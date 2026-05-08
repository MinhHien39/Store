from sqlmodel import Session, select
from app.core import logger
from app.db.core import engine
from app.db.models import Category

CATEGORIES_DATA = [
    {"name": "Điện thoại", "slug": "dien-thoai", "description": "Điện thoại thông minh", "display_order": 1},
    {"name": "Laptop", "slug": "laptop", "description": "Máy tính xách tay", "display_order": 2},
    {"name": "Máy tính bảng", "slug": "may-tinh-bang", "description": "Tablet", "display_order": 3},
    {"name": "Phụ kiện", "slug": "phu-kien", "description": "Phụ kiện công nghệ", "display_order": 4},
    {"name": "Đồng hồ thông minh", "slug": "dong-ho-thong-minh", "description": "Smartwatch", "display_order": 5},
    {"name": "Tai nghe", "slug": "tai-nghe", "description": "Tai nghe & Loa", "display_order": 6},
    {"name": "Camera", "slug": "camera", "description": "Máy ảnh & Camera", "display_order": 7},
    {"name": "Thiết bị mạng", "slug": "thiet-bi-mang", "description": "Router, Switch, Access Point", "display_order": 8},
]


def seed_categories():
    with Session(engine) as db:
        existing = db.exec(select(Category)).first()
        if existing:
            logger.info("Categories already exist, skipping seeding.")
            return

        for data in CATEGORIES_DATA:
            category = Category(
                name=data["name"],
                slug=data["slug"],
                description=data.get("description"),
                display_order=data.get("display_order", 0),
                status=1,
                created_by="seed",
            )
            db.add(category)

        db.commit()
        logger.info(f"Seeded {len(CATEGORIES_DATA)} categories successfully")
