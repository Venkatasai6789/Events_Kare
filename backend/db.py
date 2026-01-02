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


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(_get_mongo_uri())
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