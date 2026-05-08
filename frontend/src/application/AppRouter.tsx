"use client";

import React from 'react'
import { BrowserRouter, useRoutes, Navigate } from "react-router-dom";

import BaseLoading from '@/core/base/BaseLoading';
import { useAuthContext } from '@/provider/AuthContextProvider';
import { AppRoutePath } from './AppRoutePath';
import { UserRole } from '@/data/models/User';

export const SuspenseWrapper = ({
    children,
    fallback = <BaseLoading />
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) => (
    <React.Suspense fallback={fallback}>{children}</React.Suspense>
);

const AdminGuard: React.FC<{
    layout: React.ReactNode;
}> = ({ layout }) => {
    const { isAuthenticated, user } = useAuthContext();

    if (!isAuthenticated || !user || user.roleId !== UserRole.ADMIN) {
        return <Navigate to={AppRoutePath.ADMIN_LOGIN} replace />;
    }

    return layout;
};

const AdminEntryRedirect: React.FC = () => {
    const { isAuthenticated, user } = useAuthContext();

    const isAdmin = isAuthenticated && user?.roleId === UserRole.ADMIN;

    return (
        <Navigate
            to={isAdmin ? AppRoutePath.ADMIN_DASHBOARD : AppRoutePath.ADMIN_LOGIN}
            replace
        />
    );
};

// Lazy load pages
const pages = {
    HomePage: React.lazy(() => import("@/views/home/HomePage")),
    ProductListPage: React.lazy(() => import("@/views/products/ProductListPage")),
    ProductDetailPage: React.lazy(() => import("@/views/product-detail/ProductDetailPage")),
    CartPage: React.lazy(() => import("@/views/cart/CartPage")),
    CheckoutPage: React.lazy(() => import("@/views/checkout/CheckoutPage")),
    CategoriesPage: React.lazy(() => import("@/views/categories/CategoriesPage")),
    BrandsPage: React.lazy(() => import("@/views/brands/BrandsPage")),
    LoginPage: React.lazy(() => import("@/views/auth/LoginPage")),
    RegisterPage: React.lazy(() => import("@/views/auth/RegisterPage")),
    NotFound: React.lazy(() => import("@/views/others/NotFoundPage")),
    AccountPage: React.lazy(() => import("@/views/account/AccountPage")),
    OrderListPage: React.lazy(() => import("@/views/account/OrderListPage")),
    OrderDetailPage: React.lazy(() => import("@/views/account/OrderDetailPage")),
    // Admin
    AdminLoginPage: React.lazy(() => import("@/views/admin/login/AdminLoginPage")),
    AdminDashboardPage: React.lazy(() => import("@/views/admin/dashboard/AdminDashboardPage")),
    AdminProductsPage: React.lazy(() => import("@/views/admin/products/AdminProductsPage")),
    AdminCategoriesPage: React.lazy(() => import("@/views/admin/categories/AdminCategoriesPage")),
    AdminBrandsPage: React.lazy(() => import("@/views/admin/brands/AdminBrandsPage")),
    AdminOrderListPage: React.lazy(() => import("@/views/admin/orders/AdminOrderListPage")),
    AdminOrderDetailPage: React.lazy(() => import("@/views/admin/orders/AdminOrderDetailPage")),
    AdminCustomerListPage: React.lazy(() => import("@/views/admin/customers/AdminCustomerListPage")),
};

const AppRoutes: React.FC = () => {
    const routes = [
        {
            path: AppRoutePath.HOME,
            element: (
                <SuspenseWrapper>
                    <pages.HomePage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.PRODUCTS,
            element: (
                <SuspenseWrapper>
                    <pages.ProductListPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.PRODUCT_DETAIL,
            element: (
                <SuspenseWrapper>
                    <pages.ProductDetailPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.CART,
            element: (
                <SuspenseWrapper>
                    <pages.CartPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.CHECKOUT,
            element: (
                <SuspenseWrapper>
                    <pages.CheckoutPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.CATEGORIES,
            element: (
                <SuspenseWrapper>
                    <pages.CategoriesPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.BRANDS,
            element: (
                <SuspenseWrapper>
                    <pages.BrandsPage />
                </SuspenseWrapper>
            )
        },
        {
            path: `${AppRoutePath.CATEGORIES}/:id`,
            element: (
                <SuspenseWrapper>
                    <pages.ProductListPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.SEARCH,
            element: (
                <SuspenseWrapper>
                    <pages.ProductListPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.LOGIN,
            element: (
                <SuspenseWrapper>
                    <pages.LoginPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.REGISTER,
            element: (
                <SuspenseWrapper>
                    <pages.RegisterPage />
                </SuspenseWrapper>
            )
        },
        // Account (user protected)
        {
            path: AppRoutePath.ACCOUNT,
            element: (
                <SuspenseWrapper>
                    <pages.AccountPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.ORDERS,
            element: (
                <SuspenseWrapper>
                    <pages.OrderListPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.ORDER_DETAIL,
            element: (
                <SuspenseWrapper>
                    <pages.OrderDetailPage />
                </SuspenseWrapper>
            )
        },
        // Admin routes
        {
            path: AppRoutePath.ADMIN,
            element: <AdminEntryRedirect />
        },
        {
            path: AppRoutePath.ADMIN_LOGIN,
            element: (
                <SuspenseWrapper>
                    <pages.AdminLoginPage />
                </SuspenseWrapper>
            )
        },
        {
            path: AppRoutePath.ADMIN_DASHBOARD,
            element: <AdminGuard layout={(
                <SuspenseWrapper>
                    <pages.AdminDashboardPage />
                </SuspenseWrapper>
            )} />
        },
        {
            path: AppRoutePath.ADMIN_PRODUCTS,
            element: <AdminGuard layout={(
                <SuspenseWrapper>
                    <pages.AdminProductsPage />
                </SuspenseWrapper>
            )} />
        },
        {
            path: AppRoutePath.ADMIN_CATEGORIES,
            element: <AdminGuard layout={(
                <SuspenseWrapper>
                    <pages.AdminCategoriesPage />
                </SuspenseWrapper>
            )} />
        },
        {
            path: AppRoutePath.ADMIN_BRANDS,
            element: <AdminGuard layout={(
                <SuspenseWrapper>
                    <pages.AdminBrandsPage />
                </SuspenseWrapper>
            )} />
        },
        {
            path: AppRoutePath.ADMIN_ORDERS,
            element: <AdminGuard layout={(
                <SuspenseWrapper>
                    <pages.AdminOrderListPage />
                </SuspenseWrapper>
            )} />
        },
        {
            path: AppRoutePath.ADMIN_ORDER_DETAIL,
            element: <AdminGuard layout={(
                <SuspenseWrapper>
                    <pages.AdminOrderDetailPage />
                </SuspenseWrapper>
            )} />
        },
        {
            path: AppRoutePath.ADMIN_CUSTOMERS,
            element: <AdminGuard layout={(
                <SuspenseWrapper>
                    <pages.AdminCustomerListPage />
                </SuspenseWrapper>
            )} />
        },
        {
            path: `*`,
            element: (
                <SuspenseWrapper>
                    <pages.NotFound />
                </SuspenseWrapper>
            )
        }
    ];

    return useRoutes(routes);
};

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
};
