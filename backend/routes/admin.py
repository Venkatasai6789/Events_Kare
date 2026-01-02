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


def _require_int(payload: dict, key: str) -> int:
    value = payload.get(key)
    if value is None:
        raise ValueError(f"Missing field: {key}")
    if isinstance(value, bool):
        raise ValueError(f"Field '{key}' must be an integer")
    if isinstance(value, int):
        parsed = value
    elif isinstance(value, str):
        try:
            parsed = int(value.strip())
        except ValueError as exc:
            raise ValueError(f"Field '{key}' must be an integer") from exc
    else:
        raise ValueError(f"Field '{key}' must be an integer")

    if parsed <= 0:
        raise ValueError(f"Field '{key}' must be greater than 0")
    return parsed


def _parse_skills(value) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        skills = [str(v).strip() for v in value]
    elif isinstance(value, str):
        skills = [v.strip() for v in value.split(",")]
    else:
        raise ValueError("Field 'skills' must be a list of strings or a comma-separated string")

    skills = [s for s in skills if s]
    # De-duplicate while preserving order.
    seen: set[str] = set()
    deduped: list[str] = []
    for s in skills:
        key = s.lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(s)
    return deduped


def _normalize_date(date_str: str) -> str:
    # Expect YYYY-MM-DD; store normalized string so Mongo sort works.
    try:
        parsed = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError("Field 'date' must be in YYYY-MM-DD format") from exc
    return parsed.strftime("%Y-%m-%d")


def _normalize_date_field(date_str: str, field_name: str) -> str:
    # Expect YYYY-MM-DD; store normalized string so Mongo sort works.
    try:
        parsed = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError(f"Field '{field_name}' must be in YYYY-MM-DD format") from exc
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

        # Accept new schema fields (start_date/end_date) while remaining backward compatible
        # with older clients that still send only 'date'.
        raw_start = payload.get("start_date")
        if raw_start is None:
            raw_start = payload.get("date")
        if raw_start is None:
            raise ValueError("Missing field: start_date")
        if not isinstance(raw_start, str):
            raise ValueError("Field 'start_date' must be a string")
        raw_start = raw_start.strip()
        if not raw_start:
            raise ValueError("Field 'start_date' cannot be empty")
        start_date = _normalize_date_field(raw_start, "start_date")

        raw_end = payload.get("end_date")
        if raw_end is None:
            raw_end = start_date
        if not isinstance(raw_end, str):
            raise ValueError("Field 'end_date' must be a string")
        raw_end = raw_end.strip()
        if not raw_end:
            raise ValueError("Field 'end_date' cannot be empty")
        end_date = _normalize_date_field(raw_end, "end_date")

        # Keep legacy 'date' field for existing readers/sorting.
        date_str = start_date

        time_from = _normalize_time(_require_str(payload, "time_from"))
        time_to = _normalize_time(_require_str(payload, "time_to"))
        location = _require_str(payload, "location")
        description = _require_str(payload, "description")
        club_name = _require_str(payload, "club_name")

        contact_details = payload.get("contact_details")
        if contact_details is None:
            contact_details = ""
        if not isinstance(contact_details, str):
            raise ValueError("Field 'contact_details' must be a string")
        contact_details = contact_details.strip()

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
            "start_date": start_date,
            "end_date": end_date,
            "time_from": time_from,
            "time_to": time_to,
            "location": location,
            "description": description,
            "contact_details": contact_details,
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


@admin_bp.get("/vacancies")
def list_vacancies_admin():
    try:
        db = get_db()
        club_name = request.args.get("club_name")
        status = request.args.get("status")

        query: dict = {}
        if club_name:
            query["club_name"] = club_name
        if status:
            query["status"] = status

        cursor = db.vacancies.find(query, {"_id": 0}).sort([("created_at", -1)])
        return jsonify({"vacancies": list(cursor)}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@admin_bp.post("/vacancies")
def create_vacancy():
    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        club_name = _require_str(payload, "club_name")
        title = _require_str(payload, "title")
        description = _require_str(payload, "description")
        openings = _require_int(payload, "openings")

        skills = _parse_skills(payload.get("skills"))
        deadline = payload.get("deadline")
        if deadline is not None:
            if not isinstance(deadline, str):
                raise ValueError("Field 'deadline' must be a string in YYYY-MM-DD format")
            deadline = deadline.strip()
            if deadline:
                deadline = _normalize_date(deadline)
            else:
                deadline = None

        contact = payload.get("contact")
        if contact is not None and not isinstance(contact, str):
            raise ValueError("Field 'contact' must be a string")
        contact = (contact or "").strip() or None

        status = payload.get("status")
        if status is None:
            status = "Published"
        if not isinstance(status, str):
            raise ValueError("Field 'status' must be a string")
        status = status.strip() or "Published"
        if status not in {"Published", "Draft"}:
            raise ValueError("status must be 'Published' or 'Draft'")

        vacancy_doc = {
            "vacancy_id": uuid4().hex,
            "club_name": club_name,
            "title": title,
            "description": description,
            "skills": skills,
            "openings": openings,
            "deadline": deadline,
            "contact": contact,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": status,
        }

        db = get_db()
        db.vacancies.insert_one(vacancy_doc)

        return jsonify({"success": True, "vacancy_id": vacancy_doc["vacancy_id"], "status": status}), 201
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
