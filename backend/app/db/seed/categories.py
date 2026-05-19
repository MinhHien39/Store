from sqlmodel import Session, select
from app.core import logger
from app.db.core import engine
from app.db.models import Category

CATEGORIES_DATA = [
    {"name": "Điện thoại", "slug": "dien-thoai", "icon": "smartphone", "description": "Điện thoại thông minh", "display_order": 1},
    {"name": "Laptop", "slug": "laptop", "icon": "laptop", "description": "Máy tính xách tay", "display_order": 2},
    {"name": "Máy tính bảng", "slug": "may-tinh-bang", "icon": "tablet", "description": "Tablet", "display_order": 3},
    {"name": "Phụ kiện", "slug": "phu-kien", "icon": "cable", "description": "Phụ kiện công nghệ", "display_order": 4},
    {"name": "Đồng hồ thông minh", "slug": "dong-ho-thong-minh", "icon": "watch", "description": "Smartwatch", "display_order": 5},
    {"name": "Tai nghe", "slug": "tai-nghe", "icon": "headphones", "description": "Tai nghe & Loa", "display_order": 6},
    {"name": "Camera", "slug": "camera", "icon": "camera", "description": "Máy ảnh & Camera", "display_order": 7},
    {"name": "Thiết bị mạng", "slug": "thiet-bi-mang", "icon": "router", "description": "Router, Switch, Access Point", "display_order": 8},
    {"name": "Thực Phẩm Bổ Sung", "slug": "thuc-pham-bo-sung", "icon": "pill", "description": "Vitamin, omega 3 và thực phẩm bổ sung", "display_order": 9},
]


def seed_categories():
    with Session(engine) as db:
        existing_by_slug = {
            category.slug: category
            for category in db.exec(select(Category)).all()
        }

        created_count = 0
        for data in CATEGORIES_DATA:
            if data["slug"] in existing_by_slug:
                continue

            category = Category(
                name=data["name"],
                slug=data["slug"],
                icon=data["icon"],
                description=data.get("description"),
                display_order=data.get("display_order", 0),
                status=1,
                created_by="seed",
            )
            db.add(category)
            created_count += 1

        db.commit()
        logger.info(f"Seeded {created_count} missing categories successfully")
