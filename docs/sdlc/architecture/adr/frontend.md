<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-26

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because Builds the responsive SPA with the rich-text editor and live autosave status; served as a static build from S3/CloudFront and talks to the API via a bearer token read from VITE_API_BASE_URL.

## Consequences

A SPA needs client-side routing and token handling, which we add explicitly rather than getting from a server-rendered framework.
<!-- sdlc:auto:end adr -->