# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run. **Tests** counts the tests written for the story, and **Result** how many last passed, how many failed and when, as of this page's generation; the Documentation tab shows them live.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Test step | Tests | Result | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Register with email and password | US-001 | 1 | POST /auth/register, api, db, users, web_app | — | — | not started | not run | 0 | No tests | 0/4 tested · 0/4 passing | — |
| US-002 | EPIC-001 | Sign in to my account | US-002 | 1 | POST /auth/login, api, db, sessions, users, web_app | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-003 | EPIC-001 | Sign out and session expiry | US-003 | 2 | POST /auth/logout, api, db, sessions, web_app | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-004 | EPIC-001 | Only ever see my own notes | US-004 | 2 | DELETE /notes/{id}, GET /notes, GET /notes/search, GET /notes/{id}, PUT /notes/{id}, api, db, notes, users | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-005 | EPIC-002 | Create a new rich-text note | US-005, US-005-T1, US-005-T2, US-005-T3 | 1 | POST /notes, api, db, notes, web_app | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-006 | EPIC-002 | Autosave while editing | US-006, US-006-T1, US-006-T2, US-006-T3, US-006-T4 | 3 | PUT /notes/{id}, api, db, notes, web_app | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-007 | EPIC-002 | Open an existing note to edit | US-007 | 1 | GET /notes/{id}, api, notes, web_app | — | — | not started | not run | 0 | No tests | 0/1 tested · 0/1 passing | — |
| US-008 | EPIC-003 | Note list as home screen | US-008 | 2 | GET /notes, api, notes, web_app | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-009 | EPIC-003 | Delete a note | US-009 | 2 | DELETE /notes/{id}, api, db, notes, web_app | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-010 | EPIC-004 | Assign tags or folders to a note | US-010, US-010-T1, US-010-T2, US-010-T3 | 3 | POST /folders, POST /tags, PUT /notes/{id}/tags, api, db, folders, note_tags, notes, tags, web_app | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-011 | EPIC-004 | Browse notes by tag or folder | US-011 | 4 | GET /folders, GET /notes, GET /tags, api, folders, note_tags, notes, tags, web_app | — | — | not started | not run | 0 | No tests | 0/2 tested · 0/2 passing | — |
| US-012 | EPIC-005 | Search my notes | US-012 | 4 | GET /notes/search, api, db, notes, web_app | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
| US-013 | EPIC-006 | Use the app on laptop or phone in a browser | US-013, US-013-T1, US-013-T2, US-013-T3 | 4 | web_app | — | — | not started | not run | 0 | No tests | 0/3 tested · 0/3 passing | — |
<!-- sdlc:auto:end matrix -->
