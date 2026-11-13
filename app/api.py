"""Typed JSON boundary for the Next.js frontend; CMS rules remain in content.py."""
from __future__ import annotations

import hmac
import secrets
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session, load_only

from .config import get_settings
from .content import (ContentConflictError, assert_editor_state, content_state_token,
                      create_item, edit_item, get_revision, parse_slug, public_items,
                      publish_item, site_settings, unpublish_item, update_settings)
from .db import db_session
from .models import AdminSession, AdminUser, AuditLog, ContentItem, ContentRevision, Media
from .security import (COOKIE, CSRF_COOKIE, LOGIN_CSRF_COOKIE, issue_session, password_policy, ph,
                       require_admin, require_csrf, verify_password)

router = APIRouter(prefix="/api")
settings = get_settings()


def media_data(media: Media | None) -> dict | None:
    return None if media is None else {"id": media.id, "url": f"/media/{media.key}", "alt": media.alt,
                                        "width": media.width, "height": media.height}


def revision_data(rev: ContentRevision | None, *, compact: bool = False) -> dict | None:
    if rev is None:
        return None
    result = {"id": rev.id, "title": rev.title, "summary": rev.summary,
              "category": rev.category, "tags": rev.tags, "cover": media_data(rev.cover),
              "featured": rev.featured, "sample": rev.sample, "created_at": rev.created_at.isoformat()}
    if not compact:
        from .main import safe_markdown
        result.update({"body": rev.body, "body_html": str(safe_markdown(rev.body)),
                       "steps": rev.steps, "demo_url": rev.demo_url,
                       "repo_url": rev.repo_url, "video_url": rev.video_url})
    return result


def compact_revision(db: Session, revision_id: int | None) -> ContentRevision | None:
    if not revision_id:
        return None
    return db.get(ContentRevision, revision_id, options=[load_only(
        ContentRevision.id, ContentRevision.title, ContentRevision.summary,
        ContentRevision.category, ContentRevision.tags, ContentRevision.cover_media_id,
        ContentRevision.featured, ContentRevision.sample, ContentRevision.created_at)])


def item_data(db: Session, item: ContentItem, *, admin: bool = False, compact: bool = False) -> dict:
    live = compact_revision(db, item.published_revision_id) if compact else get_revision(db, item, draft=False)
    result = {"id": item.id, "kind": item.kind, "slug": item.slug,
              "updated_at": item.updated_at.isoformat(), "published": live is not None,
              "content": revision_data(live, compact=compact)}
    if admin:
        draft = compact_revision(db, item.draft_revision_id) if compact else get_revision(db, item, draft=True)
        result["draft"] = revision_data(draft, compact=compact)
        result["draft_revision_id"] = item.draft_revision_id
        if not compact:
            result["editor_state"] = content_state_token(db, item)
    return result


