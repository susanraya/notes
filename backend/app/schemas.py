"""Pydantic request and response models.

One pair per entity in the approved data model, plus the placeholder every
generated route returns until it has been implemented. Every model is an ApiModel,
so its JSON uses camelCase names (app/api_model.py).
"""

from datetime import datetime

from app.api_model import ApiModel


class StubResponse(ApiModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


class UserCreate(ApiModel):
    email: str
    role: str


class UserRead(ApiModel):
    id: str
    email: str
    role: str


class RegisterRequest(ApiModel):
    email: str
    password: str


class RegisteredUser(ApiModel):
    id: str
    email: str


class RegisterResponse(ApiModel):
    # "token", not "access_token": matches the shape /auth/login already returns.
    token: str
    user: RegisteredUser


class NoteResponse(ApiModel):
    """A note as returned to the client (POST /notes). AC-011 (US-005)."""

    id: str
    title: str
    content_html: str
    created_at: datetime
    updated_at: datetime
