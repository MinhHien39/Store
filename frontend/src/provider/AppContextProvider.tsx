"use client";

// src/provider/AppContextProvider.tsx
import { useContext, createContext } from 'react';
import {
    LocalStorageService,
    LocalStorageImpl
} from '@/core/store';
import {
    UserRepository,
    UserRepositoryImpl,
    ProductRepository,
    ProductRepositoryImpl,
    CategoryRepository,
    CategoryRepositoryImpl,
    BrandRepository,
    BrandRepositoryImpl,
    OrderRepository,
    OrderRepositoryImpl,
    DashboardRepository,
    DashboardRepositoryImpl,
    AuthRepository,
    AuthRepositoryImpl,
    StoreUserRepository,
    StoreUserRepositoryImpl,
} from '@/data/repository';

type AppContent = {
    localStorageService: LocalStorageService;
    userRepository: UserRepository;
    productRepository: ProductRepository;
    categoryRepository: CategoryRepository;
    brandRepository: BrandRepository;
    orderRepository: OrderRepository;
    dashboardRepository: DashboardRepository;
    authRepository: AuthRepository;
    storeUserRepository: StoreUserRepository;
}

// Initialize context with the service instance
export const InitAppContent: AppContent = {
    localStorageService: LocalStorageImpl.getInstance(),
    userRepository: new UserRepositoryImpl(),
    productRepository: new ProductRepositoryImpl(),
    categoryRepository: new CategoryRepositoryImpl(),
    brandRepository: new BrandRepositoryImpl(),
    orderRepository: new OrderRepositoryImpl(),
    dashboardRepository: new DashboardRepositoryImpl(),
    authRepository: new AuthRepositoryImpl(),
    storeUserRepository: new StoreUserRepositoryImpl(),
};

const AppContext = createContext<AppContent>(InitAppContent);

// AppContextProvider component to provide context to child components
export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AppContext.Provider value={InitAppContent}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};