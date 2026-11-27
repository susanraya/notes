"""Notes: create one (AC-011, US-005) and open one (AC-017, US-007).

The owner of a note always comes from the signed-in user (`current_user`), never from
the request body or the URL: POST /notes has no body at all, since there is nothing to
choose when the note starts empty, and GET /notes/{id} refuses a note it does not own.
"""

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import current_user
from app.database import get_db
from app.errors import NOTE_NOT_FOUND
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


def get_note_for_user(session: Session, note_id: str, owner_id: str) -> Note | None:
    """Fetch `note_id` if it exists and is owned by `owner_id`, else `None`. AC-017.

    A note that exists but belongs to someone else returns `None` too: the caller
    cannot tell "no such note" from "not yours" apart, so it never confirms that a
    note id owned by someone else exists at all.
    """
    note = session.get(Note, note_id)
    if note is None or note.owner_id != owner_id:
        return None
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


@router.get(
    "/notes/{note_id}",
    response_model=NoteResponse,
    responses={
        NOTE_NOT_FOUND.status_code: {"description": NOTE_NOT_FOUND.message},
    },
)
def get_note(
    note_id: str,
    user: Annotated[User, Depends(current_user)],
    session: Annotated[Session, Depends(get_db)],
) -> NoteResponse:
    """Open one of the signed-in user's notes with its saved content and formatting
    intact (AC-017); refuses a note owned by another account.
    """
    note = get_note_for_user(session, note_id=note_id, owner_id=user.id)
    if note is None:
        raise HTTPException(NOTE_NOT_FOUND.status_code, NOTE_NOT_FOUND.message)
    return NoteResponse(
        id=note.id,
        title=note.title,
        content_html=note.content_html,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )
