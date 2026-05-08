import type { Category } from "@/data/models/Category";
import type { Brand } from "@/data/models/Brand";
import type { Product, ProductImage } from "@/data/models/Product";

const now = "2026-04-28T00:00:00Z";

export const mockCategories: Category[] = [
    { id: 1, name: "Điện thoại", slug: "dien-thoai", description: "Smartphone chính hãng, cấu hình mạnh, bảo hành rõ ràng", image_url: null, display_order: 1, status: 1, created_at: now, updated_at: now },
    { id: 2, name: "Laptop", slug: "laptop", description: "Laptop văn phòng, gaming và đồ họa cho mọi nhu cầu", image_url: null, display_order: 2, status: 1, created_at: now, updated_at: now },
    { id: 3, name: "Máy tính bảng", slug: "may-tinh-bang", description: "Tablet giải trí, học tập và làm việc linh hoạt", image_url: null, display_order: 3, status: 1, created_at: now, updated_at: now },
    { id: 4, name: "Phụ kiện", slug: "phu-kien", description: "Sạc, cáp, chuột, bàn phím và phụ kiện công nghệ", image_url: null, display_order: 4, status: 1, created_at: now, updated_at: now },
    { id: 5, name: "Đồng hồ thông minh", slug: "dong-ho-thong-minh", description: "Smartwatch theo dõi sức khỏe và thông báo tiện lợi", image_url: null, display_order: 5, status: 1, created_at: now, updated_at: now },
    { id: 6, name: "Tai nghe", slug: "tai-nghe", description: "Tai nghe bluetooth, chống ồn và loa di động", image_url: null, display_order: 6, status: 1, created_at: now, updated_at: now },
    { id: 7, name: "Camera", slug: "camera", description: "Camera hành trình, an ninh và máy ảnh du lịch", image_url: null, display_order: 7, status: 1, created_at: now, updated_at: now },
    { id: 8, name: "Thiết bị mạng", slug: "thiet-bi-mang", description: "Router, mesh Wi-Fi, switch và access point", image_url: null, display_order: 8, status: 1, created_at: now, updated_at: now },
];

export const mockBrands: Brand[] = [
    { id: 1, name: "Apple", slug: "apple", description: "Thiết bị cao cấp với hệ sinh thái đồng bộ", logo_url: null, display_order: 1, status: 1, created_at: now, updated_at: now },
    { id: 2, name: "Samsung", slug: "samsung", description: "Công nghệ màn hình, smartphone và tablet hàng đầu", logo_url: null, display_order: 2, status: 1, created_at: now, updated_at: now },
    { id: 3, name: "Xiaomi", slug: "xiaomi", description: "Giá tốt, cấu hình cao, nhiều lựa chọn thông minh", logo_url: null, display_order: 3, status: 1, created_at: now, updated_at: now },
    { id: 4, name: "Dell", slug: "dell", description: "Laptop bền bỉ cho văn phòng và doanh nghiệp", logo_url: null, display_order: 4, status: 1, created_at: now, updated_at: now },
    { id: 5, name: "Asus", slug: "asus", description: "Gaming, creator và linh kiện hiệu năng cao", logo_url: null, display_order: 5, status: 1, created_at: now, updated_at: now },
    { id: 6, name: "Sony", slug: "sony", description: "Âm thanh, camera và giải trí chất lượng cao", logo_url: null, display_order: 6, status: 1, created_at: now, updated_at: now },
    { id: 7, name: "JBL", slug: "jbl", description: "Loa và tai nghe năng động, âm thanh mạnh mẽ", logo_url: null, display_order: 7, status: 1, created_at: now, updated_at: now },
    { id: 8, name: "Logitech", slug: "logitech", description: "Phụ kiện làm việc và gaming gọn gàng, bền đẹp", logo_url: null, display_order: 8, status: 1, created_at: now, updated_at: now },
];

