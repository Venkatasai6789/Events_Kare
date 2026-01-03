from __future__ import annotations

from flask import Blueprint, jsonify
from flask import request

from datetime import datetime, timezone

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


@student_bp.get("/vacancies")
def list_vacancies():
    try:
        db = get_db()
        club_name = request.args.get("club_name")

        query: dict = {"status": "Published"}
        if club_name:
            query["club_name"] = club_name

        cursor = db.vacancies.find(query, {"_id": 0}).sort([("created_at", -1)])
        return jsonify({"vacancies": list(cursor)}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@student_bp.get("/notifications")
def list_notifications():
    """Fetch notifications for a student.

    Query params:
    - student_id: the student's identifier (e.g., register number)

    Returns notifications in reverse chronological order.
    """

    try:
        db = get_db()

        student_id = request.args.get("student_id")
        if not (student_id and isinstance(student_id, str) and student_id.strip()):
            return jsonify({"error": "student_id is required"}), 400
        student_id = student_id.strip()

        query = {"student_id": {"$in": ["all", student_id]}}
        cursor = db.notifications.find(query, {"_id": 0}).sort([("created_at", -1)])
        return (
            jsonify(
                {
                    "notifications": list(cursor),
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                }
            ),
            200,
        )
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@student_bp.get("/certificates")
def list_certificates():
    """Fetch issued certificates for a student.

    Query params:
    - student_id: the student's identifier (e.g., register number)

    Returns certificates in reverse chronological order.
    """

    try:
        db = get_db()

        student_id = request.args.get("student_id")
        if not (student_id and isinstance(student_id, str) and student_id.strip()):
            return jsonify({"error": "student_id is required"}), 400
        student_id = student_id.strip()

        cursor = (
            db.certificates.find(
                {"student_id": student_id, "status": "Issued"},
                {"_id": 0},
            )
            .sort([("issued_at", -1)])
        )
        return (
            jsonify(
                {
                    "certificates": list(cursor),
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                }
            ),
            200,
        )
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
