# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Covers personal account registration and sign-in, with all notes private to the owning account.

Each person registers and signs in with an email address and password to a personal account. All notes are private to the account that created them; a user only ever sees their own notes. Free to use with no payments, billing, or subscription in scope. Session security is stated as checkable outcomes (sessions expire, signing out ends the session, passwords stored hashed) without prescribing a mechanism.

**Related:** US-001, US-002, US-003, US-004

### EPIC-002 · approved · source: planning:EPIC-002

Covers creating and editing rich-text notes with autosave.

Users create and edit rich-text notes with formatting such as bold, lists and headings. Edits are saved automatically (autosave) while the user types. No image or file attachments are in the initial scope; this is stated as an assumption on the editor.

**Related:** US-005, US-006, US-007

### EPIC-003 · approved · source: planning:EPIC-003

Covers the note list home screen and note deletion.

The note list is the home screen after sign-in, showing the user's own notes. Users can delete a note. Standard CRUD completed by create/edit (covered elsewhere) and delete here.

**Related:** US-008, US-009

### EPIC-004 · approved · source: planning:EPIC-004

Covers organising notes via tags or folders.

Users organise their notes using tags or folders so related notes can be grouped and found. Applies to the signed-in user's own notes only.

**Related:** US-010, US-011

### EPIC-005 · approved · source: planning:EPIC-005

Covers searching across a user's own notes.

Users find their notes again by searching across their own notes. Search is restricted to the signed-in user's own notes.

**Related:** US-012

### EPIC-006 · approved · source: planning:EPIC-006

Covers responsive, online-only web delivery on laptop and phone.

The application is delivered as a responsive web app usable in any modern browser on laptop or phone while online. No offline support and no native apps are in scope; these are stated as assumptions on delivery.

**Related:** US-013

### SPRINT-1 · approved · source: planning:Sprint 1

First sprint of the version-1 plan, focused on account creation, sign-in and the core note editor.

Goal: Stand up registration, sign-in and the core note editor so a user can create and reopen formatted notes. Capacity: 20 points. The input does not specify which backlog items are assigned to this sprint.

### SPRINT-2 · approved · source: planning:Sprint 2

Second sprint of the version-1 plan, focused on session security, per-account privacy, and the note list with delete.

Goal: Lock down session security and per-account privacy, and ship the note list home screen with delete. Capacity: 20 points. The input does not specify which backlog items are assigned to this sprint.

### SPRINT-3 · approved · source: planning:Sprint 3

Third sprint of the version-1 plan, focused on autosave and tag/folder organisation.

Goal: Add autosave with visible save status and let users organise notes with tags/folders. Capacity: 20 points. The input does not specify which backlog items are assigned to this sprint.

### SPRINT-4 · approved · source: planning:Sprint 4

Fourth sprint of the version-1 plan, focused on filtering, search and responsive layout.

Goal: Deliver filtering by tag/folder, full-text search, and responsive layout across devices. Capacity: 20 points. The input does not specify which backlog items are assigned to this sprint.
<!-- sdlc:auto:end narrative -->
