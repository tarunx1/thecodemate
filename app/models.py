"""CMS identities, single draft, immutable published revisions and session hashes."""
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class AdminUser(Base):
    __tablename__ = "tc_admin_users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(512))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

class AdminSession(Base):
    __tablename__ = "tc_admin_sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    admin_id: Mapped[int] = mapped_column(ForeignKey("tc_admin_users.id", ondelete="CASCADE"))
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    csrf_hash: Mapped[str] = mapped_column(String(64))
    expires_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    admin: Mapped[AdminUser] = relationship()

class ContentItem(Base):
    __tablename__ = "tc_content_items"
    __table_args__ = (UniqueConstraint("kind", "slug", name="uq_tc_kind_slug"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    kind: Mapped[str] = mapped_column(String(16), index=True)  # topic or project
    slug: Mapped[str] = mapped_column(String(90))
    published_revision_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    draft_revision_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    revisions: Mapped[list["ContentRevision"]] = relationship(back_populates="item", cascade="all, delete-orphan", foreign_keys="ContentRevision.item_id")

class ContentRevision(Base):
    __tablename__ = "tc_content_revisions"
    __table_args__ = (UniqueConstraint("item_id", "revision_number", name="uq_tc_item_revision"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("tc_content_items.id", ondelete="CASCADE"), index=True)
    revision_number: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(120))
    summary: Mapped[str] = mapped_column(String(360))
    body: Mapped[str] = mapped_column(Text, default="")
    steps: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(50), default="General")
    tags: Mapped[str] = mapped_column(String(255), default="")
    cover_media_id: Mapped[int | None] = mapped_column(ForeignKey("tc_media.id"), nullable=True)
    demo_url: Mapped[str] = mapped_column(String(500), default="")
    repo_url: Mapped[str] = mapped_column(String(500), default="")
    video_url: Mapped[str] = mapped_column(String(500), default="")
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    sample: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    item: Mapped[ContentItem] = relationship(back_populates="revisions", foreign_keys=[item_id])
    cover: Mapped["Media | None"] = relationship(foreign_keys=[cover_media_id])

class Media(Base):
    __tablename__ = "tc_media"
    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(100), unique=True)
    alt: Mapped[str] = mapped_column(String(200), default="")
    width: Mapped[int] = mapped_column(Integer)
    height: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

class SiteSetting(Base):
    __tablename__ = "tc_site_settings"
    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    value: Mapped[str] = mapped_column(Text, default="")

class AuditLog(Base):
    __tablename__ = "tc_audit_log"
    id: Mapped[int] = mapped_column(primary_key=True)
    admin_id: Mapped[int | None] = mapped_column(ForeignKey("tc_admin_users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(80))
    item_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
