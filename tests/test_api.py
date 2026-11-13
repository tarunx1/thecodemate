"""Next.js JSON boundary must preserve the existing CMS trust and publication rules."""
from test_site import example


def test_public_api_excludes_drafts_and_escapes_markdown(signed_in):
    client = signed_in
    csrf = client.cookies['tc_admin_csrf']
    response = client.post('/api/admin/content', data=example(), headers={'x-csrf-token': csrf})
    assert response.status_code == 200, response.text
    item = response.json()
    assert item['draft']['title'] == 'How Packets Move'
    assert '<script>' not in item['draft']['body_html']
    assert client.get('/api/public/topics/how-packets-move').status_code == 404
    assert client.get('/api/public/topics').json()['items'] == []
    assert client.post(f"/api/admin/content/{item['id']}/publish", data={'expected_draft': item['draft_revision_id'], 'expected_state': item['editor_state']}, headers={'x-csrf-token': csrf}).status_code == 200
    public = client.get('/api/public/topics/how-packets-move').json()['item']
    assert public['content']['title'] == 'How Packets Move'
    assert 'draft' not in public
    assert client.post(f"/api/admin/content/{item['id']}/publish", data={'expected_draft': item['draft_revision_id'], 'expected_state': item['editor_state']}, headers={'x-csrf-token': csrf}).status_code == 409
    current = client.get(f"/api/admin/content/{item['id']}").json()
    assert client.post(f"/api/admin/content/{item['id']}/unpublish", data={'expected_state': current['editor_state']}, headers={'x-csrf-token': csrf}).status_code == 200
    assert client.get('/api/public/topics/how-packets-move').status_code == 404


def test_admin_api_auth_and_csrf(client, signed_in):
    assert client.get('/api/admin/dashboard').status_code == 200  # signed_in shares client
    csrf = client.cookies['tc_admin_csrf']
    assert client.post('/api/admin/content', data=example()).status_code == 403
    assert client.post('/api/admin/content', data=example(), headers={'x-csrf-token': 'bad'}).status_code == 403
    assert client.post('/api/admin/content', data=example(), headers={'x-csrf-token': csrf}).status_code == 200
    assert client.post('/api/admin/logout', headers={'x-csrf-token': csrf}).status_code == 200
    assert client.get('/api/admin/dashboard').status_code == 401


def test_public_api_search_and_settings(signed_in):
    client = signed_in
    csrf = client.cookies['tc_admin_csrf']
    item = client.post('/api/admin/content', data=example(), headers={'x-csrf-token': csrf}).json()
    client.post(f"/api/admin/content/{item['id']}/publish", data={'expected_draft': item['draft_revision_id'], 'expected_state': item['editor_state']}, headers={'x-csrf-token': csrf})
    assert len(client.get('/api/public/topics?q=Packets').json()['items']) == 1
    assert client.get('/api/public/topics?category=Other').json()['items'] == []
    assert client.get('/api/admin/dashboard').json()['metrics']['published_topics'] == 1
    settings = client.get('/api/admin/settings').json()
    settings['hero_highlight'] = 'clear.'
    assert client.post('/api/admin/settings', data=settings, headers={'x-csrf-token': csrf}).status_code == 200
    assert client.get('/api/public/home').json()['settings']['hero_highlight'] == 'clear.'


def test_unpublished_media_is_private(signed_in):
    from io import BytesIO
    from PIL import Image
    client = signed_in
    csrf = client.cookies['tc_admin_csrf']
    image = BytesIO()
    Image.new('RGB', (80, 60), (255, 122, 0)).save(image, format='PNG')
    response = client.post('/api/admin/media', files={'file': ('cover.png', image.getvalue(), 'image/png')}, data={'alt': 'Test cover'}, headers={'x-csrf-token': csrf})
    assert response.status_code == 200, response.text
    url = response.json()['url']
    assert client.get(url).status_code == 200
    client.post('/api/admin/logout', headers={'x-csrf-token': csrf})
    assert client.get(url).status_code == 404


