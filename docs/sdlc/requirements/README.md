# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-STACK · approved · source: requirements:technology stack

Approved technology stack: FastAPI backend, AWS cloud, PostgreSQL database, React frontend.

Backend: FastAPI 0.115 - handles registration/sign-in, private per-account notes, autosave, search; lean and right-sized for a free personal-scale app. Cloud: AWS - single-region web app + Python server + one PostgreSQL database, RDS manages backups/patching, scales down cheaply with room to grow. Database: PostgreSQL 16 - stores structured per-account records, enforces one-owner-per-note, provides built-in full-text search without a separate search engine. Frontend: React 19 - responsive web app with rich-text editing (bold, lists, headings) and live autosave, using mature rich-text editor components. All chosen as platform defaults; product owner approved designing against exactly these, no substitutions.

### REQ-SERVICES · approved · source: requirements:services

One runtime service required: an SMTP server for account verification and password-reset email.

Email: SMTP server (SaaS), configured via env vars SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD. Needed because email-and-password sign-in requires sending account-verification and password-reset messages; a standard SMTP server covers this at personal-use volumes without a paid delivery plan. Required API keys/env vars: SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER (store actual values as <smtp-host>, <smtp-password>, <smtp-port>, <smtp-user> placeholders, never real credentials).

### REQ-SCOPE · approved · source: requirements:scope

Delivery scope is lightweight: a responsive web app for private, single-user note taking with no sharing, offline use, or native apps.

In scope: email/password registration and sign-in; private per-account notes; rich-text creation and editing (bold, lists, headings); autosave while editing; delete a note; note list as home screen; search across a user's notes; tags or folders for organizing notes; no image/file attachments in initial scope. Out of scope - explicitly not designed or built: sharing notes and real-time collaboration between users; offline reading/writing with later sync; native iOS/Android or desktop apps (web-only, responsive). Requirements version 1, status approved.

### REQ-FEAT-SIGNIN · approved · source: requirements:Sign-in & accounts

Covers account registration, sign-in, sign-out/session expiry, and strict per-account privacy of notes.

- Register with email and password: new visitor creates an account with email + password meeting stated rules, lands in an empty notes space; duplicate email is rejected; invalid email/password shows which field needs correcting.
- Sign in to my account: registered user signs in with email/password and is taken to the note list home screen; wrong email or password is refused with a generic message.
- Sign out and session end: signed-in user can sign out, ending the session (must sign in again to view notes); sessions also end after a period of inactivity.
- Private per-account notes: every note view, search and action is limited to the signed-in user's own notes; attempts to open, edit or delete another account's note are refused.

### REQ-FEAT-WRITING · approved · source: requirements:Writing notes

Covers creating rich-text notes, autosave, and reopening existing notes for continued editing.

- Create a rich-text note: signed-in user creates a new empty note that opens in the editor, owned by their account; can apply bold, lists and headings which are kept with the note; no image/file attachment option offered.
- Autosave while editing: changes save automatically as the user works, with a save status shown; most recently saved content/formatting appears on reopen; user is told when a save did not complete.
- Open an existing note: signed-in user selects a note from the list and it opens in the editor with saved content and formatting intact, ready to continue editing.

### REQ-FEAT-LISTDELETE · approved · source: requirements:Note list & deletion

Covers the note list home screen (including empty state) and deleting notes.

- Note list home screen: after sign-in, user lands on a list of their own notes shown with enough detail (title or snippet) to identify each; a new user with no notes sees an empty state inviting them to create their first note.
- Delete a note: signed-in user can delete an unwanted note; after confirming, it is removed and no longer appears in the list or search results; cancelling before confirming keeps the note unchanged.

### REQ-FEAT-ORGANIZE · approved · source: requirements:Organising notes

Covers assigning tags/folders to notes and browsing/filtering the note list by them.

