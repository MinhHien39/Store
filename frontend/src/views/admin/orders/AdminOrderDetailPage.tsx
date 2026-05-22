"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { AdminOrderDetailVM } from "./AdminOrderDetailVM";
import { OrderStatus } from "@/data/models/Order";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { getImageUrl } from "@/core/utils/currency";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import dayjs from "dayjs";

const AdminOrderDetailPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminOrderDetailVM();

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    if (config.isLoading || !config.order) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    const order = config.order;

    return (
        <AdminLayout>
            <Link
                to={AppRoutePath.ADMIN_ORDERS}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-6 transition"
            >
                <ArrowLeft size={16} /> {t.admin.order.back_to_list()}
            </Link>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="page-title">{t.admin.order.order_number({ id: order.id })}</h2>
                            <select
                                value={order.status}
                                onChange={(e) => action.onUpdateStatus(Number(e.target.value))}
                                className={`select !min-h-[36px] !px-3 !text-sm !font-semibold !rounded-lg ${OrderStatus.getColor(order.status)}`}
                            >
                                {OrderStatus.Values.map((s) => (
                                    <option key={s} value={s}>{OrderStatus.getLabel(s)}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t.admin.order.order_date({ date: dayjs(order.created_at).format("DD/MM/YYYY HH:mm") })}
                        </p>
                    </div>

                    {/* Items */}
                    <div className="card p-6">
                        <h3 className="font-bold text-base mb-5">{t.admin.order.products_count({ count: order.items?.length || 0 })}</h3>
                        <div className="divide-y divide-border">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-4">
                                    {item.product_image && (
                                        <img
                                            src={getImageUrl(item.product_image)}
                                            alt=""
                                            className="w-14 h-14 object-cover rounded-lg bg-slate-100"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">
                                            {item.product_name || t.admin.order.product_fallback({ id: item.product_id })}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {t.admin.order.quantity_short()}: {item.quantity} × {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                            <span className="font-bold">{t.admin.order.total()}</span>
                            <span className="text-lg font-black text-primary">{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Info */}
                <div>
                    <div className="card p-6">
                        <h3 className="font-bold text-base mb-5">{t.admin.order.shipping_info()}</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="filter-label !mb-1">{t.admin.order.recipient()}</p>
                                <p className="font-semibold">{order.shipping_name}</p>
                            </div>
                            <div>
                                <p className="filter-label !mb-1">{t.admin.order.phone()}</p>
                                <p>{order.shipping_phone}</p>
                            </div>
                            <div>
                                <p className="filter-label !mb-1">{t.admin.order.address()}</p>
                                <p>{order.shipping_address}</p>
                            </div>
                            {order.notes && (
                                <div>
                                    <p className="filter-label !mb-1">{t.admin.order.notes()}</p>
                                    <p className="text-muted-foreground">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetailPage;
