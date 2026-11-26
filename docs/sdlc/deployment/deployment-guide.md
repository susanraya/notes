# Deployment Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start how-it-deploys -->
Pushes to `main` run `.github/workflows/deploy.yml`, which builds the API image (if there is a backend) and deploys the SPA to AWS Amplify. Commits touching only `docs/sdlc/**` don't deploy. Deployments can also be started from the platform's Deployment tab.
<!-- sdlc:auto:end how-it-deploys -->

<!-- sdlc:auto:start environments -->
| Name | Service | Runtime | Scaling | Environment |
|---|---|---|---|---|
| SPA Host | S3 + CloudFront | Static React 19 build | CDN edge cache, static | dev |
| API Service | AWS App Runner | FastAPI 0.115 on Python 3.12 (Uvicorn container) | 1 instance, scale-to-few for personal use | dev |
| Database | Amazon RDS for PostgreSQL 16 | PostgreSQL 16 | Single-AZ small instance, automated backups | dev |
| Email | External SMTP server (SaaS) | SMTP | Provider-managed | dev |
<!-- sdlc:auto:end environments -->

<!-- sdlc:auto:start live -->
_Not deployed yet._
<!-- sdlc:auto:end live -->

<!-- sdlc:auto:start topology -->
```mermaid
graph LR
  n_SPA_Host["SPA Host<br/>S3 + CloudFront"]
  n_API_Service["API Service<br/>AWS App Runner"]
  n_Database["Database<br/>Amazon RDS for PostgreSQL 16"]
  n_Email["Email<br/>External SMTP server (SaaS)"]
  n_SPA_Host -->|"HTTPS"| n_API_Service
  n_API_Service -->|"PostgreSQL/TLS"| n_Database
  n_API_Service -->|"SMTP/TLS"| n_Email
```
<!-- sdlc:auto:end topology -->
