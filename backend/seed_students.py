import sys

from pymongo.errors import ConfigurationError, ServerSelectionTimeoutError
from werkzeug.security import generate_password_hash

from db import get_db, ping

students = [
    {
        "user_id": "21CSE001",
        "name": "Student One",
        "password": generate_password_hash("student@123"),
        "role": "student",
        "department": "CSE",
        "section": "A"
    },
    {
        "user_id": "21CSE002",
        "name": "Student Two",
        "password": generate_password_hash("student@123"),
        "role": "student",
        "department": "CSE",
        "section": "A"
    },
    {
        "user_id": "21CSE003",
        "name": "Student Three",
        "password": generate_password_hash("student@123"),
        "role": "student",
        "department": "CSE",
        "section": "A"
    },
    {
        "user_id": "21CSE004",
        "name": "Student Four",
        "password": generate_password_hash("student@123"),
        "role": "student",
        "department": "CSE",
        "section": "A"
    },
    {
        "user_id": "21CSE005",
        "name": "Student Five",
        "password": generate_password_hash("student@123"),
        "role": "student",
        "department": "CSE",
        "section": "A"
    }
]

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

    db = get_db()
    db.users.insert_many(students)
    print("✅ 5 students added successfully")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
