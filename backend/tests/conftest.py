"""Test fixtures: a real PostgreSQL database, migrated once, rolled back after every test.

The tests run on the engine the app is deployed on, with the schema the migrations build
(never `create_all`), so a model change without a migration fails here first.
DATABASE_URL names the database: docker-compose.yml's `db` service on your machine, and
the platform sets it in its sandbox. Each test runs inside one transaction that is rolled
back at its end, so no test sees another's rows; app code that commits only ends a
savepoint inside it.

Fixtures: `db_session` (the test's session), `client` (the app on that session),
`auth_client` and `admin_client` (the same, signed in as a new user or admin).
"""

import os
import secrets
from collections.abc import Iterator
from pathlib import Path
from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import Engine, create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.auth import ADMIN_ROLE, USER_ROLE, ensure_user
from app.database import get_db
from app.main import app

_BACKEND = Path(__file__).resolve().parent.parent
_START_IT = (
    "Start it with `docker compose up -d db` from the repository root, then set "
    "DATABASE_URL to it (see .env.example), for example "
    "postgresql+psycopg://<user>:<password>@localhost:5432/<database>."
)


def _database_url() -> str:
    url = os.getenv("DATABASE_URL", "")
    if not url or url.startswith("sqlite"):
        pytest.fail(
            "The backend tests need PostgreSQL, and DATABASE_URL does not name one. " + _START_IT,
            pytrace=False,
        )
    return url


@pytest.fixture(scope="session")
def engine() -> Iterator[Engine]:
    """The test database, brought up to the migrations once per run."""
    url = _database_url()
    engine = create_engine(url, future=True)
    try:
        with engine.connect():
            pass
    except OperationalError:
        engine.dispose()
        where = make_url(url).render_as_string(hide_password=True)
        pytest.fail(f"The test database at {where} did not answer. {_START_IT}", pytrace=False)
    config = Config(str(_BACKEND / "alembic.ini"))
    config.set_main_option("script_location", str(_BACKEND / "alembic"))
    config.set_main_option("sqlalchemy.url", url.replace("%", "%%"))
    command.upgrade(config, "head")
    yield engine
    engine.dispose()


@pytest.fixture
def db_session(engine: Engine) -> Iterator[Session]:
    """One transaction per test, rolled back at its end whatever the test committed."""
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(
        bind=connection,
        join_transaction_mode="create_savepoint",
        autoflush=False,
        expire_on_commit=False,
    )
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    """The application, talking to this test's session and nothing else."""

    def _get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def _signed_in(db_session: Session, role: str) -> TestClient:
    """A new client, signed in through /auth/login as a user made for this test only."""
    email = f"{role}-{uuid4().hex[:12]}@example.com"
    password = secrets.token_urlsafe(16)
    ensure_user(db_session, email=email, password=password, role=role)
    signed_in = TestClient(app)
    response = signed_in.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    signed_in.headers["Authorization"] = f"Bearer {response.json()['token']}"
    return signed_in


@pytest.fixture
def auth_client(client: TestClient, db_session: Session) -> TestClient:
    """`client`, signed in as a normal user."""
    return _signed_in(db_session, USER_ROLE)


@pytest.fixture
def admin_client(client: TestClient, db_session: Session) -> TestClient:
    """`client`, signed in as an admin."""
    return _signed_in(db_session, ADMIN_ROLE)
