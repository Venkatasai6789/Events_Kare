import os

from flask import Flask
from flask_cors import CORS

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
    app = Flask(__name__)
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
