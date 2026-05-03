from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid


def gen_id() -> str:
    return uuid.uuid4().hex[:12]


def now_iso() -> str:
    return datetime.utcnow().isoformat()


# ---------- Rooms ----------
class RoomBase(BaseModel):
    name: str
    type: str
    price: float
    capacity: int
    size: int
    image: str
    description: str
    amenities: List[str] = []


class RoomCreate(RoomBase):
    pass


class Room(RoomBase):
    id: str = Field(default_factory=gen_id)


# ---------- Articles (blog) ----------
class ArticleBase(BaseModel):
    title: str
    excerpt: str
    content: str
    image: str
    author: str = "Équipe Fanja"
    category: str = "Nature"


class ArticleCreate(ArticleBase):
    pass


class Article(ArticleBase):
    id: str = Field(default_factory=gen_id)
    created_at: str = Field(default_factory=now_iso)


# ---------- Promotions ----------
class PromoBase(BaseModel):
    title: str
    description: str
    discount_percent: int
    valid_until: str  # ISO date
    image: Optional[str] = None
    active: bool = True


class PromoCreate(PromoBase):
    pass


class Promo(PromoBase):
    id: str = Field(default_factory=gen_id)


# ---------- Photos (gallery) ----------
class PhotoBase(BaseModel):
    url: str
    caption: Optional[str] = ""
    category: str = "general"


class PhotoCreate(PhotoBase):
    pass


class Photo(PhotoBase):
    id: str = Field(default_factory=gen_id)
    uploaded_at: str = Field(default_factory=now_iso)


# ---------- Activities ----------
class ActivityBase(BaseModel):
    title: str
    description: str
    icon: str = "🌿"            # emoji icon
    image: Optional[str] = None  # optional cover for "featured" activities
    featured: bool = False       # featured -> shown as a big card on the public site
    order: int = 0               # display order


class ActivityCreate(ActivityBase):
    pass


class Activity(ActivityBase):
    id: str = Field(default_factory=gen_id)


# ---------- Reservations ----------
class ReservationCreate(BaseModel):
    room_id: str
    check_in: str
    check_out: str
    guests: int
    name: str
    email: EmailStr
    phone: str
    notes: Optional[str] = ""


class Reservation(ReservationCreate):
    id: str = Field(default_factory=gen_id)
    booking_number: str = Field(default_factory=lambda: f"SYL-{uuid.uuid4().hex[:5].upper()}")
    total: float = 0
    nights: int = 1
    # New reservations are initially pending and require admin confirmation
    status: str = "pending"
    created_at: str = Field(default_factory=now_iso)
