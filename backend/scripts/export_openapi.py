"""Write the backend's OpenAPI document, the source of the frontend's typed API client.

Run from backend/: `python -m scripts.export_openapi ../frontend/src/api/openapi.json`.
The frontend's `npm run gen:api` runs it, then generates src/api/schema.ts from the file.
Importing the app opens no database connection, so this needs no database.
"""

import argparse
import json
from pathlib import Path

from app.main import app


def main() -> None:
    parser = argparse.ArgumentParser(description="Write the API's OpenAPI document.")
    parser.add_argument("output", type=Path, help="where to write the JSON document")
    output: Path = parser.parse_args().output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {output}")


if __name__ == "__main__":
    main()
