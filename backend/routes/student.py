from __future__ import annotations

from flask import Blueprint, jsonify
from flask import request

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
