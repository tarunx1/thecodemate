"""Strict environment-owned settings; never copy Visa House identities or secrets."""
from dataclasses import dataclass
from functools import lru_cache
import os
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent

@dataclass(frozen=True)
class Settings:
    environment: str
    database_url: str
    site_url: str
    secret_key: str
    seo_indexing: bool
    media_dir: Path

    @property
    def production(self) -> bool:
        return self.environment == "production"

    @property
    def secure_cookie(self) -> bool:
        return self.environment in {"production", "staging"}


def build_settings() -> Settings:
    environment = os.environ.get("TC_ENV", "").strip()
    if not environment:
        raise RuntimeError("TC_ENV is required: choose development, test, staging or production explicitly")
    if environment not in {"development", "test", "production", "staging"}:
        raise RuntimeError("Invalid TC_ENV")
    production_like = environment in {"production", "staging"}
    database_url = os.environ.get("TC_DATABASE_URL", f"sqlite:///{ROOT / 'data/thecodemate.db'}")
    site_url = os.environ.get("TC_SITE_URL", "http://127.0.0.1:8000").rstrip("/")
    parts = urlsplit(site_url)
    if parts.scheme not in {"http", "https"} or not parts.netloc or parts.path not in {"", "/"}:
        raise RuntimeError("TC_SITE_URL must be a full public origin")
    secret_key = os.environ.get("TC_SECRET_KEY", "")
    if production_like:
        if not site_url.startswith("https://"):
            raise RuntimeError("Production/staging require HTTPS TC_SITE_URL")
        if len(secret_key) < 48:
            raise RuntimeError("Production/staging require a unique long TC_SECRET_KEY")
        if database_url.startswith("sqlite"):
            raise RuntimeError("Production/staging require dedicated non-SQLite database")
    return Settings(
        environment=environment,
        database_url=database_url,
        site_url=site_url,
        secret_key=secret_key,
        seo_indexing=os.environ.get("TC_SEO_INDEXING", "false").lower() in {"true", "1"} and environment == "production",
        media_dir=Path(os.environ.get("TC_MEDIA_DIR", str(ROOT / "media"))).resolve(),
    )


@lru_cache
def get_settings() -> Settings:
    return build_settings()
