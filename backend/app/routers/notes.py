"""Notes: create one (AC-011, US-005), list them and open one (AC-017, US-007), and
save formatting changes to one (AC-012/AC-013, US-006).

The owner of a note always comes from the signed-in user (`current_user`), never from
the request body or the URL: POST /notes has no body at all, since there is nothing to
choose when the note starts empty, and GET/PUT /notes/{id} refuse a note they do not own.
"""

from datetime import UTC, datetime
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_model import ApiModel
from app.auth import current_user
from app.database import get_db
from app.errors import NOTE_NOT_FOUND
from app.models import Note, User
from app.schemas import NoteResponse

router = APIRouter(tags=["Notes"])


class NoteUpdateRequest(ApiModel):
    """The one field a note's content is saved from (AC-012). Any other field in the
    body -- an attempted attachment, for example -- is accepted and silently ignored:
    AC-013 offers no way to attach an image or file through this API.
    """

    content_html: str = ""


def _to_response(note: Note) -> NoteResponse:
    return NoteResponse(
        id=note.id,
        title=note.title,
        content_html=note.content_html,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )


def create_note_for_user(session: Session, owner_id: str) -> Note:
    """Create and persist a new, empty note owned by `owner_id`. AC-011."""
    note = Note(id=str(uuid4()), owner_id=owner_id, title="", content_html="")
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


def list_notes_for_user(session: Session, owner_id: str) -> list[Note]:
    """Every note owned by `owner_id`, for their note list (AC-011/AC-017)."""
    return list(session.scalars(select(Note).where(Note.owner_id == owner_id)))


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


def update_note_content(
    session: Session, note_id: str, owner_id: str, content_html: str
) -> Note | None:
    """Save new content on a note owned by `owner_id`. AC-012. `None` when it is not
    theirs (or does not exist), so the caller never persists a change to someone
    else's note.
    """
    note = get_note_for_user(session, note_id=note_id, owner_id=owner_id)
    if note is None:
        return None
    note.content_html = content_html
    note.updated_at = datetime.now(UTC)
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
    return _to_response(note)


@router.get(
    "/notes",
    response_model=list[NoteResponse],
)
def list_notes(
    user: Annotated[User, Depends(current_user)],
    session: Annotated[Session, Depends(get_db)],
) -> list[NoteResponse]:
    """Every note owned by the signed-in user, for their note list (AC-011/AC-017)."""
    notes = list_notes_for_user(session, owner_id=user.id)
    return [_to_response(note) for note in notes]


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
    return _to_response(note)


@router.put(
    "/notes/{note_id}",
    response_model=NoteResponse,
    responses={
        NOTE_NOT_FOUND.status_code: {"description": NOTE_NOT_FOUND.message},
    },
)
def update_note(
    note_id: str,
    body: NoteUpdateRequest,
    user: Annotated[User, Depends(current_user)],
    session: Annotated[Session, Depends(get_db)],
) -> NoteResponse:
    """Apply and persist bold/heading/list formatting on one of the signed-in user's
    notes (AC-012); refuses a note owned by another account, leaving its content
    untouched (AC-012/AC-017 access control).
    """
    note = update_note_content(
        session, note_id=note_id, owner_id=user.id, content_html=body.content_html
    )
    if note is None:
        raise HTTPException(NOTE_NOT_FOUND.status_code, NOTE_NOT_FOUND.message)
    return _to_response(note)
