# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### PLAN-EPIC-001 · approved · source: planning:EPIC-001

Accounts and Authentication: each person registers and signs in with email and password to a personal, free account whose notes are private to them.

All notes are private to the account that created them; a user only ever sees their own notes. Free to use with no payments, billing, or subscription in scope. Session security is stated as checkable outcomes (sessions expire, signing out ends the session, passwords stored hashed) without prescribing a mechanism.

**Related:** US-001, US-002, US-003, US-004

### PLAN-EPIC-002 · approved · source: planning:EPIC-002

Note Creation and Editing: users create and edit rich-text notes with formatting, saved automatically as they type.

No image or file attachments are in the initial scope; this is stated as an assumption on the editor.

**Related:** US-005, US-006, US-007

### PLAN-EPIC-003 · approved · source: planning:EPIC-003

Note List and Deletion: the note list is the home screen after sign-in, and users can delete notes they no longer want.

Standard CRUD completed by create/edit (covered elsewhere) and delete here.

**Related:** US-008, US-009

### PLAN-EPIC-004 · approved · source: planning:EPIC-004

Organising Notes with Tags or Folders: users organise their notes using tags or folders so related notes can be grouped and found.

Applies to the signed-in user's own notes only.

**Related:** US-010, US-011

### PLAN-EPIC-005 · approved · source: planning:EPIC-005

Search Across Notes: users find their notes again by searching across their own notes.

Search is restricted to the signed-in user's own notes.

**Related:** US-012

### PLAN-EPIC-006 · approved · source: planning:EPIC-006

Responsive Web Delivery: the application is delivered as a responsive web app usable in any modern browser on laptop or phone while online.

No offline support and no native apps are in scope; these are stated as assumptions on delivery.

**Related:** US-013

### PLAN-SPRINT-1 · approved · source: planning:plan:Sprint 1

Sprint 1 (capacity 20): stand up registration, sign-in and core note creation/open.

Goal: stand up registration, sign-in and core note creation/open so there is an account and a note to build everything else on. Stories whose scope matches this goal: US-001 Register with email and password, US-002 Sign in to my account, US-005 Create a new rich-text note (incl. tasks for notes schema, POST /notes, editor formatting, attachment-control verification), US-007 Open an existing note to edit. The input does not explicitly assign backlog items to sprints by number; this mapping is inferred from each sprint's stated goal text.

**Related:** US-001, US-002, US-005, US-007

### PLAN-SPRINT-2 · approved · source: planning:plan:Sprint 2

Sprint 2 (capacity 20): add sign-out/session expiry, enforce per-account note privacy, and ship the note list home screen with delete.

Goal: add sign-out/session expiry, enforce per-account note privacy, and ship the note list home screen with delete. Stories whose scope matches this goal: US-003 Sign out and session expiry, US-004 Only ever see my own notes, US-008 Note list as home screen, US-009 Delete a note. The input does not explicitly assign backlog items to sprints by number; this mapping is inferred from each sprint's stated goal text.

**Related:** US-003, US-004, US-008, US-009

### PLAN-SPRINT-3 · approved · source: planning:plan:Sprint 3

Sprint 3 (capacity 20): deliver reliable autosave with save-status feedback and tag/folder organisation on a note.

Goal: deliver reliable autosave with save-status feedback and tag/folder organisation on a note. Stories whose scope matches this goal: US-006 Autosave while editing (incl. debounced trigger, save status UI, PUT /notes/{id}, failed-save handling), US-010 Assign tags or folders to a note (incl. tags/folders schema and endpoints, PUT /notes/{id}/tags, assignment UI). The input does not explicitly assign backlog items to sprints by number; this mapping is inferred from each sprint's stated goal text.

**Related:** US-006, US-010

### PLAN-SPRINT-4 · approved · source: planning:plan:Sprint 4

Sprint 4 (capacity 20): finish browsing by tag/folder, search across notes, and make the whole app responsive with an offline notice.

Goal: finish browsing by tag/folder, search across notes, and make the whole app responsive with an offline notice. Stories whose scope matches this goal: US-011 Browse notes by tag or folder, US-012 Search my notes, US-013 Use the app on laptop or phone in a browser (incl. responsive layout for note list/editor, responsive layout for auth/tag-folder screens, network connectivity detection and offline notice). The input does not explicitly assign backlog items to sprints by number; this mapping is inferred from each sprint's stated goal text.

**Related:** US-011, US-012, US-013
<!-- sdlc:auto:end narrative -->
