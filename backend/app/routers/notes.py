"""POST /notes: create a new empty note owned by the signed-in user.

AC-011 (US-005). The owner comes from the signed-in user (`current_user`), never from
the request body: there is no request body at all, since there is nothing to choose when
the note starts empty.
"""

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth import current_user
from app.database import get_db
from app.models import Note, User
from app.schemas import NoteResponse

router = APIRouter(tags=["Notes"])


def create_note_for_user(session: Session, owner_id: str) -> Note:
    """Create and persist a new, empty note owned by `owner_id`. AC-011."""
    note = Note(id=str(uuid4()), owner_id=owner_id, title="", content_html="")
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.post(
    "/notes",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_note(
    user: Annotated[User, Depends(current_user)],
    session: Annotated[Session, Depends(get_db)],
) -> NoteResponse:
    note = create_note_for_user(session, owner_id=user.id)
    return NoteResponse(
        id=note.id,
        title=note.title,
        content_html=note.content_html,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )
