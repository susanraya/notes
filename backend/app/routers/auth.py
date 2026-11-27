"""POST /auth/logout: revoke the caller's current session token.

AC-007 (US-003): once signed out, the token just used can no longer open any note;
the caller must sign in again. Distinct from app/auth.py, which holds sign-in itself
(POST /auth/login, GET /auth/me) and the `current_user` dependency every protected
route -- this one included -- depends on to require a signed-in caller.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.auth import current_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout(user: Annotated[User, Depends(current_user)]) -> None:
    """Revoke the current session token (AC-007). Logic lands with US-003.1."""
