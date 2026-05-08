-- =============================================================
-- StoreAmazon - Seed Data
-- Run after tables are created (after first docker-compose up)
-- Admin login: admin1@gmail.com / Cider123456
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- ADMINS
-- password = Cider123456 (argon2id hash)
-- -------------------------------------------------------------
INSERT IGNORE INTO admins (created_at, created_by, updated_at, updated_by, is_deleted, email, password, full_name, status)
VALUES (
    NOW(), 'seed', NOW(), 'seed', 0,
    'admin1@gmail.com',
    '$argon2id$v=19$m=65536,t=3,p=4$4bc3VcZ1+TAeYZV/e/7Y9g$xZV1cea0naGOCpwKdPVLkprM/DwxiZO3sRdZzkV86fU',
    'Admin1',
    1
);

-- -------------------------------------------------------------
-- CATEGORIES
-- -------------------------------------------------------------
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Electronics',         'Smartphones, laptops, audio, and gadgets',          NOW(), NOW()),
('Fashion',             'Clothing, shoes, bags, and accessories',             NOW(), NOW()),
('Home & Living',       'Furniture, décor, kitchen, and bedding',             NOW(), NOW()),
('Beauty & Health',     'Skincare, cosmetics, supplements, and wellness',     NOW(), NOW()),
('Sports & Outdoors',   'Gym equipment, outdoor gear, and sportswear',        NOW(), NOW()),
('Books & Stationery',  'Books, notebooks, pens, and office supplies',        NOW(), NOW()),
('Toys & Kids',         'Toys, games, and baby products',                     NOW(), NOW()),
('Food & Beverage',     'Snacks, drinks, coffee, and health foods',           NOW(), NOW());

-- -------------------------------------------------------------
-- BRANDS
-- -------------------------------------------------------------
INSERT INTO brands (name, description, created_at, updated_at) VALUES
('Sony',        'Japanese multinational conglomerate in electronics and entertainment',    NOW(), NOW()),
('Apple',       'American technology company known for iPhone, Mac, and AirPods',         NOW(), NOW()),
('Nike',        'Global sportswear leader in footwear, apparel, and equipment',           NOW(), NOW()),
('Samsung',     'South Korean electronics giant — TVs, phones, and appliances',          NOW(), NOW()),
('Uniqlo',      'Japanese casual wear brand known for quality basics',                    NOW(), NOW()),
('IKEA',        'Swedish furniture and home décor brand',                                 NOW(), NOW()),
('Laneige',     'Korean beauty brand specialising in hydration skincare',                 NOW(), NOW()),
('Anker',       'Leading brand in charging technology and audio accessories',             NOW(), NOW());

-- -------------------------------------------------------------
-- PRODUCTS
-- category_id: 1=Electronics 2=Fashion 3=Home 4=Beauty 5=Sports 6=Books 7=Toys 8=Food
-- brand_id:    1=Sony 2=Apple 3=Nike 4=Samsung 5=Uniqlo 6=IKEA 7=Laneige 8=Anker
-- -------------------------------------------------------------
INSERT INTO products (category_id, brand_id, name, short_description, description, price, sale_price, main_image_url, display_order, created_at, updated_at) VALUES

-- Electronics
(1, 2, 'Apple AirPods Pro (2nd Gen)',
 'Active noise cancellation with Adaptive Transparency',
 'The AirPods Pro deliver up to 2x more Active Noise Cancellation than the previous generation. With Adaptive Transparency, personalized Spatial Audio with dynamic head tracking, and a new H2 chip, these are the best AirPods ever made.',
 6900000, 5990000, NULL, 1, NOW(), NOW()),

(1, 1, 'Sony WH-1000XM5 Headphones',
 'Industry-leading noise cancelling wireless headphones',
 'Experience the next level of silence with the WH-1000XM5. Features 8 microphones for precise voice pickup, up to 30-hour battery, and multipoint connection to pair two Bluetooth devices simultaneously.',
 8500000, NULL, NULL, 2, NOW(), NOW()),

(1, 4, 'Samsung Galaxy S24 Ultra',
 'The ultimate Galaxy with built-in S Pen and 200MP camera',
 'Galaxy S24 Ultra is the most powerful Galaxy smartphone ever. With a 200MP camera, built-in S Pen, 6.8-inch QHD+ Dynamic AMOLED display, and Snapdragon 8 Gen 3, it pushes the boundaries of mobile.',
 28000000, 25500000, NULL, 3, NOW(), NOW()),

