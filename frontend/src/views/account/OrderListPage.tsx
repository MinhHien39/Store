"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import { Loader2, Package, ChevronRight } from "lucide-react";
import { OrderStatus } from "@/data/models/Order";
import { OrderListVM } from "./OrderListVM";
import dayjs from "dayjs";

const OrderListPage: React.FC = () => {
    const { config, action } = OrderListVM();
    const { orders, isLoading, page, totalPages } = config;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    return (
        <StoreLayout>
            <div className="container-page py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="page-title mb-6">Đơn hàng của tôi</h1>

                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <Loader2 size={32} className="animate-spin text-primary" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                            <Package size={48} className="text-muted-foreground" strokeWidth={1.2} />
                            <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
                            <Link to={AppRoutePath.PRODUCTS} className="base-button base-button--contained">
                                Mua sắm ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    to={`${AppRoutePath.ORDERS}/${order.id}`}
                                    className="card p-5 flex items-center justify-between gap-4 hover:shadow-md transition"
                                >
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-sm">Đơn hàng #{order.id}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {dayjs(order.created_at).format("DD/MM/YYYY HH:mm")}
                                        </p>
                                        <span className={`badge text-xs px-2 py-0.5 rounded-full w-fit mt-1 ${OrderStatus.getColor(order.status)}`}>
                                            {OrderStatus.getLabel(order.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-black text-primary">{formatCurrency(order.total_amount)}</p>
                                        <ChevronRight size={18} className="text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => action.onPageChange(p)}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${p === page ? "bg-primary text-white" : "bg-muted hover:bg-primary/10"}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
};

export default OrderListPage;
