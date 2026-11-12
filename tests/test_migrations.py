"""Guard the applied dynamic 0001 migration without rewriting its history."""
import os
import subprocess
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect


ROOT = Path(__file__).resolve().parents[1]
INITIAL_COLUMNS = {
    "tc_admin_users": {"id", "email", "password_hash", "active", "created_at"},
    "tc_admin_sessions": {"id", "admin_id", "token_hash", "csrf_hash", "expires_at", "created_at"},
    "tc_content_items": {"id", "kind", "slug", "published_revision_id", "draft_revision_id", "updated_at", "created_at"},
    "tc_content_revisions": {"id", "item_id", "revision_number", "title", "summary", "body", "steps", "category", "tags", "cover_media_id", "demo_url", "repo_url", "video_url", "featured", "sample", "created_at"},
    "tc_media": {"id", "key", "alt", "width", "height", "created_at"},
    "tc_site_settings": {"key", "value"},
    "tc_audit_log": {"id", "admin_id", "action", "item_id", "created_at"},
}


def test_initial_migration_contract_and_head(tmp_path):
    database = tmp_path / "migration-contract.db"
    env = {**os.environ, "TC_ENV": "test", "TC_DATABASE_URL": f"sqlite:///{database}"}
    for args in (("upgrade", "head"), ("check",)):
        result = subprocess.run([sys.executable, "-m", "alembic", *args], cwd=ROOT,
                                env=env, capture_output=True, text=True, timeout=30)
        assert result.returncode == 0, result.stdout + result.stderr
    engine = create_engine(env["TC_DATABASE_URL"])
    try:
        inspector = inspect(engine)
        assert set(inspector.get_table_names()) == {*INITIAL_COLUMNS, "alembic_version"}
        for table, columns in INITIAL_COLUMNS.items():
            assert {column["name"] for column in inspector.get_columns(table)} == columns
    finally:
        engine.dispose()