- Assign tags or folders: signed-in user can organize a note by assigning a tag or placing it in a folder; the assignment is saved and shown when the note is reopened; removing a tag or moving the note out of a folder stops it being grouped there.
- Browse by tag or folder: signed-in user can filter their note list by a tag or folder so only notes in that group are shown; clearing the filter shows the full note list again.

### REQ-FEAT-SEARCH · approved · source: requirements:Searching notes

Covers searching across a user's own notes by title or content.

- Search my notes: signed-in user can search across their own notes by title or content; only notes they own are returned; when nothing matches, a clear no-results message is shown; clearing the search term restores the full list.

### REQ-FEAT-ANYDEVICE · approved · source: requirements:Any device access

Covers responsive layout across laptop/phone and the online-connection requirement.

- Use on laptop or phone: the app adapts its layout to laptop and phone screens in a modern browser, keeping all core actions (create, edit, delete, search, organise) usable on either size.
- Connection needed notice: because the app works only while online, the user is told that a network connection is needed when they have none.

### NFR-001 · approved · source: requirements:NFR-001

Privacy: notes must be visible only to their owner.

Every note list, search and action must return or affect only notes owned by the signed-in user; any attempt to open, edit or delete another account's note must be refused so no user can see or change another user's notes.

### NFR-002 · approved · source: requirements:NFR-002

Security: passwords must be stored hashed, never in plain text.

User passwords must be stored only in hashed form; inspecting stored credentials must never reveal a usable password.

### NFR-003 · approved · source: requirements:NFR-003

Security: sessions must expire and sign-out must end them.

A session must end when the user signs out and must expire after a period of inactivity, after which the user must sign in again before viewing or editing any notes -- keeping notes private on shared or unattended devices.

### NFR-004 · approved · source: requirements:NFR-004

Security: failed sign-in must not reveal whether an email has an account.

A failed sign-in must be refused with a generic message that does not reveal whether the email address has an account.

### NFR-005 · approved · source: requirements:NFR-005

Usability: autosave status must always be visible.

While a user edits a note, the app must show whether changes have been saved, and must clearly show when a save did not complete, so the user never assumes an unsaved change was stored.

### NFR-006 · approved · source: requirements:NFR-006

Compatibility: responsive in modern browsers on laptop and phone.

The app must work as a responsive web app in any modern browser, adapting its layout to laptop and phone screens while keeping all core actions usable on both.

### NFR-007 · approved · source: requirements:NFR-007

Scalability: built for modest personal-use scale only.

The app is sized for individual users with personal note volumes and no high-concurrency or large-data demands; higher scale is not a requirement for this lightweight build.

### NFR-008 · approved · source: requirements:NFR-008

Availability (accepted risk): online connection required, no offline use.

The app requires an online connection and does not support offline reading or writing with later sync; when there is no network it informs the user that connectivity is needed. This is an accepted risk, not a defect.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-26

**Capabilities in scope:** Email and password registration and sign-in, Private per-account notes seen only by their owner, Rich-text note creation and editing (bold, lists, headings), Autosave while editing a note, Delete a note, Note list view as the home screen, Search across a user's notes, Tags or folders for organising notes, Email-and-password accounts, private to each user, No image or file attachments in the initial scope

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The server's job here is modest and clear: register and sign in users, keep each person's notes strictly private to their account, save edits as they autosave, and answer searches. FastAPI is a lean Python framework that does this cleanly without heavy machinery you would not use, and it is the platform default. For a free, personal-scale app with no high-concurrency demands, it is right-sized. |
| cloud | AWS | A single-region deployment of a web app, a Python server and one PostgreSQL database is standard on AWS, and its managed database (RDS) handles backups and patching so you are not babysitting the server. It is the platform default, scales down cheaply for a free personal-use app, and leaves room to grow if usage ever climbs. Nothing you described needs a more specialised host. |
| database | PostgreSQL | Everything you described is structured records owned by one person: accounts, notes, tags/folders. PostgreSQL stores that reliably and enforces that a note belongs to exactly one account. It also has built-in full-text search, so 'find them again through search' can be served straight from the database at your modest scale without adding a separate search engine to run and pay for. It is the platform default and covers your needs on its own. |
| frontend | React | Your product is a responsive web app that people use in any browser on laptop or phone, with rich-text editing (bold, lists, headings) and live autosave as they type. React handles exactly this kind of interactive, keeps-up-with-you editing screen, and it has mature, well-supported rich-text editors you can drop in rather than build the formatting from scratch. It is the platform default and the safest fit for what you described. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Accounts and Authentication

