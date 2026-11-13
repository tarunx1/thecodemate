"""Authored copy and runtime mode have one deliberate source of truth."""
import pytest
import re
from pathlib import Path

from app.config import build_settings
from app.content import SETTING_DEFAULTS
from app.copy import COPY


def test_site_settings_defaults_come_from_copy_catalogue():
    assert SETTING_DEFAULTS == COPY["defaults"]
    assert "hero_effect" not in SETTING_DEFAULTS
    assert "headline" not in SETTING_DEFAULTS


def test_runtime_mode_must_be_explicit(monkeypatch):
    monkeypatch.delenv("TC_ENV", raising=False)
    with pytest.raises(RuntimeError, match="TC_ENV is required"):
        build_settings()


def test_legacy_shell_reads_shared_copy_catalogue(client, monkeypatch):
    monkeypatch.setitem(COPY["legacy"]["base"], "exploreTopics", "Browse the library")
    response = client.get("/")
    assert response.status_code == 200
    assert '>Browse the library</a>' in response.text
    assert '>Explore topics</a>' not in response.text


def test_legacy_template_copy_references_exist():
    templates = Path(__file__).resolve().parents[1] / "app" / "templates"
    for template in templates.glob("*.html"):
        for group, key in re.findall(r"copy\.legacy\.(\w+)\.(\w+)", template.read_text()):
            assert key in COPY["legacy"][group], f"{template.name}: {group}.{key}"
