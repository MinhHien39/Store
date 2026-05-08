"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { AdminOrderListVM } from "./AdminOrderListVM";
import { OrderStatus } from "@/data/models/Order";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { Loader2, ShoppingBag } from "lucide-react";
import dayjs from "dayjs";

const AdminOrderListPage: React.FC = () => {
    const { config, action } = AdminOrderListVM();

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Quản lý đơn hàng</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{config.orders.length} đơn hàng</p>
                    )}
                </div>
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => action.onFilterStatus(null)}
                    className={`btn btn-sm ${
                        config.statusFilter === null ? "btn-primary" : "btn-outline"
                    }`}
                >
                    Tất cả
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
                    <h3 className="empty-state-title">Không có đơn hàng nào</h3>
                    <p className="empty-state-desc">Chưa có đơn hàng phù hợp với bộ lọc</p>
                </div>
            ) : (
                <div className="list-card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Người nhận</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày đặt</th>
                                    <th>Thao tác</th>
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
                                                Chi tiết
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
            {config.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: config.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => action.onPageChange(p)}
                            className={`btn btn-sm min-w-[36px] ${
                                p === config.page ? "btn-primary" : "btn-outline"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrderListPage;
