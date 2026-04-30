"""
FastAPI backend for Sylvana Hotel.

Auth note: This API does NOT implement application-level auth for the admin
endpoints. Admin routes (anything under /api/admin/*) are intended to be
protected at the reverse-proxy layer (Nginx Basic Auth). When you run the
API behind Nginx, the proxy will require credentials before any request can
reach these endpoints.
"""
import os
import shutil
import uuid
from pathlib import Path
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import storage
from .seed import seed_if_empty
from .models import (
    Room, RoomCreate,
    Article, ArticleCreate,
    Promo, PromoCreate,
    Photo, PhotoCreate,
    Activity, ActivityCreate,
    Reservation, ReservationCreate,
)

# ---------- App setup ----------
app = FastAPI(title="Sylvana Hotel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tightened in production via Nginx
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static uploads directory (served at /uploads/*)
UPLOADS_DIR = Path(os.getenv("UPLOADS_DIR", "./uploads"))
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.on_event("startup")
def startup():
    seed_if_empty()


@app.get("/api/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}


# =================================================================
# PUBLIC ENDPOINTS  (read-only)
# =================================================================

@app.get("/api/rooms", response_model=List[Room])
def list_rooms():
    return storage.load("rooms")


@app.get("/api/rooms/{room_id}", response_model=Room)
def get_room(room_id: str):
    item = storage.get("rooms", room_id)
    if not item:
        raise HTTPException(404, "Room not found")
    return item


@app.get("/api/articles", response_model=List[Article])
def list_articles():
    items = storage.load("articles")
    return sorted(items, key=lambda a: a.get("created_at", ""), reverse=True)


@app.get("/api/articles/{article_id}", response_model=Article)
def get_article(article_id: str):
    item = storage.get("articles", article_id)
    if not item:
        raise HTTPException(404, "Article not found")
    return item


@app.get("/api/promos", response_model=List[Promo])
def list_promos(active_only: bool = True):
    items = storage.load("promos")
    if active_only:
        items = [p for p in items if p.get("active", True)]
    return items


@app.get("/api/photos", response_model=List[Photo])
def list_photos(category: str | None = None):
    items = storage.load("photos")
    if category:
        items = [p for p in items if p.get("category") == category]
    return items


@app.get("/api/activities", response_model=List[Activity])
def list_activities():
    items = storage.load("activities")
    return sorted(items, key=lambda a: a.get("order", 0))


@app.post("/api/reservations", response_model=Reservation)
def create_reservation(payload: ReservationCreate):
    room = storage.get("rooms", payload.room_id)
    if not room:
        raise HTTPException(404, "Room not found")

    try:
        d_in = datetime.fromisoformat(payload.check_in)
        d_out = datetime.fromisoformat(payload.check_out)
    except ValueError:
        raise HTTPException(400, "Invalid date format")

    nights = max(1, (d_out - d_in).days)
    subtotal = room["price"] * nights
    total = round(subtotal * 1.1, 2)  # +10% taxes

    reservation = Reservation(
        **payload.model_dump(),
        nights=nights,
        total=total,
    )
    storage.insert("reservations", reservation.model_dump())
    return reservation


# =================================================================
# ADMIN ENDPOINTS  (protected by Nginx Basic Auth)
# =================================================================

# ---------- Rooms ----------
@app.post("/api/admin/rooms", response_model=Room)
def admin_create_room(payload: RoomCreate):
    room = Room(**payload.model_dump())
    storage.insert("rooms", room.model_dump())
    return room


@app.put("/api/admin/rooms/{room_id}", response_model=Room)
def admin_update_room(room_id: str, payload: RoomCreate):
    updated = storage.update("rooms", room_id, payload.model_dump())
    if not updated:
        raise HTTPException(404, "Room not found")
    return updated


@app.delete("/api/admin/rooms/{room_id}")
def admin_delete_room(room_id: str):
    if not storage.delete("rooms", room_id):
        raise HTTPException(404, "Room not found")
    return {"deleted": True}


# ---------- Articles ----------
@app.post("/api/admin/articles", response_model=Article)
def admin_create_article(payload: ArticleCreate):
    art = Article(**payload.model_dump())
    storage.insert("articles", art.model_dump())
    return art


@app.put("/api/admin/articles/{article_id}", response_model=Article)
def admin_update_article(article_id: str, payload: ArticleCreate):
    updated = storage.update("articles", article_id, payload.model_dump())
    if not updated:
        raise HTTPException(404, "Article not found")
    return updated


@app.delete("/api/admin/articles/{article_id}")
def admin_delete_article(article_id: str):
    if not storage.delete("articles", article_id):
        raise HTTPException(404, "Article not found")
    return {"deleted": True}


# ---------- Promos ----------
@app.post("/api/admin/promos", response_model=Promo)
def admin_create_promo(payload: PromoCreate):
    promo = Promo(**payload.model_dump())
    storage.insert("promos", promo.model_dump())
    return promo


@app.put("/api/admin/promos/{promo_id}", response_model=Promo)
def admin_update_promo(promo_id: str, payload: PromoCreate):
    updated = storage.update("promos", promo_id, payload.model_dump())
    if not updated:
        raise HTTPException(404, "Promo not found")
    return updated


@app.delete("/api/admin/promos/{promo_id}")
def admin_delete_promo(promo_id: str):
    if not storage.delete("promos", promo_id):
        raise HTTPException(404, "Promo not found")
    return {"deleted": True}


# ---------- Photos / Uploads ----------
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


@app.post("/api/admin/upload")
async def admin_upload(file: UploadFile = File(...)):
    """Upload an image. Returns a URL that can be used in image fields."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Extension {ext} not allowed")

    name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOADS_DIR / name
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"url": f"/uploads/{name}", "filename": name}


@app.post("/api/admin/photos", response_model=Photo)
def admin_create_photo(payload: PhotoCreate):
    photo = Photo(**payload.model_dump())
    storage.insert("photos", photo.model_dump())
    return photo


@app.put("/api/admin/photos/{photo_id}", response_model=Photo)
def admin_update_photo(photo_id: str, payload: PhotoCreate):
    updated = storage.update("photos", photo_id, payload.model_dump())
    if not updated:
        raise HTTPException(404, "Photo not found")
    return updated


@app.delete("/api/admin/photos/{photo_id}")
def admin_delete_photo(photo_id: str):
    photo = storage.get("photos", photo_id)
    if not photo:
        raise HTTPException(404, "Photo not found")
    # Best-effort delete of the file if it lives in /uploads
    url = photo.get("url", "")
    if url.startswith("/uploads/"):
        try:
            (UPLOADS_DIR / url.split("/uploads/")[1]).unlink(missing_ok=True)
        except Exception:
            pass
    storage.delete("photos", photo_id)
    return {"deleted": True}


# ---------- Activities ----------
@app.post("/api/admin/activities", response_model=Activity)
def admin_create_activity(payload: ActivityCreate):
    item = Activity(**payload.model_dump())
    storage.insert("activities", item.model_dump())
    return item


@app.put("/api/admin/activities/{activity_id}", response_model=Activity)
def admin_update_activity(activity_id: str, payload: ActivityCreate):
    updated = storage.update("activities", activity_id, payload.model_dump())
    if not updated:
        raise HTTPException(404, "Activity not found")
    return updated


@app.delete("/api/admin/activities/{activity_id}")
def admin_delete_activity(activity_id: str):
    if not storage.delete("activities", activity_id):
        raise HTTPException(404, "Activity not found")
    return {"deleted": True}


# ---------- Reservations (admin view) ----------
@app.get("/api/admin/reservations", response_model=List[Reservation])
def admin_list_reservations():
    items = storage.load("reservations")
    return sorted(items, key=lambda r: r.get("created_at", ""), reverse=True)


@app.delete("/api/admin/reservations/{reservation_id}")
def admin_delete_reservation(reservation_id: str):
    if not storage.delete("reservations", reservation_id):
        raise HTTPException(404, "Reservation not found")
    return {"deleted": True}


# ---------- Admin info (echo authenticated user from Nginx) ----------
@app.get("/api/admin/me")
def admin_me(x_remote_user: str | None = Header(default=None)):
    """Echoes the user authenticated by the upstream Nginx proxy."""
    return {"user": x_remote_user or "admin", "authenticated": True}
