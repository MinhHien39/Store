import { AppRoutePath } from '@/application/AppRoutePath';
import User, { UserRole } from '@/data/models/User';
import Token from '@/data/models/Token';

import LocalStorageImpl, { LocalStorageKey } from './LocalStorageService';
import { JsonUtils, StringUtils } from '@/core/utils';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'store';

class AppLocalStorage {
    private static _instance: AppLocalStorage;

    private localStorageService: LocalStorageImpl = LocalStorageImpl.getInstance();

    private constructor() {
        // No-Op
    }

    public static getInstance(): AppLocalStorage {
        if (!this._instance) {
            this._instance = new AppLocalStorage();
        }
        return this._instance;
    }

    private buildKey(key: string): string {
        return `${APP_NAME}_${key}`;
    }

    public getRoleIdFromUrl(): UserRole {
        if (typeof window === 'undefined') return UserRole.MEMBER;
        const paths = window.location.pathname.split('/').filter(Boolean);

        const admin = "admin";
        const manager = "manager";
        const member = "member";

        const role = paths.find(p => [admin, manager, member].includes(p));

        switch (role) {
            case admin:
                return UserRole.ADMIN;
            case manager:
                return UserRole.MANAGER;
            default:
                return UserRole.MEMBER;
        }
    }

    private getUserKey(roleId?: UserRole): LocalStorageKey {
        const role = roleId ?? this.getRoleIdFromUrl();
        switch (role) {
            case UserRole.ADMIN:
                return LocalStorageKey.ADMIN;
            case UserRole.MANAGER:
                return LocalStorageKey.MANAGER;
            case UserRole.MEMBER:
                return LocalStorageKey.MEMBER;
            default:
                throw new Error('Invalid user role for local storage key');
        }
    }

    // Separate token keys by user role to avoid conflicts when multiple roles log in on the same browser
    private getTokenKey(roleId?: UserRole): string {
        const userKey = this.getUserKey(roleId);
        return this.buildKey(`${userKey}_${LocalStorageKey.TOKEN}`);
    }

    // Get user from local storage, return null if not found or expired
    public getUser() {
        const userKey = this.getUserKey();
        const key = this.buildKey(userKey);
        const cookieValue: string | null = LocalStorageImpl.getInstance().getItemSync<string>(key);

        if (cookieValue === undefined || cookieValue === null) {
            return null;
        }

        // Parse the JSON string back into an object
        try {
            const jsonObject = JsonUtils.parse<Record<string, any> | null>(cookieValue);
            if (jsonObject == null) {
                return null;
            }
            const user: User = new User().fromJson(jsonObject);
            return user;
        }
        catch {
            return null;
        }
    };

    // Save user and token to local storage
    public saveData([user, token]: [User, Token]) {
        const userJsonString = JsonUtils.stringify(user.toJson());
        const tokenJsonString = JsonUtils.stringify(token.toJson());
        if (userJsonString && tokenJsonString) {
            const userKey = this.getUserKey();
            const key = this.buildKey(userKey);
            const tokenKey = this.getTokenKey();
            this.localStorageService.setItemSync(key, userJsonString);
            this.localStorageService.setItemSync(tokenKey, tokenJsonString);
        }
    };

    // Clear user and token from local storage for the given role (or URL-inferred role if omitted)
    public clearData(roleId?: UserRole) {
        const userKey = this.getUserKey(roleId);
        const key = this.buildKey(userKey);
        const tokenKey = this.getTokenKey(roleId);
        this.localStorageService.removeItemSync(key);
        this.localStorageService.removeItemSync(tokenKey);
    }

    // Get access token from local storage, return empty string if not found or expired
    public getAccessToken(): string {
        const key = this.getTokenKey();
        const jsonString: string = this.localStorageService.getItemSync<string>(key) ?? "";
        if (StringUtils.isEmpty(jsonString)) {
            return "";
        }
        const jsonObject = JsonUtils.parse<object>(jsonString);
        if (jsonObject === null) {
            return "";
        }
        const token = new Token().fromJson(jsonObject);
        return token.accessToken;
    }

    public saveToken(token: Token | Record<string, any>) {
        const tokenKey = this.getTokenKey();
        const tokenObject = token instanceof Token ? token.toJson() : token;
        const tokenJsonString = JsonUtils.stringify(tokenObject);
        if (tokenJsonString) {
            this.localStorageService.setItemSync(tokenKey, tokenJsonString);
        }
    }
}

export default AppLocalStorage;
