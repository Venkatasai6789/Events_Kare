from flask import Blueprint, jsonify

try:
	from .db import get_db, ping
except ImportError:  # pragma: no cover
	from db import get_db, ping

api = Blueprint("api", __name__)


@api.get("/")
def home():
	return jsonify({"message": "Flask server running"})


@api.get("/health")
def health():
	return jsonify({"status": "ok"})


@api.get("/db-status")
def db_status():
	try:
		ping()
		return jsonify({"db": "connected"})
	except Exception as exc:
		return jsonify({"db": "disconnected", "error": str(exc)}), 500


@api.get("/test-db")
def test_db():
	try:
		db = get_db()
		db.test.insert_one({"status": "DB Connected"})
		data = db.test.find_one({}, {"_id": 0})
		return jsonify(data or {"status": "DB Connected"})
	except Exception as exc:
		return jsonify({"error": str(exc)}), 500