(1, 8, 'Anker 737 Power Bank (PowerCore 24K)',
 '24,000mAh portable charger with 140W output',
 'The Anker 737 Power Bank features a massive 24,000mAh capacity, 140W max output, and a smart digital display showing exact battery percentage and charging wattage in real time.',
 1890000, 1590000, NULL, 4, NOW(), NOW()),

(1, 2, 'Apple MacBook Air M3 13"',
 'Incredibly thin and fast, with up to 18-hour battery life',
 'MacBook Air with the M3 chip is our most popular laptop, made even more capable. Up to 18 hours of battery life, a 13.6-inch Liquid Retina display, 1080p FaceTime HD camera, and all-day performance.',
 28900000, NULL, NULL, 5, NOW(), NOW()),

-- Fashion
(2, 3, 'Nike Air Max 270',
 'Max Air cushioning in a modern lifestyle sneaker',
 'The Nike Air Max 270 features Nike''s biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks. A mesh upper keeps you cool, while the foam midsole provides lightweight comfort all day.',
 3200000, 2490000, NULL, 6, NOW(), NOW()),

(2, 5, 'Uniqlo Ultra Light Down Jacket',
 'Packable, warm, and incredibly light for everyday wear',
 'Made with high-quality down fill, this jacket packs down small enough to fit in its own pocket. The perfect layer for cool days or travel — lightweight yet surprisingly warm.',
 1290000, NULL, NULL, 7, NOW(), NOW()),

(2, 3, 'Nike Dri-FIT Training T-Shirt',
 'Sweat-wicking performance tee for any workout',
 'The Nike Dri-FIT T-Shirt uses high-performance fabric to move sweat away from your skin for quicker evaporation, helping you stay dry and comfortable during workouts.',
 690000, 490000, NULL, 8, NOW(), NOW()),

-- Home & Living
(3, 6, 'IKEA POÄNG Armchair',
 'Classic bent wood armchair with cushion — timeless comfort',
 'The POÄNG armchair has a sturdy frame in layer-glued bent birch, which gives flexibility and comfort. The high-resilience seat cushion keeps its shape for years. Easy to assemble and available in multiple colours.',
 3200000, NULL, NULL, 9, NOW(), NOW()),

(3, 6, 'IKEA KALLAX Shelf Unit',
 'Versatile shelf that works as room divider or bookcase',
 'KALLAX is a versatile storage solution. Use it as a room divider, bookcase, or display shelf. Compatible with doors, drawers, and insert shelves sold separately. Holds up to 13 kg per cube.',
 2490000, 1990000, NULL, 10, NOW(), NOW()),

-- Beauty & Health
(4, 7, 'Laneige Water Sleeping Mask',
 'Overnight hydration mask for plump, dewy skin',
 'Wake up to deeply hydrated skin with the Laneige Water Sleeping Mask. Formulated with Hydro Ionized Mineral Water and SLEEP-TOX technology, this overnight mask replenishes moisture while you sleep.',
 890000, 690000, NULL, 11, NOW(), NOW()),

(4, 7, 'Laneige Lip Sleeping Mask',
 'Best-selling overnight lip treatment in berry scent',
 'The cult-favourite Laneige Lip Sleeping Mask uses Moisture Wrap and Vitamin C to keep your lips soft and plump overnight. Wake up to smooth, nourished lips every morning.',
 590000, NULL, NULL, 12, NOW(), NOW()),

-- Sports & Outdoors
(5, 3, 'Nike Metcon 9 Training Shoes',
 'Stable and durable shoes built for cross-training',
 'The Nike Metcon 9 is built for the toughest workouts. A wide, flat heel provides a stable base for weightlifting, while the forefoot rubber wrap protects against rope climb abrasion.',
 3890000, 3290000, NULL, 13, NOW(), NOW()),

-- Books & Stationery
(6, NULL, 'Atomic Habits — James Clear',
 'The #1 bestselling guide to building good habits',
 'Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies to form good habits, break bad ones, and master the tiny behaviours that lead to remarkable results.',
 290000, NULL, NULL, 14, NOW(), NOW()),

-- Food & Beverage
(8, NULL, 'Specialty Coffee Sampler Box (6 bags)',
 'Six single-origin coffees from around the world',
 'Explore six distinct flavour profiles with our Specialty Coffee Sampler. Each 100g bag features a single-origin coffee from a different country: Ethiopia, Colombia, Guatemala, Kenya, Brazil, and Peru.',
 890000, 750000, NULL, 15, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
