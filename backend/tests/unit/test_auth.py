"""POST /auth/register: validation, duplicate rejection and password hashing.

Covers AC-001 through AC-004 of US-001. Uses the same `client`/`db_session` fixtures
as the integration suite (tests/conftest.py), which point the app at a real,
per-test-transaction database.
"""

import secrets
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import USER_ROLE, ensure_user, verify_password
from app.errors import WRONG_CREDENTIALS
from app.models import User
from app.routers.register import MIN_PASSWORD_LENGTH


def _email() -> str:
    """A new address per test, so one test never collides with another's rows."""
    return f"reg-{uuid4().hex[:12]}@example.com"


def _strong_password() -> str:
    """A password that meets the stated requirements, random each time."""
    return "Aa1" + secrets.token_urlsafe(12)


def test_ac001_registers_and_signs_in_to_a_new_account(client: TestClient) -> None:
    email = _email()
    password = _strong_password()

    response = client.post("/auth/register", json={"email": email, "password": password})

    assert response.status_code == 201
    body = response.json()
    assert body["user"]["email"] == email
    assert body["user"]["id"]
    assert body["token"]

    # Signed in to that account: the returned token works against a protected route.
    me = client.get("/auth/me", headers={"Authorization": f"Bearer {body['token']}"})
    assert me.status_code == 200
    assert me.json()["email"] == email


def test_ac002_rejects_an_email_already_registered(client: TestClient) -> None:
    email = _email()
    first = client.post("/auth/register", json={"email": email, "password": _strong_password()})
    assert first.status_code == 201

    second = client.post("/auth/register", json={"email": email, "password": _strong_password()})

    assert second.status_code == 409
    assert "notes" not in second.json()["detail"].lower()
    assert "already" in second.json()["detail"].lower()


def test_ac003_rejects_an_invalid_email_format(client: TestClient) -> None:
    response = client.post(
        "/auth/register",
        json={"email": "not-an-email", "password": _strong_password()},
    )

    assert response.status_code == 422
    assert "email" in response.json()["detail"].lower()


def test_ac003_rejects_a_password_below_the_minimum_length(client: TestClient) -> None:
    short_password = "Aa1" + "a" * (MIN_PASSWORD_LENGTH - 4)
    assert len(short_password) < MIN_PASSWORD_LENGTH

    response = client.post(
        "/auth/register",
        json={"email": _email(), "password": short_password},
    )

    assert response.status_code == 422
    assert "password" in response.json()["detail"].lower()


def test_ac003_rejects_a_password_without_a_digit(client: TestClient) -> None:
    response = client.post(
        "/auth/register",
        json={"email": _email(), "password": "nothingbutletters"},
    )

    assert response.status_code == 422
    assert "password" in response.json()["detail"].lower()


def test_ac004_stores_the_password_only_as_a_hash(client: TestClient, db_session: Session) -> None:
    email = _email()
    password = _strong_password()

    response = client.post("/auth/register", json={"email": email, "password": password})
    assert response.status_code == 201

    stored = db_session.scalars(select(User).where(User.email == email)).one()

    assert stored.password_hash != password
    assert password not in stored.password_hash
    assert verify_password(password, stored.password_hash)


# --- US-002: Sign in to my account (POST /auth/login) ---


def test_ac005_signs_in_with_the_correct_email_and_password(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    password = _strong_password()
    ensure_user(db_session, email=email, password=password, role=USER_ROLE)

    response = client.post("/auth/login", json={"email": email, "password": password})

    assert response.status_code == 200
    token = response.json()["token"]
    assert token

    # Signed in: the token works against a protected route and lands on this account.
    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == email


def test_ac006_rejects_an_incorrect_password_with_the_generic_message(
    client: TestClient, db_session: Session
) -> None:
    email = _email()
    ensure_user(db_session, email=email, password=_strong_password(), role=USER_ROLE)

    response = client.post(
        "/auth/login", json={"email": email, "password": secrets.token_urlsafe()}
    )

    assert response.status_code == WRONG_CREDENTIALS.status_code
    assert response.json()["detail"] == WRONG_CREDENTIALS.message


def test_ac006_rejects_an_unknown_email_with_the_very_same_message(client: TestClient) -> None:
    """NFR-004: an email that was never registered is refused exactly like a wrong
    password for one that was, so the response alone never reveals which it was."""
    response = client.post(
        "/auth/login",
        json={"email": _email(), "password": _strong_password()},
    )

    assert response.status_code == WRONG_CREDENTIALS.status_code
    assert response.json()["detail"] == WRONG_CREDENTIALS.message
