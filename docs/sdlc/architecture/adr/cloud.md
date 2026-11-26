<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-26

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- GCP
- Azure

## Decision Outcome

Chosen option: AWS, because Single-region deployment of the static SPA (S3/CloudFront), the API (App Runner container) and managed PostgreSQL (RDS) that handles backups and patching, scaling down cheaply for a free personal app.

## Consequences

Managed services add small fixed cost versus a single VM, repaid by not babysitting backups, patching, or TLS.
<!-- sdlc:auto:end adr -->