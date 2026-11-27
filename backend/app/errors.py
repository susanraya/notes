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

# POST /auth/login
# One message for a wrong email and a wrong password alike (AC-006, NFR-004): it
# never says which of the two was wrong, so it never confirms an email is registered.
WRONG_CREDENTIALS = ErrorCode(
    status.HTTP_401_UNAUTHORIZED,
    "Incorrect email or password.",
)

# GET /notes/{id}
# The same code for "no such note" and "not yours" (AC-017): it never confirms that a
# note id owned by someone else exists at all.
NOTE_NOT_FOUND = ErrorCode(
    status.HTTP_404_NOT_FOUND,
    "No such note.",
)
