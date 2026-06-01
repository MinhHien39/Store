"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import Pagination from "@/component/pagination/Pagination";
import { AdminProductViewsVM } from "./AdminProductViewsVM";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { BarChart3, Eye, Globe2, Loader2, Monitor, Search, Smartphone, Tablet, Users } from "lucide-react";
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
    const actionRef = useRef(action);
    const didMountRef = useRef(false);
    const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 7 }, (_, index) => currentYear - index);
    const topChartItems = config.chart.slice(0, 4);
    const maxCylinderViews = Math.max(1, ...topChartItems.map((item) => item.total_views));
    const totalDeviceViews = config.summary.desktop_views + config.summary.mobile_views + config.summary.tablet_views;
    const unknownDeviceViews = Math.max(0, config.summary.total_views - totalDeviceViews);
    const pageStartItem = config.totalItems === 0 ? 0 : (config.page - 1) * config.perPage + 1;

    const applyFilters = () => {
        action.onApplyFilters({ keyword, month, year, source, deviceType });
    };

    useEffect(() => {
        actionRef.current = action;
    }, [action]);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return;
        }

        if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
        filterDebounceRef.current = setTimeout(() => {
            actionRef.current.onApplyFilters({ keyword, month, year, source, deviceType });
        }, keyword ? 420 : 120);

        return () => {
            if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
        };
    }, [keyword, month, year, source, deviceType]);

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

    const deviceSegments = useMemo(() => {
        return [
            {
                key: "desktop",
                label: t.admin.productView.device_desktop(),
                value: config.summary.desktop_views,
                color: "#f97316",
                icon: <Monitor size={16} />,
            },
            {
                key: "mobile",
                label: t.admin.productView.device_mobile(),
                value: config.summary.mobile_views,
                color: "#2563eb",
                icon: <Smartphone size={16} />,
            },
            {
                key: "tablet",
                label: t.admin.productView.device_tablet(),
                value: config.summary.tablet_views,
                color: "#0f766e",
                icon: <Tablet size={16} />,
            },
            {
                key: "unknown",
                label: t.admin.productView.device_unknown(),
                value: unknownDeviceViews,
                color: "#94a3b8",
                icon: <Globe2 size={16} />,
            },
        ].filter((segment) => segment.value > 0);
    }, [
        config.summary.desktop_views,
        config.summary.mobile_views,
        config.summary.tablet_views,
        unknownDeviceViews,
    ]);

    const donutTotal = Math.max(1, deviceSegments.reduce((total, segment) => total + segment.value, 0));
    const donutBackground = useMemo(() => {
        if (deviceSegments.length === 0) return "#e2e8f0";
        let cursor = 0;
        const stops = deviceSegments.map((segment) => {
            const start = cursor;
            const end = cursor + (segment.value / donutTotal) * 100;
            cursor = end;
            return `${segment.color} ${start}% ${end}%`;
        });
        return `conic-gradient(${stops.join(", ")})`;
    }, [deviceSegments, donutTotal]);

    const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.productView.page_title()}</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{t.admin.productView.items_count({ count: config.totalItems })}</p>
                    )}
                </div>
            </div>

            <div className="product-view-filters mb-6">
                <label className="product-view-search">
                    <Search size={17} />
                    <input
                        placeholder={t.admin.productView.search_placeholder()}
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") applyFilters();
                        }}
                    />
                </label>
                <select className="input" value={month} onChange={(event) => setMonth(event.target.value)}>
                    <option value="">{t.admin.productView.filter_all_months()}</option>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                        <option key={value} value={String(value)}>
                            {t.admin.productView.filter_month_label({ month: value })}
                        </option>
                    ))}
                </select>
                <select className="input" value={year} onChange={(event) => setYear(event.target.value)}>
                    <option value="">{t.admin.productView.filter_all_years()}</option>
                    {yearOptions.map((value) => (
                        <option key={value} value={String(value)}>
                            {value}
                        </option>
                    ))}
                </select>
                <select className="input" value={source} onChange={(event) => setSource(event.target.value)}>
                    <option value="">{t.admin.productView.source_all()}</option>
                    <option value="web">{t.admin.productView.source_web()}</option>
                </select>
                <select className="input" value={deviceType} onChange={(event) => setDeviceType(event.target.value)}>
                    <option value="">{t.admin.productView.device_all()}</option>
                    <option value="desktop">{t.admin.productView.device_desktop()}</option>
                    <option value="mobile">{t.admin.productView.device_mobile()}</option>
                    <option value="tablet">{t.admin.productView.device_tablet()}</option>
                </select>
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
                <div className="product-views-shell space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="summary-tile list-card p-4 border-l-4 border-l-primary">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Eye size={16} />
                                {t.admin.productView.summary_total_views()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{formatNumber(config.summary.total_views)}</div>
                        </div>
                        <div className="summary-tile list-card p-4 border-l-4 border-l-emerald-500">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Globe2 size={16} />
                                {t.admin.productView.summary_unique_visitors()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{formatNumber(config.summary.unique_visitors)}</div>
                        </div>
                        <div className="summary-tile list-card p-4 border-l-4 border-l-sky-500">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Smartphone size={16} />
                                {t.admin.productView.summary_mobile()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{formatNumber(config.summary.mobile_views)}</div>
                        </div>
                        <div className="summary-tile list-card p-4 border-l-4 border-l-orange-500">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Monitor size={16} />
                                {t.admin.productView.summary_desktop()}
                            </div>
                            <div className="mt-2 text-2xl font-semibold">{formatNumber(config.summary.desktop_views)}</div>
                        </div>
                    </div>

                    <div className="chart-showcase-card list-card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded bg-primary/10 text-primary flex items-center justify-center">
                                    <BarChart3 size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">{t.admin.productView.chart_title()}</h3>
                                    <p className="text-xs text-muted-foreground">{t.admin.productView.chart_subtitle()}</p>
                                </div>
                            </div>
                        </div>
                        {config.chart.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">{t.admin.productView.no_chart_data()}</div>
                        ) : (
                            <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
                                <div className="device-donut-panel">
                                    <div className="donut-chart" style={{ background: donutBackground }}>
                                        <div className="donut-center">
                                            <span>{formatNumber(config.summary.total_views)}</span>
                                            <small>{t.admin.productView.summary_total_views()}</small>
                                        </div>
                                    </div>
                                    <div className="mt-5 space-y-3">
                                        {deviceSegments.map((segment) => (
                                            <div key={segment.key} className="device-legend-row">
                                                <span className="device-legend-icon" style={{ color: segment.color }}>
                                                    {segment.icon}
                                                </span>
                                                <span className="flex-1">{segment.label}</span>
                                                <strong>{formatNumber(segment.value)}</strong>
                                                <small>{Math.round((segment.value / donutTotal) * 100)}%</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="cylinder-panel">
                                    <div className="cylinder-stage">
                                        {topChartItems.map((item, index) => {
                                            const cylinderStyle = {
                                                "--height": `${Math.max(44, (item.total_views / maxCylinderViews) * 150)}px`,
                                                "--delay": `${index * 85}ms`,
                                                "--accent": index === 0 ? "#fb923c" : index === 1 ? "#38bdf8" : index === 2 ? "#10b981" : "#f97316",
                                            } as React.CSSProperties;

                                            return (
                                                <Link
                                                    key={item.product_id}
                                                    className="cylinder-item"
                                                    style={cylinderStyle}
                                                    to={AppRoutePath.ADMIN_PRODUCT_EDIT.replace(":id", String(item.product_id))}
                                                    title={item.product_name}
                                                >
                                                    <span className="cylinder-rank">#{index + 1}</span>
                                                    <span className="view-cylinder">
                                                        <span className="view-cylinder-top" />
                                                        <span className="view-cylinder-shine" />
                                                        <span className="view-cylinder-value">{formatNumber(item.total_views)}</span>
                                                    </span>
                                                    <span className="cylinder-name">{item.product_name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="product-view-list-grid">
                        {config.stats.map((item, index) => (
                            <div
                                key={item.product_id}
                                className="product-view-item"
                                style={{ "--item-delay": `${index * 45}ms` } as React.CSSProperties}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                            <span className="rank-pill">#{pageStartItem + index}</span>
                                            <span>{t.admin.productView.rank_label()}</span>
                                        </div>
                                        <Link
                                            className="font-semibold text-primary hover:underline line-clamp-2"
                                            to={AppRoutePath.ADMIN_PRODUCT_EDIT.replace(":id", String(item.product_id))}
                                        >
                                            {item.product_name}
                                        </Link>
                                        <div className="mt-1 text-sm text-muted-foreground">#{item.product_id}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-semibold">{formatNumber(item.total_views)}</div>
                                        <div className="text-xs text-muted-foreground">{t.admin.productView.col_total_views()}</div>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    <div className="metric-chip">
                                        <Monitor size={15} className="text-orange-500" />
                                        <span>{formatNumber(item.desktop_views)}</span>
                                    </div>
                                    <div className="metric-chip">
                                        <Smartphone size={15} className="text-sky-600" />
                                        <span>{formatNumber(item.mobile_views)}</span>
                                    </div>
                                    <div className="metric-chip">
                                        <Tablet size={15} className="text-emerald-600" />
                                        <span>{formatNumber(item.tablet_views)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                                    <div className="detail-chip">
                                        <Users size={14} />
                                        <span>{formatNumber(item.unique_visitors)} {t.admin.productView.short_unique()}</span>
                                    </div>
                                    <div className="detail-chip">
                                        <Eye size={14} />
                                        <span>
                                            {t.admin.productView.user_short()} {formatNumber(item.authenticated_views)}
                                            <span className="view-split-dot">•</span>
                                            {t.admin.productView.anonymous_short()} {formatNumber(item.anonymous_views)}
                                        </span>
                                    </div>
                                    <div className="detail-chip detail-chip-ip sm:col-span-2">
                                        <Globe2 size={14} />
                                        <span className="detail-chip-label">{t.admin.productView.col_ip()}</span>
                                        <span className="detail-chip-value font-mono" title={item.latest_ip_address || "-"}>
                                            {item.latest_ip_address || "-"}
                                        </span>
                                    </div>
                                    <div className="detail-chip">
                                        <Globe2 size={14} />
                                        <span>{getSourceLabel(item.latest_source)}</span>
                                    </div>
                                    <div className="detail-chip">
                                        <Monitor size={14} />
                                        <span>{getDeviceLabel(item.latest_device_type)}</span>
                                    </div>
                                </div>

                                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                                    <div className="min-w-0">
                                        <span className="font-medium text-foreground">{t.admin.productView.col_browser()}: </span>
                                        <span>{[item.latest_browser, item.latest_os].filter(Boolean).join(" / ") || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">{t.admin.productView.col_latest_viewed()}: </span>
                                        <span>{item.latest_viewed_at ? dayjs(item.latest_viewed_at).format("DD/MM/YYYY HH:mm") : "-"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!config.isLoading && config.totalItems > 0 && (
                <Pagination
                    props={{
                        currentPage: config.page,
                        perPage: config.perPage,
                        totalCount: config.totalItems,
                        totalPages: config.totalPages,
                        onPageChange: action.onPageChange,
                        showPerPage: false,
                    }}
                />
            )}
            <style jsx>{`
                .product-view-filters {
                    display: grid;
                    grid-template-columns: minmax(220px, 1fr) repeat(4, minmax(140px, 170px));
                    gap: 10px;
                    align-items: center;
                }

                .product-view-filters .input,
                .product-view-search {
                    min-height: 44px;
                    border-radius: 8px;
                    border: 1px solid var(--color-border);
                    background: var(--color-card);
                    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
                }

                .product-view-filters .input:hover,
                .product-view-search:hover {
                    border-color: rgba(249, 115, 22, 0.45);
                }

                .product-view-filters .input:focus,
                .product-view-search:focus-within {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.12);
                }

                .product-view-search {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0 14px;
                    color: var(--color-muted-foreground);
                }

                .product-view-search input {
                    width: 100%;
                    min-width: 0;
                    border: 0;
                    outline: 0;
                    background: transparent;
                    color: var(--color-foreground);
                }

                .product-views-shell {
                    animation: productViewsFade 360ms ease both;
                }

                .summary-tile {
                    transition: transform 180ms ease, box-shadow 180ms ease;
                }

                .summary-tile:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--app-shadow-md);
                }

                .chart-showcase-card {
                    position: relative;
                    overflow: hidden;
                    background:
                        radial-gradient(circle at 85% 5%, rgba(37, 99, 235, 0.09), rgba(37, 99, 235, 0) 28%),
                        radial-gradient(circle at 8% 10%, rgba(249, 115, 22, 0.12), rgba(249, 115, 22, 0) 32%),
                        var(--color-card);
                }

                .chart-showcase-card::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(148, 163, 184, 0.09) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(148, 163, 184, 0.09) 1px, transparent 1px);
                    background-size: 34px 34px;
                    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0));
                    pointer-events: none;
                }

                .chart-showcase-card > * {
                    position: relative;
                    z-index: 1;
                }

                .device-donut-panel,
                .cylinder-panel {
                    min-height: 270px;
                    border-radius: 8px;
                    background:
                        linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(255, 255, 255, 0.98)),
                        var(--color-card);
                    border: 1px solid var(--color-border);
                    padding: 16px;
                    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
                    overflow: hidden;
                }

                .device-donut-panel {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .cylinder-panel {
                    position: relative;
                    display: flex;
                    align-items: stretch;
                    padding-top: 12px;
                }

                .cylinder-panel::before {
                    content: "";
                    position: absolute;
                    left: 18px;
                    right: 18px;
                    bottom: 66px;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.28), transparent);
                }

                .cylinder-panel::after {
                    content: "";
                    position: absolute;
                    inset: auto 32px 48px;
                    height: 42px;
                    border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(249, 115, 22, 0.18), rgba(249, 115, 22, 0) 70%);
                    filter: blur(2px);
                }

                .donut-chart {
                    position: relative;
                    width: min(150px, 58vw);
                    aspect-ratio: 1;
                    margin: 0 auto;
                    border-radius: 999px;
                    box-shadow:
                        0 16px 34px rgba(15, 23, 42, 0.12),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.45);
                    animation: donutPop 760ms cubic-bezier(0.2, 0.85, 0.2, 1) both, donutGlow 2800ms ease-in-out 900ms infinite;
                }

                .donut-chart::after {
                    content: "";
                    position: absolute;
                    inset: 10px;
                    border-radius: inherit;
                    border: 1px solid rgba(255, 255, 255, 0.7);
                    background: radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 42%);
                    pointer-events: none;
                }

                .donut-chart::before {
                    content: "";
                    position: absolute;
                    inset: -8px;
                    border-radius: inherit;
                    background: conic-gradient(from 90deg, rgba(249, 115, 22, 0), rgba(249, 115, 22, 0.28), rgba(37, 99, 235, 0.22), rgba(15, 118, 110, 0.2), rgba(249, 115, 22, 0));
                    filter: blur(18px);
                    opacity: 0.55;
                    z-index: -1;
                }

                .donut-center {
                    position: absolute;
                    inset: 34px;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    background: var(--color-card);
                    text-align: center;
                    box-shadow: inset 0 0 0 1px var(--color-border);
                }

                .donut-center span {
                    font-size: 1.35rem;
                    font-weight: 800;
                    line-height: 1;
                }

                .donut-center small {
                    margin-top: 5px;
                    color: var(--color-muted-foreground);
                    font-size: 0.64rem;
                    font-weight: 700;
                }

                .device-legend-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-radius: 8px;
                    background: var(--color-card);
                    border: 1px solid var(--color-border);
                    padding: 7px 9px;
                    animation: productViewsFade 420ms ease both;
                    transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
                }

                .device-legend-row:hover {
                    transform: translateX(4px);
                    border-color: rgba(249, 115, 22, 0.32);
                    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
                }

                .device-legend-icon {
                    display: inline-flex;
                    width: 23px;
                    height: 23px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    background: var(--color-muted);
                }

                .device-legend-row small {
                    min-width: 42px;
                    color: var(--color-muted-foreground);
                    text-align: right;
                }

                .cylinder-stage {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    width: 100%;
                    min-height: 202px;
                    grid-template-columns: repeat(4, minmax(58px, 1fr));
                    align-items: end;
                    align-content: end;
                    gap: 14px;
                }

                .cylinder-item {
                    display: grid;
                    min-width: 0;
                    grid-template-rows: 32px 170px auto;
                    gap: 6px;
                    align-items: end;
                    color: inherit;
                    text-align: center;
                }

                .cylinder-rank {
                    position: relative;
                    z-index: 4;
                    justify-self: center;
                    align-self: start;
                    border-radius: 999px;
                    background:
                        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94)),
                        var(--color-card);
                    border: 1px solid rgba(203, 213, 225, 0.9);
                    padding: 5px 10px;
                    color: var(--color-foreground);
                    font-size: 0.72rem;
                    font-weight: 800;
                    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.09);
                    transition: transform 180ms ease, color 180ms ease, border-color 180ms ease;
                }

                .cylinder-rank::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: calc(100% + 1px);
                    width: 1px;
                    height: 9px;
                    background: linear-gradient(180deg, rgba(148, 163, 184, 0.55), rgba(148, 163, 184, 0));
                    transform: translateX(-50%);
                }

                .view-cylinder {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    width: min(100%, 92px);
                    min-width: 42px;
                    height: var(--height);
                    align-self: end;
                    justify-self: center;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px 999px 10px 10px;
                    background:
                        linear-gradient(90deg, rgba(0, 0, 0, 0.16), rgba(255, 255, 255, 0.22), rgba(0, 0, 0, 0.12)),
                        linear-gradient(180deg, color-mix(in srgb, var(--accent) 86%, white), var(--accent) 52%, color-mix(in srgb, var(--accent) 76%, black));
                    box-shadow:
                        0 16px 24px color-mix(in srgb, var(--accent) 28%, transparent),
                        inset 10px 0 18px rgba(255, 255, 255, 0.13),
                        inset -12px 0 20px rgba(0, 0, 0, 0.12);
                    transform-origin: bottom;
                    animation: cylinderRise 780ms cubic-bezier(0.2, 0.85, 0.2, 1) both, cylinderFloat 3200ms ease-in-out calc(var(--delay) + 900ms) infinite;
                    animation-delay: var(--delay);
                    overflow: visible;
                }

                .view-cylinder::after {
                    content: "";
                    position: absolute;
                    left: 8%;
                    right: 8%;
                    bottom: -12px;
                    height: 22px;
                    border-radius: 50%;
                    background: radial-gradient(ellipse, color-mix(in srgb, var(--accent) 38%, transparent), transparent 70%);
                    filter: blur(4px);
                    z-index: -1;
                }

                .view-cylinder-top {
                    position: absolute;
                    z-index: 2;
                    top: -9px;
                    left: 0;
                    right: 0;
                    height: 18px;
                    border-radius: 999px;
                    background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 44%, white), var(--accent));
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: inset 0 5px 12px rgba(255, 255, 255, 0.3);
                }

                .view-cylinder-shine {
                    position: absolute;
                    inset: 14px auto 10px 18%;
                    width: 18%;
                    border-radius: 999px;
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.04));
                }

                .view-cylinder-value {
                    position: relative;
                    z-index: 1;
                    color: #ffffff;
                    font-size: 0.72rem;
                    font-weight: 800;
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
                }

                .cylinder-name {
                    display: -webkit-box;
                    min-height: 38px;
                    overflow: hidden;
                    color: var(--color-muted-foreground);
                    font-size: 0.78rem;
                    font-weight: 700;
                    line-height: 1.25;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }

                .cylinder-item:hover .view-cylinder {
                    filter: saturate(1.12);
                    transform: translateY(-8px) scale(1.02);
                    transition: transform 220ms ease, filter 180ms ease;
                }

                .view-split-dot {
                    display: inline-block;
                    margin: 0 7px;
                    color: var(--color-muted-foreground);
                }

                .cylinder-item:hover .cylinder-rank {
                    color: var(--color-primary);
                    transform: translateY(-2px);
                }

                .product-view-list-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 14px;
                }

                .product-view-item {
                    position: relative;
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    background:
                        linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)),
                        var(--color-card);
                    padding: 18px;
                    transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
                    animation: productViewsFade 460ms ease both;
                    animation-delay: var(--item-delay);
                }

                .product-view-item::before {
                    content: "";
                    position: absolute;
                    inset: 0 auto 0 0;
                    width: 4px;
                    background: linear-gradient(180deg, #f97316, #2563eb);
                    opacity: 0;
                    transition: opacity 180ms ease;
                }

                .product-view-item::after {
                    content: "";
                    position: absolute;
                    top: -60px;
                    right: -60px;
                    width: 140px;
                    height: 140px;
                    border-radius: 999px;
                    background: radial-gradient(circle, rgba(249, 115, 22, 0.12), rgba(249, 115, 22, 0));
                    opacity: 0;
                    transition: opacity 180ms ease;
                    pointer-events: none;
                }

                .product-view-item:hover {
                    transform: translateY(-2px);
                    border-color: rgba(249, 115, 22, 0.38);
                    box-shadow: var(--app-shadow-md);
                }

                .product-view-item:hover::before,
                .product-view-item:hover::after {
                    opacity: 1;
                }

                .rank-pill {
                    display: inline-flex;
                    min-width: 32px;
                    min-height: 24px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    background: var(--color-muted);
                    color: var(--color-foreground);
                }

                .metric-chip,
                .detail-chip {
                    display: flex;
                    min-width: 0;
                    align-items: center;
                    gap: 8px;
                    border-radius: 8px;
                    background: var(--color-muted);
                    padding: 9px 10px;
                    font-weight: 700;
                    transition: transform 180ms ease, background-color 180ms ease;
                }

                .metric-chip {
                    justify-content: center;
                }

                .metric-chip:hover,
                .detail-chip:hover {
                    transform: translateY(-1px);
                    background: #eef2f7;
                }

                .detail-chip span {
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .detail-chip-ip {
                    background: linear-gradient(180deg, #f8fafc, #eef2f7);
                }

                .detail-chip-label {
                    flex: 0 0 auto;
                    color: var(--color-muted-foreground);
                    font-size: 0.78rem;
                    font-weight: 800;
                }

                .detail-chip-value {
                    flex: 1 1 auto;
                    min-width: 0;
                    color: var(--color-foreground);
                    text-align: right;
                }

                @keyframes productViewsFade {
                    from {
                        opacity: 0;
                        transform: translateY(14px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes donutPop {
                    from {
                        opacity: 0;
                        transform: scale(0.82) rotate(-22deg);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }

                @keyframes donutGlow {
                    0%,
                    100% {
                        filter: saturate(1);
                    }
                    50% {
                        filter: saturate(1.16);
                    }
                }

                @keyframes cylinderRise {
                    from {
                        opacity: 0;
                        transform: translateY(18px) scaleY(0.08);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scaleY(1);
                    }
                }

                @keyframes cylinderFloat {
                    0%,
                    100% {
                        translate: 0 0;
                    }
                    50% {
                        translate: 0 -5px;
                    }
                }

                @media (max-width: 1100px) {
                    .product-view-filters {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .product-view-search {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 640px) {
                    .product-view-list-grid {
                        grid-template-columns: 1fr;
                    }

                    .product-view-filters,
                    .cylinder-stage {
                        grid-template-columns: 1fr;
                    }

                    .device-donut-panel,
                    .cylinder-panel {
                        min-height: auto;
                    }

                    .cylinder-item {
                        grid-template-columns: 48px minmax(48px, 74px) 1fr;
                        grid-template-rows: auto;
                        align-items: center;
                        text-align: left;
                    }

                    .cylinder-rank {
                        justify-self: start;
                    }

                    .cylinder-name {
                        min-height: auto;
                    }

                }

                @media (prefers-reduced-motion: reduce) {
                    .product-views-shell,
                    .summary-tile,
                    .donut-chart,
                    .device-legend-row,
                    .view-cylinder,
                    .product-view-item {
                        animation: none;
                        transition: none;
                    }
                }
            `}</style>
        </AdminLayout>
    );
};

export default AdminProductViewsPage;
