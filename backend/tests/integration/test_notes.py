"""US-005: Create a new rich-text note.

POST /notes (Notes API) is the only endpoint the published API spec documents for this
story (AC-011). TC-024, TC-025 and TC-027 also call GET /notes/{id} and PUT /notes/{id}
to read and update a note's content for AC-012/AC-013; those two routes are not yet in
frontend/src/api/openapi.json, so the request body below follows the one field name the
spec does give for note content, `contentHtml` (NoteResponse), rather than the case's
generic "content" label.
"""

import secrets
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


def _second_user(client: TestClient) -> TestClient:
    """A second, independently signed-in client (Bob), made through the API itself."""
    email = f"bob-{uuid4().hex[:12]}@example.com"
    pw = secrets.token_urlsafe(16)
    other = TestClient(app)
    response = other.post(
        "/auth/register",
        json={"email": email, "password": pw, "confirmPassword": pw},
    )
    assert response.status_code == 201, response.text
    tok = response.json()["token"]
    other.headers["Authorization"] = f"Bearer {tok}"
    return other


# --- AC-011 ---


def test_tc021_create_new_empty_note_via_api(auth_client: TestClient) -> None:
    create_response = auth_client.post("/notes")

    assert create_response.status_code == 201, create_response.text
    note = create_response.json()
    assert note["title"] == ""
    assert note["contentHtml"] == ""

    list_response = auth_client.get("/notes")

    assert list_response.status_code == 200, list_response.text
    note_ids = [item["id"] for item in list_response.json()]
    assert note["id"] in note_ids


def test_tc022_create_note_without_authentication_is_rejected(client: TestClient) -> None:
    response = client.post("/notes")

    assert response.status_code == 401, response.text


# --- AC-012 ---


def test_tc024_apply_and_persist_bold_heading_and_list_formatting(
    auth_client: TestClient,
) -> None:
    created = auth_client.post("/notes")
    assert created.status_code == 201, created.text
    note_id = created.json()["id"]

    html = (
        "<h1>Project Plan</h1><p><strong>Bold intro</strong></p>"
        "<ul><li>First item</li><li>Second item</li></ul>"
    )

    save_response = auth_client.put(f"/notes/{note_id}", json={"contentHtml": html})

    assert save_response.status_code == 200, save_response.text
    saved = save_response.json()
    assert saved["updatedAt"]
    assert "<h1>Project Plan</h1>" in saved["contentHtml"]
    assert "<strong>Bold intro</strong>" in saved["contentHtml"]
    assert "<li>First item</li>" in saved["contentHtml"]
    assert "<li>Second item</li>" in saved["contentHtml"]

    read_response = auth_client.get(f"/notes/{note_id}")

    assert read_response.status_code == 200, read_response.text
    reread = read_response.json()
    assert "<h1>Project Plan</h1>" in reread["contentHtml"]
    assert "<strong>Bold intro</strong>" in reread["contentHtml"]
    assert "<li>First item</li>" in reread["contentHtml"]
    assert "<li>Second item</li>" in reread["contentHtml"]


def test_tc025_cannot_format_a_note_owned_by_another_user(
    auth_client: TestClient, client: TestClient
) -> None:
    created = auth_client.post("/notes")
    assert created.status_code == 201, created.text
    note_id = created.json()["id"]
    original_content = created.json()["contentHtml"]

    bob = _second_user(client)

    hack_response = bob.put(f"/notes/{note_id}", json={"contentHtml": "<strong>Hacked</strong>"})

    assert hack_response.status_code in (403, 404), hack_response.text

    read_response = auth_client.get(f"/notes/{note_id}")

    assert read_response.status_code == 200, read_response.text
    assert read_response.json()["contentHtml"] == original_content


# --- AC-013 ---


def test_tc027_api_offers_no_way_to_attach_an_image_or_file(auth_client: TestClient) -> None:
    created = auth_client.post("/notes")
    assert created.status_code == 201, created.text
    note_id = created.json()["id"]

    save_response = auth_client.put(
        f"/notes/{note_id}",
        json={"contentHtml": "<p>Agenda notes</p>", "attachment": "photo.jpg"},
    )

    assert save_response.status_code == 200, save_response.text
    saved = save_response.json()
    assert saved["updatedAt"]
    assert saved["contentHtml"] == "<p>Agenda notes</p>"
    assert "attachment" not in saved
    assert "image" not in saved

    read_response = auth_client.get(f"/notes/{note_id}")

    assert read_response.status_code == 200, read_response.text
    reread = read_response.json()
    assert reread["contentHtml"] == "<p>Agenda notes</p>"
    assert "attachment" not in reread
    assert "image" not in reread


# --- AC-017 ---


def test_tc002_fetch_an_owned_note_returns_its_saved_content_and_formatting(
    auth_client: TestClient,
) -> None:
    created = auth_client.post("/notes")
    assert created.status_code == 201, created.text
    note_id = created.json()["id"]

    html = "<h1>Agenda</h1><p>— <strong>budget review</strong>, hiring plan, open risks</p>"

    save_response = auth_client.put(f"/notes/{note_id}", json={"contentHtml": html})
    assert save_response.status_code == 200, save_response.text

    list_response = auth_client.get("/notes")

    assert list_response.status_code == 200, list_response.text
    note_ids = [item["id"] for item in list_response.json()]
    assert note_id in note_ids

    read_response = auth_client.get(f"/notes/{note_id}")

    assert read_response.status_code == 200, read_response.text
    reread = read_response.json()
    assert reread["id"] == note_id
    assert reread["contentHtml"] == html


def test_tc003_opening_a_note_owned_by_another_account_is_refused(
    auth_client: TestClient, client: TestClient
) -> None:
    bob = _second_user(client)

    created = bob.post("/notes")
    assert created.status_code == 201, created.text
    note_id = created.json()["id"]

    save_response = bob.put(
        f"/notes/{note_id}", json={"contentHtml": "<h1>Bob's private note</h1>"}
    )
    assert save_response.status_code == 200, save_response.text

    hack_response = auth_client.get(f"/notes/{note_id}")

    assert hack_response.status_code in (403, 404), hack_response.text
    assert "Bob's private note" not in hack_response.text

    owner_read_response = bob.get(f"/notes/{note_id}")

    assert owner_read_response.status_code == 200, owner_read_response.text
    assert owner_read_response.json()["contentHtml"] == "<h1>Bob's private note</h1>"


def test_tc004_opening_a_note_that_does_not_exist_fails_clearly(
    auth_client: TestClient,
) -> None:
    response = auth_client.get("/notes/999999")

    assert response.status_code == 404, response.text
