from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash

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


@api.post("/api/login")
def login():
	"""Authenticate a user using MongoDB stored password hash.

	Expected JSON body:
	{
		"user_id": "...",
		"password": "..."
	}
	"""

	if not request.is_json:
		return jsonify({"error": "Request body must be JSON"}), 400

	payload = request.get_json(silent=True) or {}
	user_id = payload.get("user_id")
	password = payload.get("password")

	if not (isinstance(user_id, str) and user_id.strip()):
		return jsonify({"error": "user_id is required"}), 400
	if not (isinstance(password, str) and password.strip()):
		return jsonify({"error": "password is required"}), 400

	user_id = user_id.strip()

	try:
		db = get_db()
		user = db.users.find_one({"user_id": user_id}, {"_id": 0})
		if not user:
			return jsonify({"error": "Invalid credentials"}), 401

		stored_hash = user.get("password")
		if not (isinstance(stored_hash, str) and stored_hash):
			return jsonify({"error": "Invalid credentials"}), 401

		if not check_password_hash(stored_hash, password):
			return jsonify({"error": "Invalid credentials"}), 401

		return (
			jsonify(
				{
					"user_id": user.get("user_id"),
					"name": user.get("name"),
					"role": user.get("role"),
					"department": user.get("department"),
					"section": user.get("section"),
				}
			),
			200,
		)
	except Exception as exc:
		return jsonify({"error": str(exc)}), 500
