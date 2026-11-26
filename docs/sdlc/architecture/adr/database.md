<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-26

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL
- SQLite

## Decision Outcome

Chosen option: PostgreSQL 16, because Stores accounts, notes, tags and folders with a foreign key guaranteeing a note belongs to exactly one account, and serves search via built-in tsvector full-text search, so no separate search engine is needed.

## Consequences

Full-text search is good enough for personal scale but lacks the relevance tuning of a dedicated engine, which this build does not require.
<!-- sdlc:auto:end adr -->