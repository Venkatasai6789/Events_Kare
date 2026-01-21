import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    load_dotenv = None

try:
    from .api import api
except ImportError:  # pragma: no cover
    from api import api

try:
    from .routes.admin import admin_bp
    from .routes.student import student_bp
    from .routes.hod import hod_bp
    from .routes.hostel import hostel_bp
    from .routes.auth import auth_bp
except ImportError:  # pragma: no cover
    from routes.admin import admin_bp
    from routes.student import student_bp
    from routes.hod import hod_bp
    from routes.hostel import hostel_bp
    from routes.auth import auth_bp


def create_app() -> Flask:
    if load_dotenv is not None:
        load_dotenv()

    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = (
        os.getenv("JWT_SECRET_KEY")
        or os.getenv("FLASK_SECRET_KEY")
        or os.getenv("SECRET_KEY")
        or os.urandom(32).hex()
    )

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

    jwt = JWTManager(app)

    # Ensure missing/invalid JWTs produce 401 responses.
    # (Student routes also enforce role-based access.)
    @jwt.unauthorized_loader
    def _jwt_missing_token(_reason: str):
        return jsonify({"error": "Unauthorized"}), 401

    @jwt.invalid_token_loader
    def _jwt_invalid_token(_reason: str):
        return jsonify({"error": "Unauthorized"}), 401

    @jwt.expired_token_loader
    def _jwt_expired_token(_jwt_header, _jwt_payload):
        return jsonify({"error": "Unauthorized"}), 401

    @jwt.revoked_token_loader
    def _jwt_revoked_token(_jwt_header, _jwt_payload):
        return jsonify({"error": "Unauthorized"}), 401

    CORS(app)
    app.register_blueprint(api)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(hod_bp)
    app.register_blueprint(hostel_bp)
    return app


app = create_app()


if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(debug=debug, host=os.getenv("FLASK_HOST", "127.0.0.1"), port=int(os.getenv("FLASK_PORT", "5000")))
