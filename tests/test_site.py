from io import BytesIO
from PIL import Image
import re

def example(**overrides):
    base = {
        "kind":"topic", "slug":"how-packets-move", "title":"How Packets Move",
        "category":"Networking", "summary":"A visual walkthrough of packet routing across networks.",
        "body":"## A simple example\n\nThe data moves in packets.\n\n<script>alert(1)</script>",
        "steps":"Prepare | Make data ready.\nRoute | Forward the packets.",
        "tags":"TCP, Network", "demo_url":"", "repo_url":"", "video_url":"",
    }
    base.update(overrides)
    return base


def editor_tokens(client, item_id):
    html = client.get(f"/admin/edit/{item_id}").text
    draft = re.search(r'name="expected_draft" value="(\d+)"', html)
    return (draft.group(1) if draft else None,
            re.search(r'name="expected_state" value="([a-f0-9]+)"', html).group(1))

def test_public_pages_and_real_not_found(client):
    assert client.get("/").status_code == 200
    assert "Ideas deserve" in client.get("/").text
    assert client.get("/topics").status_code == 200
    assert client.get("/projects").status_code == 200
    assert client.get("/topics/missing").status_code == 404
    assert client.get("/robots.txt").text.startswith("User-agent")
    assert "noindex" in client.get("/topics").text

def test_anonymous_cannot_write_or_preview(client):
    assert client.post("/admin/new", data=example()).status_code == 401
    assert client.get("/admin/preview/1", follow_redirects=False).status_code == 303
    assert client.post("/admin/settings", data={"hero_description":"hacked"}).status_code == 401
    assert client.get("/admin").status_code == 200  # redirects to sign in

def test_login_csrf_and_invalid_password(client):
    assert client.post("/admin/login", data={"email":"owner@example.org","password":"wrong","csrf":"invalid"}).status_code == 403
    client.get("/admin/login")
    csrf = client.cookies.get("tc_login_csrf")
    res = client.post("/admin/login", data={"email":"owner@example.org","password":"wrong","csrf":csrf})
    assert res.status_code == 401
    assert "Invalid email or password" in res.text

def test_draft_preview_publish_revision_isolation(signed_in):
    client = signed_in
    assert client.post("/admin/new", data=example()).status_code == 403  # no CSRF
    csrf = client.cookies["tc_admin_csrf"]
    response = client.post("/admin/new", data={**example(), "csrf":csrf}, follow_redirects=False)
    assert response.status_code == 303, response.text
    item_id = int(response.headers["location"].split("/")[3].split("?")[0])
    assert client.get("/topics/how-packets-move").status_code == 404
    preview = client.get(f"/admin/preview/{item_id}")
    assert preview.status_code == 200
    assert "PREVIEW MODE" in preview.text
    assert "How Packets Move" in preview.text
    # Raw HTML is escaped instead of injected into the article.
    assert "<script>alert(1)</script>" not in preview.text
    expected, state = editor_tokens(client, item_id)
    publish = client.post(f"/admin/publish/{item_id}", data={"csrf":csrf,"expected_draft":expected,"expected_state":state}, follow_redirects=False)
    assert publish.status_code == 303
    live = client.get("/topics/how-packets-move")
    assert live.status_code == 200
    assert "A visual walkthrough" in live.text
    assert client.post(f"/admin/publish/{item_id}", data={"csrf":csrf,"expected_draft":expected,"expected_state":state}).status_code == 409
    # New edit produces a separate working draft, leaving the public revision intact.
    _, state = editor_tokens(client, item_id)
    res = client.post(f"/admin/edit/{item_id}", data={**example(title="How Packets Really Move", summary="A revised explanation of network packet movement."),"csrf":csrf,"expected_state":state}, follow_redirects=False)
    assert res.status_code == 303
    assert "How Packets Really Move" in client.get(f"/admin/preview/{item_id}").text
    assert "How Packets Really Move" not in client.get("/topics/how-packets-move").text
    expected2, state2 = editor_tokens(client, item_id)
    assert expected2 != expected
    assert client.post(f"/admin/publish/{item_id}", data={"csrf":csrf,"expected_draft":expected2,"expected_state":state2}, follow_redirects=False).status_code == 303
    assert "How Packets Really Move" in client.get("/topics/how-packets-move").text
    _, state3 = editor_tokens(client, item_id)
    assert client.post(f"/admin/unpublish/{item_id}", data={"csrf":csrf,"expected_state":state3}, follow_redirects=False).status_code == 303
    assert client.get("/topics/how-packets-move").status_code == 404

