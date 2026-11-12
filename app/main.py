"""Server-rendered public pages plus session-protected editorial dashboard.

Database tables are created by explicit Alembic migrations, never on app import.
"""
from datetime import timedelta
from io import BytesIO
from pathlib import Path
from urllib.parse import quote
from uuid import uuid4
import hmac
from html import escape as html_escape
import secrets
import time

import bleach
import mistune
from fastapi import Depends, FastAPI, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse, Response
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment
from markupsafe import Markup
from PIL import Image, ImageOps, UnidentifiedImageError
from pydantic import ValidationError
from sqlalchemy import event, select, text
from sqlalchemy.orm import Session
from starlette.templating import Jinja2Templates

from .config import ROOT, get_settings
from .content import (ContentConflictError, ContentPayload, assert_editor_state,
                      content_state_token, create_item, edit_item, get_revision, parse_steps,
                      public_items, publish_item, site_settings, unpublish_item, update_settings)
from .db import db_session
from .models import AdminSession, AdminUser, ContentItem, ContentRevision, Media, utcnow
from .security import (COOKIE, CSRF_COOKIE, LOGIN_CSRF_COOKIE, digest, get_session,
                       issue_session, require_admin, require_csrf, verify_password)
from .request_limits import RequestBodyLimit

settings = get_settings()
app = FastAPI(title="thecodemate", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(RequestBodyLimit)
app.mount("/static", StaticFiles(directory=ROOT / "app" / "static"), name="static")
templates = Jinja2Templates(directory=ROOT / "app" / "templates")
_markdown = mistune.create_markdown(escape=True)
ALLOWED_TAGS = {"p", "h2", "h3", "h4", "strong", "em", "ul", "ol", "li", "blockquote", "a", "code", "pre", "hr"}

def safe_markdown(text_value: str) -> Markup:
    html = _markdown(text_value or "")
    return Markup(bleach.clean(html, tags=ALLOWED_TAGS, attributes={"a": ["href", "title"]}, protocols=["https"], strip=True))

templates.env.filters["markdown"] = safe_markdown
templates.env.filters["split_tags"] = lambda value: [part.strip() for part in (value or "").split(",") if part.strip()]
templates.env.filters["steps"] = parse_steps

# Simple bounded dev/single-worker login limiter. Shared-store limiter needed for multi-worker deployment.
_login_attempts: dict[str, list[float]] = {}


@event.listens_for(Session, "after_rollback")
def remove_uncommitted_media(session):
    for path in session.info.pop("new_media_paths", []):
        path.unlink(missing_ok=True)


@event.listens_for(Session, "after_commit")
def retain_committed_media(session):
    session.info.pop("new_media_paths", None)

def login_allowed(identity: str) -> bool:
    now = time.monotonic()
    if len(_login_attempts) > 2000:
        _login_attempts.clear()
    series = [n for n in _login_attempts.get(identity, []) if now - n < 600]
    allowed = len(series) < 8
    if allowed:
        series.append(now)
    _login_attempts[identity] = series
    return allowed

@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; "
        "font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; "
        "base-uri 'self'; object-src 'none'"
    )
    if settings.production:
        response.headers["Strict-Transport-Security"] = "max-age=31536000"
    if request.url.path.startswith(("/admin", "/api/admin")):
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Robots-Tag"] = "noindex, nofollow"
    return response

@app.exception_handler(HTTPException)
async def app_http_error(request: Request, exc: HTTPException):
    if request.url.path.startswith("/api/"):
        return JSONResponse({"detail": exc.detail}, status_code=exc.status_code, headers={"Cache-Control": "no-store"})
    if exc.status_code == 401 and request.url.path.startswith("/admin") and request.method == "GET":
        return RedirectResponse("/admin/login", status_code=303)
    if request.url.path.startswith("/admin"):
        return HTMLResponse(f"<h1>{exc.status_code}</h1><p>{html_escape(str(exc.detail))}</p><p><a href='/admin'>Back to dashboard</a></p>", status_code=exc.status_code)
    return templates.TemplateResponse(request, "error.html", {"status": exc.status_code, "message": str(exc.detail), "site": {**{}}}, status_code=exc.status_code)

