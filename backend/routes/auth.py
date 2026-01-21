from __future__ import annotations

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash

try:
    from ..db import get_users_collection
except ImportError:  # pragma: no cover
    from db import get_users_collection


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _require_str(payload: dict, key: str) -> str:
    value = payload.get(key)
    if not (isinstance(value, str) and value.strip()):
        raise ValueError(f"{key} is required")
    return value.strip()


@auth_bp.post("/login")
def login():
    """Verify user credentials.

    Expected JSON:
    - role: student | admin | hod
    - login_id: string (user_id or email)
    - password: string

    Returns 200 only when credentials are valid.
    """

    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        role = _require_str(payload, "role").lower()
        login_id = _require_str(payload, "login_id")
        password = _require_str(payload, "password")

        if role not in {"student", "admin", "hod"}:
            return jsonify({"error": "Invalid role"}), 400

        users = get_users_collection()

        user = users.find_one(
            {
                "role": role,
                "$or": [
                    {"user_id": login_id},
                    {"email": login_id},
                ],
            },
            {"_id": 0},
        )

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        stored_hash = user.get("password")
        if not (isinstance(stored_hash, str) and stored_hash):
            return jsonify({"error": "Invalid credentials"}), 401

        if not check_password_hash(stored_hash, password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Minimal response: confirm auth and return non-sensitive profile fields.
        user_public = {
            "user_id": user.get("user_id"),
            "name": user.get("name"),
            "role": user.get("role"),
            "department": user.get("department"),
            "section": user.get("section"),
        }

        return jsonify({"ok": True, "role": role, "user": user_public}), 200
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
