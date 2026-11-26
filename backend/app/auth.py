"""Sign-in: an email and a password in, a bearer token out.

Part of the scaffold's test kit, so the seed script, the signed-in test client and the
smoke check have a real login from the first commit. The frontend and the API are on
different origins once deployed, so the token travels in the response body and comes back
as `Authorization: Bearer <token>`, never as a cookie.

JWT_SECRET_KEY signs the tokens. Without it (local runs, tests) a random key is made per
process, so tokens stop working on restart: fine anywhere except a deployed app, where the
platform always sets it.
"""

import os
import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any
from uuid import uuid4

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_model import ApiModel
from app.database import get_db
from app.models import User

ADMIN_ROLE = "admin"
USER_ROLE = "user"
TOKEN_LIFETIME = timedelta(hours=12)

_ALGORITHM = "HS256"
_SECRET = os.getenv("JWT_SECRET_KEY") or secrets.token_urlsafe(32)
_bearer = HTTPBearer(auto_error=False)
# The users table may come from the approved data model, so its key is read, not assumed:
# an integer key is made by the database, a text key here.
_KEY_COLUMN = User.__mapper__.primary_key[0]
_KEY = User.__mapper__.get_property_by_column(_KEY_COLUMN).key

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(ApiModel):
    email: str
    password: str


class LoginResponse(ApiModel):
    # "token", not "access_token": one word reads the same in camelCase, and it is a name
    # the platform's smoke check looks for.
    token: str


class CurrentUser(ApiModel):
    id: str
    email: str
    role: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ValueError:  # not a bcrypt hash
        return False


def find_user(session: Session, email: str) -> User | None:
    return session.scalars(select(User).where(User.email == email)).first()


def ensure_user(session: Session, *, email: str, password: str, role: str) -> bool:
    """Create the user unless one with this email exists. True when it was created."""
    if find_user(session, email) is not None:
        return False
    values: dict[str, Any] = {
        "email": email,
        "password_hash": hash_password(password),
        "role": role,
    }
    if _KEY_COLUMN.type.python_type is str:
        values[_KEY] = str(uuid4())
    session.add(User(**values))
    session.flush()
    return True


def issue_token(user: User) -> str:
    now = datetime.now(UTC)
    claims = {
        "sub": str(getattr(user, _KEY)),
        "role": user.role,
        "iat": now,
        "exp": now + TOKEN_LIFETIME,
    }
    return jwt.encode(claims, _SECRET, algorithm=_ALGORITHM)


def _refused() -> HTTPException:
    return HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        "Sign in first.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    session: Annotated[Session, Depends(get_db)],
) -> User:
    """The signed-in user. Add `Depends(current_user)` to any route that needs one."""
    if credentials is None:
        raise _refused()
    try:
        claims = jwt.decode(credentials.credentials, _SECRET, algorithms=[_ALGORITHM])
        key = _KEY_COLUMN.type.python_type(claims["sub"])
    except (jwt.PyJWTError, KeyError, TypeError, ValueError):
        raise _refused() from None
    user = session.get(User, key)
    if user is None:
        raise _refused()
    return user


@router.post("/login")
def login(body: LoginRequest, session: Annotated[Session, Depends(get_db)]) -> LoginResponse:
    user = find_user(session, body.email.strip())
    if user is None or not verify_password(body.password, user.password_hash or ""):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong email or password.")
    return LoginResponse(token=issue_token(user))


@router.get("/me")
def me(user: Annotated[User, Depends(current_user)]) -> CurrentUser:
    return CurrentUser(id=str(getattr(user, _KEY)), email=user.email, role=user.role)
