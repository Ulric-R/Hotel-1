"""SQL-backed persistence layer using SQLAlchemy Core.

This keeps the same API as the original JSON `storage.py` so the rest of
the application can continue to call `load`, `get`, `insert`, `update` and
`delete` with minimal changes.
"""
from typing import Any, Dict, List, Optional
from datetime import datetime

# Try to use SQLAlchemy-backed storage; if SQLAlchemy fails to import or
# initialize (some Python versions may be incompatible), fall back to the
# original JSON-file storage to keep the app runnable.
_USE_SQLALCHEMY = True
try:
    from sqlalchemy import select, insert as sa_insert, update as sa_update, delete as sa_delete
    from app import db

    TABLES = {
        "rooms": db.rooms,
        "articles": db.articles,
        "promos": db.promos,
        "photos": db.photos,
        "activities": db.activities,
        "reservations": db.reservations,
    }


    def _table(name: str):
        t = TABLES.get(name)
        if t is None:
            raise ValueError(f"Unknown storage table: {name}")
        return t


    def load(name: str) -> List[Dict[str, Any]]:
        t = _table(name)
        with db.SessionLocal() as session:
            stmt = select(t)
            res = session.execute(stmt)
            rows = [dict(r._mapping) for r in res]
        # convert datetimes to ISO strings where applicable
        for r in rows:
            for k, v in list(r.items()):
                if isinstance(v, datetime):
                    r[k] = v.isoformat()
        return rows


    def get(name: str, item_id: str) -> Optional[Dict[str, Any]]:
        t = _table(name)
        with db.SessionLocal() as session:
            stmt = select(t).where(t.c.id == item_id)
            res = session.execute(stmt).first()
            if not res:
                return None
            row = dict(res._mapping)
        for k, v in list(row.items()):
            if isinstance(v, datetime):
                row[k] = v.isoformat()
        return row


    def insert(name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        t = _table(name)
        # Coerce common date/datetime strings to Python objects for DB drivers
        def _coerce(table, data: Dict[str, Any]):
            from datetime import datetime, date
            out = dict(data)
            for k in ("created_at", "uploaded_at"):
                if k in out and isinstance(out[k], str):
                    try:
                        out[k] = datetime.fromisoformat(out[k])
                    except Exception:
                        pass
            for k in ("valid_until", "check_in", "check_out"):
                if k in out and isinstance(out[k], str):
                    try:
                        out[k] = date.fromisoformat(out[k])
                    except Exception:
                        pass
            return out

        with db.SessionLocal() as session:
            stmt = sa_insert(t).values(**_coerce(t, item))
            session.execute(stmt)
            session.commit()
        return item


    def update(name: str, item_id: str, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        t = _table(name)
        # Coerce dates for update as well
        def _coerce_update(data: Dict[str, Any]):
            from datetime import datetime, date
            out = dict(data)
            for k in ("created_at", "uploaded_at"):
                if k in out and isinstance(out[k], str):
                    try:
                        out[k] = datetime.fromisoformat(out[k])
                    except Exception:
                        pass
            for k in ("valid_until", "check_in", "check_out"):
                if k in out and isinstance(out[k], str):
                    try:
                        out[k] = date.fromisoformat(out[k])
                    except Exception:
                        pass
            return out

        with db.SessionLocal() as session:
            stmt = sa_update(t).where(t.c.id == item_id).values(**_coerce_update(patch))
            res = session.execute(stmt)
            session.commit()
            if res.rowcount == 0:
                return None
            stmt2 = select(t).where(t.c.id == item_id)
            r = session.execute(stmt2).first()
            row = dict(r._mapping) if r else None
        if row:
            for k, v in list(row.items()):
                if isinstance(v, datetime):
                    row[k] = v.isoformat()
        return row


    def delete(name: str, item_id: str) -> bool:
        t = _table(name)
        with db.SessionLocal() as session:
            stmt = sa_delete(t).where(t.c.id == item_id)
            res = session.execute(stmt)
            session.commit()
            return res.rowcount > 0

except Exception:
    # Fallback to original JSON-file storage if SQLAlchemy fails to initialize.
    _USE_SQLALCHEMY = False
    import json
    import os
    from pathlib import Path
    from threading import Lock

    DATA_DIR = Path(os.getenv("DATA_DIR", Path(__file__).resolve().parent.parent / "data"))
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    _locks: Dict[str, Lock] = {}


    def _lock(name: str) -> Lock:
        if name not in _locks:
            _locks[name] = Lock()
        return _locks[name]


    def _path(name: str) -> Path:
        return DATA_DIR / f"{name}.json"


    def load(name: str) -> List[Dict[str, Any]]:
        p = _path(name)
        if not p.exists():
            return []
        try:
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            return []


    def save(name: str, items: List[Dict[str, Any]]) -> None:
        with _lock(name):
            with open(_path(name), "w", encoding="utf-8") as f:
                json.dump(items, f, indent=2, ensure_ascii=False)


    def insert(name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        items = load(name)
        items.append(item)
        save(name, items)
        return item


    def update(name: str, item_id: str, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        items = load(name)
        for i, it in enumerate(items):
            if it.get("id") == item_id:
                items[i] = {**it, **patch}
                save(name, items)
                return items[i]
        return None


    def delete(name: str, item_id: str) -> bool:
        items = load(name)
        new_items = [it for it in items if it.get("id") != item_id]
        if len(new_items) == len(items):
            return False
        save(name, new_items)
        return True


    def get(name: str, item_id: str) -> Optional[Dict[str, Any]]:
        for it in load(name):
            if it.get("id") == item_id:
                return it
        return None

