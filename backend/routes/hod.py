from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from flask import Blueprint, jsonify, request

try:
    from ..db import get_db
except ImportError:  # pragma: no cover
    from db import get_db


hod_bp = Blueprint("hod", __name__, url_prefix="/api/hod")


def _require_str(payload: dict, key: str) -> str:
    value = payload.get(key)
    if value is None:
        raise ValueError(f"Missing field: {key}")
    if not isinstance(value, str):
        raise ValueError(f"Field '{key}' must be a string")
    value = value.strip()
    if not value:
        raise ValueError(f"Field '{key}' cannot be empty")
    return value


@hod_bp.post("/od/approve")
def approve_od_request():
    """Approve an OD request and notify the student once.

    Notes:
    - This project currently doesn't implement authentication; callers must provide student_id.
    - We ensure a given od_request_id produces at most one approval notification.
    """

    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        od_request_id = _require_str(payload, "od_request_id")
        event_name = _require_str(payload, "event_name")
        student_id = _require_str(payload, "student_id")

        db = get_db()

        # Persist OD request status (lightweight) so we can avoid re-notifying.
        db.od_requests.update_one(
            {"od_request_id": od_request_id},
            {
                "$set": {
                    "od_request_id": od_request_id,
                    "event_name": event_name,
                    "student_id": student_id,
                    "status": "Approved",
                    "approved_at": datetime.now(timezone.utc).isoformat(),
                }
            },
            upsert=True,
        )

        # Avoid duplicates: if already approved+notified, do nothing.
        existing = db.notifications.find_one(
            {"student_id": student_id, "type": "od", "reference_id": od_request_id},
            {"_id": 1},
        )
        if existing:
            return jsonify({"success": True, "notified": False}), 200

        # Once OD is approved, remove any previous OD-related notifications
        # for this request so no further OD-related notifications appear.
        db.notifications.delete_many(
            {"student_id": student_id, "type": "od", "reference_id": od_request_id}
        )

        db.notifications.insert_one(
            {
                "student_id": student_id,
                "title": "OD Approved",
                "message": f"Your OD request for {event_name} has been approved",
                "type": "od",
                "reference_id": od_request_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "is_read": False,
            }
        )

        return jsonify({"success": True, "notified": True}), 200

    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
