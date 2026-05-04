from __future__ import annotations
import os
from pathlib import Path

# Try to import SQLAlchemy; if unavailable or incompatible with the current
# Python runtime, provide safe fallbacks so the application can still run
# using the JSON storage layer.
_HAS_SQLALCHEMY = True
try:
    from sqlalchemy import (
        create_engine, MetaData, Table, Column, String, Integer, Text, DateTime,
        Boolean, Numeric, JSON, Date, func
    )
    from sqlalchemy.engine import Engine
    from sqlalchemy.orm import sessionmaker

    # Read DB url from environment. If not provided, fall back to a local SQLite
    # database inside the backend folder so the project works out-of-the-box
    # without a running MySQL server.
    default_sqlite = f"sqlite:///{(Path(__file__).resolve().parent.parent / 'data' / 'Fanja.db').as_posix()}"
    DB_URL = os.getenv("DATABASE_URL", default_sqlite)

    # Create engine and session factory. For SQLite we must pass `connect_args`.
    connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite:") else {}
    engine: Engine = create_engine(DB_URL, future=True, connect_args=connect_args)
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

    metadata = MetaData()

    # Tables definitions (kept minimal and matching models.py)
    rooms = Table(
        "rooms",
        metadata,
        Column("id", String(32), primary_key=True),
        Column("name", Text, nullable=False),
        Column("type", String(128), nullable=False),
        Column("price", Numeric(10, 2), nullable=False),
        Column("capacity", Integer, nullable=False),
        Column("size", Integer, nullable=False),
        Column("image", Text, nullable=False),
        Column("description", Text, nullable=False),
        Column("amenities", JSON, nullable=False),
        Column("created_at", DateTime, server_default=func.now()),
    )

    articles = Table(
        "articles",
        metadata,
        Column("id", String(32), primary_key=True),
        Column("title", Text, nullable=False),
        Column("excerpt", Text, nullable=False),
        Column("content", Text, nullable=False),
        Column("image", Text, nullable=False),
        Column("author", String(200), nullable=False),
        Column("category", String(128), nullable=False),
        Column("created_at", DateTime, nullable=False),
    )

    promos = Table(
        "promos",
        metadata,
        Column("id", String(32), primary_key=True),
        Column("title", Text, nullable=False),
        Column("description", Text, nullable=False),
        Column("discount_percent", Integer, nullable=False),
        Column("valid_until", Date, nullable=False),
        Column("image", Text, nullable=True),
        Column("active", Boolean, nullable=False, server_default="1"),
    )

    photos = Table(
        "photos",
        metadata,
        Column("id", String(32), primary_key=True),
        Column("url", Text, nullable=False),
        Column("caption", Text, nullable=True),
        Column("category", String(128), nullable=False),
        Column("uploaded_at", DateTime, nullable=False, server_default=func.now()),
    )

    activities = Table(
        "activities",
        metadata,
        Column("id", String(32), primary_key=True),
        Column("title", Text, nullable=False),
        Column("description", Text, nullable=False),
        Column("icon", String(16), nullable=True),
        Column("image", Text, nullable=True),
        Column("featured", Boolean, nullable=False, server_default="0"),
        Column("order", Integer, nullable=False, server_default="0"),
    )

    reservations = Table(
        "reservations",
        metadata,
        Column("id", String(32), primary_key=True),
        Column("room_id", String(32), nullable=False),
        Column("check_in", Date, nullable=False),
        Column("check_out", Date, nullable=False),
        Column("guests", Integer, nullable=False),
        Column("name", Text, nullable=False),
        Column("email", String(320), nullable=False),
        Column("phone", String(64), nullable=False),
        Column("notes", Text, nullable=True),
        Column("booking_number", String(64), nullable=False),
        Column("total", Numeric(10, 2), nullable=False, server_default="0"),
        Column("nights", Integer, nullable=False, server_default="1"),
        Column("status", String(64), nullable=False, server_default="pending"),
        Column("created_at", DateTime, nullable=False),
    )


    def init_db():
        """Create tables in the database. Call at startup if desired."""
        metadata.create_all(bind=engine)

    __all__ = [
        "engine",
        "SessionLocal",
        "metadata",
        "rooms",
        "articles",
        "promos",
        "photos",
        "activities",
        "reservations",
        "init_db",
    ]
except Exception:
    # SQLAlchemy not available / incompatible — provide no-op fallbacks so the
    # rest of the application (which uses JSON fallback storage) can operate.
    _HAS_SQLALCHEMY = False
    DB_URL = None
    engine = None

    class _DummySession:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

    def SessionLocal():
        return _DummySession()

    def init_db():
        return None

    # Placeholder names to avoid import-time AttributeError in other modules
    metadata = None
    rooms = articles = promos = photos = activities = reservations = None

    __all__ = [
        "engine",
        "SessionLocal",
        "metadata",
        "rooms",
        "articles",
        "promos",
        "photos",
        "activities",
        "reservations",
        "init_db",
    ]
