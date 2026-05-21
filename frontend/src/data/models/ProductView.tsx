export interface ProductViewStats {
    product_id: number;
    product_name: string;
    total_views: number;
    authenticated_views: number;
    anonymous_views: number;
    unique_visitors: number;
    latest_viewed_at: string | null;
}

export default ProductViewStats;
