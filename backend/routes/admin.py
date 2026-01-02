from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from flask import Blueprint, jsonify, request

try:
    from ..db import get_db
except ImportError:  # pragma: no cover
    from db import get_db


admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


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


def _normalize_date(date_str: str) -> str:
    # Expect YYYY-MM-DD; store normalized string so Mongo sort works.
    try:
        parsed = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError("Field 'date' must be in YYYY-MM-DD format") from exc
    return parsed.strftime("%Y-%m-%d")


def _normalize_time(time_str: str) -> str:
    # Expect HH:MM (24h)
    try:
        parsed = datetime.strptime(time_str, "%H:%M")
    except ValueError as exc:
        raise ValueError("Field 'time' must be in HH:MM (24h) format") from exc
    return parsed.strftime("%H:%M")


@admin_bp.post("/events")
def publish_event():
    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        event_name = _require_str(payload, "event_name")
        event_type = _require_str(payload, "event_type")
        category = _require_str(payload, "category")
        date_str = _normalize_date(_require_str(payload, "date"))
        time_from = _normalize_time(_require_str(payload, "time_from"))
        time_to = _normalize_time(_require_str(payload, "time_to"))
        location = _require_str(payload, "location")
        description = _require_str(payload, "description")
        club_name = _require_str(payload, "club_name")
        created_by = payload.get("created_by") or club_name
        if not isinstance(created_by, str):
            raise ValueError("Field 'created_by' must be a string")
        created_by = created_by.strip() or club_name

        if event_type not in {"Technical", "Non-Technical"}:
            return jsonify({"error": "event_type must be 'Technical' or 'Non-Technical'"}), 400

        if category not in {"Internal", "External"}:
            return jsonify({"error": "category must be 'Internal' or 'External'"}), 400

        event_doc = {
            "event_id": uuid4().hex,
            "event_name": event_name,
            "event_type": event_type,
            "category": category,
            "date": date_str,
            "time_from": time_from,
            "time_to": time_to,
            "location": location,
            "description": description,
            "club_name": club_name,
            "created_by": created_by,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "Published",
        }

        db = get_db()
        db.events.insert_one(event_doc)

        return jsonify({"success": True, "event_id": event_doc["event_id"], "status": "Published"}), 201

    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
