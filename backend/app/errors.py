"""Error codes: one named constant per error an endpoint can return.

Each pairs the HTTP status with a short, user-facing message. A route raises
`HTTPException(CODE.status_code, CODE.message)` and documents the same code in its
`responses=` mapping, so the OpenAPI spec and the raised error never drift apart.
"""

from dataclasses import dataclass

from fastapi import status


@dataclass(frozen=True)
class ErrorCode:
    status_code: int
    message: str


# POST /auth/register
EMAIL_ALREADY_REGISTERED = ErrorCode(
    status.HTTP_409_CONFLICT,
    "An account with this email already exists.",
)
INVALID_EMAIL = ErrorCode(
    status.HTTP_422_UNPROCESSABLE_ENTITY,
    "Enter a valid email address.",
)
WEAK_PASSWORD = ErrorCode(
    status.HTTP_422_UNPROCESSABLE_ENTITY,
    "Password does not meet the required strength.",
)
