from sqlmodel import Session, select
from app.core import logger
from app.db.core import engine
from app.db.models import Brand

BRANDS_DATA = [
    {"name": "Apple", "slug": "apple", "display_order": 1},
    {"name": "Samsung", "slug": "samsung", "display_order": 2},
    {"name": "Xiaomi", "slug": "xiaomi", "display_order": 3},
    {"name": "Oppo", "slug": "oppo", "display_order": 4},
    {"name": "Dell", "slug": "dell", "display_order": 5},
    {"name": "Asus", "slug": "asus", "display_order": 6},
    {"name": "HP", "slug": "hp", "display_order": 7},
    {"name": "Sony", "slug": "sony", "display_order": 8},
    {"name": "JBL", "slug": "jbl", "display_order": 9},
    {"name": "Logitech", "slug": "logitech", "display_order": 10},
]


def seed_brands():
    with Session(engine) as db:
        existing = db.exec(select(Brand)).first()
        if existing:
            logger.info("Brands already exist, skipping seeding.")
            return

        for data in BRANDS_DATA:
            brand = Brand(
                name=data["name"],
                slug=data["slug"],
                display_order=data.get("display_order", 0),
                status=1,
                created_by="seed",
            )
            db.add(brand)

        db.commit()
        logger.info(f"Seeded {len(BRANDS_DATA)} brands successfully")