def view(request: Request, name: str, db: Session, *, status_code: int = 200, **ctx):
    ctx.setdefault("site", site_settings(db))
    ctx.setdefault("page_title", "thecodemate — Technology, made visual")
    ctx.setdefault("description", "Understand technology through visual explainers and explore the projects behind thecodemate.")
    ctx.setdefault("canonical", settings.site_url + request.url.path)
    ctx.setdefault("indexable", settings.seo_indexing and not request.url.path.startswith("/admin"))
    ctx.setdefault("admin_session", get_session(db, request) if request.url.path.startswith("/admin") else None)
    return templates.TemplateResponse(request, name, ctx, status_code=status_code)

def show_samples() -> bool:
    return settings.environment == "development"

@app.get("/", response_class=HTMLResponse)
def homepage(request: Request, db: Session = Depends(db_session)):
    topics = public_items(db, "topic", show_sample=show_samples())
    projects = public_items(db, "project", show_sample=show_samples())
    return view(request, "home.html", db, topics=topics[:4], projects=projects[:3], topic_count=len(topics), project_count=len(projects), active="home")

@app.get("/topics", response_class=HTMLResponse)
def topic_directory(request: Request, q: str = "", category: str = "", db: Session = Depends(db_session)):
    all_topics = public_items(db, "topic", show_sample=show_samples())
    categories = sorted({rev.category for _, rev in all_topics})
    needle = q.strip().casefold()[:80]
    matches = [(item, rev) for item, rev in all_topics if (not needle or needle in (rev.title + " " + rev.summary + " " + rev.tags).casefold()) and (not category or category == rev.category)]
    return view(request, "directory.html", db, entries=matches, kind="topic", categories=categories, q=q[:80], category=category, page_title="Explore topics — thecodemate", active="topics")

@app.get("/projects", response_class=HTMLResponse)
def project_directory(request: Request, q: str = "", category: str = "", db: Session = Depends(db_session)):
    all_projects = public_items(db, "project", show_sample=show_samples())
    categories = sorted({rev.category for _, rev in all_projects})
    needle = q.strip().casefold()[:80]
    matches = [(item, rev) for item, rev in all_projects if (not needle or needle in (rev.title + " " + rev.summary + " " + rev.tags).casefold()) and (not category or category == rev.category)]
    return view(request, "directory.html", db, entries=matches, kind="project", categories=categories, q=q[:80], category=category, page_title="Our projects — thecodemate", active="projects")

def detail(request: Request, db: Session, kind: str, slug: str):
    item = db.scalar(select(ContentItem).where(ContentItem.kind == kind, ContentItem.slug == slug))
    if item is None:
        raise HTTPException(404, "That page doesn't exist")
    rev = get_revision(db, item, draft=False)
    if rev is None or (rev.sample and not show_samples()):
        raise HTTPException(404, "That page isn't published")
    return view(request, "detail.html", db, item=item, content=rev, kind=kind, preview=False, page_title=f"{rev.title} — thecodemate", description=rev.summary, active=kind+"s")

@app.get("/topics/{slug}", response_class=HTMLResponse)
def topic_detail(request: Request, slug: str, db: Session = Depends(db_session)):
    return detail(request, db, "topic", slug)

@app.get("/projects/{slug}", response_class=HTMLResponse)
def project_detail(request: Request, slug: str, db: Session = Depends(db_session)):
    return detail(request, db, "project", slug)

@app.get("/media/{key}")
def media_file(request: Request, key: str, db: Session = Depends(db_session)):
    if not key or len(key) > 100 or not all(x.isalnum() or x in "-_." for x in key) or not key.endswith(".webp"):
        raise HTTPException(404, "Image not found")
    media = db.scalar(select(Media).where(Media.key == key))
    path = settings.media_dir / key
    if media is None or not path.is_file():
        raise HTTPException(404, "Image not found")
    query = select(ContentRevision.id).join(ContentItem, ContentItem.published_revision_id == ContentRevision.id).where(ContentRevision.cover_media_id == media.id)
    if settings.environment != "development":
        query = query.where(ContentRevision.sample.is_(False))
    public_use = db.scalar(query)
    if not public_use and get_session(db, request) is None:
        raise HTTPException(404, "Image not found")
    return FileResponse(path, media_type="image/webp", headers={"Cache-Control": "no-store"})

