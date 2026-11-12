import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db import Base, db_session
from app.models import AdminUser
from app.security import ph
from app.main import app, _login_attempts
import app.main as main_module
from dataclasses import replace

@pytest.fixture
def client(tmp_path, monkeypatch):
    engine = create_engine(f"sqlite:///{tmp_path / 'isolated.db'}", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine, expire_on_commit=False)
    with Session() as db:
        db.add(AdminUser(email="owner@example.org", password_hash=ph.hash("test-secret-for-owner-2026!")))
        db.commit()
    def override_db():
        db = Session()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[db_session] = override_db
    monkeypatch.setattr(main_module, "settings", replace(main_module.settings, media_dir=tmp_path / "media"))
    _login_attempts.clear()
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    engine.dispose()

@pytest.fixture
def signed_in(client):
    page = client.get("/admin/login")
    assert page.status_code == 200
    cookie = client.cookies.get("tc_login_csrf")
    response = client.post("/admin/login", data={"email": "owner@example.org", "password": "test-secret-for-owner-2026!", "csrf": cookie}, follow_redirects=False)
    assert response.status_code == 303
    assert client.cookies.get("tc_admin_session")
    return client
