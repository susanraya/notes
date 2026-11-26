<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-26

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Flask
- Django

## Decision Outcome

Chosen option: FastAPI 0.115, because Lean Python framework handling registration, session issuance/revocation, per-user note scoping, sanitised rich-text storage, and PostgreSQL full-text search without heavy machinery, right-sized for personal scale.

## Consequences

Minimal batteries-included features means auth, email, and session storage are assembled from focused libraries, which keeps the surface small for this app.
<!-- sdlc:auto:end adr -->