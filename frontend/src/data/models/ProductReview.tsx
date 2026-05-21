export interface ProductReview {
    id: number;
    product_id: number;
    product_name: string;
    user_id: number;
    user_name: string | null;
    rating: number;
    comment: string | null;
    status: number;
    created_at: string;
    updated_at: string | null;
}

export interface ProductReviewSummary {
    product_id: number;
    average_rating: number;
    total_reviews: number;
    rating_counts: Record<number, number>;
}

export interface ProductReviewListResponse {
    summary: ProductReviewSummary;
    items: ProductReview[];
    paging: Record<string, any>;
}
