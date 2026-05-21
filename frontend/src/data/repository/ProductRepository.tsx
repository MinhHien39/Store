import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';
import type { Product } from '@/data/models/Product';
import type { ProductReview, ProductReviewListResponse } from '@/data/models/ProductReview';
import type { ProductViewStats } from '@/data/models/ProductView';

export interface ProductListResponse {
    items: Product[];
    paging: Record<string, any>;
}

export interface ProductViewStatsListResponse {
    items: ProductViewStats[];
    paging: Record<string, any>;
}

export interface ProductCsvImportErrorItem {
    row_number: number;
    identifier: string | null;
    message: string;
}

export interface ProductCsvImportResult {
    total_rows: number;
    created_count: number;
    updated_count: number;
    skipped_count: number;
    errors: ProductCsvImportErrorItem[];
}

export interface ProductRepository {
    getList(params: {
        keyword?: string;
        category_id?: number;
        brand_id?: number;
        min_price?: number;
        max_price?: number;
        sort_by?: string;
        sort_dir?: string;
        page?: number;
        per_page?: number;
    }): Promise<ApiResult<ProductListResponse>>;
    getById(id: number): Promise<ApiResult<Product>>;
    getBySlug(slug: string): Promise<ApiResult<Product>>;
    // Admin
    adminGetList(params: Record<string, any>): Promise<ApiResult<ProductListResponse>>;
    adminCreate(data: Record<string, any>): Promise<ApiResult<Product>>;
    adminUpdate(id: number, data: Record<string, any>): Promise<ApiResult<Product>>;
    adminDelete(id: number): Promise<ApiResult<{ id: number }>>;
    adminImportCsv(formData: FormData): Promise<ApiResult<ProductCsvImportResult>>;
    adminUploadImages(productId: number, formData: FormData): Promise<ApiResult<any>>;
    adminUploadMainImage(productId: number, file: File): Promise<ApiResult<{ main_image_url: string }>>;
    adminDeleteImage(imageId: number): Promise<ApiResult<{ id: number }>>;
    trackView(productId: number, data: Record<string, any>): Promise<ApiResult<{ tracked: boolean; product_id: number }>>;
    adminGetViewStats(params: Record<string, any>): Promise<ApiResult<ProductViewStatsListResponse>>;
    getReviews(productId: number, params: Record<string, any>): Promise<ApiResult<ProductReviewListResponse>>;
    createOrUpdateReview(productId: number, data: { rating: number; comment?: string | null }): Promise<ApiResult<ProductReview>>;
    adminGetReviews(params: Record<string, any>): Promise<ApiResult<{ items: ProductReview[]; paging: Record<string, any> }>>;
    adminUpdateReviewStatus(reviewId: number, status: number): Promise<ApiResult<ProductReview>>;
    adminDeleteReview(reviewId: number): Promise<ApiResult<{ id: number }>>;
}

export class ProductRepositoryImpl extends BaseRepository implements ProductRepository {
    getList(params: Record<string, any>): Promise<ApiResult<ProductListResponse>> {
        return this.safeCall(() =>
            this.apiService.get<ProductListResponse>('/api/v1/products', params)
        );
    }

    getById(id: number): Promise<ApiResult<Product>> {
        return this.safeCall(() =>
            this.apiService.get<Product>(`/api/v1/products/${id}`, {})
        );
    }

    getBySlug(slug: string): Promise<ApiResult<Product>> {
        return this.safeCall(() =>
            this.apiService.get<Product>(`/api/v1/products/slug/${slug}`, {})
        );
    }

    adminGetList(params: Record<string, any>): Promise<ApiResult<ProductListResponse>> {
        return this.safeCall(() =>
            this.apiService.get<ProductListResponse>('/api/v1/admin/products', params)
        );
    }

    adminCreate(data: Record<string, any>): Promise<ApiResult<Product>> {
        return this.safeCall(() =>
            this.apiService.post<Product>('/api/v1/admin/products', data)
        );
    }

    adminUpdate(id: number, data: Record<string, any>): Promise<ApiResult<Product>> {
        return this.safeCall(() =>
            this.apiService.put<Product>(`/api/v1/admin/products/${id}`, data)
        );
    }

    adminDelete(id: number): Promise<ApiResult<{ id: number }>> {
        return this.safeCall(() =>
            this.apiService.delete<{ id: number }>(`/api/v1/admin/products/${id}`)
        );
    }

    adminImportCsv(formData: FormData): Promise<ApiResult<ProductCsvImportResult>> {
        return this.safeCall(() =>
            this.apiService.postFormData<ProductCsvImportResult>('/api/v1/admin/products/import-csv', formData)
        );
    }

    adminUploadImages(productId: number, formData: FormData): Promise<ApiResult<any>> {
        return this.safeCall(() =>
            this.apiService.postFormData<any>(`/api/v1/admin/products/${productId}/images`, formData)
        );
    }

    adminUploadMainImage(productId: number, file: File): Promise<ApiResult<{ main_image_url: string }>> {
        const fd = new FormData();
        fd.append('file', file);
        return this.safeCall(() =>
            this.apiService.postFormData<{ main_image_url: string }>(`/api/v1/admin/products/${productId}/main-image`, fd)
        );
    }

    adminDeleteImage(imageId: number): Promise<ApiResult<{ id: number }>> {
        return this.safeCall(() =>
            this.apiService.delete<{ id: number }>(`/api/v1/admin/product-images/${imageId}`)
        );
    }

    trackView(productId: number, data: Record<string, any>): Promise<ApiResult<{ tracked: boolean; product_id: number }>> {
        return this.safeCall(() =>
            this.apiService.post<{ tracked: boolean; product_id: number }>(`/api/v1/products/${productId}/views`, data)
        );
    }

    adminGetViewStats(params: Record<string, any>): Promise<ApiResult<ProductViewStatsListResponse>> {
        return this.safeCall(() =>
            this.apiService.get<ProductViewStatsListResponse>('/api/v1/admin/product-views', params)
        );
    }

    getReviews(productId: number, params: Record<string, any>): Promise<ApiResult<ProductReviewListResponse>> {
        return this.safeCall(() =>
            this.apiService.get<ProductReviewListResponse>(`/api/v1/products/${productId}/reviews`, params)
        );
    }

    createOrUpdateReview(productId: number, data: { rating: number; comment?: string | null }): Promise<ApiResult<ProductReview>> {
        return this.safeCall(() =>
            this.apiService.post<ProductReview>(`/api/v1/products/${productId}/reviews`, data)
        );
    }

    adminGetReviews(params: Record<string, any>): Promise<ApiResult<{ items: ProductReview[]; paging: Record<string, any> }>> {
        return this.safeCall(() =>
            this.apiService.get<{ items: ProductReview[]; paging: Record<string, any> }>('/api/v1/admin/product-reviews', params)
        );
    }

    adminUpdateReviewStatus(reviewId: number, status: number): Promise<ApiResult<ProductReview>> {
        return this.safeCall(() =>
            this.apiService.patch<ProductReview>(`/api/v1/admin/product-reviews/${reviewId}/status`, { status })
        );
    }

    adminDeleteReview(reviewId: number): Promise<ApiResult<{ id: number }>> {
        return this.safeCall(() =>
            this.apiService.delete<{ id: number }>(`/api/v1/admin/product-reviews/${reviewId}`)
        );
    }
}

export default ProductRepositoryImpl;
