import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';
import type { Product } from '@/data/models/Product';

export interface ProductListResponse {
    items: Product[];
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
}

export default ProductRepositoryImpl;
