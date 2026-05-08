"use client";

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import {
    Award,
    FolderTree,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    ShoppingCart,
    Users,
    X,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import LanguageSwitcher from "@/component/common/LanguageSwitcher";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    useLanguage();

    const adminNavItems = [
        { label: t.admin.nav.dashboard(), path: AppRoutePath.ADMIN_DASHBOARD, icon: LayoutDashboard },
        { label: t.admin.nav.products(), path: AppRoutePath.ADMIN_PRODUCTS, icon: Package },
        { label: t.admin.nav.categories(), path: AppRoutePath.ADMIN_CATEGORIES, icon: FolderTree },
        { label: t.admin.nav.brands(), path: AppRoutePath.ADMIN_BRANDS, icon: Award },
        { label: t.admin.nav.orders(), path: AppRoutePath.ADMIN_ORDERS, icon: ShoppingCart },
        { label: t.admin.nav.customers(), path: AppRoutePath.ADMIN_CUSTOMERS, icon: Users },
    ];

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        navigate(AppRoutePath.ADMIN_LOGIN);
    };

    return (
        <div className={`admin-layout${isSidebarOpen ? " admin-layout--open" : ""}`}>
            <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />

            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <Link to={AppRoutePath.ADMIN_DASHBOARD} className="admin-sidebar__brand">
                        <span className="admin-sidebar__brand-icon">
                            <Package size={20} />
                        </span>
                        <span>
                            <span className="admin-sidebar__brand-name">StoreAmazon</span>
                            <span className="admin-sidebar__brand-sub">Admin Console</span>
                        </span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="admin-sidebar__close" aria-label="close sidebar">
                        <X size={18} />
                    </button>
                </div>

                <nav className="admin-sidebar__nav">
                    {adminNavItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`admin-sidebar__link${isActive ? " admin-sidebar__link--active" : ""}`}
                            >
                                <Icon size={19} />
                                <span className="admin-sidebar__link-label">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar__footer">
                    <LanguageSwitcher variant="compact" />
                    <button onClick={handleLogout} className="admin-sidebar__logout">
                        <LogOut size={19} />
                        {t.admin.common.logout()}
                    </button>
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <button
                        onClick={() => setIsSidebarOpen((v) => !v)}
                        className="admin-topbar__toggle icon-btn"
                        aria-label="toggle sidebar"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="admin-topbar__info">
                        <p className="admin-topbar__title">StoreAmazon Admin</p>
                        <p className="admin-topbar__desc">Products, categories, brands and orders</p>
                    </div>
                    <div className="admin-topbar__lang">
                        <LanguageSwitcher />
                    </div>
                </header>

                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
