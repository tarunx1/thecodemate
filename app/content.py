"""Server-owned CMS validation and immutable-live revision semantics."""
from datetime import datetime
from hashlib import sha256
from hmac import compare_digest
from ipaddress import ip_address
import json
import re
from urllib.parse import urlparse
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session, load_only
from .models import AuditLog, ContentItem, ContentRevision, SiteSetting, utcnow

SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ALLOWED_KINDS = {"topic", "project"}
REVISION_STATE_FIELDS = ("id", "title", "summary", "body", "steps", "category", "tags",
                         "demo_url", "repo_url", "video_url", "featured", "sample", "cover_media_id")


class ContentConflictError(ValueError):
    """The submitted editor snapshot no longer matches the current item."""
SETTING_DEFAULTS = {
    "eyebrow": "AN INDEPENDENT VISUAL TECH JOURNAL",
    "headline": "Understand the complex. Build the next.",  # legacy editorial note, not used in hero
    "hero_line1": "Ideas deserve",
    "hero_line2": "to be",
    "hero_highlight": "seen.",
    "hero_description": "An evolving library of tech concepts explained visually, alongside the real projects we design and build.",
    "instagram_url": "https://www.instagram.com/thecodemate/",
    "footer_note": "Technology, made visual.",
    "hero_effect": "liquid-metal",
}
# Developer-owned allowlist of homepage hero animations the owner can switch between.
HERO_EFFECTS = {"liquid-metal"}

class ContentPayload(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    summary: str = Field(min_length=12, max_length=360)
    body: str = Field(default="", max_length=50000)
    steps: str = Field(default="", max_length=4500)
    category: str = Field(default="General", min_length=2, max_length=50)
    tags: str = Field(default="", max_length=255)
    demo_url: str = Field(default="", max_length=500)
    repo_url: str = Field(default="", max_length=500)
    video_url: str = Field(default="", max_length=500)
    featured: bool = False
    sample: bool = False

    @field_validator("title", "summary", "category", mode="before")
    @classmethod
    def strip_required(cls, value):
        return str(value).strip()

    @field_validator("demo_url", "repo_url", "video_url", mode="before")
    @classmethod
    def safe_https(cls, value):
        value = str(value or "").strip()
        if not value:
            return ""
        parts = urlparse(value)
        if parts.scheme != "https" or not parts.hostname or parts.username or parts.password or any(c in value for c in "\\<>"):
            raise ValueError("Links must be full HTTPS URLs without credentials")
        host = parts.hostname.rstrip(".").lower()
        if host in {"localhost", "0.0.0.0"} or host.endswith((".localhost", ".local", ".internal")):
            raise ValueError("Local/private destinations are not accepted")
        try:
            address = ip_address(host)
        except ValueError:
            address = None
        if (address is not None and not address.is_global) or (address is None and ("." not in host or host.replace(".", "").isdigit())):
            raise ValueError("Local/private destinations are not accepted")
        return value

    @field_validator("steps")
    @classmethod
    def validate_steps(cls, text):
        lines = [x.strip() for x in text.splitlines() if x.strip()]
        if len(lines) > 8 or any("|" not in x or len(x) > 350 for x in lines):
            raise ValueError("Steps: maximum eight lines in 'Heading | Explanation' format")
        return "\n".join(lines)

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, text):
        values = [x.strip() for x in text.split(",") if x.strip()]
        if len(values) > 8 or any(len(tag) > 25 for tag in values):
            raise ValueError("Use up to eight tags, each no more than 25 characters")
        return ", ".join(dict.fromkeys(values))


def parse_slug(value: str) -> str:
    slug = str(value).strip().lower()
    if len(slug) > 90 or not SLUG.fullmatch(slug) or slug in {"new", "admin", "login"}:
        raise ValueError("Slug must use lowercase letters, numbers and single hyphens")
    return slug

def attributes(data: ContentPayload) -> dict:
    return data.model_dump()

def create_item(db: Session, kind: str, slug: str, payload: ContentPayload, actor: int, cover_id: int | None = None) -> ContentItem:
    if kind not in ALLOWED_KINDS:
        raise ValueError("Unknown content type")
    slug = parse_slug(slug)
    if db.scalar(select(ContentItem.id).where(ContentItem.kind == kind, ContentItem.slug == slug)):
        raise ValueError("This slug is already in use")
    item = ContentItem(kind=kind, slug=slug, created_at=utcnow(), updated_at=utcnow())
    db.add(item)
    db.flush()
    revision = ContentRevision(item_id=item.id, revision_number=1, cover_media_id=cover_id, **attributes(payload))
    db.add(revision)
    db.flush()
    item.draft_revision_id = revision.id
    db.add(AuditLog(admin_id=actor, item_id=item.id, action="content.create"))
    db.commit()
    return item

def get_revision(db: Session, item: ContentItem, *, draft: bool) -> ContentRevision | None:
    revision_id = item.draft_revision_id if draft else item.published_revision_id
    return db.get(ContentRevision, revision_id) if revision_id else None


def content_state_token(db: Session, item: ContentItem) -> str:
    """A non-secret review token that changes whenever either editor snapshot changes."""
    revisions = [get_revision(db, item, draft=True), get_revision(db, item, draft=False)]
    state = [item.id, item.draft_revision_id, item.published_revision_id,
             [[getattr(rev, field) for field in REVISION_STATE_FIELDS] if rev else None for rev in revisions]]
    return sha256(json.dumps(state, ensure_ascii=False, separators=(",", ":")).encode("utf-8")).hexdigest()


