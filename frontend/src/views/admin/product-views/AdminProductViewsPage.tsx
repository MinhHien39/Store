"use client";

import React, { useState } from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { AdminProductViewsVM } from "./AdminProductViewsVM";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { BarChart3, Eye, Filter, Globe2, Loader2, Monitor, Search, Smartphone, Tablet } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import dayjs from "dayjs";

const AdminProductViewsPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminProductViewsVM();
    const [keyword, setKeyword] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [source, setSource] = useState("");
    const [deviceType, setDeviceType] = useState("");
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 7 }, (_, index) => currentYear - index);
    const maxChartViews = Math.max(1, ...config.chart.map((item) => item.total_views));

    const applyFilters = () => {
        action.onApplyFilters({ keyword, month, year, source, deviceType });
    };

    const getDeviceLabel = (value?: string | null) => {
        if (value === "desktop") return t.admin.productView.device_desktop();
        if (value === "mobile") return t.admin.productView.device_mobile();
        if (value === "tablet") return t.admin.productView.device_tablet();
        return t.admin.productView.device_unknown();
    };

    const getSourceLabel = (value?: string | null) => {
        if (value === "web") return t.admin.productView.source_web();
        return value || "-";
    };

    const getDevicePercent = (value: number, total: number) => {
        if (total <= 0 || value <= 0) return "0%";
        return `${Math.max(6, (value / total) * 100)}%`;
    };

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.productView.page_title()}</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{t.admin.productView.items_count({ count: config.stats.length })}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <input
                    className="input max-w-sm"
                    placeholder={t.admin.productView.search_placeholder()}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") applyFilters();
                    }}
                />
                <select className="input w-[150px]" value={month} onChange={(event) => setMonth(event.target.value)}>
                    <option value="">{t.admin.productView.filter_all_months()}</option>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                        <option key={value} value={String(value)}>
                            {t.admin.productView.filter_month_label({ month: value })}
                        </option>
                    ))}
                </select>
                <select className="input w-[140px]" value={year} onChange={(event) => setYear(event.target.value)}>
                    <option value="">{t.admin.productView.filter_all_years()}</option>
                    {yearOptions.map((value) => (
                        <option key={value} value={String(value)}>
                            {value}
                        </option>
                    ))}
                </select>
                <select className="input w-[150px]" value={source} onChange={(event) => setSource(event.target.value)}>
                    <option value="">{t.admin.productView.source_all()}</option>
                    <option value="web">{t.admin.productView.source_web()}</option>
                </select>
                <select className="input w-[160px]" value={deviceType} onChange={(event) => setDeviceType(event.target.value)}>
                    <option value="">{t.admin.productView.device_all()}</option>
                    <option value="desktop">{t.admin.productView.device_desktop()}</option>
                    <option value="mobile">{t.admin.productView.device_mobile()}</option>
                    <option value="tablet">{t.admin.productView.device_tablet()}</option>
                </select>
                <button className="btn btn-primary" onClick={applyFilters}>
                    <Filter size={16} />
                    {t.admin.productView.apply_filters()}
                </button>
                <button className="btn btn-outline" onClick={applyFilters}>
                    <Search size={16} />
                    {t.admin.common.search()}
                </button>
            </div>

            {config.isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : config.stats.length === 0 ? (
                <div className="empty-state">
                    <Eye size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">{t.admin.productView.empty_title()}</h3>
                    <p className="empty-state-desc">{t.admin.productView.empty_desc()}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="list-card p-4 border-l-4 border-l-primary">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Eye size={16} />
                                {t.admin.productView.summary_total_views()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{config.summary.total_views}</div>
                        </div>
                        <div className="list-card p-4 border-l-4 border-l-emerald-500">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Globe2 size={16} />
                                {t.admin.productView.summary_unique_visitors()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{config.summary.unique_visitors}</div>
                        </div>
                        <div className="list-card p-4 border-l-4 border-l-sky-500">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Smartphone size={16} />
                                {t.admin.productView.summary_mobile()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{config.summary.mobile_views}</div>
                        </div>
                        <div className="list-card p-4 border-l-4 border-l-orange-500">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Monitor size={16} />
                                {t.admin.productView.summary_desktop()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{config.summary.desktop_views}</div>
                        </div>
                    </div>

                    <div className="list-card p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                                    <BarChart3 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{t.admin.productView.chart_title()}</h3>
                                    <p className="text-sm text-muted-foreground">{t.admin.productView.chart_subtitle()}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="rounded border px-2 py-1 text-muted-foreground">{t.admin.productView.device_desktop()}</span>
                                <span className="rounded border px-2 py-1 text-muted-foreground">{t.admin.productView.device_mobile()}</span>
                                <span className="rounded border px-2 py-1 text-muted-foreground">{t.admin.productView.device_tablet()}</span>
                            </div>
                        </div>
                        {config.chart.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">{t.admin.productView.no_chart_data()}</div>
                        ) : (
                            <div className="space-y-3">
                                {config.chart.map((item, index) => {
                                    const width = `${Math.max(8, (item.total_views / maxChartViews) * 100)}%`;
                                    const deviceTotal = item.mobile_views + item.desktop_views + item.tablet_views;
                                    return (
                                        <div key={item.product_id} className="rounded border border-border bg-background p-4 transition hover:border-primary/40 hover:shadow-sm">
                                            <div className="grid gap-4 xl:grid-cols-[72px_minmax(220px,300px)_1fr_120px] xl:items-center">
                                                <div className="flex items-center gap-3 xl:block">
                                                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-lg font-semibold text-foreground">
                                                        #{index + 1}
                                                    </div>
                                                    <span className="text-xs uppercase tracking-wide text-muted-foreground xl:mt-1 xl:block">
                                                        {t.admin.productView.rank_label()}
                                                    </span>
                                                </div>

                                                <div className="min-w-0">
                                                    <Link
                                                        className="font-semibold text-primary hover:underline line-clamp-2"
                                                        to={AppRoutePath.ADMIN_PRODUCT_EDIT.replace(":id", String(item.product_id))}
                                                    >
                                                        {item.product_name}
                                                    </Link>
                                                    <div className="mt-1 text-sm text-muted-foreground">#{item.product_id}</div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                        <span className="text-sm font-medium">{t.admin.productView.col_total_views()}</span>
                                                        <span className="text-sm font-semibold">{item.total_views}</span>
                                                    </div>
                                                    <div className="h-11 rounded bg-muted overflow-hidden">
                                                        <div
                                                            className="h-full rounded-r bg-primary flex items-center px-3 text-primary-foreground text-sm font-semibold"
                                                            style={{ width }}
                                                        >
                                                            {item.total_views}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                                            <span>{t.admin.productView.device_mix()}</span>
                                                            <span>{item.unique_visitors} {t.admin.productView.short_unique()}</span>
                                                        </div>
                                                        <div className="flex h-3 overflow-hidden rounded bg-muted">
                                                            <div className="bg-orange-500" style={{ width: getDevicePercent(item.desktop_views, deviceTotal) }} />
                                                            <div className="bg-sky-500" style={{ width: getDevicePercent(item.mobile_views, deviceTotal) }} />
                                                            <div className="bg-emerald-500" style={{ width: getDevicePercent(item.tablet_views, deviceTotal) }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 text-center xl:grid-cols-1">
                                                    <div className="rounded bg-muted px-2 py-2">
                                                        <Monitor size={15} className="mx-auto mb-1 text-orange-500" />
                                                        <div className="text-sm font-semibold">{item.desktop_views}</div>
                                                    </div>
                                                    <div className="rounded bg-muted px-2 py-2">
                                                        <Smartphone size={15} className="mx-auto mb-1 text-sky-500" />
                                                        <div className="text-sm font-semibold">{item.mobile_views}</div>
                                                    </div>
                                                    <div className="rounded bg-muted px-2 py-2">
                                                        <Tablet size={15} className="mx-auto mb-1 text-emerald-500" />
                                                        <div className="text-sm font-semibold">{item.tablet_views}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                                                <div className="rounded bg-muted px-3 py-2">
                                                    <span className="block text-xs text-muted-foreground">{t.admin.productView.col_user_views()}</span>
                                                    {item.authenticated_views}
                                                </div>
                                                <div className="rounded bg-muted px-3 py-2">
                                                    <span className="block text-xs text-muted-foreground">{t.admin.productView.col_anonymous_views()}</span>
                                                    {item.anonymous_views}
                                                </div>
                                                <div className="rounded bg-muted px-3 py-2">
                                                    <span className="block text-xs text-muted-foreground">{t.admin.productView.col_ip()}</span>
                                                    <span className="font-mono">{item.latest_ip_address || "-"}</span>
                                                </div>
                                                <div className="rounded bg-muted px-3 py-2">
                                                    <span className="block text-xs text-muted-foreground">{t.admin.productView.col_source()}</span>
                                                    {getSourceLabel(item.latest_source)}
                                                </div>
                                                <div className="rounded bg-muted px-3 py-2">
                                                    <span className="block text-xs text-muted-foreground">{t.admin.productView.col_device()}</span>
                                                    {getDeviceLabel(item.latest_device_type)}
                                                </div>
                                                <div className="rounded bg-muted px-3 py-2">
                                                    <span className="block text-xs text-muted-foreground">{t.admin.productView.col_browser()}</span>
                                                    {[item.latest_browser, item.latest_os].filter(Boolean).join(" / ") || "-"}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">{t.admin.productView.col_latest_viewed()}: </span>
                                                {item.latest_viewed_at ? dayjs(item.latest_viewed_at).format("DD/MM/YYYY HH:mm") : "-"}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {config.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: config.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => action.onPageChange(page)}
                            className={`btn btn-sm min-w-[36px] ${
                                page === config.page ? "btn-primary" : "btn-outline"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProductViewsPage;
