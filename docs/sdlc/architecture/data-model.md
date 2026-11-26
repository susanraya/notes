# Data Model

<!-- sdlc:auto:start entities -->
### users

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| email | citext | False | — | False |
| password_hash | text | False | — | False |
| email_verified | boolean | False | — | False |
| created_at | timestamptz | False | — | False |

### sessions

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| token_hash | text | False | — | False |
| expires_at | timestamptz | False | — | False |
| revoked_at | timestamptz | False | — | True |
| created_at | timestamptz | False | — | False |

### email_tokens

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| token_hash | text | False | — | False |
| purpose | text | False | — | False |
| expires_at | timestamptz | False | — | False |
| used_at | timestamptz | False | — | True |

### folders

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| name | text | False | — | False |
| created_at | timestamptz | False | — | False |

### notes

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| folder_id | uuid | False | folders.id | True |
| title | text | False | — | False |
| content_html | text | False | — | False |
| content_text | text | False | — | False |
| search_vector | tsvector | False | — | True |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |

### tags

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| name | text | False | — | False |

### note_tags

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| note_id | uuid | True | notes.id | False |
| tag_id | uuid | True | tags.id | False |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
| Source | Target | Type |
|---|---|---|
| users | notes | one-to-many |
| users | folders | one-to-many |
| users | tags | one-to-many |
| users | sessions | one-to-many |
| users | email_tokens | one-to-many |
| folders | notes | one-to-many |
| notes | note_tags | one-to-many |
| tags | note_tags | one-to-many |
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  users {
    uuid id PK
    citext email
    text password_hash
    boolean email_verified
    timestamptz created_at
  }
  sessions {
    uuid id PK
    uuid user_id FK
    text token_hash
    timestamptz expires_at
    timestamptz revoked_at
    timestamptz created_at
  }
  email_tokens {
    uuid id PK
    uuid user_id FK
    text token_hash
    text purpose
    timestamptz expires_at
    timestamptz used_at
  }
  folders {
    uuid id PK
    uuid user_id FK
    text name
    timestamptz created_at
  }
  notes {
    uuid id PK
    uuid user_id FK
    uuid folder_id FK
    text title
    text content_html
    text content_text
    tsvector search_vector
    timestamptz created_at
    timestamptz updated_at
  }
  tags {
    uuid id PK
    uuid user_id FK
    text name
  }
  note_tags {
    uuid note_id PK,FK
    uuid tag_id PK,FK
  }
  users ||--o{ notes : "one-to-many"
  users ||--o{ folders : "one-to-many"
  users ||--o{ tags : "one-to-many"
  users ||--o{ sessions : "one-to-many"
  users ||--o{ email_tokens : "one-to-many"
  folders ||--o{ notes : "one-to-many"
  notes ||--o{ note_tags : "one-to-many"
  tags ||--o{ note_tags : "one-to-many"
```
<!-- sdlc:auto:end er-diagram -->
