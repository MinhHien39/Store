import { ApiResult } from '@/core/api';
import BaseRepository from './BaseRepository';

import User from '../models/User';
import { UserRequest as Request } from './request/UserRequest';
import { PasswordRequest } from './request/PasswordRequest';
import { UserResponse as Response } from './response/UserResponse';

export interface UserRepository {
    getHealthyCheck(): Promise<ApiResult<string>>;

    doLogin(request: Request): Promise<ApiResult<Response>>;

    doGetUserList(request: Request): Promise<ApiResult<Response>>;

    doGetUserDetail(userId: number, roleId: number): Promise<ApiResult<User>>;

    doRegisterUser(request: Request): Promise<ApiResult<User>>;

    doUpdateUser(request: Request): Promise<ApiResult<User>>;

    doDeleteUserList(request: Request): Promise<ApiResult<void>>;

    doLogout(): Promise<ApiResult<void>>;

    doAdminLogout(): Promise<ApiResult<void>>;

    doGetInfo(): Promise<ApiResult<User>>;

    doResetPassword(request: PasswordRequest): Promise<ApiResult<Record<string, any>>>;

    doCheckTokenResetPassword(request: PasswordRequest): Promise<ApiResult<Record<string, any>>>;

    doChangePassword(request: PasswordRequest): Promise<ApiResult<Record<string, any>>>;
}

class UserRepositoryImpl extends BaseRepository implements UserRepository {
    getHealthyCheck(): Promise<ApiResult<string>> {
        const path = '/api/v1/healthy_check';
        const body = {};
        const transformCallback = (data: Record<string, any>): string => {
            return data["status"] ?? "unknown";
        }
        return this.safeCall(() => this.apiService.get<string>(path, body, transformCallback));
    }

    doLogin(request: Request): Promise<ApiResult<Response>> {
        const path = "/api/v1/admin/auth/login";
        const body = {
            email: request.emailOrUserId,
            password: request.password,
        };
        const transformCallback = (data: Record<string, any>): Response => {
            return new Response().fromLoginJson(data)
        };
        return this.safeCall(() => this.apiService.post<Response>(path, body, transformCallback));
    }

    doGetUserList(request: Request): Promise<ApiResult<Response>> {
        const path = "/api/v1/users";
        const body = request.toGetParameter();

        const transformCallback = (data: Record<string, any>): Response => {
            return new Response().fromGetListJson(data);
        };

        return this.safeCall(() => this.apiService.get<Response>(path, body, transformCallback));
    }

    doGetUserDetail(userId: number, roleId: number): Promise<ApiResult<User>> {
        const path = `/api/v1/user/${userId}`;
        const body = {
            role_id: roleId
        };

        const transformCallback = (data: Record<string, any>): User => {
            return new User().fromJson(data);
        };
        return this.safeCall(() => this.apiService.get<User>(path, body, transformCallback));
    }

    doRegisterUser(request: Request): Promise<ApiResult<User>> {
        const path = "/api/v1/user/register";
        const body = request.toRegisterParameter();
        const transformCallback = (data: Record<string, any>): User => {
            return new User().fromJson(data);
        };
        return this.safeCall(() => this.apiService.post<User>(path, body, transformCallback));
    }

    doUpdateUser(request: Request): Promise<ApiResult<User>> {
        const path = `/api/v1/user/update/${request.id}`;
        const body = request.toUpdateParameter();
        const transformCallback = (data: Record<string, any>): User => {
            return new User().fromJson(data);
        };
        return this.safeCall(() => this.apiService.post<User>(path, body, transformCallback));
    }

    doDeleteUserList(request: Request): Promise<ApiResult<void>> {
        const path = "/api/v1/user/deletes";
        const body = request.toDeleteParameter();
        const transformCallback = (): void => { };
        return this.safeCall(() => this.apiService.post(path, body, transformCallback));
    }

    doLogout(): Promise<ApiResult<void>> {
        const path = "/api/v1/auth/logout";
        const body = {};
        const transformCallback = (): void => { };
        return this.safeCall(() => this.apiService.post(path, body, transformCallback));
    }

    doAdminLogout(): Promise<ApiResult<void>> {
        const path = "/api/v1/admin/auth/logout";
        const body = {};
        const transformCallback = (): void => { };
        return this.safeCall(() => this.apiService.post(path, body, transformCallback));
    }

    doGetInfo(): Promise<ApiResult<User>> {
        const path = "/api/v1/auth/me";
        const body = {};
        const transformCallback = (data: Record<string, any>): User => {
            return new User().fromJson(data);
        };
        return this.safeCall(() => this.apiService.get<User>(path, body, transformCallback));
    }

    doResetPassword(request: PasswordRequest): Promise<ApiResult<Record<string, any>>> {
        const path = "/api/v1/auth/reset-password";
        const body = request.toResetPasswordParameter();
        
        const transformCallback = (data: Record<string, any>): Record<string, any> => {
            return data;
        }
        return this.safeCall(() => this.apiService.post<Record<string, any>>(path, body, transformCallback));
    }

    doCheckTokenResetPassword(request: PasswordRequest): Promise<ApiResult<Record<string, any>>> {
        const path = "/api/v1/auth/check-token-reset-password";
        const params = request.toCheckTokenParameter();

        const transformCallback = (data: Record<string, any>): Record<string, any> => {
            return data;
        }
        return this.safeCall(() => this.apiService.get<Record<string, any>>(path, params, transformCallback));
    }

    doChangePassword(request: PasswordRequest): Promise<ApiResult<Record<string, any>>> {
        const path = "/api/v1/auth/change-password";
        const body = request.toChangePasswordParameter();

        const transformCallback = (data: Record<string, any>): Record<string, any> => {
            return data;
        }
        return this.safeCall(() => this.apiService.patch<Record<string, any>>(path, body, transformCallback));
    }
}

export default UserRepositoryImpl;
