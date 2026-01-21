"""One-time seed script for initial club admin credentials.

This inserts records into the separate `club_admins` collection.

Usage (from repo root):
  python backend/seed_club_admins.py

Environment:
  - MONGO_URI (required)
  - MONGO_DB_NAME (optional, default: campus_connect)
  - CLUB_ADMIN_PASSWORD (optional, default: clubadmin@123)

The script is idempotent: it uses upsert + $setOnInsert, so re-running it
won't overwrite existing users.
"""

from __future__ import annotations

import os
import sys

from pymongo.errors import ConfigurationError, ServerSelectionTimeoutError
from werkzeug.security import generate_password_hash

try:
    from .db import get_club_admins_collection, ping
except ImportError:  # pragma: no cover
    from db import get_club_admins_collection, ping


def main() -> int:
    try:
        ping()
    except (ServerSelectionTimeoutError, ConfigurationError) as exc:
        print("❌ Could not connect to MongoDB.")
        print(f"Reason: {exc}")
        print(
            "\nTips:\n"
            "- Ensure MONGO_URI is set (backend/.env or environment).\n"
            "- On Windows, SRV (mongodb+srv://) may hang if DNS blocks UDP/53; try a standard URI (mongodb://host1,host2/...).\n"
            "- You can also set MONGO_CONNECT_TIMEOUT_MS and MONGO_SERVER_SELECTION_TIMEOUT_MS to fail fast."
        )
        return 1

    password_plain = os.getenv("CLUB_ADMIN_PASSWORD", "clubadmin@123")

    club_admins = [
        {
            "admin_id": "CLUBADMIN_TIG",
            "name": "Tech Innovators Guild Admin",
            "password": generate_password_hash(password_plain),
            "club_name": "Tech Innovators Guild",
        }
    ]

    club_admins_col = get_club_admins_collection()

    inserted = 0
    for u in club_admins:
        result = club_admins_col.update_one(
            {"admin_id": u["admin_id"]},
            {"$setOnInsert": u},
            upsert=True,
        )
        if result.upserted_id is not None:
            inserted += 1

    if inserted:
        print(f"✅ Seeded {inserted} club admin record(s) into club_admins collection")
    else:
        print("ℹ️ Club admin seed already present (no changes made)")

    print("\nClub Admin Login (seeded)")
    print(f"- admin_id: {club_admins[0]['admin_id']}")
    print(f"- password: {password_plain}")
    print(f"- club_name: {club_admins[0]['club_name']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
