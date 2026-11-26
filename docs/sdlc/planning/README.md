# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Each person registers and signs in with an email address and password to a personal account; all notes are private to the account that created them. Free to use, no billing.

**Related:** US-001, US-002, US-003, US-004

### EPIC-002 · approved · source: planning:EPIC-002

Users create and edit rich-text notes with bold/lists/headings, with autosave while typing; no image or file attachments in this version.

**Related:** US-005, US-006, US-007

### EPIC-003 · approved · source: planning:EPIC-003

The note list is the home screen after sign-in, showing the user's own notes, with the ability to delete a note.

**Related:** US-008, US-009

### EPIC-004 · approved · source: planning:EPIC-004

Users organise their own notes using tags or folders so related notes can be grouped and found.

**Related:** US-010, US-011

### EPIC-005 · approved · source: planning:EPIC-005

Users find their notes again by searching across their own notes only.

**Related:** US-012

### EPIC-006 · approved · source: planning:EPIC-006

The application is delivered as a responsive web app usable in any modern browser on laptop or phone while online; no offline support or native apps in scope.

**Related:** US-013

### SPRINT-1 · approved · source: planning:Sprint 1

Stand up registration, sign-in and core note creation/open so there is an account and a note to build everything else on.

Capacity: 20 points. Covers registering with email/password (5 pts, backend-agent), signing in (3 pts, backend-agent), creating a new rich-text note (8 pts, frontend-agent) with its schema/endpoint/editor/QA tasks, and opening an existing note (3 pts, frontend-agent).

**Related:** US-001, US-002, US-005, US-005-T1, US-005-T2, US-005-T3, US-005-T4, US-007

### SPRINT-2 · approved · source: planning:Sprint 2

Add sign-out/session expiry, enforce per-account note privacy, and ship the note list home screen with delete.

Capacity: 20 points. Covers sign-out and session expiry (5 pts, backend-agent), restricting all note actions to their owner (5 pts, security-agent), the note list home screen (5 pts, frontend-agent), and note deletion (3 pts, frontend-agent).

**Related:** US-003, US-004, US-008, US-009

### SPRINT-3 · approved · source: planning:Sprint 3

Deliver reliable autosave with save-status feedback and tag/folder organisation on a note.

Capacity: 20 points. Covers autosave while editing (8 pts, frontend-agent) with debounce/trigger, status indicator, PUT endpoint, and failure-state tasks; and assigning tags/folders to a note (8 pts, backend-agent) with schema, endpoint, and UI tasks.

**Related:** US-006, US-006-T1, US-006-T2, US-006-T3, US-006-T4, US-010, US-010-T1, US-010-T2, US-010-T3

### SPRINT-4 · approved · source: planning:Sprint 4

Finish browsing by tag/folder, search across notes, and make the whole app responsive with an offline notice.

Capacity: 20 points. Covers browsing notes by tag or folder (5 pts, frontend-agent), searching notes (5 pts, backend-agent), and responsive delivery (8 pts, frontend-agent) including responsive layout for note list/editor and auth/tag/folder screens, plus network connectivity detection and offline notice.

**Related:** US-011, US-012, US-013, US-013-T1, US-013-T2, US-013-T3
<!-- sdlc:auto:end narrative -->
