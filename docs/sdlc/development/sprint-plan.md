# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Stand up registration, sign-in and core note creation/open so there is an account and a note to build everything else on

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Register with email and password | 5 | backend-agent | — |
| US-002 | Story | Sign in to my account | 3 | backend-agent | US-001 |
| US-005 | Story | Create a new rich-text note | 8 | frontend-agent | US-002 |
| ↳ US-005-T1 | Task | Design notes table schema and migration | — | backend-agent | — |
| ↳ US-005-T2 | Task | Implement POST /notes endpoint | — | backend-agent | — |
| ↳ US-005-T3 | Task | Integrate rich-text editor with bold, list and heading formatting | — | frontend-agent | — |
| ↳ US-005-T4 | Task | Verify no attachment controls are exposed | — | qa-agent | — |
| US-007 | Story | Open an existing note to edit | 3 | frontend-agent | US-005 |

## Sprint 2: Sprint 2

Add sign-out/session expiry, enforce per-account note privacy, and ship the note list home screen with delete

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-003 | Story | Sign out and session expiry | 5 | backend-agent | US-002 |
| US-004 | Story | Only ever see my own notes | 5 | security-agent | US-002, US-005 |
| US-008 | Story | Note list as home screen | 5 | frontend-agent | US-005 |
| US-009 | Story | Delete a note | 3 | frontend-agent | US-005 |

## Sprint 3: Sprint 3

Deliver reliable autosave with save-status feedback and tag/folder organisation on a note

Capacity: 20 points · Committed: 16

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-006 | Story | Autosave while editing | 8 | frontend-agent | US-005 |
| ↳ US-006-T1 | Task | Implement debounced autosave trigger in the editor | — | frontend-agent | — |
| ↳ US-006-T2 | Task | Add save status indicator UI | — | frontend-agent | — |
| ↳ US-006-T3 | Task | Implement PUT /notes/{id} endpoint | — | backend-agent | — |
| ↳ US-006-T4 | Task | Handle and surface failed autosave state | — | frontend-agent | — |
| US-010 | Story | Assign tags or folders to a note | 8 | backend-agent | US-005 |
| ↳ US-010-T1 | Task | Add tags and folders schema with create/list endpoints | — | backend-agent | — |
| ↳ US-010-T2 | Task | Implement PUT /notes/{id}/tags to assign and remove tags/folder | — | backend-agent | — |
| ↳ US-010-T3 | Task | Build tag/folder assignment UI in the note editor | — | frontend-agent | — |

## Sprint 4: Sprint 4

Finish browsing by tag/folder, search across notes, and make the whole app responsive with an offline notice

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-011 | Story | Browse notes by tag or folder | 5 | frontend-agent | US-010 |
| US-012 | Story | Search my notes | 5 | backend-agent | US-005, US-008 |
| US-013 | Story | Use the app on laptop or phone in a browser | 8 | frontend-agent | US-005, US-008, US-009, US-010, US-011, US-012 |
| ↳ US-013-T1 | Task | Implement responsive layout for note list and editor screens | — | frontend-agent | — |
| ↳ US-013-T2 | Task | Implement responsive layout for auth and tag/folder screens | — | frontend-agent | — |
| ↳ US-013-T3 | Task | Add network connectivity detection and offline notice | — | frontend-agent | — |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
