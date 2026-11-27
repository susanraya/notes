"""Sign-in, proved on the test database. Part of the scaffold's test kit.

The `auth_client` fixture (tests/conftest.py) signs in the same way, so a failure here
explains a failure in every test that uses it.
"""

import secrets
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth import USER_ROLE, ensure_user
from app.seed import seed


def test_a_signed_in_user_reads_their_profile(auth_client: TestClient) -> None:
    response = auth_client.get("/auth/me")

    assert response.status_code == 200
    assert response.json()["role"] == USER_ROLE


def test_without_a_token_the_profile_is_refused(client: TestClient) -> None:
    assert client.get("/auth/me").status_code == 401


def _email() -> str:
    """A new address per test: the database may already hold users the app seeded."""
    return f"kit-{uuid4().hex[:12]}@example.com"


def test_a_wrong_password_is_refused(client: TestClient, db_session: Session) -> None:
    email = _email()
    ensure_user(db_session, email=email, password=secrets.token_urlsafe(), role=USER_ROLE)

    response = client.post(
        "/auth/login", json={"email": email, "password": secrets.token_urlsafe()}
    )

    assert response.status_code == 401


def test_the_seed_makes_its_users_once(db_session: Session) -> None:
    settings = {
        "BOOTSTRAP_ADMIN_EMAIL": _email(),
        "BOOTSTRAP_ADMIN_PASSWORD": secrets.token_urlsafe(),
        "SMOKE_TEST_EMAIL": _email(),
        "SMOKE_TEST_PASSWORD": secrets.token_urlsafe(),
    }

    assert seed(db_session, settings) == 2
    assert seed(db_session, settings) == 0


# --- US-001: Register with email and password (POST /auth/register) ---


def test_tc011_register_creates_account_and_empty_notes_space(client: TestClient) -> None:
    new_pw = "SecurePass123!"

    response = client.post(
        "/auth/register",
        json={
            "email": "alice@example.com",
            "password": new_pw,
            "confirmPassword": new_pw,
        },
    )

    assert response.status_code == 201, response.text
    body = response.json()
    assert body["token"]
    assert body["user"]["email"] == "alice@example.com"

    notes_response = client.get("/notes", headers={"Authorization": f"Bearer {body['token']}"})

    assert notes_response.status_code == 200, notes_response.text
    assert notes_response.json() == []


def test_tc013_registering_with_an_already_used_email_is_rejected(client: TestClient) -> None:
    first_pw = "SecurePass123!"
    second_pw = "AnotherPass456!"

    first = client.post(
        "/auth/register",
        json={
            "email": "alice@example.com",
            "password": first_pw,
            "confirmPassword": first_pw,
        },
    )
    assert first.status_code == 201, first.text

    response = client.post(
        "/auth/register",
        json={
            "email": "alice@example.com",
            "password": second_pw,
            "confirmPassword": second_pw,
        },
    )

    assert response.status_code == 409, response.text
    assert "note" not in response.text.lower()


def test_tc015_registering_with_an_invalid_email_format_is_rejected(client: TestClient) -> None:
    new_pw = "SecurePass123!"

    response = client.post(
        "/auth/register",
        json={
            "email": "bob.example.com",
            "password": new_pw,
            "confirmPassword": new_pw,
        },
    )

    assert response.status_code == 422, response.text
    errors = response.json().get("detail", [])

    def _mentions_email(error: object) -> bool:
        if isinstance(error, dict):
            return "email" in str(error.get("loc", [])).lower() or "email" in str(
                error.get("msg", "")
            ).lower()
        return "email" in str(error).lower()

    assert any(_mentions_email(error) for error in errors), response.text


def test_tc016_registering_with_a_too_short_password_is_rejected(client: TestClient) -> None:
    weak_pw = "abc123"

    response = client.post(
        "/auth/register",
        json={
            "email": "carol@example.com",
            "password": weak_pw,
            "confirmPassword": weak_pw,
        },
    )

    assert response.status_code == 422, response.text
    errors = response.json().get("detail", [])

    def _mentions_password(error: object) -> bool:
        if isinstance(error, dict):
            return "password" in str(error.get("loc", [])).lower() or "password" in str(
                error.get("msg", "")
            ).lower()
        return "password" in str(error).lower()

    assert any(_mentions_password(error) for error in errors), response.text


def test_tc019_stored_password_is_hashed_never_plain_text(client: TestClient) -> None:
    new_pw = "HashedPass789!"

    response = client.post(
        "/auth/register",
        json={
            "email": "dave@example.com",
            "password": new_pw,
            "confirmPassword": new_pw,
        },
    )

    assert response.status_code == 201, response.text
    body = response.json()
    assert body["token"]
    assert new_pw not in response.text


# --- US-002: Sign in to my account (POST /auth/login) ---


def test_tc005_successful_login_issues_session_token(client: TestClient) -> None:
    new_pw = "Str0ngP@ss1"

    register_response = client.post(
        "/auth/register",
        json={
            "email": "alice@example.com",
            "password": new_pw,
            "confirmPassword": new_pw,
        },
    )
    assert register_response.status_code == 201, register_response.text
    assert register_response.json()["token"]

    login_response = client.post(
        "/auth/login", json={"email": "alice@example.com", "password": new_pw}
    )

    assert login_response.status_code == 200, login_response.text
    assert login_response.json()["token"]


def test_tc007_login_refused_with_wrong_password(client: TestClient) -> None:
    correct_pw = "CorrectPass1"

    register_response = client.post(
        "/auth/register",
        json={
            "email": "carol@example.com",
            "password": correct_pw,
            "confirmPassword": correct_pw,
        },
    )
    assert register_response.status_code == 201, register_response.text

    response = client.post(
        "/auth/login", json={"email": "carol@example.com", "password": "WrongPass9"}
    )

    assert response.status_code == 401, response.text
    assert "token" not in response.json()
    assert "carol@example.com" not in response.text


def test_tc008_login_refused_identically_for_unknown_email(client: TestClient) -> None:
    correct_pw = "CorrectPass1"

    register_response = client.post(
        "/auth/register",
        json={
            "email": "carol2@example.com",
            "password": correct_pw,
            "confirmPassword": correct_pw,
        },
    )
    assert register_response.status_code == 201, register_response.text

    wrong_password_response = client.post(
        "/auth/login", json={"email": "carol2@example.com", "password": "WrongPass9"}
    )
    unknown_email_response = client.post(
        "/auth/login", json={"email": "nouser@example.com", "password": "AnyPass123"}
    )

    assert wrong_password_response.status_code == 401, wrong_password_response.text
    assert unknown_email_response.status_code == wrong_password_response.status_code
    assert unknown_email_response.json() == wrong_password_response.json()
    assert "token" not in unknown_email_response.json()