def test_retired_settings_are_not_exposed_or_overwritten(signed_in):
    from app.db import db_session
    from app.main import app
    from app.models import SiteSetting
    client = signed_in
    csrf = client.cookies['tc_admin_csrf']
    settings = client.get('/api/admin/settings').json()
    assert 'hero_effect' not in settings
    assert 'headline' not in settings
    db = next(app.dependency_overrides[db_session]())  # the isolated test database
    db.add(SiteSetting(key='hero_effect', value='aurora'))
    db.add(SiteSetting(key='headline', value='Old headline'))
    db.commit()
    db.close()
    assert client.post('/api/admin/settings', data={**settings, 'hero_effect': '<script>', 'headline': 'new'}, headers={'x-csrf-token': csrf}).status_code == 200
    for path in ('/api/admin/settings', '/api/public/settings', '/api/public/home'):
        payload = client.get(path).json()
        active = payload['settings'] if path.endswith('/home') else payload
        assert 'hero_effect' not in active
        assert 'headline' not in active
    db = next(app.dependency_overrides[db_session]())
    assert db.get(SiteSetting, 'hero_effect').value == 'aurora'
    assert db.get(SiteSetting, 'headline').value == 'Old headline'
    db.close()


def test_stale_editor_cannot_save_or_publish_unreviewed_changes(signed_in):
    client = signed_in
    csrf = client.cookies['tc_admin_csrf']
    item = client.post('/api/admin/content', data=example(), headers={'x-csrf-token': csrf}).json()
    first_state = item['editor_state']
    changed = client.post(f"/api/admin/content/{item['id']}",
                          data={**example(title='Another tab edit'), 'expected_state': first_state},
                          headers={'x-csrf-token': csrf})
    assert changed.status_code == 200, changed.text
    assert changed.json()['editor_state'] != first_state
    assert client.post(f"/api/admin/content/{item['id']}",
                       data={**example(title='Stale overwrite'), 'expected_state': first_state},
                       headers={'x-csrf-token': csrf}).status_code == 409
    assert client.post(f"/api/admin/content/{item['id']}/publish",
                       data={'expected_draft': item['draft_revision_id'], 'expected_state': first_state},
                       headers={'x-csrf-token': csrf}).status_code == 409
    current = client.get(f"/api/admin/content/{item['id']}").json()
    assert current['draft']['title'] == 'Another tab edit'
    assert client.post(f"/api/admin/content/{item['id']}/publish",
                       data={'expected_draft': current['draft_revision_id'], 'expected_state': current['editor_state']},
                       headers={'x-csrf-token': csrf}).status_code == 200


def test_lists_are_paginated_and_compact(signed_in):
    client = signed_in
    csrf = client.cookies['tc_admin_csrf']
    for number in range(3):
        item = client.post('/api/admin/content', data=example(slug=f'packet-guide-{number}',
                           title=f'Packet Guide {number}'), headers={'x-csrf-token': csrf}).json()
        assert client.post(f"/api/admin/content/{item['id']}/publish",
                           data={'expected_draft': item['draft_revision_id'], 'expected_state': item['editor_state']},
                           headers={'x-csrf-token': csrf}).status_code == 200
    first = client.get('/api/public/topics?page=1&page_size=2').json()
    second = client.get('/api/public/topics?page=2&page_size=2').json()
    assert (first['total'], len(first['items']), first['has_next']) == (3, 2, True)
    assert (second['page'], len(second['items']), second['has_next']) == (2, 1, False)
    assert 'body_html' not in first['items'][0]['content']
    assert 'body_html' in client.get('/api/public/topics/packet-guide-0').json()['item']['content']
    admin = client.get('/api/admin/content?kind=topic&page_size=2').json()
    assert (admin['total'], len(admin['items'])) == (3, 2)
    assert 'body' not in admin['items'][0]['content']


def test_upload_limit_and_failed_write_remove_temporary_media(signed_in, tmp_path):
    from io import BytesIO
    from PIL import Image
    import app.main as main
    client = signed_in
    csrf = client.cookies['tc_admin_csrf']
    too_large = client.post('/api/admin/media',
                            files={'file': ('huge.png', b'x' * (9 * 1024 * 1024 + 1), 'image/png')},
                            headers={'x-csrf-token': csrf})
    assert too_large.status_code == 413
    image = BytesIO()
    Image.new('RGB', (16, 16), (255, 122, 0)).save(image, format='PNG')
    response = client.post('/api/admin/content', data=example(kind='invalid'),
                           files={'cover': ('cover.png', image.getvalue(), 'image/png')},
                           headers={'x-csrf-token': csrf})
    assert response.status_code == 422
    assert list(main.settings.media_dir.glob('*.webp')) == []
