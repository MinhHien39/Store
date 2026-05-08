export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
    sort_order: number;
}

export interface Product {
    id: number;
    category_id: number;
    brand_id: number;
    name: string;
    slug: string;
    short_description: string;
    description: string;
    price: number;
    sale_price: number | null;
    stock_quantity: number;
    main_image_url: string;
    display_order: number;
    status: number;
    created_at: string;
    updated_at: string;
    // Joined
    category_name?: string;
    brand_name?: string;
    images?: ProductImage[];
}

export default Product;
