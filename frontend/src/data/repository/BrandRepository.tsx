import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';
import type { Brand } from '@/data/models/Brand';

export interface BrandRepository {
    getList(): Promise<ApiResult<Brand[]>>;
    getById(id: number): Promise<ApiResult<Brand>>;
    adminCreate(data: Record<string, any>): Promise<ApiResult<Brand>>;
    adminUpdate(id: number, data: Record<string, any>): Promise<ApiResult<Brand>>;
    adminDelete(id: number): Promise<ApiResult<{ id: number }>>;
}

export class BrandRepositoryImpl extends BaseRepository implements BrandRepository {
    getList(): Promise<ApiResult<Brand[]>> {
        return this.safeCall(() =>
            this.apiService.get<Brand[]>('/api/v1/brands', {})
        );
    }

    getById(id: number): Promise<ApiResult<Brand>> {
        return this.safeCall(() =>
            this.apiService.get<Brand>(`/api/v1/brands/${id}`, {})
        );
    }

    adminCreate(data: Record<string, any>): Promise<ApiResult<Brand>> {
        return this.safeCall(() =>
            this.apiService.post<Brand>('/api/v1/admin/brands', data)
        );
    }

    adminUpdate(id: number, data: Record<string, any>): Promise<ApiResult<Brand>> {
        return this.safeCall(() =>
            this.apiService.put<Brand>(`/api/v1/admin/brands/${id}`, data)
        );
    }

    adminDelete(id: number): Promise<ApiResult<{ id: number }>> {
        return this.safeCall(() =>
            this.apiService.delete<{ id: number }>(`/api/v1/admin/brands/${id}`)
        );
    }
}

export default BrandRepositoryImpl;
