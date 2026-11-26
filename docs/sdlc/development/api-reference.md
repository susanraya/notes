# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| POST | /auth/login | login | `backend/app/auth.py:130` | — |
| GET | /auth/me | me | `backend/app/auth.py:138` | — |
| GET | /health | health | `backend/app/main.py:87` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /folders/{id}
- DELETE /notes/{id}
- GET /folders
- GET /notes
- GET /notes/search
- GET /notes/{id}
- GET /tags
- POST /auth/logout
- POST /auth/password-reset/confirm
- POST /auth/password-reset/request
- POST /auth/register
- POST /auth/verify-email
- POST /folders
- POST /notes
- POST /tags
- PUT /notes/{id}
- PUT /notes/{id}/tags

**Code only:**

- GET /auth/me
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `1fa1502`
<!-- sdlc:auto:end source -->
