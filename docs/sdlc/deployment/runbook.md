# Runbook

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start health -->
- Backend: `https://c5a5204f1606.local.awsapprunner.local/health`
- Frontend: https://pc5a5204f1606.dshared.amplifyapp.local
<!-- sdlc:auto:end health -->

<!-- sdlc:auto:start deploy -->
Push to `main` to run `.github/workflows/deploy.yml`, or start a deployment from the platform's Deployment tab.
<!-- sdlc:auto:end deploy -->

<!-- sdlc:auto:start rollback -->
Redeploy the last good version from the platform's Deployment tab, or revert the offending commit on `main` — the workflow redeploys.

**Last live version:** bf20e1128527 (`bf20e11`)
<!-- sdlc:auto:end rollback -->

<!-- sdlc:auto:start recent-failures -->
_No failed deployments recorded._
<!-- sdlc:auto:end recent-failures -->

## Contacts and escalation

_Add on-call contacts here — this section is never overwritten._