Each person registers and signs in with an email address and password to a personal account. All notes are private to the account that created them; a user only ever sees their own notes. Free to use with no payments, billing, or subscription in scope. Session security is stated as checkable outcomes (sessions expire, signing out ends the session, passwords stored hashed) without prescribing a mechanism.

### US-001: Register with email and password

**Priority:** critical

> As a new visitor, I want to create a personal account using my email address and a password, so that I can start keeping my own private notes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am on the registration screen and no account exists for my email | I submit a valid email address and a password that meets the stated requirements | my account is created and I am signed in to an empty personal notes space |
| AC-002 | I am on the registration screen | I submit an email address that already has an account | registration is rejected and I am told the email is already in use, without revealing any note content |
| AC-003 | I am on the registration screen | I submit an invalid email format or a password that does not meet the stated requirements | registration is rejected and I am shown which field needs correcting |
| AC-004 | my account has been created | the stored credentials are inspected | the password is stored only in hashed form and never in plain text |

### US-002: Sign in to my account

**Priority:** critical

> As a registered user, I want to sign in with my email and password, so that I can access my private notes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | I have a registered account | I submit my correct email and password | I am signed in and taken to my note list home screen |
| AC-006 | I am on the sign-in screen | I submit an incorrect email or password | sign-in is refused with a generic message that does not reveal whether the email exists |

### US-003: Sign out and session expiry

**Priority:** high

> As a signed-in user, I want my session to end when I sign out and to expire after a period of inactivity, so that my notes stay private on shared or unattended devices.

| ID | Given | When | Then |
|---|---|---|---|
| AC-007 | I am signed in | I choose to sign out | my session ends and I must sign in again before I can view any notes |
| AC-008 | I am signed in | my session has expired through time or inactivity | I am required to sign in again before I can view or edit any notes |

### US-004: Only ever see my own notes

**Priority:** critical

> As a signed-in user, I want every note view, search and action restricted to notes I own, so that no other user can see or change my notes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-009 | two users each have their own notes | I am signed in as one user and view my note list or run a search | only notes I own are returned and no other user's notes appear |
| AC-010 | I am signed in | I attempt to open, edit or delete a note that belongs to another account | the action is refused and the note is not shown |

## EPIC-002: Note Creation and Editing

Users create and edit rich-text notes with formatting such as bold, lists and headings. Edits are saved automatically (autosave) while the user types. No image or file attachments are in the initial scope; this is stated as an assumption on the editor.

### US-005: Create a new rich-text note

**Priority:** critical

> As a signed-in user, I want to create a new note and format its text with bold, lists and headings, so that I can capture structured information the way I want it.

| ID | Given | When | Then |
|---|---|---|---|
| AC-011 | I am signed in and on my note list | I choose to create a new note | a new empty note opens in the editor ready for typing, owned by my account |
| AC-012 | I am editing a note | I apply bold, a list, or a heading to selected text | the formatting is applied and preserved in the note content |
| AC-013 | the initial scope excludes attachments | I am editing a note | no option to add images or file attachments is offered (attachments are out of scope for this version) |

### US-006: Autosave while editing

**Priority:** critical

> As a signed-in user, I want my changes to a note to be saved automatically as I work, so that I do not lose work and do not have to remember to save.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | I am editing a note and online | I pause after making changes | the changes are saved automatically and a save status is shown to me |
| AC-015 | my changes have been autosaved | I reopen the note later or in another browser session | the most recently saved content and formatting are shown |
| AC-016 | I am editing a note and a save does not complete | the autosave fails | I am shown that the change is unsaved so I do not assume it was stored |

