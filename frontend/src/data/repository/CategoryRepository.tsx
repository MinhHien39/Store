import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';
import type { Category } from '@/data/models/Category';

export interface CategoryRepository {
    getList(): Promise<ApiResult<Category[]>>;
    getById(id: number): Promise<ApiResult<Category>>;
    adminCreate(data: Record<string, any>): Promise<ApiResult<Category>>;
    adminUpdate(id: number, data: Record<string, any>): Promise<ApiResult<Category>>;
    adminDelete(id: number): Promise<ApiResult<{ id: number }>>;
}

export class CategoryRepositoryImpl extends BaseRepository implements CategoryRepository {
    getList(): Promise<ApiResult<Category[]>> {
        return this.safeCall(() =>
            this.apiService.get<Category[]>('/api/v1/categories', {})
        );
    }

    getById(id: number): Promise<ApiResult<Category>> {
        return this.safeCall(() =>
            this.apiService.get<Category>(`/api/v1/categories/${id}`, {})
        );
    }

    adminCreate(data: Record<string, any>): Promise<ApiResult<Category>> {
        return this.safeCall(() =>
            this.apiService.post<Category>('/api/v1/admin/categories', data)
        );
    }

    adminUpdate(id: number, data: Record<string, any>): Promise<ApiResult<Category>> {
        return this.safeCall(() =>
            this.apiService.put<Category>(`/api/v1/admin/categories/${id}`, data)
        );
    }

    adminDelete(id: number): Promise<ApiResult<{ id: number }>> {
        return this.safeCall(() =>
            this.apiService.delete<{ id: number }>(`/api/v1/admin/categories/${id}`)
        );
    }
}

export default CategoryRepositoryImpl;
