"""Seed initial data on first run."""
from app import storage
from app import db

INITIAL_ACTIVITIES = [
    # Two "featured" big cards
    {
        "id": "act-spa",
        "title": "Spa & Bien-être",
        "description": "Bain nordique en plein air, sauna finlandais et massages aux huiles essentielles de la forêt.",
        "icon": "♨️",
        "image": "/images/spa.jpg",
        "featured": True,
        "order": 1,
    },
    {
        "id": "act-resto",
        "title": "Table Forestière",
        "description": "Cuisine de saison signée par notre chef, avec des produits cueillis chaque matin.",
        "icon": "🍽️",
        "image": "/images/restaurant.jpg",
        "featured": True,
        "order": 2,
    },
    # Small "icon tile" activities
    {"id": "act-1", "title": "Randonnées guidées", "description": "Sentiers balisés avec un guide naturaliste.", "icon": "🥾", "featured": False, "order": 10},
    {"id": "act-2", "title": "Yoga en forêt", "description": "Sessions matinales au cœur des arbres.", "icon": "🧘", "featured": False, "order": 11},
    {"id": "act-3", "title": "VTT électrique", "description": "Location de vélos pour explorer le domaine.", "icon": "🚴", "featured": False, "order": 12},
    {"id": "act-4", "title": "Observation faune", "description": "Affût photo et jumelles fournies.", "icon": "🦌", "featured": False, "order": 13},
    {"id": "act-5", "title": "Soirées au feu", "description": "Histoires et marshmallows autour du brasero.", "icon": "🔥", "featured": False, "order": 14},
    {"id": "act-6", "title": "Bain de canopée", "description": "Méditation suspendue dans les arbres.", "icon": "⭐", "featured": False, "order": 15},
]



INITIAL_ROOMS = [
    {
        "id": "cabin-pine",
        "name": "Cabane des Pins",
        "type": "Cabane Romantique",
        "price": 189,
        "capacity": 2,
        "size": 32,
        "image": "/images/room-cabin.jpg",
        "description": "Une cabane intimiste en bois massif avec cheminée et vue plongeante sur la forêt de pins. Idéale pour une escapade en amoureux.",
        "amenities": ["Cheminée", "Lit King-Size", "Wi-Fi", "Petit-déjeuner inclus", "Terrasse privée"],
    },
    {
        "id": "suite-foret",
        "name": "Suite Forêt",
        "type": "Suite Premium",
        "price": 289,
        "capacity": 3,
        "size": 55,
        "image": "/images/room-suite.jpg",
        "description": "Une suite spacieuse avec baignoire en îlot, fenêtres panoramiques et accès direct au sentier de randonnée.",
        "amenities": ["Baignoire en îlot", "Vue panoramique", "Mini-bar", "Service en chambre", "Spa privatif"],
    },
    {
        "id": "treehouse",
        "name": "Cabane dans les Arbres",
        "type": "Expérience Unique",
        "price": 349,
        "capacity": 2,
        "size": 40,
        "image": "/images/room-treehouse.jpg",
        "description": "Suspendue à 8 mètres au-dessus du sol, cette cabane offre une immersion totale dans la canopée.",
        "amenities": ["Vue canopée", "Terrasse 360°", "Petit-déjeuner livré", "Lanternes", "Hamac suspendu"],
    },
]

INITIAL_ARTICLES = [
    {
        "id": "art-1",
        "title": "L'art du bain de forêt",
        "excerpt": "Découvrez le shinrin-yoku, cette pratique japonaise qui invite à se reconnecter à la nature.",
        "content": "Le shinrin-yoku, ou bain de forêt, est bien plus qu'une simple promenade. C'est une immersion sensorielle complète...",
        "image": "/images/hero.jpg",
        "author": "Marie Dubois",
        "category": "Bien-être",
        "created_at": "2026-01-15T10:00:00",
    },
    {
        "id": "art-2",
        "title": "Cuisine de saison : automne en forêt",
        "excerpt": "Notre chef partage sa philosophie de la cuisine forestière et ses produits du moment.",
        "content": "L'automne est une saison généreuse en forêt. Champignons, châtaignes, baies sauvages...",
        "image": "/images/restaurant.jpg",
        "author": "Chef Laurent",
        "category": "Gastronomie",
        "created_at": "2026-02-03T14:30:00",
    },
]

INITIAL_PROMOS = [
    {
        "id": "promo-1",
        "title": "Escapade hivernale",
        "description": "2 nuits offertes pour toute réservation de 5 nuits dans nos suites.",
        "discount_percent": 30,
        "valid_until": "2026-12-31",
        "image": "/images/room-suite.jpg",
        "active": True,
    },
]

INITIAL_PHOTOS = [
    {"id": "p1", "url": "/images/hero.jpg", "caption": "Vue extérieure", "category": "exterior"},
    {"id": "p2", "url": "/images/room-cabin.jpg", "caption": "Cabane des Pins", "category": "rooms"},
    {"id": "p3", "url": "/images/spa.jpg", "caption": "Spa nordique", "category": "spa"},
    {"id": "p4", "url": "/images/room-treehouse.jpg", "caption": "Cabane perchée", "category": "rooms"},
    {"id": "p5", "url": "/images/restaurant.jpg", "caption": "Restaurant", "category": "dining"},
    {"id": "p6", "url": "/images/room-suite.jpg", "caption": "Suite Forêt", "category": "rooms"},
]


def seed_if_empty():
    # Ensure DB tables exist
    db.init_db()

    # Insert initial items only when corresponding tables are empty
    if not storage.load("rooms"):
        for r in INITIAL_ROOMS:
            storage.insert("rooms", r)
    if not storage.load("articles"):
        for a in INITIAL_ARTICLES:
            storage.insert("articles", a)
    if not storage.load("promos"):
        for p in INITIAL_PROMOS:
            storage.insert("promos", p)
    if not storage.load("photos"):
        from datetime import datetime
        for p in INITIAL_PHOTOS:
            if "uploaded_at" not in p:
                p = {**p, "uploaded_at": datetime.utcnow().isoformat()}
            storage.insert("photos", p)
    if not storage.load("activities"):
        for a in INITIAL_ACTIVITIES:
            storage.insert("activities", a)
    if storage.load("reservations") == []:
        # leave empty list for reservations; no initial inserts
        pass
