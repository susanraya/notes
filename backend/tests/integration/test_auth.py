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
