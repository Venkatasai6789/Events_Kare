from __future__ import annotations

import os
from datetime import datetime, timezone
from uuid import uuid4

from flask import Blueprint, jsonify, request

try:
    from ..email_sender import send_email
except ImportError:  # pragma: no cover
    from email_sender import send_email

try:
    from ..db import get_db
except ImportError:  # pragma: no cover
    from db import get_db


hod_bp = Blueprint("hod", __name__, url_prefix="/api/fa")


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


def _require_bool(payload: dict, key: str) -> bool:
    value = payload.get(key)
    if value is None:
        raise ValueError(f"Missing field: {key}")
    if not isinstance(value, bool):
        raise ValueError(f"Field '{key}' must be a boolean")
    return value


def _optional_str(payload: dict, key: str, default: str = "") -> str:
    value = payload.get(key)
    if value is None:
        return default
    if not isinstance(value, str):
        raise ValueError(f"Field '{key}' must be a string")
    return value.strip() or default


def _require_email(payload: dict, key: str) -> str:
    value = _require_str(payload, key)
    # Minimal validation; no auth changes requested.
    if "@" not in value or value.startswith("@") or value.endswith("@"):
        raise ValueError(f"Field '{key}' must be a valid email")
    return value


def _serialize_hostel_permission(doc: dict) -> dict:
    out = {k: v for k, v in doc.items() if k != "_id"}
    if "_id" in doc:
        out["id"] = str(doc["_id"])
    return out


def _ensure_hostel_permissions_indexes(db) -> None:
    try:
        db.hostel_permissions.create_index("student_id")
        db.hostel_permissions.create_index("status")
        db.hostel_permissions.create_index("section")
        db.hostel_permissions.create_index([("requested_at", -1)])
    except Exception:
        # Index creation is best-effort; shouldn't block requests.
        pass


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


