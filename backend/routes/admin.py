from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from flask import Blueprint, g, jsonify, request

from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request
from werkzeug.security import check_password_hash

try:
    from bson import ObjectId
except Exception:  # pragma: no cover
    ObjectId = None

try:
    from ..db import get_club_admins_collection, get_db
except ImportError:  # pragma: no cover
    from db import get_club_admins_collection, get_db


admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.before_request
def _admin_jwt_guard():
    """Require JWT for all /api/admin/* routes except login.

    - Missing/invalid/expired/revoked token => handled by JWT callbacks (401)
    - Stores extracted identity on `flask.g.admin_identity`
    """

    # Allow CORS preflight to pass through.
    if request.method == "OPTIONS":
        return None

    # Do not protect the login endpoint.
    if request.path.rstrip("/") == "/api/admin/login":
        return None

    verify_jwt_in_request()
    g.admin_identity = get_jwt_identity()
    return None


@admin_bp.post("/login")
def club_admin_login():
    """Authenticate a club admin using credentials stored in `club_admins`.

    Expected JSON body:
    {
        "admin_id": "...",
        "password": "..."
    }

    Returns:
    {
        "message": "Login successful",
        "access_token": "...",
        "admin_id": "...",
        "name": "...",
        "club_name": "..."
    }
    """

    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        admin_id = _require_str(payload, "admin_id")
        password = _require_str(payload, "password")

        admins = get_club_admins_collection()
        admin = admins.find_one({"admin_id": admin_id}, {"_id": 0})
        if not admin:
            return jsonify({"error": "Invalid credentials"}), 401

        stored_hash = admin.get("password")
        if not (isinstance(stored_hash, str) and stored_hash):
            return jsonify({"error": "Invalid credentials"}), 401

        if not check_password_hash(stored_hash, password):
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(
            identity={"kind": "club_admin", "admin_id": admin_id}
        )

        return (
            jsonify(
                {
                    "message": "Login successful",
                    "access_token": access_token,
                    "admin_id": admin_id,
                    "name": admin.get("name"),
                    "club_name": admin.get("club_name"),
                }
            ),
            200,
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


def _insert_notification(
    db,
    *,
    student_id: str,
    title: str,
    message: str,
    notif_type: str,
    reference_id: str,
) -> bool:
    """Insert a notification if it doesn't already exist.

    Dedupe key: (student_id, type, reference_id)
    """

    existing = db.notifications.find_one(
        {"student_id": student_id, "type": notif_type, "reference_id": reference_id},
        {"_id": 1},
    )
    if existing:
        return False

    doc = {
        "student_id": student_id,
        "title": title,
        "message": message,
        "type": notif_type,  # event | vacancy | certificate | od
        "reference_id": reference_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_read": False,
    }
    db.notifications.insert_one(doc)
    return True


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

        try:
            _insert_notification(
                db,
                student_id="all",
                title="New Event Posted",
                message=f"New event posted: {event_name} by {club_name}",
                notif_type="event",
                reference_id=event_doc["event_id"],
            )
        except Exception:
            # Notifications should not block publishing.
            pass

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

        if status == "Published":
            try:
                _insert_notification(
                    db,
                    student_id="all",
                    title="New Club Vacancies",
                    message=f"New club vacancies available in {club_name}",
                    notif_type="vacancy",
                    reference_id=vacancy_doc["vacancy_id"],
                )
            except Exception:
                pass

        return jsonify({"success": True, "vacancy_id": vacancy_doc["vacancy_id"], "status": status}), 201
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@admin_bp.post("/certificates")
def send_certificate():
    """Issue a certificate (URL-only for now) and notify the student.

    Required JSON fields:
    - student_id
    - student_name
    - event_id
    - event_name
    - club_name
    - issued_by

    Optional JSON fields:
    - certificate_image_url (dummy image URL for now)
    """

    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        student_id = _require_str(payload, "student_id")
        student_name = _require_str(payload, "student_name")
        event_id = _require_str(payload, "event_id")
        event_name = _require_str(payload, "event_name")
        club_name = _require_str(payload, "club_name")
        issued_by = _require_str(payload, "issued_by")

        certificate_image_url = payload.get("certificate_image_url")
        if certificate_image_url is None:
            certificate_image_url = ""
        if not isinstance(certificate_image_url, str):
            raise ValueError("Field 'certificate_image_url' must be a string")
        certificate_image_url = certificate_image_url.strip()
        if not certificate_image_url:
            # Default dummy certificate URL (temporary)
            certificate_image_url = "https://placehold.co/1200x800/png?text=Certificate"

        issued_at = datetime.now(timezone.utc).isoformat()

        db = get_db()

        certificate_doc = {
            "certificate_id": uuid4().hex,
            "student_id": student_id,
            "student_name": student_name,
            "event_id": event_id,
            "event_name": event_name,
            "club_name": club_name,
            "certificate_image_url": certificate_image_url,
            "issued_by": issued_by,
            "issued_at": issued_at,
            "status": "Issued",
        }
        db.certificates.insert_one(certificate_doc)

        _insert_notification(
            db,
            student_id=student_id,
            title="Certificate Available",
            message=f"Your certificate for {event_name} is now available",
            notif_type="certificate",
            reference_id=event_id,
        )

        return (
            jsonify(
                {
                    "success": True,
                    "certificate_id": certificate_doc["certificate_id"],
                    "status": "Issued",
                }
            ),
            201,
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


def _find_attendance_by_id(db, attendance_id: str):
    attendance_id = (attendance_id or "").strip()
    if not attendance_id:
        return None

    # Prefer Mongo ObjectId when possible.
    if ObjectId is not None:
        try:
            if len(attendance_id) == 24:
                return db.attendances.find_one({"_id": ObjectId(attendance_id)})
        except Exception:
            pass

    # Fallback: support apps that store an explicit attendance_id.
    return db.attendances.find_one({"attendance_id": attendance_id})


def _attendance_public_doc(doc: dict) -> dict:
    # Frontend needs a stable string id.
    public_id = doc.get("attendance_id")
    if not public_id:
        public_id = str(doc.get("_id"))

    return {
        "attendance_id": public_id,
        "student_id": doc.get("student_id", ""),
        "student_name": doc.get("student_name", ""),
        "event_id": doc.get("event_id", ""),
        "event_name": doc.get("event_name", ""),
        "marked_at": doc.get("marked_at"),
        "status": doc.get("status") or "Pending",
    }


@admin_bp.get("/attendance")
def list_attendance_for_event():
    """Fetch attendance records for an event.

    GET /api/admin/attendance?event_id=<event_id>
    """

    try:
        event_id = (request.args.get("event_id") or "").strip()
        if not event_id:
            return jsonify({"error": "event_id query param is required"}), 400

        db = get_db()
        cursor = db.attendances.find({"event_id": event_id}).sort([("marked_at", -1)])
        records = [_attendance_public_doc(doc) for doc in cursor]
        return jsonify({"attendances": records}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@admin_bp.post("/attendance/<attendance_id>/approve")
def approve_attendance(attendance_id: str):
    """Approve an attendance record.

    POST /api/admin/attendance/{attendance_id}/approve
    """

    try:
        db = get_db()
        existing = _find_attendance_by_id(db, attendance_id)
        if not existing:
            return jsonify({"error": "Attendance record not found"}), 404

        db.attendances.update_one(
            {"_id": existing["_id"]},
            {"$set": {"status": "Approved"}},
        )
        updated = db.attendances.find_one({"_id": existing["_id"]})
        return jsonify({"success": True, "attendance": _attendance_public_doc(updated)}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@admin_bp.post("/attendance/<attendance_id>/reject")
def reject_attendance(attendance_id: str):
    """Reject an attendance record.

    POST /api/admin/attendance/{attendance_id}/reject
    """

    try:
        db = get_db()
        existing = _find_attendance_by_id(db, attendance_id)
        if not existing:
            return jsonify({"error": "Attendance record not found"}), 404

        db.attendances.update_one(
            {"_id": existing["_id"]},
            {"$set": {"status": "Rejected"}},
        )
        updated = db.attendances.find_one({"_id": existing["_id"]})
        return jsonify({"success": True, "attendance": _attendance_public_doc(updated)}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
