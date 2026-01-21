import os
from typing import Optional

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.database import Database

load_dotenv()

_client: Optional[MongoClient] = None


def _get_mongo_uri() -> str:
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set. Add it to your environment or .env file.")
    return mongo_uri


def _get_mongo_client_options() -> dict:
    # Fail fast by default; override via env if needed.
    def _int_env(name: str, default: int) -> int:
        value = os.getenv(name)
        if value is None or value.strip() == "":
            return default
        return int(value)

    return {
        "connectTimeoutMS": _int_env("MONGO_CONNECT_TIMEOUT_MS", 5_000),
        "serverSelectionTimeoutMS": _int_env("MONGO_SERVER_SELECTION_TIMEOUT_MS", 5_000),
        "socketTimeoutMS": _int_env("MONGO_SOCKET_TIMEOUT_MS", 10_000),
    }


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(_get_mongo_uri(), **_get_mongo_client_options())
    return _client


def get_db() -> Database:
    db_name = os.getenv("MONGO_DB_NAME", "campus_connect")
    return get_client()[db_name]


def ping() -> dict:
    client = get_client()
    client.admin.command("ping")
    return {"ok": True}


def close_client() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None


class _LazyDB:
    def __getattr__(self, item):
        return getattr(get_db(), item)

    def __getitem__(self, item):
        return get_db()[item]


# Backwards compatible handle for code that expects `db`.
db = _LazyDB()