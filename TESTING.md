# Testing notes

The platform keeps one test case sheet for this project. Each test case has an ID such as
`TC-102`. The platform runs the tests, reads their JUnit XML reports and finds the test for
each case by that ID. A test that does not carry its ID is not counted for any case.

## Naming rule

A test written for a test case carries the case's ID in its name: `tc102` (or `TC-102`)
for case TC-102. Only integration tests (pytest, under `backend/tests/integration/`) and
E2E tests (Playwright, under `e2e/`) carry IDs; unit tests (pytest elsewhere, Vitest) never do.

| Kind | Example |
|---|---|
| Integration (pytest) | `def test_tc102_taken_slot_returns_409(auth_client): ...` |
| E2E (Playwright) | `test("TC-102 a taken slot cannot be booked", ...)` |

One test per case. A test for a case never changes the case's expected result to match
the code: if the expectation is wrong, the case is fixed in the sheet, not in the test.
Unit tests that belong to no case need no ID.

## Reports

Every run writes a JUnit XML report to a fixed folder, `reports/junit/`:

| Command | Report |
|---|---|
| `pytest` (backend) | `backend/reports/junit/pytest.xml` |
| `npm run test` (frontend) | `frontend/reports/junit/vitest.xml` |
| `npm run test:e2e` (frontend) | `frontend/reports/junit/playwright.xml` |

The folder is not committed.

## End-to-end tests

Playwright specs live in `frontend/e2e/`. The E2E code is written at release, against the
whole app, not in each sprint. Sign in only through `adminCredentials()` from
`frontend/e2e/support/admin.ts`. Select an element by its test ID from the approved screen
spec when it has one, and otherwise by its role and accessible name (`getByRole`). With
`E2E_BASE_URL` set (for example the staging address) the suite runs against that deployed
app; without it, Playwright builds and serves this repository.

## Backend tests

The backend tests run on PostgreSQL, never SQLite, with the schema the Alembic migrations
build. Start the database and point `DATABASE_URL` at it:

```bash
docker compose up -d db        # from the repository root
cd backend
export DATABASE_URL=postgresql+psycopg://<user>:<password>@localhost:5432/<database>
pytest
```

`tests/conftest.py` migrates the database once per run and rolls every test back at its
end. Its fixtures:

| Fixture | What it is |
|---|---|
| `db_session` | the test's database session |
| `client` | the app, on that session |
| `auth_client` | `client`, signed in as a new normal user |
| `admin_client` | `client`, signed in as a new admin |

Every model or column change ships with a migration in `backend/alembic/versions/`
(`alembic revision --autogenerate -m "..."`). The app runs `alembic upgrade head` when it
starts.

## Users

`python -m app.seed` (and the app's startup) creates the first admin from
`BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`, and a normal user from
`SMOKE_TEST_EMAIL` and `SMOKE_TEST_PASSWORD`. It never creates a user twice. Never write a
password in code or tests: tests make their own users through the fixtures above.

## Smoke check

`python -m scripts.smoke --base-url <API address> [--frontend-url <app address>]` checks
that the API answers `/health` and that the smoke user can sign in. It exits 1 on a
failure.

## The API client

The frontend calls the API only through `frontend/src/api/client.ts`, which is typed from
the backend's OpenAPI document. After any change to a route or a schema, run
`npm run gen:api` in `frontend/` (it needs the backend's `.venv`, or set `PYTHON`) and
commit `src/api/openapi.json` and `src/api/schema.ts`. Lint refuses `fetch` and axios
outside `src/api/`. JSON field names are camelCase: every schema inherits
`app.api_model.ApiModel`.
