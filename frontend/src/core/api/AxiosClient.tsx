import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

import ApiError from './ApiError';
import AppLocalStorage from '@/core/store/AppLocalStorage';
import { LogUtils } from '@/core/utils';
import { UserRole } from '@/data/models/User';
import { AppRoutePath } from '@/application/AppRoutePath';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const MAX_REFRESH_RETRY = 3;

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

class AxiosClient {
    private static _instance: AxiosInstance;
    private static appLocalStorage = AppLocalStorage.getInstance();

    private static isRefreshing = false;
    private static refreshPromise: Promise<string> | null = null;
    private static refreshRetryCount = 0;

    static getInstance(): AxiosInstance {
        if (!this._instance) {
            this._instance = axios.create({
                baseURL: BASE_URL,
                timeout: 30000,
                withCredentials: true,
            });

            this.setupInterceptors(this._instance);
        }
        return this._instance;
    }

    /* ================= Interceptors ================= */
    private static setupInterceptors(instance: AxiosInstance) {

        /* -------- Request -------- */
        instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = this.appLocalStorage.getAccessToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            }
        );

        /* -------- Response -------- */
        instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as RetryConfig;

                if (!error.response) {
                    // Server Not Responding
                    throw new ApiError(0, 'Server không phản hồi.');
                }

                const status = error.response.status;
                const url = originalRequest.url ?? '';

                /* === Skip refresh for login / refresh === */
                if (
                    status !== 401 ||
                    originalRequest._retry ||
                    url.includes('/auth/login') ||
                    url.includes('/auth/refresh_token') ||
                    url.includes('/auth/reset-password') ||
                    url.includes('/auth/check-token-reset-password') ||
                    url.includes('/auth/change-password')
                ) {
                    throw AxiosClient.mapError(error);
                }

                /* === More than 3 refresh attempts === */
                if (this.refreshRetryCount >= MAX_REFRESH_RETRY) {
                    this.forceLogout();
                    throw new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                }

                /* === Token already refreshed by a concurrent request === */
                const currentToken = this.appLocalStorage.getAccessToken();
                const requestToken = (originalRequest.headers?.Authorization as string)
                    ?.replace('Bearer ', '');
                if (currentToken && requestToken && requestToken !== currentToken) {
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers!.Authorization = `Bearer ${currentToken}`;
                    return instance(originalRequest);
                }

                originalRequest._retry = true;

                /* === If refreshing → wait === */
                if (this.isRefreshing && this.refreshPromise) {
                    const newToken = await this.refreshPromise;
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers!.Authorization = `Bearer ${newToken}`;
                    return instance(originalRequest);
                }

                /* === Start refresh === */
                this.isRefreshing = true;
                this.refreshRetryCount++;

                this.refreshPromise = this.refreshToken();

                try {
                    const newToken = await this.refreshPromise;

                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers!.Authorization = `Bearer ${newToken}`;
                    this.refreshRetryCount = 0;
                    return instance(originalRequest);
                } catch (e) {
                    this.forceLogout();
                    throw e;
                } finally {
                    this.isRefreshing = false;
                    this.refreshPromise = null;
                }
            }
        );
    }

    /* ================= Refresh Token ================= */
    private static async refreshToken(): Promise<string> {
        LogUtils.debug('Refreshing token... attempt:', this.refreshRetryCount);
        const roleId = this.appLocalStorage.getUser()?.roleId;

        const res = await axios.post(
            `${BASE_URL}/api/v1/auth/refresh_token`,
            {},
            {
                withCredentials: true,
                params: { role_id: roleId },
            }
        );
        const tokenData = res.data?.data;
        const newAccessToken = tokenData?.access_token;

        if (!newAccessToken) {
            throw new ApiError(401, 'Refresh token failed');
        }

        this.appLocalStorage.saveToken(tokenData);

        return newAccessToken;
    }

    /* ================= Utils ================= */
    private static forceLogout() {
        LogUtils.debug('Force logout');
        const user = this.appLocalStorage.getUser();
        const roleId = user?.roleId as UserRole | undefined;
        this.appLocalStorage.clearData(roleId);

        const path = window.location.pathname;
        if (path.includes('/login')) return;

        if (roleId === UserRole.ADMIN || path.startsWith('/admin')) {
            window.location.href = AppRoutePath.ADMIN_LOGIN;
        } else {
            window.location.href = AppRoutePath.LOGIN;
        }
    }

    private static mapError(error: AxiosError): ApiError {
        const status = error.response?.status ?? 0;
        const message = (error.response?.data as any)?.message ?? 'Đã xảy ra lỗi không xác định.';
        return new ApiError(status, message);
    }
}

export default AxiosClient;
