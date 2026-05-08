"use client";

import React from "react";
import StoreLayout from "@/component/layout/StoreLayout";
import { OrderDetailVM } from "./OrderDetailVM";
import { OrderStatus } from "@/data/models/Order";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { getImageUrl } from "@/core/utils/currency";
import dayjs from "dayjs";

const OrderDetailPage: React.FC = () => {
    const { config } = OrderDetailVM();

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    if (config.isLoading || !config.order) {
        return (
            <StoreLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            </StoreLayout>
        );
    }

    const order = config.order;

    return (
        <StoreLayout>
            <div className="container-page py-10">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to={AppRoutePath.ORDERS}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-6 transition"
                    >
                        <ArrowLeft size={16} /> Quay lại danh sách đơn hàng
                    </Link>

                    <div className="card p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="page-title">Đơn hàng #{order.id}</h2>
                            <span className={`badge ${OrderStatus.getColor(order.status)}`}>
                                {OrderStatus.getLabel(order.status)}
                            </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="filter-label !mb-1">Ngày đặt</p>
                                <p>{dayjs(order.created_at).format("DD/MM/YYYY HH:mm")}</p>
                            </div>
                            <div>
                                <p className="filter-label !mb-1">Tổng tiền</p>
                                <p className="font-black text-lg text-primary">{formatCurrency(order.total_amount)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="card p-6 mb-6">
                        <h3 className="font-bold text-base mb-4">Thông tin giao hàng</h3>
                        <div className="text-sm space-y-2">
                            <p><span className="text-muted-foreground">Người nhận:</span> <span className="font-medium">{order.shipping_name}</span></p>
                            <p><span className="text-muted-foreground">Điện thoại:</span> <span className="font-medium">{order.shipping_phone}</span></p>
                            <p><span className="text-muted-foreground">Địa chỉ:</span> <span className="font-medium">{order.shipping_address}</span></p>
                            {order.notes && <p><span className="text-muted-foreground">Ghi chú:</span> {order.notes}</p>}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="card p-6">
                        <h3 className="font-bold text-base mb-5">Sản phẩm</h3>
                        <div className="divide-y divide-border">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-4">
                                    {item.product_image && (
                                        <img
                                            src={getImageUrl(item.product_image)}
                                            alt=""
                                            className="w-16 h-16 object-cover rounded-lg bg-slate-100"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">
                                            {item.product_name || `Sản phẩm #${item.product_id}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">SL: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
};

export default OrderDetailPage;
