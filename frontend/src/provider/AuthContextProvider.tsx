"use client";

// src/provider/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import User, { UserRole } from '@/data/models/User';
import Token from '@/data/models/Token';
import { AppLocalStorage } from '@/core/store';
import { LogUtils } from '@/core/utils';
import { ApiResultType, ApiResult } from '@/core/api';
import { useAppContext } from './AppContextProvider';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    onLoginSuccess: (user: User, token: Token) => void;
    onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { userRepository, memberRepository } = useAppContext();

    const appLocalStorage = AppLocalStorage.getInstance();

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const clearAuthState = () => {
        setUser(null);
        setIsAuthenticated(false);
        appLocalStorage.clearData();
    };

    const refreshUser = async () => {
        setIsLoading(true);
        try {
            // Check if token exists before making API call
            const token = appLocalStorage.getAccessToken();

            // If no token, clear auth state and exit early
            if (!token) {
                clearAuthState();
                return;
            }

            // Token exists, attempt to fetch user info to validate token and get user data
            let result: ApiResult<User>;

            if (appLocalStorage.getRoleIdFromUrl() === UserRole.MEMBER) {
                result = await memberRepository.doGetInfo();
            } else {
                result = await userRepository.doGetInfo();
            }

            switch (result.type) {
                case ApiResultType.Success:
                    LogUtils.debug('User info refreshed:', result.data);
                    setUser(result.data);
                    setIsAuthenticated(true);
                    break;
                case ApiResultType.Error:
                    LogUtils.error('Failed to refresh user:', result.error);
                    clearAuthState();
                    break;
            }
        } catch (error) {
            LogUtils.error('Failed to refresh user:', error);
            clearAuthState();
        } finally {
            setIsLoading(false);
        }
    };

    const onLoginSuccess = (user: User, token: Token) => {
        appLocalStorage.saveData([user, token]);
        setUser(user);
        setIsAuthenticated(true);
    };

    const onLogout = () => {
        clearAuthState();
    };

    useEffect(() => {
        // Auto fetch user on mount if token exists
        refreshUser();
    }, []);

    // Don't render children until initial user fetch is complete
    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                onLoginSuccess,
                onLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
