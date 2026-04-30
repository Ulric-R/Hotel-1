"""Simple JSON-file persistence layer. Thread-safe enough for a small site."""
import json
import os
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List

DATA_DIR = Path(os.getenv("DATA_DIR", "./data"))
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


def update(name: str, item_id: str, patch: Dict[str, Any]) -> Dict[str, Any] | None:
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


def get(name: str, item_id: str) -> Dict[str, Any] | None:
    for it in load(name):
        if it.get("id") == item_id:
            return it
    return None