### US-007: Open an existing note to edit

**Priority:** high

> As a signed-in user, I want to open one of my existing notes and continue editing it, so that I can keep my notes up to date.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | I own an existing note | I select it from my note list | the note opens in the editor with its saved content and formatting intact |

## EPIC-003: Note List and Deletion

The note list is the home screen after sign-in, showing the user's own notes. Users can delete a note. Standard CRUD completed by create/edit (covered elsewhere) and delete here.

### US-008: Note list as home screen

**Priority:** high

> As a signed-in user, I want to land on a list of my notes after signing in, so that I can quickly find and open what I need.

| ID | Given | When | Then |
|---|---|---|---|
| AC-018 | I am signed in and own one or more notes | I arrive at the home screen | my notes are listed with enough detail (such as title or snippet) to identify them |
| AC-019 | I am a new user with no notes | I arrive at the home screen | I see an empty state that invites me to create my first note |

### US-009: Delete a note

**Priority:** high

> As a signed-in user, I want to delete a note I no longer want, so that my note list stays relevant.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | I own a note | I choose to delete it and confirm the deletion | the note is removed and no longer appears in my note list or search results |
| AC-021 | I choose to delete a note | I cancel before confirming | the note is kept unchanged |

## EPIC-004: Organising Notes with Tags or Folders

Users organise their notes using tags or folders so related notes can be grouped and found. Applies to the signed-in user's own notes only.

### US-010: Assign tags or folders to a note

**Priority:** medium

> As a signed-in user, I want to organise a note using tags or a folder, so that I can group related notes together.

| ID | Given | When | Then |
|---|---|---|---|
| AC-022 | I am editing or viewing one of my notes | I assign a tag or place it in a folder | the assignment is saved against that note and reflected when I reopen it |
| AC-023 | I have assigned a tag or folder to a note | I remove that tag or move it out of the folder | the note is no longer grouped under that tag or folder |

### US-011: Browse notes by tag or folder

**Priority:** medium

> As a signed-in user, I want to filter my note list by a tag or folder, so that I can view only the notes in a group.

| ID | Given | When | Then |
|---|---|---|---|
| AC-024 | I own notes assigned to a tag or folder | I select that tag or folder | only my notes in that group are shown |
| AC-025 | I am filtering by a tag or folder | I clear the filter | my full note list is shown again |

## EPIC-005: Search Across Notes

Users find their notes again by searching across their own notes. Search is restricted to the signed-in user's own notes.

### US-012: Search my notes

**Priority:** high

> As a signed-in user, I want to search across my notes by their content or title, so that I can quickly find a specific note.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | I own notes containing a word I am looking for | I enter that word in search | notes matching the word in their title or content are listed, and only notes I own are returned |
| AC-027 | no note matches my search term | I run the search | I am shown a clear no-results message rather than an error |
| AC-028 | I have run a search | I clear the search term | my full note list is shown again |

## EPIC-006: Responsive Web Delivery

The application is delivered as a responsive web app usable in any modern browser on laptop or phone while online. No offline support and no native apps are in scope; these are stated as assumptions on delivery.

### US-013: Use the app on laptop or phone in a browser

**Priority:** high

> As a user, I want the app to adapt to my laptop or phone screen in a standard browser, so that I can read and edit my notes on whichever device I have.

| ID | Given | When | Then |
|---|---|---|---|
| AC-029 | I open the app in a modern browser on a laptop | I view my note list and open a note | the layout is usable and all core actions (create, edit, delete, search, organise) are available |
| AC-030 | I open the app in a modern browser on a phone | I view my note list and open a note | the layout adapts to the smaller screen and all core actions remain usable |
| AC-031 | the app requires an online connection | I have no network connection | I am informed that connectivity is needed (offline use and native apps are out of scope for this version) |
<!-- sdlc:auto:end epics -->