export const mockProductImages: ProductImage[] = [
    { id: 1, product_id: 1, image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 2, product_id: 1, image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&h=900&fit=crop", sort_order: 2 },
    { id: 3, product_id: 2, image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 4, product_id: 3, image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 5, product_id: 4, image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 6, product_id: 5, image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 7, product_id: 6, image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 8, product_id: 7, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 9, product_id: 8, image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 10, product_id: 9, image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=900&fit=crop", sort_order: 1 },
    { id: 11, product_id: 10, image_url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=900&h=900&fit=crop", sort_order: 1 },
];

export const mockProducts: Product[] = [
    {
        id: 1,
        category_id: 1,
        brand_id: 1,
        name: "iPhone 15 Pro Max 256GB",
        slug: "iphone-15-pro-max-256gb",
        short_description: "Chip A17 Pro, camera 48MP, khung titanium và màn hình Super Retina XDR.",
        description: "iPhone 15 Pro Max phù hợp người cần hiệu năng cao, quay chụp ổn định và trải nghiệm cao cấp trong hệ sinh thái Apple.",
        price: 34990000,
        sale_price: 32990000,
        stock_quantity: 24,
        main_image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&h=900&fit=crop",
        display_order: 1,
        status: 1,
        created_at: "2026-04-27T08:00:00Z",
        updated_at: now,
        category_name: "Điện thoại",
        brand_name: "Apple",
        images: mockProductImages.filter((image) => image.product_id === 1),
    },
    {
        id: 2,
        category_id: 1,
        brand_id: 2,
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        short_description: "Màn hình Dynamic AMOLED, camera 200MP, S Pen và Galaxy AI.",
        description: "Galaxy S24 Ultra có thiết kế chắc chắn, camera linh hoạt, pin lớn và bộ công cụ AI hữu ích cho công việc hằng ngày.",
        price: 31990000,
        sale_price: 29990000,
        stock_quantity: 18,
        main_image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&h=900&fit=crop",
        display_order: 2,
        status: 1,
        created_at: "2026-04-26T08:00:00Z",
        updated_at: now,
        category_name: "Điện thoại",
        brand_name: "Samsung",
        images: mockProductImages.filter((image) => image.product_id === 2),
    },
    {
        id: 3,
        category_id: 2,
        brand_id: 1,
        name: "MacBook Pro 14 inch M3",
        slug: "macbook-pro-14-inch-m3",
        short_description: "Chip M3, 16GB RAM, 512GB SSD, màn hình Liquid Retina XDR.",
        description: "MacBook Pro 14 inch M3 dành cho lập trình, đồ họa và sáng tạo nội dung cần hiệu năng ổn định trong thân máy gọn.",
        price: 49990000,
        sale_price: 46990000,
        stock_quantity: 12,
        main_image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=900&fit=crop",
        display_order: 3,
        status: 1,
        created_at: "2026-04-25T08:00:00Z",
        updated_at: now,
        category_name: "Laptop",
        brand_name: "Apple",
        images: mockProductImages.filter((image) => image.product_id === 3),
    },
    {
        id: 4,
        category_id: 2,
        brand_id: 4,
        name: "Dell XPS 13 Plus",
        slug: "dell-xps-13-plus",
        short_description: "Laptop mỏng nhẹ, màn hình sắc nét, bàn phím tràn viền hiện đại.",
        description: "Dell XPS 13 Plus là lựa chọn gọn đẹp cho văn phòng, di chuyển nhiều và cần một chiếc máy cao cấp để làm việc mỗi ngày.",
        price: 37990000,
        sale_price: null,
        stock_quantity: 16,
        main_image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&h=900&fit=crop",
        display_order: 4,
        status: 1,
        created_at: "2026-04-24T08:00:00Z",
        updated_at: now,
        category_name: "Laptop",
        brand_name: "Dell",
        images: mockProductImages.filter((image) => image.product_id === 4),
    },
    {
        id: 5,
        category_id: 3,
        brand_id: 1,
        name: "iPad Air M2 11 inch",
        slug: "ipad-air-m2-11-inch",
        short_description: "Màn hình 11 inch, chip M2, hỗ trợ Apple Pencil Pro.",
        description: "iPad Air M2 phù hợp học tập, ghi chú, giải trí và làm việc nhẹ với thiết kế mỏng nhẹ, pin tốt.",
        price: 16990000,
        sale_price: 15990000,
        stock_quantity: 30,
        main_image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&h=900&fit=crop",
        display_order: 5,
        status: 1,
        created_at: "2026-04-23T08:00:00Z",
        updated_at: now,
        category_name: "Máy tính bảng",
        brand_name: "Apple",
        images: mockProductImages.filter((image) => image.product_id === 5),
    },
    {
        id: 6,
        category_id: 5,
        brand_id: 3,
        name: "Xiaomi Watch S3",
        slug: "xiaomi-watch-s3",
        short_description: "Theo dõi sức khỏe, pin lâu, mặt đồng hồ tùy biến linh hoạt.",
        description: "Xiaomi Watch S3 có giao diện gọn, nhiều chế độ luyện tập và thời lượng pin dài cho người dùng năng động.",
        price: 4990000,
        sale_price: 4290000,
        stock_quantity: 42,
        main_image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=900&fit=crop",
        display_order: 6,
        status: 1,
        created_at: "2026-04-22T08:00:00Z",
        updated_at: now,
        category_name: "Đồng hồ thông minh",
        brand_name: "Xiaomi",
        images: mockProductImages.filter((image) => image.product_id === 6),
    },
    {
        id: 7,
        category_id: 6,
        brand_id: 6,
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        short_description: "Tai nghe chống ồn cao cấp, âm thanh chi tiết, đeo êm.",
        description: "Sony WH-1000XM5 mang lại khả năng chống ồn mạnh, đàm thoại rõ và thời lượng pin phù hợp đi làm, đi máy bay.",
        price: 8990000,
        sale_price: 7990000,
        stock_quantity: 36,
        main_image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=900&fit=crop",
        display_order: 7,
        status: 1,
        created_at: "2026-04-21T08:00:00Z",
        updated_at: now,
        category_name: "Tai nghe",
        brand_name: "Sony",
        images: mockProductImages.filter((image) => image.product_id === 7),
    },
    {
        id: 8,
        category_id: 6,
        brand_id: 7,
        name: "JBL Charge 5",
        slug: "jbl-charge-5",
        short_description: "Loa bluetooth chống nước, bass chắc, pin 20 giờ.",
        description: "JBL Charge 5 phù hợp dã ngoại và không gian nhỏ, âm lượng lớn, chống nước và có thể sạc ngược cho điện thoại.",
        price: 3990000,
        sale_price: null,
        stock_quantity: 28,
        main_image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=900&fit=crop",
        display_order: 8,
        status: 1,
        created_at: "2026-04-20T08:00:00Z",
        updated_at: now,
        category_name: "Tai nghe",
        brand_name: "JBL",
        images: mockProductImages.filter((image) => image.product_id === 8),
    },
    {
        id: 9,
        category_id: 7,
        brand_id: 6,
        name: "Sony Alpha ZV-E10",
        slug: "sony-alpha-zv-e10",
        short_description: "Máy ảnh mirrorless cho vlog, lấy nét nhanh, thay ống kính.",
        description: "Sony Alpha ZV-E10 dành cho nhà sáng tạo nội dung cần hình ảnh đẹp, âm thanh rõ và thân máy nhỏ để mang theo.",
        price: 18990000,
        sale_price: 17490000,
        stock_quantity: 10,
        main_image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=900&fit=crop",
        display_order: 9,
        status: 1,
        created_at: "2026-04-19T08:00:00Z",
        updated_at: now,
        category_name: "Camera",
        brand_name: "Sony",
        images: mockProductImages.filter((image) => image.product_id === 9),
    },
    {
        id: 10,
        category_id: 8,
        brand_id: 3,
        name: "Xiaomi Mesh System AX3000",
        slug: "xiaomi-mesh-system-ax3000",
        short_description: "Bộ mesh Wi-Fi 6 phủ sóng rộng, quản lý đơn giản qua app.",
        description: "Xiaomi Mesh AX3000 giúp mạng gia đình ổn định hơn, phù hợp căn hộ nhiều phòng và nhiều thiết bị kết nối cùng lúc.",
        price: 3290000,
        sale_price: 2890000,
        stock_quantity: 22,
        main_image_url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=900&h=900&fit=crop",
        display_order: 10,
        status: 1,
        created_at: "2026-04-18T08:00:00Z",
        updated_at: now,
        category_name: "Thiết bị mạng",
        brand_name: "Xiaomi",
        images: mockProductImages.filter((image) => image.product_id === 10),
    },
];

export function filterProducts(params: {
    keyword?: string;
    category_id?: number;
    brand_id?: number;
    sort?: string;
}): Product[] {
    let filtered = [...mockProducts];

    if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filtered = filtered.filter(
            (product) =>
                product.name.toLowerCase().includes(keyword) ||
                product.short_description.toLowerCase().includes(keyword) ||
                product.category_name?.toLowerCase().includes(keyword) ||
                product.brand_name?.toLowerCase().includes(keyword)
        );
    }

    if (params.category_id) {
        filtered = filtered.filter((product) => product.category_id === params.category_id);
    }

    if (params.brand_id) {
        filtered = filtered.filter((product) => product.brand_id === params.brand_id);
    }

    switch (params.sort) {
        case "price_asc":
            filtered.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
            break;
        case "price_desc":
            filtered.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
            break;
        case "newest":
        default:
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
    }

    return filtered;
}

export function getProductById(id: number): Product | undefined {
    return mockProducts.find((product) => product.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
    return mockProducts
        .filter((item) => item.id !== product.id && (item.category_id === product.category_id || item.brand_id === product.brand_id))
        .slice(0, limit);
}
