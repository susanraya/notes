"""POST /notes: a new, empty note owned by the signed-in user.
GET /notes/{id}: open one of the signed-in user's own notes.

Covers AC-011 of US-005 and AC-017 of US-007. Uses the same
`client`/`auth_client`/`db_session` fixtures as the integration suite
(tests/conftest.py), which point the app at a real, per-test-transaction database.
"""

from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Note
from app.routers.notes import create_note_for_user, get_note_for_user


def test_ac011_creates_an_empty_note_owned_by_the_given_user(db_session: Session) -> None:
    owner_id = "11111111-1111-1111-1111-111111111111"

    note = create_note_for_user(db_session, owner_id=owner_id)

    assert note.id
    assert note.owner_id == owner_id
    assert note.title == ""
    assert note.content_html == ""
    assert note.created_at is not None
    assert note.updated_at is not None

    stored = db_session.scalars(select(Note).where(Note.id == note.id)).one()
    assert stored.owner_id == owner_id


def test_ac011_each_call_creates_a_distinct_note(db_session: Session) -> None:
    owner_id = "22222222-2222-2222-2222-222222222222"

    first = create_note_for_user(db_session, owner_id=owner_id)
    second = create_note_for_user(db_session, owner_id=owner_id)

    assert first.id != second.id


def test_ac011_post_notes_returns_a_new_empty_note_owned_by_me(auth_client: TestClient) -> None:
    me = auth_client.get("/auth/me")
    assert me.status_code == 200
    my_id = me.json()["id"]

    response = auth_client.post("/notes")

    assert response.status_code == 201
    body = response.json()
    assert body["id"]
    assert body["title"] == ""
    assert body["contentHtml"] == ""
    assert body["createdAt"]
    assert body["updatedAt"]

    # Owned by the signed-in user, never by anything the request could claim.
    again = auth_client.get("/auth/me")
    assert again.json()["id"] == my_id


def test_ac011_post_notes_requires_a_signed_in_user(client: TestClient) -> None:
    response = client.post("/notes")

    assert response.status_code == 401


# --- AC-017 ---


def test_ac017_fetches_a_note_owned_by_the_given_user(db_session: Session) -> None:
    owner_id = "33333333-3333-3333-3333-333333333333"
    note = create_note_for_user(db_session, owner_id=owner_id)

    fetched = get_note_for_user(db_session, note_id=note.id, owner_id=owner_id)

    assert fetched is not None
    assert fetched.id == note.id


def test_ac017_returns_none_for_a_note_owned_by_someone_else(db_session: Session) -> None:
    owner_id = "44444444-4444-4444-4444-444444444444"
    other_id = "55555555-5555-5555-5555-555555555555"
    note = create_note_for_user(db_session, owner_id=owner_id)

    fetched = get_note_for_user(db_session, note_id=note.id, owner_id=other_id)

    assert fetched is None


def test_ac017_returns_none_for_an_unknown_note_id(db_session: Session) -> None:
    fetched = get_note_for_user(db_session, note_id="does-not-exist", owner_id="anyone")

    assert fetched is None


def test_ac017_get_notes_id_opens_the_note_with_saved_content(auth_client: TestClient) -> None:
    created = auth_client.post("/notes")
    assert created.status_code == 201, created.text
    note_id = created.json()["id"]
    html = "<h1>Title</h1><p><strong>Bold</strong></p>"
    saved = auth_client.put(f"/notes/{note_id}", json={"contentHtml": html})
    assert saved.status_code == 200, saved.text

    response = auth_client.get(f"/notes/{note_id}")

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["id"] == note_id
    assert body["contentHtml"] == html


def test_ac017_get_notes_id_refuses_a_note_owned_by_another_account(
    auth_client: TestClient, admin_client: TestClient
) -> None:
    created = auth_client.post("/notes")
    assert created.status_code == 201, created.text
    note_id = created.json()["id"]

    response = admin_client.get(f"/notes/{note_id}")

    assert response.status_code == 404


def test_ac017_get_notes_id_404s_for_an_unknown_note(auth_client: TestClient) -> None:
    response = auth_client.get("/notes/does-not-exist-at-all")

    assert response.status_code == 404


def test_ac017_get_notes_id_requires_a_signed_in_user(client: TestClient) -> None:
    response = client.get("/notes/some-id")

    assert response.status_code == 401
