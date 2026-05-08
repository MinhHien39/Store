import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';
import User from '@/data/models/User';
import Token from '@/data/models/Token';

export interface AuthLoginResponse {
    user: Record<string, any>;
    token: Record<string, any>;
}

export interface AuthRepository {
    login(email: string, password: string): Promise<ApiResult<AuthLoginResponse>>;
    register(data: Record<string, any>): Promise<ApiResult<AuthLoginResponse>>;
    logout(): Promise<ApiResult<void>>;
    getMe(): Promise<ApiResult<Record<string, any>>>;
    changePassword(data: Record<string, any>): Promise<ApiResult<void>>;
    refreshToken(): Promise<ApiResult<Record<string, any>>>;
}

export class AuthRepositoryImpl extends BaseRepository implements AuthRepository {
    login(email: string, password: string): Promise<ApiResult<AuthLoginResponse>> {
        return this.safeCall(() =>
            this.apiService.post<AuthLoginResponse>('/api/v1/auth/login', { email, password })
        );
    }

    register(data: Record<string, any>): Promise<ApiResult<AuthLoginResponse>> {
        return this.safeCall(() =>
            this.apiService.post<AuthLoginResponse>('/api/v1/auth/register', data)
        );
    }

    logout(): Promise<ApiResult<void>> {
        return this.safeCall(() =>
            this.apiService.post<void>('/api/v1/auth/logout', {})
        );
    }

    getMe(): Promise<ApiResult<Record<string, any>>> {
        return this.safeCall(() =>
            this.apiService.get<Record<string, any>>('/api/v1/auth/me', {})
        );
    }

    changePassword(data: Record<string, any>): Promise<ApiResult<void>> {
        return this.safeCall(() =>
            this.apiService.patch<void>('/api/v1/auth/change-password', data)
        );
    }

    refreshToken(): Promise<ApiResult<Record<string, any>>> {
        return this.safeCall(() =>
            this.apiService.post<Record<string, any>>('/api/v1/auth/refresh_token', {})
        );
    }
}

export default AuthRepositoryImpl;