def assert_editor_state(db: Session, item: ContentItem, expected_state: str) -> None:
    if not expected_state or not compare_digest(content_state_token(db, item), expected_state):
        raise ContentConflictError("Content changed since you opened this editor. Reload and review before saving or publishing.")


def lock_item(db: Session, item: ContentItem) -> ContentItem:
    """Serialize item writes on databases with row locks; the token also catches stale tabs."""
    return db.scalar(select(ContentItem).where(ContentItem.id == item.id).with_for_update()
                     .execution_options(populate_existing=True))

def edit_item(db: Session, item: ContentItem, payload: ContentPayload, actor: int, cover_id: int | None = None,
              *, expected_state: str) -> ContentRevision:
    item = lock_item(db, item)
    assert_editor_state(db, item, expected_state)
    draft = get_revision(db, item, draft=True)
    if draft is None:
        prior = get_revision(db, item, draft=False)
        next_version = max((r.revision_number for r in item.revisions), default=0) + 1
        draft = ContentRevision(item_id=item.id, revision_number=next_version, cover_media_id=prior.cover_media_id if prior else None, **attributes(payload))
        db.add(draft)
        db.flush()
        item.draft_revision_id = draft.id
    else:
        # Only a working draft is editable; published rows stay immutable.
        for key, value in attributes(payload).items():
            setattr(draft, key, value)
    if cover_id is not None:
        draft.cover_media_id = cover_id
    item.updated_at = utcnow()
    db.add(AuditLog(admin_id=actor, item_id=item.id, action="content.edit"))
    db.commit()
    return draft

def publish_item(db: Session, item: ContentItem, expected_draft: int, actor: int, *, expected_state: str) -> None:
    item = lock_item(db, item)
    assert_editor_state(db, item, expected_state)
    if item.draft_revision_id is None or item.draft_revision_id != expected_draft:
        raise ValueError("Draft changed. Reload and review before publishing.")
    draft = get_revision(db, item, draft=True)
    if not draft or not draft.title or not draft.summary:
        raise ValueError("Complete required fields before publishing")
    # Optimistic compare; single-writer SQLite local. MySQL deployment must additionally
    # verify row locking under concurrency before production approval.
    item.published_revision_id = draft.id
    item.draft_revision_id = None
    item.updated_at = utcnow()
    db.add(AuditLog(admin_id=actor, item_id=item.id, action="content.publish"))
    db.commit()

def unpublish_item(db: Session, item: ContentItem, actor: int, *, expected_state: str) -> None:
    item = lock_item(db, item)
    assert_editor_state(db, item, expected_state)
    if item.published_revision_id is None:
        return
    item.published_revision_id = None
    item.updated_at = utcnow()
    db.add(AuditLog(admin_id=actor, item_id=item.id, action="content.unpublish"))
    db.commit()

def public_items(db: Session, kind: str, *, show_sample: bool) -> list[tuple[ContentItem, ContentRevision]]:
    query = (select(ContentItem, ContentRevision)
             .join(ContentRevision, ContentItem.published_revision_id == ContentRevision.id)
             .options(load_only(ContentRevision.id, ContentRevision.title, ContentRevision.summary,
                                ContentRevision.category, ContentRevision.tags, ContentRevision.cover_media_id,
                                ContentRevision.featured, ContentRevision.sample, ContentRevision.created_at))
             .where(ContentItem.kind == kind)
             .order_by(ContentRevision.featured.desc(), ContentItem.updated_at.desc()))
    if not show_sample:
        query = query.where(ContentRevision.sample.is_(False))
    return [(item, revision) for item, revision in db.execute(query).all()]

def site_settings(db: Session) -> dict[str,str]:
    result = SETTING_DEFAULTS.copy()
    for row in db.scalars(select(SiteSetting)):
        if row.key in result:
            result[row.key] = row.value
    if result["hero_effect"] not in HERO_EFFECTS:  # e.g. a retired effect such as "aurora"
        result["hero_effect"] = SETTING_DEFAULTS["hero_effect"]
    return result

def update_settings(db: Session, values: dict, actor: int) -> None:
    for key in SETTING_DEFAULTS:
        value = str(values.get(key, "")).strip()
        if key == "hero_effect":
            if not value:  # older forms (e.g. the Jinja fallback) do not send it: keep the current choice
                row = db.get(SiteSetting, key)
                value = row.value if row and row.value in HERO_EFFECTS else SETTING_DEFAULTS[key]
            if value not in HERO_EFFECTS:
                raise ValueError("hero_effect: choose one of the available hero animations")
        limit = 500 if key == "hero_description" else (60 if key in {"hero_line1", "hero_line2", "hero_highlight"} else 220)
        if len(value) > limit:
            raise ValueError(f"{key}: text is too long")
        if key in {"hero_line1", "hero_line2", "hero_highlight"} and not value:
            raise ValueError(f"{key}: please enter a headline phrase")
        if key == "instagram_url":
            value = ContentPayload.safe_https(value)
        row = db.get(SiteSetting, key)
        if row is None:
            db.add(SiteSetting(key=key, value=value))
        else:
            row.value = value
    db.add(AuditLog(admin_id=actor, action="settings.update"))
    db.commit()

def parse_steps(value: str) -> list[tuple[str,str]]:
    return [(title.strip(), text.strip()) for line in (value or "").splitlines() if "|" in line for title, text in [line.split("|", 1)]]
