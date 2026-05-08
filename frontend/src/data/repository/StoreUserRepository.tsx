import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';

export interface StoreUserListResponse {
    items: Record<string, any>[];
    paging: Record<string, any>;
}

export interface StoreUserRepository {
    getList(params?: Record<string, any>): Promise<ApiResult<StoreUserListResponse>>;
    getById(id: number): Promise<ApiResult<Record<string, any>>>;
    create(data: Record<string, any>): Promise<ApiResult<Record<string, any>>>;
    update(id: number, data: Record<string, any>): Promise<ApiResult<Record<string, any>>>;
    deleteUser(id: number): Promise<ApiResult<{ id: number }>>;
}

export class StoreUserRepositoryImpl extends BaseRepository implements StoreUserRepository {
    getList(params?: Record<string, any>): Promise<ApiResult<StoreUserListResponse>> {
        return this.safeCall(() =>
            this.apiService.get<StoreUserListResponse>('/api/v1/admin/users', params || {})
        );
    }

    getById(id: number): Promise<ApiResult<Record<string, any>>> {
        return this.safeCall(() =>
            this.apiService.get<Record<string, any>>(`/api/v1/admin/users/${id}`, {})
        );
    }

    create(data: Record<string, any>): Promise<ApiResult<Record<string, any>>> {
        return this.safeCall(() =>
            this.apiService.post<Record<string, any>>('/api/v1/admin/users', data)
        );
    }

    update(id: number, data: Record<string, any>): Promise<ApiResult<Record<string, any>>> {
        return this.safeCall(() =>
            this.apiService.put<Record<string, any>>(`/api/v1/admin/users/${id}`, data)
        );
    }

    deleteUser(id: number): Promise<ApiResult<{ id: number }>> {
        return this.safeCall(() =>
            this.apiService.delete<{ id: number }>(`/api/v1/admin/users/${id}`)
        );
    }
}

export default StoreUserRepositoryImpl;
