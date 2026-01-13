from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, jsonify, request, Response

try:
    from ..db import get_db
except ImportError:  # pragma: no cover
    from db import get_db


hostel_bp = Blueprint("hostel", __name__, url_prefix="/api/hostel")


def _serialize_hostel_permission(doc: dict) -> dict:
    out = {k: v for k, v in doc.items() if k != "_id"}
    if "_id" in doc:
        out["id"] = str(doc["_id"])
    return out


@hostel_bp.get("/hostel-permissions/<permission_id>/respond")
def respond_to_hostel_permission(permission_id: str):
    """Hostel-head response endpoint (link-based, no auth).

    Query params:
    - status: Approved | Rejected

    Returns a small HTML page for humans. Also supports JSON when Accept: application/json.
    """

    permission_id = (permission_id or "").strip()
    if not permission_id:
        return jsonify({"error": "permission_id is required"}), 400

    status = (request.args.get("status") or "").strip()
    if status not in {"Approved", "Rejected"}:
        return jsonify({"error": "status must be Approved or Rejected"}), 400

    try:
        db = get_db()
        responded_at = datetime.now(timezone.utc).isoformat()

        result = db.hostel_permissions.update_one(
            {"_id": permission_id},
            {"$set": {"status": status, "responded_at": responded_at}},
        )
        if result.matched_count == 0:
            return jsonify({"error": "hostel permission request not found"}), 404

        doc = db.hostel_permissions.find_one({"_id": permission_id})
        payload = {
            "success": True,
            "status": status,
            "responded_at": responded_at,
            "hostel_permission": _serialize_hostel_permission(doc or {"_id": permission_id, "status": status, "responded_at": responded_at}),
        }

        wants_json = "application/json" in (request.headers.get("Accept") or "")
        if wants_json:
            return jsonify(payload), 200

        html = f"""<!doctype html>
<html lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>Hostel Permission Updated</title>
    <style>
      body {{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; background: #0b1220; color: #e5e7eb; }}
      .card {{ max-width: 680px; margin: 0 auto; background: #0f172a; border: 1px solid #1f2937; border-radius: 18px; padding: 20px; }}
      .badge {{ display: inline-block; padding: 6px 10px; border-radius: 10px; font-weight: 700; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; }}
      .ok {{ background: rgba(16, 185, 129, .12); color: #34d399; border: 1px solid rgba(16, 185, 129, .25); }}
      .no {{ background: rgba(244, 63, 94, .12); color: #fb7185; border: 1px solid rgba(244, 63, 94, .25); }}
      .muted {{ color: #94a3b8; font-size: 13px; }}
      code {{ color: #cbd5e1; }}
    </style>
  </head>
  <body>
    <div class=\"card\">
      <h2 style=\"margin:0 0 8px\">Response recorded</h2>
      <div class=\"muted\">Permission ID: <code>{permission_id}</code></div>
      <div style=\"margin-top: 14px\">
        <span class=\"badge {'ok' if status == 'Approved' else 'no'}\">{status}</span>
      </div>
      <div class=\"muted\" style=\"margin-top: 14px\">You can close this tab. The FA portal will reflect the updated status shortly.</div>
    </div>
  </body>
</html>"""
        return Response(html, status=200, mimetype="text/html")

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