def page_data(items: list[dict], page: int, page_size: int) -> dict:
    page_size = min(48, max(1, page_size))
    page = min(max(1, page), max(1, (len(items) + page_size - 1) // page_size))
    start = (page - 1) * page_size
    return {"items": items[start:start + page_size], "total": len(items),
            "page": page, "page_size": page_size, "has_next": start + page_size < len(items)}


def visible_public(db: Session, kind: str) -> list[ContentItem]:
    return [item for item, _ in public_items(db, kind, show_sample=settings.environment == "development")]


@router.get("/public/home")
def public_home(db: Session = Depends(db_session)):
    topics = visible_public(db, "topic")
    projects = visible_public(db, "project")
    return {"settings": site_settings(db), "topics": [item_data(db, x, compact=True) for x in topics[:4]],
            "projects": [item_data(db, x, compact=True) for x in projects[:3]],
            "topic_count": len(topics), "project_count": len(projects)}


@router.get("/public/settings")
def public_settings(db: Session = Depends(db_session)):
    return site_settings(db)


@router.get("/public/{kind}")
def public_list(kind: str, q: str = "", category: str = "", page: int = 1, page_size: int = 24,
                db: Session = Depends(db_session)):
    if kind not in {"topics", "projects"}:
        raise HTTPException(404, "Collection not found")
    items = [item_data(db, item, compact=True) for item in visible_public(db, kind[:-1])]
    categories = sorted({item["content"]["category"] for item in items if item["content"]})
    needle = q.strip().casefold()[:80]
    matches = [item for item in items if item["content"] and
               (not needle or needle in (item["content"]["title"] + " " + item["content"]["summary"] + " " + item["content"]["tags"]).casefold()) and
               (not category or category == item["content"]["category"])]
    return {**page_data(matches, page, page_size), "categories": categories, "q": q[:80], "category": category}


@router.get("/public/{kind}/{slug}")
def public_detail(kind: str, slug: str, db: Session = Depends(db_session)):
    if kind not in {"topics", "projects"}:
        raise HTTPException(404, "Page not found")
    item = db.scalar(select(ContentItem).where(ContentItem.kind == kind[:-1], ContentItem.slug == slug))
    if item is None or item not in visible_public(db, kind[:-1]):
        raise HTTPException(404, "Page not found")
    related = [item_data(db, other, compact=True) for other in visible_public(db, kind[:-1]) if other.id != item.id][:3]
    return {"item": item_data(db, item), "related": related}


@router.get("/admin/login-token")
def login_token():
    token = secrets.token_urlsafe(24)
    response = JSONResponse({"csrf": token})
    response.set_cookie(LOGIN_CSRF_COOKIE, token, httponly=True, secure=settings.secure_cookie,
                        samesite="lax", max_age=900)
    return response


@router.post("/admin/login")
async def login(request: Request, db: Session = Depends(db_session)):
    from .main import login_allowed
    data = await request.form()
    csrf = str(data.get("csrf", ""))
    if not csrf or not hmac.compare_digest(request.cookies.get(LOGIN_CSRF_COOKIE, ""), csrf):
        raise HTTPException(403, "Invalid form token")
    if not login_allowed(request.client.host if request.client else "unknown"):
        raise HTTPException(429, "Too many attempts. Try later.")
    email = str(data.get("email", "")).strip().lower()[:255]
    user = db.scalar(select(AdminUser).where(AdminUser.email == email))
    if not user or not user.active or not verify_password(user, str(data.get("password", ""))):
        raise HTTPException(401, "Invalid email or password")
    token, csrf = issue_session(db, user)
    response = JSONResponse({"ok": True})
    response.set_cookie(COOKIE, token, httponly=True, secure=settings.secure_cookie,
                        samesite="lax", max_age=43200, path="/")
    response.set_cookie(CSRF_COOKIE, csrf, httponly=False, secure=settings.secure_cookie,
                        samesite="lax", max_age=43200, path="/")
    response.delete_cookie(LOGIN_CSRF_COOKIE)
    return response


@router.get("/admin/me")
def me(request: Request, db: Session = Depends(db_session)):
    active = require_admin(db, request)
    return {"email": active.admin.email, "csrf": request.cookies.get(CSRF_COOKIE, "")}


@router.post("/admin/logout")
def logout(request: Request, db: Session = Depends(db_session)):
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    db.delete(active)
    db.commit()
    response = JSONResponse({"ok": True})
    response.delete_cookie(COOKIE)
    response.delete_cookie(CSRF_COOKIE)
    return response


@router.post("/admin/password")
async def change_password(request: Request, db: Session = Depends(db_session)):
    """Owner changes their own password. Needs the current password; other sessions are revoked."""
    from .main import login_allowed
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    data = await request.form()
    current = str(data.get("current_password", ""))
    new = str(data.get("new_password", ""))
    if not login_allowed(f"password:{active.admin_id}"):
        raise HTTPException(429, "Too many attempts. Try later.")
    if not verify_password(active.admin, current):
        raise HTTPException(400, "Current password is incorrect")
    if new != str(data.get("confirm_password", "")):
        raise HTTPException(422, "New passwords do not match")
    if new == current:
        raise HTTPException(422, "New password must differ from the current password")
    try:
        password_policy(new)
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc
    active.admin.password_hash = ph.hash(new)
    db.query(AdminSession).filter(AdminSession.admin_id == active.admin_id, AdminSession.id != active.id).delete(synchronize_session=False)
    db.add(AuditLog(admin_id=active.admin_id, action="admin.password_change"))
    db.commit()
    return {"ok": True}


@router.get("/admin/dashboard")
def dashboard(request: Request, db: Session = Depends(db_session)):
    require_admin(db, request)
    items = db.scalars(select(ContentItem).order_by(ContentItem.updated_at.desc())).all()
    groups = {kind: [item_data(db, item, admin=True, compact=True) for item in items if item.kind == kind] for kind in ("topic", "project")}
    metrics = {f"{state}_{kind}s": sum(bool(item["published"] if state == "published" else item["draft"]) for item in groups[kind])
               for state in ("published", "draft") for kind in ("topic", "project")}
    return {"metrics": metrics, "topics": groups["topic"][:5], "projects": groups["project"][:5]}


@router.get("/admin/content")
def admin_content(request: Request, kind: str = "topic", q: str = "", status: str = "", category: str = "",
                  page: int = 1, page_size: int = 24, db: Session = Depends(db_session)):
    require_admin(db, request)
    if kind not in {"topic", "project"}:
        raise HTTPException(400, "Invalid content type")
    items = [item_data(db, item, admin=True, compact=True) for item in db.scalars(select(ContentItem).where(ContentItem.kind == kind).order_by(ContentItem.updated_at.desc()))]
    categories = sorted({(x["draft"] or x["content"])["category"] for x in items if x["draft"] or x["content"]})
    needle = q.strip().casefold()[:80]
    def matches(item: dict) -> bool:
        rev = item["draft"] or item["content"]
        return bool(rev and (not needle or needle in (rev["title"] + " " + rev["summary"] + " " + item["slug"]).casefold()) and
                    (not category or rev["category"] == category) and
                    (not status or status == "all" or (status == "published" and item["published"]) or
                     (status == "draft" and item["draft"]) or (status == "offline" and not item["published"])))
    return {**page_data([x for x in items if matches(x)], page, page_size), "categories": categories}


@router.get("/admin/content/{item_id}")
def admin_detail(request: Request, item_id: int, db: Session = Depends(db_session)):
    require_admin(db, request)
    item = db.get(ContentItem, item_id)
    if item is None:
        raise HTTPException(404, "Content not found")
    return item_data(db, item, admin=True)


@router.get("/admin/settings")
def admin_settings(request: Request, db: Session = Depends(db_session)):
    require_admin(db, request)
    return site_settings(db)


@router.post("/admin/settings")
async def save_settings(request: Request, db: Session = Depends(db_session)):
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    data = await request.form()
    try:
        update_settings(db, dict(data), active.admin_id)
    except ValueError as exc:
        db.rollback()
        raise HTTPException(422, str(exc)) from exc
    return site_settings(db)


@router.get("/admin/media")
def media_list(request: Request, db: Session = Depends(db_session)):
    require_admin(db, request)
    return {"items": [media_data(x) for x in db.scalars(select(Media).order_by(Media.created_at.desc()))]}


@router.post("/admin/media")
async def upload_media(request: Request, db: Session = Depends(db_session)):
    from .main import process_media
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    form = await request.form()
    file = form.get("file")
    if not getattr(file, "filename", None) or not hasattr(file, "read"):
        raise HTTPException(422, "Select a JPEG, PNG or WebP image")
    try:
        media_id = await process_media(file, db, alt=str(form.get("alt", "")))
    except ValueError as exc:
        db.rollback()
        raise HTTPException(422, str(exc)) from exc
    if media_id is None:
        raise HTTPException(422, "Select an image")
    db.add(AuditLog(admin_id=active.admin_id, action="media.upload"))
    db.commit()
    return media_data(db.get(Media, media_id))


@router.post("/admin/content")
async def create(request: Request, db: Session = Depends(db_session)):
    from .main import parse_content_form, process_media
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    form = await request.form()
    try:
        _, payload, cover = await parse_content_form(request)
        slug = parse_slug(str(form.get("slug", "")))
        cover_id = await process_media(cover, db, alt=payload.title)
        if cover_id is None and form.get("cover_media_id"):
            media = db.get(Media, int(str(form["cover_media_id"])))
            if media is None:
                raise ValueError("Cover image not found")
            cover_id = media.id
        item = create_item(db, str(form.get("kind", "")), slug, payload, active.admin_id, cover_id)
    except (ValueError, ValidationError) as exc:
        db.rollback()
        raise HTTPException(422, str(exc)) from exc
    return item_data(db, item, admin=True)


@router.post("/admin/content/{item_id}")
async def save(request: Request, item_id: int, db: Session = Depends(db_session)):
    from .main import parse_content_form, process_media
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    item = db.get(ContentItem, item_id)
    if item is None:
        raise HTTPException(404, "Content not found")
    form = await request.form()
    try:
        expected_state = str(form.get("expected_state", ""))
        assert_editor_state(db, item, expected_state)
        _, payload, cover = await parse_content_form(request)
        cover_id = await process_media(cover, db, alt=payload.title)
        if cover_id is None and form.get("cover_media_id"):
            media = db.get(Media, int(str(form["cover_media_id"])))
            if media is None:
                raise ValueError("Cover image not found")
            cover_id = media.id
        edit_item(db, item, payload, active.admin_id, cover_id, expected_state=expected_state)
    except ContentConflictError as exc:
        db.rollback()
        raise HTTPException(409, str(exc)) from exc
    except (ValueError, ValidationError) as exc:
        db.rollback()
        raise HTTPException(422, str(exc)) from exc
    return item_data(db, item, admin=True)


@router.post("/admin/content/{item_id}/publish")
async def publish(request: Request, item_id: int, db: Session = Depends(db_session)):
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    item = db.get(ContentItem, item_id)
    if item is None:
        raise HTTPException(404, "Content not found")
    data = await request.form()
    try:
        publish_item(db, item, int(str(data.get("expected_draft", "0"))), active.admin_id,
                     expected_state=str(data.get("expected_state", "")))
    except (ValueError, TypeError) as exc:
        db.rollback()
        raise HTTPException(409, str(exc)) from exc
    return item_data(db, item, admin=True)


@router.post("/admin/content/{item_id}/unpublish")
async def unpublish(request: Request, item_id: int, db: Session = Depends(db_session)):
    active = require_csrf(db, request, request.headers.get("x-csrf-token", ""))
    item = db.get(ContentItem, item_id)
    if item is None:
        raise HTTPException(404, "Content not found")
    data = await request.form()
    try:
        unpublish_item(db, item, active.admin_id, expected_state=str(data.get("expected_state", "")))
    except ContentConflictError as exc:
        db.rollback()
        raise HTTPException(409, str(exc)) from exc
    return item_data(db, item, admin=True)
