"""Explicit one-time admin bootstrap. Run only against the intended local database."""
import getpass
import os
from sqlalchemy import select
from app.config import get_settings
from app.db import SessionLocal
from app.models import AdminUser
from app.security import ph, password_policy

def main():
    settings = get_settings()
    print(f"Environment: {settings.environment}; database: {settings.database_url.split('@')[-1]}")
    email = (os.environ.get("TC_ADMIN_EMAIL") or input("Admin email: ")).strip().lower()
    password = os.environ.get("TC_ADMIN_PASSWORD") or getpass.getpass("Admin password (12+ mixed characters): ")
    password_policy(password)
    if not email or "@" not in email or len(email) > 255:
        raise SystemExit("Valid admin email required")
    with SessionLocal() as db:
        if db.scalar(select(AdminUser).where(AdminUser.email == email)):
            raise SystemExit("Admin already exists. Bootstrap refuses to overwrite credentials.")
        db.add(AdminUser(email=email, password_hash=ph.hash(password)))
        db.commit()
    print("Admin created. Remove temporary TC_ADMIN_PASSWORD from your shell immediately.")

if __name__ == "__main__":
    main()
