from __future__ import annotations

from flask import Blueprint, jsonify

try:
    from ..db import get_db
except ImportError:  # pragma: no cover
    from db import get_db


student_bp = Blueprint("student", __name__, url_prefix="/api/student")


@student_bp.get("/events")
def list_events():
    try:
        db = get_db()
        cursor = (
            db.events.find({"status": "Published"}, {"_id": 0})
            .sort([("date", 1), ("time_from", 1)])
        )
        return jsonify({"events": list(cursor)}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
