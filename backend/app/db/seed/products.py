from sqlmodel import Session, select
from app.core import logger
from app.db.core import engine
from app.db.models import Product, Category, Brand

PRODUCTS_DATA = [
    {
        "name": "iPhone 15 Pro Max",
        "slug": "iphone-15-pro-max",
        "short_description": "Chip A17 Pro, camera 48MP, titanium",
        "description": "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp, khung titanium cao cấp. Màn hình Super Retina XDR 6.7 inch, Dynamic Island.",
        "price": 34990000,
        "sale_price": 32990000,
        "stock_quantity": 50,
        "display_order": 1,
        "category_slug": "dien-thoai",
        "brand_slug": "apple",
    },
    {
        "name": "Samsung Galaxy S24 Ultra",
        "slug": "samsung-s24-ultra",
        "short_description": "Snapdragon 8 Gen 3, 200MP, S Pen",
        "description": "Samsung Galaxy S24 Ultra trang bị chip Snapdragon 8 Gen 3, camera 200MP, tích hợp S Pen và AI Galaxy AI thông minh.",
        "price": 31990000,
        "sale_price": 29990000,
        "stock_quantity": 40,
        "display_order": 2,
        "category_slug": "dien-thoai",
        "brand_slug": "samsung",
    },
    {
        "name": "MacBook Pro M3 14\"",
        "slug": "macbook-pro-m3-14",
        "short_description": "Chip M3, 16GB RAM, 512GB SSD",
        "description": "MacBook Pro 14 inch với chip Apple M3, RAM 16GB, SSD 512GB. Màn hình Liquid Retina XDR, hiệu năng vượt trội cho công việc sáng tạo.",
        "price": 49990000,
        "sale_price": None,
        "stock_quantity": 20,
        "display_order": 3,
        "category_slug": "laptop",
        "brand_slug": "apple",
    },
    {
        "name": "Dell XPS 15",
        "slug": "dell-xps-15",
        "short_description": "Intel Core i7, 16GB RAM, RTX 4050",
        "description": "Dell XPS 15 với Intel Core i7 thế hệ 13, card đồ họa RTX 4050, màn hình OLED 3.5K tuyệt đẹp.",
        "price": 42990000,
        "sale_price": 39990000,
        "stock_quantity": 15,
        "display_order": 4,
        "category_slug": "laptop",
        "brand_slug": "dell",
    },
    {
        "name": "iPad Pro M2 12.9\"",
        "slug": "ipad-pro-m2-12-9",
        "short_description": "Chip M2, 256GB, Liquid Retina XDR",
        "description": "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR mini-LED, hỗ trợ Apple Pencil 2 và Magic Keyboard.",
        "price": 29990000,
        "sale_price": 27990000,
        "stock_quantity": 25,
        "display_order": 5,
        "category_slug": "may-tinh-bang",
        "brand_slug": "apple",
    },
    {
        "name": "Xiaomi 14 Ultra",
        "slug": "xiaomi-14-ultra",
        "short_description": "Snapdragon 8 Gen 3, Leica camera",
        "description": "Xiaomi 14 Ultra với chip Snapdragon 8 Gen 3, hệ thống camera Leica chuyên nghiệp, sạc nhanh 90W.",
        "price": 23990000,
        "sale_price": 21990000,
        "stock_quantity": 30,
        "display_order": 6,
        "category_slug": "dien-thoai",
        "brand_slug": "xiaomi",
    },
    {
        "name": "Apple Watch Ultra 2",
        "slug": "apple-watch-ultra-2",
        "short_description": "Chip S9, GPS, titanium, 36h pin",
        "description": "Apple Watch Ultra 2 với chip S9, vỏ titanium, pin 36 giờ, chống nước 100m, hoàn hảo cho thể thao mạo hiểm.",
        "price": 21990000,
        "sale_price": None,
        "stock_quantity": 20,
        "display_order": 7,
        "category_slug": "dong-ho-thong-minh",
        "brand_slug": "apple",
    },
    {
        "name": "Samsung Galaxy Watch 6 Classic",
        "slug": "samsung-galaxy-watch-6-classic",
        "short_description": "Exynos W930, vành xoay, BIA",
        "description": "Samsung Galaxy Watch 6 Classic với chip Exynos W930, vành xoay cổ điển, đo thành phần cơ thể BIA.",
        "price": 9990000,
        "sale_price": 8990000,
        "stock_quantity": 35,
        "display_order": 8,
        "category_slug": "dong-ho-thong-minh",
        "brand_slug": "samsung",
    },
    {
        "name": "Sony WH-1000XM5",
        "slug": "sony-wh-1000xm5",
        "short_description": "Chống ồn ANC, LDAC, 30h pin",
        "description": "Tai nghe Sony WH-1000XM5 chống ồn chủ động hàng đầu, codec LDAC Hi-Res, pin 30 giờ, thiết kế nhẹ thoải mái.",
        "price": 8490000,
        "sale_price": 7490000,
        "stock_quantity": 40,
        "display_order": 9,
        "category_slug": "tai-nghe",
        "brand_slug": "sony",
    },
    {
        "name": "AirPods Pro 2",
        "slug": "airpods-pro-2",
        "short_description": "Chip H2, ANC, Adaptive Audio",
        "description": "AirPods Pro 2 với chip H2, chống ồn chủ động thế hệ mới, Adaptive Audio, USB-C, pin 6 giờ (30 giờ với hộp).",
        "price": 6990000,
        "sale_price": 5990000,
        "stock_quantity": 60,
        "display_order": 10,
        "category_slug": "tai-nghe",
        "brand_slug": "apple",
    },
    {
        "name": "JBL Charge 5",
        "slug": "jbl-charge-5",
        "short_description": "Loa bluetooth, IP67, 20h pin",
        "description": "Loa bluetooth JBL Charge 5 với công suất lớn, chống nước IP67, pin 20 giờ, hỗ trợ PartyBoost ghép đôi.",
        "price": 3990000,
        "sale_price": 3490000,
        "stock_quantity": 45,
        "display_order": 11,
        "category_slug": "tai-nghe",
        "brand_slug": "jbl",
    },
    {
        "name": "Sony Alpha A7 IV",
        "slug": "sony-alpha-a7-iv",
        "short_description": "Full-frame 33MP, 4K 60fps",
        "description": "Máy ảnh Sony Alpha A7 IV full-frame 33MP, quay video 4K 60fps, AF mắt thời gian thực, ổn định hình ảnh 5 trục.",
        "price": 54990000,
        "sale_price": None,
        "stock_quantity": 10,
        "display_order": 12,
        "category_slug": "camera",
        "brand_slug": "sony",
    },
    {
        "name": "Asus ROG Zephyrus G14",
        "slug": "asus-rog-zephyrus-g14",
        "short_description": "AMD R9, RTX 4060, 2K 165Hz",
        "description": "Laptop gaming Asus ROG Zephyrus G14 với AMD Ryzen 9, RTX 4060, màn hình 2K 165Hz, trọng lượng chỉ 1.72kg.",
        "price": 39990000,
        "sale_price": 36990000,
        "stock_quantity": 12,
        "display_order": 13,
        "category_slug": "laptop",
        "brand_slug": "asus",
    },
    {
        "name": "Logitech MX Master 3S",
        "slug": "logitech-mx-master-3s",
        "short_description": "Chuột không dây, 8K DPI, USB-C",
        "description": "Chuột không dây Logitech MX Master 3S với cảm biến 8K DPI, cuộn MagSpeed, kết nối đa thiết bị, sạc USB-C.",
        "price": 2490000,
        "sale_price": 2190000,
        "stock_quantity": 80,
        "display_order": 14,
        "category_slug": "phu-kien",
        "brand_slug": "logitech",
    },
    {
        "name": "Oppo Find X7 Ultra",
        "slug": "oppo-find-x7-ultra",
        "short_description": "Snapdragon 8 Gen 3, Hasselblad",
        "description": "Oppo Find X7 Ultra với chip Snapdragon 8 Gen 3, camera Hasselblad kép periscope, sạc nhanh 100W.",
        "price": 24990000,
        "sale_price": 22990000,
        "stock_quantity": 20,
        "display_order": 15,
        "category_slug": "dien-thoai",
        "brand_slug": "oppo",
    },
]


def seed_products():
    with Session(engine) as db:
        existing = db.exec(select(Product)).first()
        if existing:
            logger.info("Products already exist, skipping seeding.")
            return

        # Build slug -> id maps
        categories = db.exec(select(Category)).all()
        cat_map = {c.slug: c.id for c in categories}

        brands = db.exec(select(Brand)).all()
        brand_map = {b.slug: b.id for b in brands}

        for data in PRODUCTS_DATA:
            product = Product(
                name=data["name"],
                slug=data["slug"],
                short_description=data.get("short_description"),
                description=data.get("description"),
                price=data["price"],
                sale_price=data.get("sale_price"),
                stock_quantity=data.get("stock_quantity", 0),
                display_order=data.get("display_order", 0),
                category_id=cat_map.get(data.get("category_slug")),
                brand_id=brand_map.get(data.get("brand_slug")),
                status=1,
                created_by="seed",
            )
            db.add(product)

        db.commit()
        logger.info(f"Seeded {len(PRODUCTS_DATA)} products successfully")
