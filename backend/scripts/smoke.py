"""Smoke check of a running app: it starts, and a user can sign in.

    python -m scripts.smoke --base-url https://api.example.com [--frontend-url https://...]

In order: the API's /health answers 200; the smoke user (SMOKE_TEST_EMAIL and
SMOKE_TEST_PASSWORD) signs in at /auth/login and reads /auth/me with the token; with
--frontend-url, the frontend serves its page. Exits 1 when a check fails, so a deploy step
can roll back on it. Standard library only, and it never prints a credential.
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any

_TIMEOUT_SECONDS = 15


def _call(
    method: str, url: str, body: dict[str, Any] | None = None, token: str | None = None
) -> tuple[int | None, str]:
    """The status and body of one request; no status when the server did not answer."""
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(url, data=data, method=method)
    if data is not None:
        request.add_header("Content-Type", "application/json")
    if token:
        request.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(request, timeout=_TIMEOUT_SECONDS) as response:
            return response.status, response.read().decode(errors="replace")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode(errors="replace")
    except (urllib.error.URLError, TimeoutError) as exc:
        return None, str(getattr(exc, "reason", exc))


def _join(base: str, path: str) -> str:
    return base.rstrip("/") + path


def run(base_url: str, frontend_url: str | None) -> list[tuple[str, bool, str]]:
    """Each check as (name, passed, what happened)."""
    results: list[tuple[str, bool, str]] = []
    status, _ = _call("GET", _join(base_url, "/health"))
    results.append(("API health", status == 200, f"/health answered {status}"))

    email = os.getenv("SMOKE_TEST_EMAIL", "")
    password = os.getenv("SMOKE_TEST_PASSWORD", "")
    if not email or not password:
        results.append(("Sign-in", False, "SMOKE_TEST_EMAIL and SMOKE_TEST_PASSWORD are not set"))
    else:
        status, text = _call(
            "POST", _join(base_url, "/auth/login"), {"email": email, "password": password}
        )
        token = ""
        if status == 200:
            try:
                token = str(json.loads(text).get("token") or "")
            except (ValueError, AttributeError):
                token = ""
        results.append(("Sign-in", bool(token), f"/auth/login answered {status}"))
        if token:
            status, _ = _call("GET", _join(base_url, "/auth/me"), token=token)
            results.append(("Signed-in read", status == 200, f"/auth/me answered {status}"))

    if frontend_url:
        status, text = _call("GET", frontend_url)
        page = status == 200 and "<html" in text.lower()
        results.append(("Frontend", page, f"/ answered {status}"))
    return results


def main() -> None:
    parser = argparse.ArgumentParser(description="Smoke-check a running app.")
    parser.add_argument("--base-url", required=True, help="the API's address")
    parser.add_argument("--frontend-url", help="the frontend's address (optional)")
    args = parser.parse_args()
    results = run(args.base_url, args.frontend_url)
    for name, passed, detail in results:
        print(f"{'PASS' if passed else 'FAIL'} {name}: {detail}")
    sys.exit(0 if all(passed for _, passed, _ in results) else 1)


if __name__ == "__main__":
    main()
