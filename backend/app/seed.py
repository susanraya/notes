"""The users every environment starts with, made from settings, never from literals.

- The first admin, from BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD. The platform
  sets both on every deployed app and every E2E run.
- One normal user for the smoke check, from SMOKE_TEST_EMAIL and SMOKE_TEST_PASSWORD.

Idempotent: a user whose email exists is left as it is, and a pair that is not set seeds
nothing. Runs at startup (app/main.py) and on demand: `python -m app.seed`.
"""

import os
from collections.abc import Mapping
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.auth import ADMIN_ROLE, USER_ROLE, ensure_user
from app.database import SessionLocal


@dataclass(frozen=True)
class SeedUser:
    email_setting: str
    password_setting: str
    role: str


SEED_USERS = (
    SeedUser("BOOTSTRAP_ADMIN_EMAIL", "BOOTSTRAP_ADMIN_PASSWORD", ADMIN_ROLE),
    SeedUser("SMOKE_TEST_EMAIL", "SMOKE_TEST_PASSWORD", USER_ROLE),
)


def seed(session: Session, settings: Mapping[str, str] | None = None) -> int:
    """Create each configured user that does not exist yet. Returns how many were made."""
    values = os.environ if settings is None else settings
    created = 0
    for user in SEED_USERS:
        email = values.get(user.email_setting, "").strip()
        password = values.get(user.password_setting, "")
        if email and password:
            created += ensure_user(session, email=email, password=password, role=user.role)
    return created


def seed_from_env() -> int:
    with SessionLocal() as session:
        created = seed(session)
        session.commit()
    return created


if __name__ == "__main__":
    print(f"Seeded {seed_from_env()} new user(s).")