@hod_bp.get("/hostel-permissions")
def list_hostel_permissions():
    """List hostel permission requests (FA view).

    Optional query params:
    - status: Pending | Approved | Rejected
    - section
    - student_id
    """

    try:
        db = get_db()
        _ensure_hostel_permissions_indexes(db)

        query: dict = {}
        status = request.args.get("status")
        section = request.args.get("section")
        student_id = request.args.get("student_id")

        if status:
            status = status.strip()
            if status not in {"Pending", "Approved", "Rejected"}:
                return jsonify({"error": "status must be Pending, Approved, or Rejected"}), 400
            query["status"] = status
        if section:
            query["section"] = section.strip()
        if student_id:
            query["student_id"] = student_id.strip()

        cursor = db.hostel_permissions.find(query).sort(
            [("requested_at", -1), ("responded_at", -1)]
        )
        return jsonify({"hostel_permissions": [_serialize_hostel_permission(d) for d in cursor]}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@hod_bp.post("/hostel-permissions/<permission_id>/send")
def send_hostel_permission_to_head(permission_id: str):
    """Mark a permission request as sent by FA to the hostel head.

    This does not change approval status; it only records requested_by_fa/requested_at.
    """

    try:
        permission_id = (permission_id or "").strip()
        if not permission_id:
            return jsonify({"error": "permission_id is required"}), 400

        db = get_db()
        _ensure_hostel_permissions_indexes(db)

        doc = db.hostel_permissions.find_one({"_id": permission_id})
        if not doc:
            return jsonify({"error": "hostel permission request not found"}), 404

        now = datetime.now(timezone.utc).isoformat()

        db.hostel_permissions.update_one(
            {"_id": permission_id},
            {"$set": {"requested_by_fa": True, "requested_at": now}},
        )

        # Build link-based approval URLs (dummy/simple; no auth as per project constraints).
        public_base = (request.headers.get("X-Public-Base") or "").strip()
        if not public_base:
            public_base = (os.getenv("PUBLIC_BASE_URL") or "").strip()
        if not public_base:
            public_base = (request.host_url or "").rstrip("/")

        approve_url = f"{public_base}/api/hostel/hostel-permissions/{permission_id}/respond?status=Approved"
        reject_url = f"{public_base}/api/hostel/hostel-permissions/{permission_id}/respond?status=Rejected"

        hostel_head_email = (doc.get("hostel_head_email") or "").strip()
        email_result = {"sent": False, "provider": "dummy", "error": "hostel_head_email missing"}

        if hostel_head_email:
            student_name = doc.get("student_name") or "Student"
            student_id = doc.get("student_id") or ""
            event_name = doc.get("event_name") or "Event"
            event_date = doc.get("event_date") or ""
            section = doc.get("section") or ""
            hostel_name = doc.get("hostel_name") or ""
            duration = doc.get("duration") or ""

            subject = f"Hostel Permission Request: {student_name} ({event_name})"

            body_text = (
                "A hostel permission request has been sent by FA.\n\n"
                f"Student: {student_name} ({student_id})\n"
                f"Section: {section}\n"
                f"Event: {event_name}\n"
                f"Event Date: {event_date}\n"
                f"Duration: {duration}\n"
                f"Hostel: {hostel_name}\n\n"
                "Respond using one of these links:\n"
                f"Approve: {approve_url}\n"
                f"Reject: {reject_url}\n"
            )

            body_html = f"""<div style='font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial'>
  <h2 style='margin:0 0 10px'>Hostel Permission Request</h2>
  <p style='margin:0 0 8px'>A hostel permission request has been sent by FA.</p>
  <ul>
    <li><b>Student:</b> {student_name} ({student_id})</li>
    <li><b>Section:</b> {section}</li>
    <li><b>Event:</b> {event_name}</li>
    <li><b>Event Date:</b> {event_date}</li>
    <li><b>Duration:</b> {duration}</li>
    <li><b>Hostel:</b> {hostel_name}</li>
  </ul>
  <p>
    <a href='{approve_url}' style='display:inline-block;padding:10px 14px;border-radius:10px;background:#10b981;color:white;text-decoration:none;font-weight:700'>Approve</a>
    <a href='{reject_url}' style='display:inline-block;padding:10px 14px;border-radius:10px;background:#f43f5e;color:white;text-decoration:none;font-weight:700;margin-left:8px'>Reject</a>
  </p>
</div>"""

            email_result = send_email(
                to_email=hostel_head_email,
                subject=subject,
                body_text=body_text,
                body_html=body_html,
            )

        return (
            jsonify(
                {
                    "success": True,
                    "requested_by_fa": True,
                    "requested_at": now,
                    "email": email_result,
                    "approval_links": {"approve": approve_url, "reject": reject_url},
                }
            ),
            200,
        )
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@hod_bp.patch("/hostel-permissions/<permission_id>/status")
def update_hostel_permission_status(permission_id: str):
    """Update approval status for a hostel permission request.

    No auth is enforced (per project constraints). Intended for hostel-head tooling.
    Body JSON:
    - status: Pending | Approved | Rejected
    """

    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    payload = request.get_json(silent=True) or {}

    try:
        permission_id = (permission_id or "").strip()
        if not permission_id:
            return jsonify({"error": "permission_id is required"}), 400

        status = _require_str(payload, "status")
        if status not in {"Pending", "Approved", "Rejected"}:
            return jsonify({"error": "status must be Pending, Approved, or Rejected"}), 400

        db = get_db()
        _ensure_hostel_permissions_indexes(db)

        update: dict = {"status": status}
        if status in {"Approved", "Rejected"}:
            update["responded_at"] = datetime.now(timezone.utc).isoformat()
        else:
            update["responded_at"] = None

        result = db.hostel_permissions.update_one(
            {"_id": permission_id},
            {"$set": update},
        )
        if result.matched_count == 0:
            return jsonify({"error": "hostel permission request not found"}), 404

        return jsonify({"success": True, "status": status, "responded_at": update.get("responded_at")}), 200
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
