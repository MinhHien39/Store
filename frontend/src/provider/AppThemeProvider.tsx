"use client";

// src/provider/AppThemeProvider.tsx
import { useContext, createContext } from 'react';

type AppThemeContent = {
}

// Initialize context with the service instance
export const InitAppThemeContent: AppThemeContent = {
};

const AppTheme = createContext<AppThemeContent>(InitAppThemeContent);

// AppContextProvider component to provide context to child components
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AppTheme.Provider value={InitAppThemeContent}>
            {children}
        </AppTheme.Provider>
    );
};

export const useAppTheme = () => {
    const context = useContext(AppTheme);
    if (!context) {
        throw new Error('useAppTheme must be used within an AppThemeProvider');
    }
    return context;
};
