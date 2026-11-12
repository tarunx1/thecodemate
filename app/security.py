"""Opaque hashed sessions and server-verified CSRF for a single-owner CMS."""
from datetime import datetime, timedelta
from hashlib import sha256
from hmac import compare_digest
import secrets

from argon2 import PasswordHasher, exceptions as argon_exc
from fastapi import HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import AdminSession, AdminUser, utcnow

COOKIE = "tc_admin_session"
CSRF_COOKIE = "tc_admin_csrf"
LOGIN_CSRF_COOKIE = "tc_login_csrf"
SESSION_TTL = timedelta(hours=12)
ph = PasswordHasher(time_cost=2, memory_cost=19456, parallelism=2)

def digest(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()

def password_policy(value: str) -> None:
    if len(value) < 12 or len(value.encode("utf-8")) > 128 or value.isalpha() or value.isdigit():
        raise ValueError("Password must be at least 12 characters with mixed character types")

def issue_session(db: Session, user: AdminUser) -> tuple[str, str]:
    db.query(AdminSession).filter(AdminSession.admin_id == user.id).delete(synchronize_session=False)
    token, csrf = secrets.token_urlsafe(32), secrets.token_urlsafe(32)
    db.add(AdminSession(admin_id=user.id, token_hash=digest(token), csrf_hash=digest(csrf), expires_at=utcnow()+SESSION_TTL))
    db.commit()
    return token, csrf

def get_session(db: Session, request: Request) -> AdminSession | None:
    raw = request.cookies.get(COOKIE, "")
    if not raw or len(raw) > 128:
        return None
    result = db.scalar(select(AdminSession).where(AdminSession.token_hash == digest(raw)))
    if result is None or result.expires_at <= utcnow() or not result.admin.active:
        return None
    return result

def require_admin(db: Session, request: Request) -> AdminSession:
    active = get_session(db, request)
    if active is None:
        raise HTTPException(401, "Administrator authentication required")
    return active

def require_csrf(db: Session, request: Request, submitted: str) -> AdminSession:
    active = require_admin(db, request)
    cookie = request.cookies.get(CSRF_COOKIE, "")
    if not cookie or not submitted or not compare_digest(cookie, submitted) or not compare_digest(active.csrf_hash, digest(submitted)):
        raise HTTPException(403, "Invalid CSRF token")
    return active

def verify_password(user: AdminUser | None, submitted: str) -> bool:
    if not user:
        # Similar-cost check for unknown accounts; arbitrary valid Argon2 hash.
        try:
            ph.verify(DUMMY_HASH, submitted)
        except (argon_exc.VerifyMismatchError, argon_exc.VerificationError):
            pass
        return False
    try:
        return bool(ph.verify(user.password_hash, submitted))
    except (argon_exc.VerifyMismatchError, argon_exc.VerificationError):
        return False

DUMMY_HASH = ph.hash("not-a-real-account-password-555!")