@app.get("/robots.txt")
def robots():
    if not settings.seo_indexing:
        return Response("User-agent: *\nDisallow: /\n", media_type="text/plain")
    return Response(f"User-agent: *\nDisallow: /admin\nSitemap: {settings.site_url}/sitemap.xml\n", media_type="text/plain")

@app.get("/sitemap.xml")
def sitemap(db: Session = Depends(db_session)):
    from xml.sax.saxutils import escape
    paths = ["/", "/topics", "/projects"]
    for kind in ("topic", "project"):
        paths.extend(f"/{kind}s/{item.slug}" for item, _ in public_items(db, kind, show_sample=False))
    xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f"<url><loc>{escape(settings.site_url + path)}</loc></url>" for path in paths) + "</urlset>"
    return Response(xml, media_type="application/xml")

@app.get("/health/live")
def health_live():
    return {"status": "live"}

@app.get("/health/ready")
def health_ready(db: Session = Depends(db_session)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        raise HTTPException(503, "Database is unavailable")

# ---- Admin login & session management ----
@app.get("/admin/login", response_class=HTMLResponse)
def admin_login_page(request: Request, db: Session = Depends(db_session)):
    if get_session(db, request):
        return RedirectResponse("/admin", status_code=303)
    token = secrets.token_urlsafe(24)
    response = view(request, "login.html", db, login_csrf=token, page_title="Sign in — thecodemate", indexable=False)
    response.set_cookie(LOGIN_CSRF_COOKIE, token, httponly=True, secure=settings.secure_cookie, samesite="lax", max_age=900)
    return response

@app.post("/admin/login")
async def admin_login(request: Request, db: Session = Depends(db_session)):
    data = await request.form()
    csrf = str(data.get("csrf", ""))
    cookie = request.cookies.get(LOGIN_CSRF_COOKIE, "")
    if not cookie or not csrf or not hmac.compare_digest(cookie, csrf):
        raise HTTPException(403, "Invalid form token")
    email = str(data.get("email", "")).strip().lower()[:255]
    password = str(data.get("password", ""))
    # Do not log password or submitted credentials.
    if not login_allowed(request.client.host if request.client else "unknown"):
        raise HTTPException(429, "Too many attempts. Try later.")
    user = db.scalar(select(AdminUser).where(AdminUser.email == email))
    if not user or not user.active or not verify_password(user, password):
        token = secrets.token_urlsafe(24)
        response = view(request, "login.html", db, login_csrf=token, error="Invalid email or password", indexable=False, status_code=401)
        response.set_cookie(LOGIN_CSRF_COOKIE, token, httponly=True, secure=settings.secure_cookie, samesite="lax", max_age=900)
        return response
    token, csrf = issue_session(db, user)
    response = RedirectResponse("/admin", status_code=303)
    response.set_cookie(COOKIE, token, httponly=True, secure=settings.secure_cookie, samesite="lax", max_age=43200, path="/")
    response.set_cookie(CSRF_COOKIE, csrf, httponly=False, secure=settings.secure_cookie, samesite="lax", max_age=43200, path="/")
    response.delete_cookie(LOGIN_CSRF_COOKIE)
    return response

@app.post("/admin/logout")
async def admin_logout(request: Request, db: Session = Depends(db_session)):
    data = await request.form()
    active = require_csrf(db, request, str(data.get("csrf", "")))
    db.delete(active)
    db.commit()
    response = RedirectResponse("/admin/login", status_code=303)
    response.delete_cookie(COOKIE)
    response.delete_cookie(CSRF_COOKIE)
    return response

@app.get("/admin", response_class=HTMLResponse)
def admin_home(request: Request, db: Session = Depends(db_session)):
    require_admin(db, request)
    items = db.scalars(select(ContentItem).order_by(ContentItem.updated_at.desc())).all()
    return view(request, "admin.html", db, items=items, drafts=sum(bool(i.draft_revision_id) for i in items), published=sum(bool(i.published_revision_id) for i in items), page_title="Dashboard — thecodemate", indexable=False)

@app.get("/admin/new", response_class=HTMLResponse)
def admin_new(request: Request, kind: str = "topic", db: Session = Depends(db_session)):
    require_admin(db, request)
    if kind not in {"topic", "project"}:
        raise HTTPException(400, "Invalid content type")
    return view(request, "editor.html", db, item=None, content=None, form={}, kind=kind, error=None, page_title="New content — thecodemate", indexable=False)

@app.get("/admin/edit/{item_id}", response_class=HTMLResponse)
def admin_edit(request: Request, item_id: int, db: Session = Depends(db_session)):
    require_admin(db, request)
    item = db.get(ContentItem, item_id)
    if not item:
        raise HTTPException(404, "Content not found")
    content = get_revision(db, item, draft=True) or get_revision(db, item, draft=False)
    return view(request, "editor.html", db, item=item, content=content, form={}, kind=item.kind,
                editor_state=content_state_token(db, item), error=None, page_title=f"Edit {item.slug} — thecodemate", indexable=False)

async def process_media(file: UploadFile | None, db: Session, *, alt: str) -> int | None:
    if file is None or not file.filename:
        return None
    data = await file.read(8*1024*1024 + 1)
    if len(data) > 8*1024*1024:
        raise ValueError("Cover image must be smaller than 8 MB")
    try:
        probe = Image.open(BytesIO(data))
        if probe.format not in {"JPEG", "PNG", "WEBP"} or probe.width * probe.height > 20_000_000:
            raise ValueError("Image must be a reasonable JPEG, PNG or WebP")
        probe.verify()
        img = Image.open(BytesIO(data))
        img = ImageOps.exif_transpose(img)
        img.thumbnail((2560, 2560))
        img = img.convert("RGB")
        output = BytesIO()
        img.save(output, format="WEBP", quality=82, method=4)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as exc:
        raise ValueError("Invalid or unsupported image") from exc
    settings.media_dir.mkdir(parents=True, exist_ok=True)
    key = uuid4().hex + ".webp"
    path = settings.media_dir / key
    try:
        path.write_bytes(output.getvalue())
        db.info.setdefault("new_media_paths", []).append(path)
        media = Media(key=key, alt=alt[:200], width=img.width, height=img.height)
        db.add(media)
        db.flush()
    except Exception:
        path.unlink(missing_ok=True)
        raise
    return media.id

async def parse_content_form(request: Request) -> tuple[dict, ContentPayload, UploadFile | None]:
    form = await request.form()
    raw = {key: str(form.get(key, "")) for key in ("title", "summary", "body", "steps", "category", "tags", "demo_url", "repo_url", "video_url")}
    raw["featured"] = "featured" in form
    raw["sample"] = "sample" in form
    payload = ContentPayload.model_validate(raw)
    cover = form.get("cover")
    return dict(form), payload, cover if getattr(cover, "filename", None) and hasattr(cover, "read") else None

@app.post("/admin/new")
async def admin_create(request: Request, db: Session = Depends(db_session)):
    form = await request.form()
    active = require_csrf(db, request, str(form.get("csrf", "")))
    kind = str(form.get("kind", "topic"))
    cover_id = None
    try:
        _, payload, cover = await parse_content_form(request)
        from .content import parse_slug
        slug = parse_slug(str(form.get("slug", "")))
        cover_id = await process_media(cover, db, alt=payload.title)
        item = create_item(db, kind, slug, payload, active.admin_id, cover_id)
    except (ValueError, ValidationError) as exc:
        db.rollback()
        return view(request, "editor.html", db, item=None, content=None, form=dict(form), kind=kind if kind in {"topic", "project"} else "topic", error=str(exc), status_code=422, indexable=False)
    return RedirectResponse(f"/admin/edit/{item.id}?created=1", status_code=303)

@app.post("/admin/edit/{item_id}")
async def admin_save(request: Request, item_id: int, db: Session = Depends(db_session)):
    form = await request.form()
    active = require_csrf(db, request, str(form.get("csrf", "")))
    item = db.get(ContentItem, item_id)
    if not item:
        raise HTTPException(404, "Content not found")
    content = get_revision(db, item, draft=True) or get_revision(db, item, draft=False)
    try:
        expected_state = str(form.get("expected_state", ""))
        assert_editor_state(db, item, expected_state)
        _, payload, cover = await parse_content_form(request)
        cover_id = await process_media(cover, db, alt=payload.title)
        edit_item(db, item, payload, active.admin_id, cover_id, expected_state=expected_state)
    except ContentConflictError as exc:
        db.rollback()
        latest = get_revision(db, item, draft=True) or get_revision(db, item, draft=False)
        return view(request, "editor.html", db, item=item, content=latest, form={}, kind=item.kind,
                    editor_state=content_state_token(db, item), error=str(exc), status_code=409, indexable=False)
    except (ValueError, ValidationError) as exc:
        db.rollback()
        return view(request, "editor.html", db, item=item, content=content, form=dict(form), kind=item.kind,
                    editor_state=content_state_token(db, item), error=str(exc), status_code=422, indexable=False)
    return RedirectResponse(f"/admin/edit/{item_id}?saved=1", status_code=303)

@app.post("/admin/publish/{item_id}")
async def admin_publish(request: Request, item_id: int, db: Session = Depends(db_session)):
    form = await request.form()
    active = require_csrf(db, request, str(form.get("csrf", "")))
    item = db.get(ContentItem, item_id)
    if not item:
        raise HTTPException(404, "Content not found")
    try:
        publish_item(db, item, int(str(form.get("expected_draft", "0"))), active.admin_id,
                     expected_state=str(form.get("expected_state", "")))
    except (ValueError, TypeError) as exc:
        raise HTTPException(409, str(exc)) from exc
    return RedirectResponse(f"/admin/edit/{item_id}?published=1", status_code=303)

@app.post("/admin/unpublish/{item_id}")
async def admin_unpublish(request: Request, item_id: int, db: Session = Depends(db_session)):
    form = await request.form()
    active = require_csrf(db, request, str(form.get("csrf", "")))
    item = db.get(ContentItem, item_id)
    if not item:
        raise HTTPException(404, "Content not found")
    try:
        unpublish_item(db, item, active.admin_id, expected_state=str(form.get("expected_state", "")))
    except ContentConflictError as exc:
        db.rollback()
        raise HTTPException(409, str(exc)) from exc
    return RedirectResponse(f"/admin/edit/{item_id}?unpublished=1", status_code=303)

@app.get("/admin/preview/{item_id}")
def admin_preview(request: Request, item_id: int, db: Session = Depends(db_session)):
    require_admin(db, request)
    item = db.get(ContentItem, item_id)
    if not item:
        raise HTTPException(404, "Content not found")
    rev = get_revision(db, item, draft=True) or get_revision(db, item, draft=False)
    if not rev:
        raise HTTPException(404, "No preview content")
    return view(request, "detail.html", db, item=item, content=rev, kind=item.kind, preview=True, indexable=False, page_title=f"Preview: {rev.title}")

@app.get("/admin/settings")
def admin_settings(request: Request, db: Session = Depends(db_session)):
    require_admin(db, request)
    return view(request, "settings.html", db, error=None, page_title="Site settings — thecodemate", indexable=False)

@app.post("/admin/settings")
async def admin_settings_save(request: Request, db: Session = Depends(db_session)):
    data = await request.form()
    active = require_csrf(db, request, str(data.get("csrf", "")))
    try:
        update_settings(db, dict(data), active.admin_id)
    except ValueError as exc:
        db.rollback()
        return view(request, "settings.html", db, error=str(exc), status_code=422, indexable=False)
    return RedirectResponse("/admin/settings?saved=1", status_code=303)

# JSON gateway for the Next.js frontend. Legacy server-rendered routes remain available.
from .api import router as api_router
app.include_router(api_router)