def test_create_project_search_and_external_link(signed_in):
    client = signed_in
    csrf = client.cookies["tc_admin_csrf"]
    response = client.post("/admin/new", data={**example(kind="project", slug="network-simulator", title="Network Simulator", demo_url="https://example.org/my-demo"), "csrf":csrf}, follow_redirects=False)
    assert response.status_code == 303
    item_id = int(response.headers["location"].split("/")[3].split("?")[0])
    expected, state = editor_tokens(client, item_id)
    client.post(f"/admin/publish/{item_id}", data={"csrf":csrf, "expected_draft":expected,"expected_state":state})
    page = client.get("/projects/network-simulator")
    assert "https://example.org/my-demo" in page.text
    assert "noopener noreferrer" in page.text
    assert "Network Simulator" in client.get("/projects?q=Simulator").text
    assert "Network Simulator" not in client.get("/projects?q=absent-term").text

def test_unsafe_links_validation(signed_in):
    client = signed_in
    csrf = client.cookies["tc_admin_csrf"]
    response = client.post("/admin/new", data={**example(demo_url="javascript:alert(1)"), "csrf":csrf})
    assert response.status_code == 422
    assert "Links must be full HTTPS" in response.text
    assert client.get("/topics/how-packets-move").status_code == 404
    for private_url in ("https://192.168.1.1", "https://10.0.0.5", "https://[::1]", "https://169.254.169.254"):
        response = client.post("/admin/new", data={**example(demo_url=private_url), "csrf":csrf})
        assert response.status_code == 422
        assert "Local/private destinations" in response.text


def test_staging_uses_secure_session_cookies(monkeypatch):
    from app.config import build_settings
    monkeypatch.setenv("TC_ENV", "staging")
    monkeypatch.setenv("TC_SITE_URL", "https://staging.example.test")
    monkeypatch.setenv("TC_DATABASE_URL", "mysql+pymysql://placeholder@localhost/placeholder")
    monkeypatch.setenv("TC_SECRET_KEY", "x" * 48)
    assert build_settings().secure_cookie is True

def test_settings_and_logout(signed_in):
    client = signed_in
    csrf = client.cookies["tc_admin_csrf"]
    settings = {"eyebrow":"OUR VISUAL LAB", "hero_description":"We help people learn how the web works.", "hero_line1":"Ideas become", "hero_line2":"easy to", "hero_highlight":"understand.", "instagram_url":"https://www.instagram.com/thecodemate/", "footer_note":"Designed to make it click.", "csrf":csrf}
    assert client.post("/admin/settings", data=settings, follow_redirects=False).status_code == 303
    assert "OUR VISUAL LAB" in client.get("/").text
    assert "Ideas become" in client.get("/").text
    assert "understand." in client.get("/").text
    assert "Designed to make it click" in client.get("/").text
    assert client.post("/admin/logout", data={"csrf":csrf}, follow_redirects=False).status_code == 303
    assert client.post("/admin/settings", data=settings).status_code == 401

def test_image_upload_reencoded_and_served(signed_in):
    client = signed_in
    csrf = client.cookies["tc_admin_csrf"]
    img = Image.new("RGB", (800, 400), (255, 122, 0))
    data = BytesIO(); img.save(data, format="PNG")
    response = client.post("/admin/new", data={**example(), "csrf":csrf}, files={"cover": ("cover.png", data.getvalue(), "image/png")}, follow_redirects=False)
    assert response.status_code == 303, response.text
    item_id = int(response.headers["location"].split("/")[3].split("?")[0])
    import re
    preview = client.get(f"/admin/preview/{item_id}")
    m = re.search(r'/media/([a-z0-9]+\.webp)',preview.text)
    assert m
    resp = client.get("/media/" + m.group(1))
    assert resp.status_code == 200 and resp.headers["content-type"].startswith("image/webp")
    assert Image.open(BytesIO(resp.content)).format == "WEBP"
