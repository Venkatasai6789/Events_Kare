from __future__ import annotations

from functools import wraps

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from datetime import datetime, timezone

try:
    from ..db import get_db
except ImportError:  # pragma: no cover
    from db import get_db


student_bp = Blueprint("student", __name__, url_prefix="/api/student")


def student_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt() or {}
        if claims.get("role") != "student":
            return jsonify({"error": "Unauthorized"}), 401
        return fn(*args, **kwargs)

    return wrapper


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


def _require_email(payload: dict, key: str) -> str:
    value = _require_str(payload, key)
    if "@" not in value or value.startswith("@") or value.endswith("@"):
        raise ValueError(f"Field '{key}' must be a valid email")
    return value


def _ensure_hostel_permissions_indexes(db) -> None:
    try:
        db.hostel_permissions.create_index("student_id")
        db.hostel_permissions.create_index("status")
        db.hostel_permissions.create_index("section")
        db.hostel_permissions.create_index([("created_at", -1)])
    except Exception:
        pass


def _serialize_hostel_permission(doc: dict) -> dict:
    out = {k: v for k, v in doc.items() if k != "_id"}
    if "_id" in doc:
        out["id"] = str(doc["_id"])
    return out


@student_bp.get("/events")
@student_required
def list_events():
    try:
        _user_id = get_jwt_identity()
        db = get_db()
        cursor = (
            db.events.find({"status": "Published"}, {"_id": 0})
            .sort([("date", 1), ("time_from", 1)])
        )
        return jsonify({"events": list(cursor)}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@student_bp.get("/vacancies")
@student_required
def list_vacancies():
    try:
        _user_id = get_jwt_identity()
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
@student_required
def list_notifications():
    """Fetch notifications for a student.

    Query params:
    - student_id: the student's identifier (e.g., register number)

    Returns notifications in reverse chronological order.
    """

    try:
        _user_id = get_jwt_identity()
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
@student_required
def list_certificates():
    """Fetch issued certificates for a student.

    Query params:
    - student_id: the student's identifier (e.g., register number)

    Returns certificates in reverse chronological order.
    """

    try:
        _user_id = get_jwt_identity()
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


@student_bp.post("/hostel-permissions")
@student_required
def create_hostel_permission_request():
    """Create a hostel permission request (student-submitted).

    Stores in Mongo collection: hostel_permissions

    Required JSON fields:
    - student_id
    - student_name
    - section
    - event_id
    - event_name
    - event_date
    - duration
    - hostel_name
    - hostel_head_email

    Server-set defaults:
    - status: Pending
    - requested_by_fa: False
    - requested_at: None
    - responded_at: None
    """

    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        _user_id = get_jwt_identity()
        student_id = _require_str(payload, "student_id")
        student_name = _require_str(payload, "student_name")
        section = _require_str(payload, "section")
        event_id = _require_str(payload, "event_id")
        event_name = _require_str(payload, "event_name")
        event_date = _require_str(payload, "event_date")
        duration = _require_str(payload, "duration")
        hostel_name = _require_str(payload, "hostel_name")
        hostel_head_email = _require_email(payload, "hostel_head_email")

        db = get_db()
        _ensure_hostel_permissions_indexes(db)

        # Use deterministic id from client if provided, otherwise create one.
        # This keeps schema clean (still just Mongo _id + specified fields).
        request_id = payload.get("id")
        if request_id is None:
            request_id = f"hp_{student_id}_{event_id}_{datetime.now(timezone.utc).timestamp()}"
        if not isinstance(request_id, str) or not request_id.strip():
            raise ValueError("Field 'id' must be a non-empty string if provided")
        request_id = request_id.strip()

        now = datetime.now(timezone.utc).isoformat()
        doc = {
            "_id": request_id,
            "student_id": student_id,
            "student_name": student_name,
            "section": section,
            "event_id": event_id,
            "event_name": event_name,
            "event_date": event_date,
            "duration": duration,
            "hostel_name": hostel_name,
            "hostel_head_email": hostel_head_email,
            "status": "Pending",
            "requested_by_fa": False,
            "requested_at": None,
            "responded_at": None,
            "created_at": now,
        }

        # Upsert to avoid duplicates if student retries.
        db.hostel_permissions.update_one({"_id": request_id}, {"$setOnInsert": doc}, upsert=True)

        stored = db.hostel_permissions.find_one({"_id": request_id})
        return jsonify({"success": True, "hostel_permission": _serialize_hostel_permission(stored or doc)}), 201

    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@student_bp.get("/hostel-permissions")
@student_required
def list_hostel_permission_requests():
    """List hostel permission requests for a student.

    Query params:
    - student_id (required)
    """

    try:
        _user_id = get_jwt_identity()
        db = get_db()
        _ensure_hostel_permissions_indexes(db)

        student_id = request.args.get("student_id")
        if not (student_id and isinstance(student_id, str) and student_id.strip()):
            return jsonify({"error": "student_id is required"}), 400
        student_id = student_id.strip()

        cursor = db.hostel_permissions.find({"student_id": student_id}).sort(
            [("created_at", -1), ("requested_at", -1)]
        )
        return jsonify({"hostel_permissions": [_serialize_hostel_permission(d) for d in cursor]}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
