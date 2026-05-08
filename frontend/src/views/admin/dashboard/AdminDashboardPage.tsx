"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import AdminLayout from "@/component/layout/AdminLayout";
import { Package, FolderTree, Award, Loader2, ArrowRight, ShoppingCart, Users, DollarSign, Clock } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { AdminDashboardVM } from "./AdminDashboardVM";
import "./styles.css";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const AdminDashboardPage: React.FC = () => {
    useLanguage();
    const { config } = AdminDashboardVM();
    const { summary, categories, brands, isLoading } = config;

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="dash-loading">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    const kpiCards = [
        { label: t.admin.dashboard.revenue(), value: summary ? formatCurrency(summary.total_revenue) : "0₫", icon: DollarSign, variant: "green", link: AppRoutePath.ADMIN_ORDERS },
        { label: t.admin.dashboard.total_orders(), value: String(summary?.total_orders || 0), icon: ShoppingCart, variant: "amber", link: AppRoutePath.ADMIN_ORDERS },
        { label: t.admin.dashboard.pending_orders(), value: String(summary?.pending_orders || 0), icon: Clock, variant: "red", link: AppRoutePath.ADMIN_ORDERS },
        { label: t.admin.dashboard.products_label(), value: String(summary?.total_products || 0), icon: Package, variant: "blue", link: AppRoutePath.ADMIN_PRODUCTS },
        { label: t.admin.dashboard.customers(), value: String(summary?.total_users || 0), icon: Users, variant: "purple", link: AppRoutePath.ADMIN_CUSTOMERS },
        { label: t.admin.dashboard.categories_label(), value: String(categories.length), icon: FolderTree, variant: "cyan", link: AppRoutePath.ADMIN_CATEGORIES },
    ];

    const quickLinks = [
        { label: t.admin.dashboard.manage_products(), desc: t.admin.dashboard.manage_products_desc(), path: AppRoutePath.ADMIN_PRODUCTS, icon: Package },
        { label: t.admin.dashboard.manage_orders(), desc: t.admin.dashboard.manage_orders_desc(), path: AppRoutePath.ADMIN_ORDERS, icon: ShoppingCart },
        { label: t.admin.dashboard.manage_categories(), desc: t.admin.dashboard.manage_categories_desc(), path: AppRoutePath.ADMIN_CATEGORIES, icon: FolderTree },
        { label: t.admin.dashboard.manage_brands(), desc: t.admin.dashboard.manage_brands_desc(), path: AppRoutePath.ADMIN_BRANDS, icon: Award },
        { label: t.admin.dashboard.manage_customers(), desc: t.admin.dashboard.manage_customers_desc(), path: AppRoutePath.ADMIN_CUSTOMERS, icon: Users },
    ];

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.dashboard.title()}</h2>
                    <p className="page-subtitle">{t.admin.dashboard.subtitle()}</p>
                </div>
            </div>

            {/* KPI cards */}
            <div className="dash-kpi-grid">
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} to={card.link} className="dash-kpi">
                            <div className="dash-kpi__top">
                                <div className={`dash-kpi__icon dash-kpi__icon--${card.variant}`}>
                                    <Icon size={20} />
                                </div>
                                <ArrowRight size={16} className="dash-kpi__arrow" />
                            </div>
                            <div>
                                <p className="dash-kpi__value">{card.value}</p>
                                <p className="dash-kpi__label">{card.label}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom panels */}
            <div className="dash-panels">
                {/* Quick links */}
                <div className="dash-panel">
                    <div className="dash-panel__header">
                        <h3 className="dash-panel__title">{t.admin.dashboard.quick_management()}</h3>
                        <span className="dash-panel__badge">{t.admin.dashboard.items_suffix({ count: quickLinks.length })}</span>
                    </div>
                    <div className="dash-panel__body">
                        {quickLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.label} to={item.path} className="dash-quick-link">
                                    <div className="dash-quick-link__icon">
                                        <Icon size={16} />
                                    </div>
                                    <div className="dash-quick-link__text">
                                        <span className="dash-quick-link__label">{item.label}</span>
                                        <span className="dash-quick-link__desc">{item.desc}</span>
                                    </div>
                                    <ArrowRight size={14} className="dash-quick-link__arrow" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Categories & Brands overview */}
                <div className="dash-panel">
                    <div className="dash-panel__header">
                        <h3 className="dash-panel__title">{t.admin.dashboard.categories_and_brands()}</h3>
                        <span className="dash-panel__badge">{categories.length + brands.length}</span>
                    </div>
                    <div className="dash-panel__body">
                        {categories.slice(0, 4).map((cat) => (
                            <div key={cat.id} className="dash-info-item">
                                <div className="dash-info-item__left">
                                    <span className="dash-info-item__dot dash-info-item__dot--green" />
                                    <span className="dash-info-item__name">{cat.name}</span>
                                </div>
                                <span className="dash-info-item__count">{t.admin.dashboard.category_badge()}</span>
                            </div>
                        ))}
                        {brands.slice(0, 4).map((brand) => (
                            <div key={brand.id} className="dash-info-item">
                                <div className="dash-info-item__left">
                                    <span className="dash-info-item__dot dash-info-item__dot--blue" />
                                    <span className="dash-info-item__name">{brand.name}</span>
                                </div>
                                <span className="dash-info-item__count">{t.admin.dashboard.brand_badge()}</span>
                            </div>
                        ))}
                        {categories.length === 0 && brands.length === 0 && (
                            <p className="dash-info-item__name" style={{ padding: '12px', color: '#94a3b8' }}>{t.admin.dashboard.no_data()}</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
