"""POST /auth/register: validate email/password, reject duplicates, hash, sign in.

AC-001/002/003/004 (US-001). Validation runs before the duplicate-email check, so a
badly-formed email or a weak password is reported as such even when that email is
already taken, and a taken email is never reported as a password problem.
"""

import re
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import USER_ROLE, find_user, hash_password, issue_token
from app.database import get_db
from app.errors import EMAIL_ALREADY_REGISTERED, INVALID_EMAIL, WEAK_PASSWORD
from app.models import User
from app.schemas import RegisteredUser, RegisterRequest, RegisterResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

# Matches the rule shown to the visitor on the registration screen
# (frontend/src/screens/Register.tsx): at least this many characters, with a letter
# and a digit among them.
MIN_PASSWORD_LENGTH = 10
_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")


def _is_valid_email(email: str) -> bool:
    return bool(_EMAIL_RE.match(email))


def _is_strong_password(password: str) -> bool:
    has_letter = any(c.isalpha() for c in password)
    has_digit = any(c.isdigit() for c in password)
    return len(password) >= MIN_PASSWORD_LENGTH and has_letter and has_digit


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        EMAIL_ALREADY_REGISTERED.status_code: {
            "description": EMAIL_ALREADY_REGISTERED.message,
        },
        WEAK_PASSWORD.status_code: {
            "description": f"{INVALID_EMAIL.message} {WEAK_PASSWORD.message}",
        },
    },
)
def register(
    body: RegisterRequest, session: Annotated[Session, Depends(get_db)]
) -> RegisterResponse:
    email = body.email.strip()
    if not _is_valid_email(email):
        raise HTTPException(INVALID_EMAIL.status_code, INVALID_EMAIL.message)
    if not _is_strong_password(body.password):
        raise HTTPException(WEAK_PASSWORD.status_code, WEAK_PASSWORD.message)
    if find_user(session, email) is not None:
        raise HTTPException(EMAIL_ALREADY_REGISTERED.status_code, EMAIL_ALREADY_REGISTERED.message)

    user = User(
        id=str(uuid4()),
        email=email,
        password_hash=hash_password(body.password),
        role=USER_ROLE,
    )
    session.add(user)
    session.commit()

    return RegisterResponse(
        token=issue_token(user),
        user=RegisteredUser(id=user.id, email=user.email),
    )
