"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import AdminLayout from "@/component/layout/AdminLayout";
import { Package, FolderTree, Award, Loader2, ArrowRight, ShoppingCart, Users, DollarSign, Clock, Activity, Sparkles, TrendingUp } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { AdminDashboardVM } from "./AdminDashboardVM";
import "./styles.css";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const formatCompact = (value: number) =>
    new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(value);

const AdminDashboardPage: React.FC = () => {
    useLanguage();
    const { config } = AdminDashboardVM();
    const { summary, chart, categories, brands, isLoading } = config;

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

    const chartDays = chart?.days || [];
    const maxOrders = Math.max(...chartDays.map((day) => day.orders), 1);
    const maxRevenue = Math.max(...chartDays.map((day) => day.revenue), 1);
    const totalChartOrders = chartDays.reduce((total, day) => total + day.orders, 0);
    const totalChartRevenue = chartDays.reduce((total, day) => total + day.revenue, 0);
    const chartWidth = Math.max(680, chartDays.length * 96);
    const chartHeight = 250;
    const plotTop = 24;
    const plotBottom = 188;
    const plotHeight = plotBottom - plotTop;
    const step = chartDays.length > 1 ? chartWidth / chartDays.length : chartWidth;
    const revenuePoints = chartDays.map((day, index) => {
        const x = step * index + step / 2;
        const y = plotBottom - (day.revenue / maxRevenue) * plotHeight;
        return { x, y };
    });
    const revenueLine = revenuePoints.map((point) => `${point.x},${point.y}`).join(" ");
    const revenueArea = revenuePoints.length > 0
        ? `0,${plotBottom} ${revenueLine} ${chartWidth},${plotBottom}`
        : "";

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="page-header dash-page-header">
                <div>
                    <h2 className="page-title">{t.admin.dashboard.title()}</h2>
                    <p className="page-subtitle">{t.admin.dashboard.subtitle()}</p>
                </div>
            </div>

            <div className="dash-hero">
                <div className="dash-hero__content">
                    <span className="dash-hero__eyebrow"><Sparkles size={15} /> Store pulse</span>
                    <h3 className="dash-hero__title">{formatCurrency(summary?.total_revenue || 0)}</h3>
                    <p className="dash-hero__desc">{t.admin.dashboard.revenue()} · {chartDays.length || 7} days</p>
                </div>
                <div className="dash-hero__metrics">
                    <div>
                        <Activity size={18} />
                        <strong>{totalChartOrders}</strong>
                        <span>{t.admin.dashboard.total_orders()}</span>
                    </div>
                    <div>
                        <TrendingUp size={18} />
                        <strong>{formatCompact(totalChartRevenue)}</strong>
                        <span>{t.admin.dashboard.revenue()}</span>
                    </div>
                </div>
            </div>

            {/* KPI cards */}
            <div className="dash-kpi-grid">
                {kpiCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} to={card.link} className={`dash-kpi dash-kpi--${card.variant}`} style={{ "--delay": `${index * 65}ms` } as React.CSSProperties}>
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
                <div className="dash-panel dash-panel--quick">
                    <div className="dash-panel__header">
                        <h3 className="dash-panel__title">{t.admin.dashboard.quick_management()}</h3>
                        <span className="dash-panel__badge">{t.admin.dashboard.items_suffix({ count: quickLinks.length })}</span>
                    </div>
                    <div className="dash-panel__body">
                        {quickLinks.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.label} to={item.path} className="dash-quick-link" style={{ "--delay": `${index * 55}ms` } as React.CSSProperties}>
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
                <div className="dash-panel dash-panel--catalog">
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

            {/* Orders chart — last 7 days */}
            {chartDays.length > 0 && (
                <div className="dash-chart">
                    <div className="dash-chart__header">
                        <div>
                            <h3 className="dash-panel__title">{t.admin.dashboard.chart_title()}</h3>
                            <p className="dash-chart__subtitle">{formatCompact(totalChartRevenue)} · {totalChartOrders} {t.admin.dashboard.total_orders()}</p>
                        </div>
                        <div className="dash-chart__legend">
                            <span><span className="dash-chart__dot dash-chart__dot--orders" />{t.admin.dashboard.total_orders()}</span>
                            <span><span className="dash-chart__dot dash-chart__dot--revenue" />{t.admin.dashboard.revenue()}</span>
                        </div>
                    </div>
                    <div className="dash-chart__scroll">
                        <svg className="dash-chart__svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img">
                            <defs>
                                <linearGradient id="dashRevenueArea" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                                </linearGradient>
                                <linearGradient id="dashOrderBar" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#fb923c" />
                                    <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                            </defs>
                            {[0, 1, 2, 3].map((line) => {
                                const y = plotTop + (plotHeight / 3) * line;
                                return <line key={line} x1="0" x2={chartWidth} y1={y} y2={y} className="dash-chart__gridline" />;
                            })}
                            {revenueArea && <polygon points={revenueArea} className="dash-chart__area" />}
                            {revenueLine && <polyline points={revenueLine} className="dash-chart__line" />}
                            {chartDays.map((day, index) => {
                                const x = step * index + step / 2;
                                const barHeight = Math.max(6, (day.orders / maxOrders) * 132);
                                const barWidth = Math.min(34, step * 0.34);
                                const barX = x - barWidth / 2;
                                const barY = plotBottom - barHeight;
                                const point = revenuePoints[index];
                                return (
                                    <g key={day.date} className="dash-chart__day" style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}>
                                        <rect x={barX} y={barY} width={barWidth} height={barHeight} rx="10" className="dash-chart__bar" />
                                        {point && <circle cx={point.x} cy={point.y} r="5" className="dash-chart__point" />}
                                        <text x={x} y={218} textAnchor="middle" className="dash-chart__label">{day.date.slice(5)}</text>
                                        <text x={x} y={238} textAnchor="middle" className="dash-chart__value">{day.orders}</text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboardPage;
