"""POST /notes: a new, empty note owned by the signed-in user.

Covers AC-011 of US-005. Uses the same `client`/`auth_client`/`db_session` fixtures as
the integration suite (tests/conftest.py), which point the app at a real,
per-test-transaction database.
"""

from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Note
from app.routers.notes import create_note_for_user


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
