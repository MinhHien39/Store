"use client";

import { useNavigate, useParams } from 'react-router-dom';
import LogUtils from '@/core/utils/LogUtils';
import User, { UserRole } from '@/data/models/User';
import Token from '@/data/models/Token';
import { useAuthContext } from '@/provider/AuthContextProvider';
import { AppRoutePath } from './AppRoutePath';

// Helper to build path with params
const buildPath = (path: string, params?: Record<string, string>): string => {
    let builtPath = path;
    for (const [key, value] of Object.entries(params || {})) {
        builtPath = builtPath.replace(`:${key}`, value);
    }
    if (builtPath.includes(':')) {
        LogUtils.warn(`[AppNavigation.buildPath] Not all params were replaced in path: ${builtPath}`);
    }
    return builtPath;
};

export const useAppNavigation = () => {
    const navigate = useNavigate();
    const { user, onLoginSuccess, onLogout } = useAuthContext();

    // Get default route based on role
    const getDefaultRoute = (role: UserRole): string => {
        switch (role) {
            case UserRole.ADMIN:
                return AppRoutePath.ADMIN_DASHBOARD;
            case UserRole.STORE_USER:
                return AppRoutePath.HOME;
            default:
                return AppRoutePath.HOME;
        }
    };

    // Get login route based on role
    const getLoginRoute = (role: UserRole): string => {
        switch (role) {
            case UserRole.ADMIN:
                return AppRoutePath.ADMIN_LOGIN;
            case UserRole.STORE_USER:
                return AppRoutePath.LOGIN;
            default:
                return AppRoutePath.LOGIN;
        }
    };

    return {
        buildPath,
        // Navigate to default page based on role after login
        afterLoginSuccess: (user: User, token: Token) => {
            onLoginSuccess(user, token);
            const route = getDefaultRoute(user.roleId);
            setTimeout(() => navigate(route, { replace: true }), 0);
        },

        // Navigate to login based on role
        toLogin: (role?: UserRole) => {
            onLogout();
            const targetRole = role || user?.roleId || UserRole.STORE_USER;
            const route = getLoginRoute(targetRole);
            navigate(route, { replace: true });
        },

        // Navigate with path
        to: (path: string, params?: Record<string, string>) => {
            const fullPath = buildPath(path, params);
            navigate(fullPath);
        },

        // Replace current route
        replace: (path: string, params?: Record<string, string>) => {
            const fullPath = buildPath(path, params);
            navigate(fullPath, { replace: true });
        },

        // Go back
        goBack: (path?: AppRoutePath, params?: Record<string, string>) => {
            if (window.history.length > 1) {
                navigate(-1);
            } else if (path) {
                const fullPath = buildPath(path, params);
                navigate(fullPath);
            } else {
                LogUtils.error('[useAppNavigation.goBack] Cannot navigate back');
            }
        },

        // Go forward
        goForward: () => navigate(1),
    };
};
