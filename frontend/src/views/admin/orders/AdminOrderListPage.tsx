"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import Pagination from "@/component/pagination/Pagination";
import { AdminOrderListVM } from "./AdminOrderListVM";
import { OrderStatus } from "@/data/models/Order";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { Download, Loader2, ShoppingBag } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import dayjs from "dayjs";

const AdminOrderListPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminOrderListVM();

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.order.page_title()}</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{t.admin.order.items_count({ count: config.totalItems })}</p>
                    )}
                </div>
                <button className="btn btn-primary" onClick={action.onExportCsv}>
                    <Download size={16} />
                    {t.admin.order.export_csv()}
                </button>
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => action.onFilterStatus(null)}
                    className={`btn btn-sm ${
                        config.statusFilter === null ? "btn-primary" : "btn-outline"
                    }`}
                >
                    {t.admin.common.all()}
                </button>
                {OrderStatus.Values.map((s) => (
                    <button
                        key={s}
                        onClick={() => action.onFilterStatus(s)}
                        className={`btn btn-sm ${
                            config.statusFilter === s ? "btn-primary" : "btn-outline"
                        }`}
                    >
                        {OrderStatus.getLabel(s)}
                    </button>
                ))}
            </div>

            {config.isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : config.orders.length === 0 ? (
                <div className="empty-state">
                    <ShoppingBag size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">{t.admin.order.empty_title()}</h3>
                    <p className="empty-state-desc">{t.admin.order.empty_desc()}</p>
                </div>
            ) : (
                <div className="list-card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{t.admin.order.col_recipient()}</th>
                                    <th>{t.admin.order.col_total()}</th>
                                    <th>{t.admin.order.col_status()}</th>
                                    <th>{t.admin.order.col_created()}</th>
                                    <th>{t.admin.order.col_actions()}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {config.orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="font-semibold">#{order.id}</td>
                                        <td className="font-medium">{order.shipping_name}</td>
                                        <td className="font-semibold">{formatCurrency(order.total_amount)}</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => action.onUpdateStatus(order.id, Number(e.target.value))}
                                                className={`select !min-h-[32px] !px-2 !text-xs !font-semibold !rounded-full ${OrderStatus.getColor(order.status)}`}
                                            >
                                                {OrderStatus.Values.map((s) => (
                                                    <option key={s} value={s}>{OrderStatus.getLabel(s)}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="text-muted-foreground whitespace-nowrap">
                                            {dayjs(order.created_at).format("DD/MM/YYYY")}
                                        </td>
                                        <td>
                                            <Link
                                                to={AppRoutePath.ADMIN_ORDER_DETAIL.replace(":id", String(order.id))}
                                                className="btn btn-sm btn-outline"
                                            >
                                                {t.admin.order.detail()}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {config.totalItems > 0 && (
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
        </AdminLayout>
    );
};

export default AdminOrderListPage;
