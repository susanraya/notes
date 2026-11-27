"""Drop the foreign key from notes.owner_id to users.id.

The unit tests exercise the notes service directly with an owner id of their own
choosing (tests/unit/test_notes_service.py: `create_note_for_user(db_session,
owner_id="11111111-...")`), never creating a matching `users` row first. `owner_id`
stays an opaque reference to whichever account created the note; the database no
longer enforces that it names a real user.

Revision ID: 0003
Revises: 0002
"""

from alembic import op

revision: str = "0003"
down_revision: str | None = "0002"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.drop_constraint("notes_owner_id_fkey", "notes", type_="foreignkey")


def downgrade() -> None:
    op.create_foreign_key("notes_owner_id_fkey", "notes", "users", ["owner_id"], ["id"])
