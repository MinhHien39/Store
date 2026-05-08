"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { formatVnd } from "@/core/utils/currency";
import { Loader2, ArrowLeft, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";
import { CheckoutVM } from "./CheckoutVM";
import "./styles.css";

const CheckoutPage: React.FC = () => {
    useLanguage();
    const { config, action } = CheckoutVM();
    const { form, errors, isSubmitting, orderSuccess, orderId, items, subtotal, shipping, total } = config;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        action.onSubmit();
    };

    const inputClass = (hasError: boolean) => `input ${hasError ? 'input--error' : ''}`;

    if (orderSuccess) {
        return (
            <StoreLayout>
                <div className="container-page checkout-success">
                    <div className="checkout-success__icon">
                        <div className="checkout-success__icon-circle">
                            <CheckCircle2 size={32} className="text-success" />
                        </div>
                    </div>
                    <h1 className="checkout-success__title">Đặt hàng thành công!</h1>
                    <p className="checkout-success__desc">Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:</p>
                    <p className="checkout-success__order-id">#{String(orderId).padStart(6, '0')}</p>
                    <p className="checkout-success__note">Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.</p>
                    <div className="checkout-success__actions">
                        <Link to={AppRoutePath.ORDERS} className="base-button base-button--contained">
                            Xem đơn hàng
                        </Link>
                        <Link to={AppRoutePath.PRODUCTS} className="base-button base-button--outline">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </StoreLayout>
        );
    }

    if (items.length === 0) {
        return (
            <StoreLayout>
                <div className="container-page checkout-empty">
                    <h1 className="checkout-empty__title">Giỏ hàng trống</h1>
                    <p className="checkout-empty__desc">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                    <Link to={AppRoutePath.PRODUCTS} className="base-button base-button--contained">
                        Xem sản phẩm
                    </Link>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout>
            <div className="container-page checkout-page">
                <Link to={AppRoutePath.CART} className="checkout-back">
                    <ArrowLeft size={16} />
                    Quay lại giỏ hàng
                </Link>

                <h1 className="checkout-title">Thanh toán</h1>

                <form onSubmit={handleSubmit}>
                    <div className="checkout-layout">
                        {/* Shipping form */}
                        <div className="checkout-form">
                            <div className="card checkout-form__inner">
                                <h2 className="checkout-form__title">Thông tin giao hàng</h2>

                                {errors._global && (
                                    <div className="checkout-form__error">{errors._global}</div>
                                )}

                                <div className="checkout-form__fields">
                                    <div>
                                        <label className="label">Họ và tên <span className="text-destructive">*</span></label>
                                        <input name="shipping_name" value={form.shipping_name} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder="Nguyễn Văn A" className={inputClass(!!errors.shipping_name)} />
                                        {errors.shipping_name && <p className="checkout-form__field-error">{errors.shipping_name}</p>}
                                    </div>
                                    <div>
                                        <label className="label">Số điện thoại <span className="text-destructive">*</span></label>
                                        <input name="shipping_phone" value={form.shipping_phone} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder="0901234567" className={inputClass(!!errors.shipping_phone)} />
                                        {errors.shipping_phone && <p className="checkout-form__field-error">{errors.shipping_phone}</p>}
                                    </div>
                                    <div>
                                        <label className="label">Địa chỉ giao hàng <span className="text-destructive">*</span></label>
                                        <input name="shipping_address" value={form.shipping_address} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM" className={inputClass(!!errors.shipping_address)} />
                                        {errors.shipping_address && <p className="checkout-form__field-error">{errors.shipping_address}</p>}
                                    </div>
                                    <div>
                                        <label className="label">Ghi chú</label>
                                        <textarea name="notes" value={form.notes} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder="Giao giờ hành chính, gọi trước khi giao..." rows={3} className="textarea" />
                                    </div>
                                </div>

                                <div className="checkout-form__footer">
                                    <div className="checkout-form__badge">
                                        <ShieldCheck size={14} /> Bảo mật thông tin
                                    </div>
                                    <div className="checkout-form__badge">
                                        <Truck size={14} /> Giao hàng toàn quốc
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="checkout-summary">
                            <div className="checkout-summary__inner">
                                <h3 className="checkout-summary__title">Đơn hàng ({items.length} sản phẩm)</h3>

                                <div className="checkout-summary__items">
                                    {items.map(item => (
                                        <div key={item.id} className="checkout-summary__item">
                                            <div className="checkout-summary__item-img">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className="checkout-summary__item-info">
                                                <p className="checkout-summary__item-name">{item.name}</p>
                                                <p className="checkout-summary__item-qty">SL: {item.quantity}</p>
                                            </div>
                                            <p className="checkout-summary__item-price">{formatVnd((item.sale_price ?? item.price) * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkout-summary__totals">
                                    <div className="checkout-summary__row">
                                        <span className="checkout-summary__row-label">Tạm tính</span>
                                        <span className="checkout-summary__row-value">{formatVnd(subtotal)}</span>
                                    </div>
                                    <div className="checkout-summary__row">
                                        <span className="checkout-summary__row-label">Phí vận chuyển</span>
                                        <span className={`checkout-summary__row-value ${shipping === 0 ? 'checkout-summary__row-value--free' : ''}`}>
                                            {shipping === 0 ? 'Miễn phí' : formatVnd(shipping)}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="checkout-cod-note">Miễn phí vận chuyển cho đơn từ {formatVnd(500000)}</p>
                                    )}
                                    <div className="checkout-summary__total-row">
                                        <span className="checkout-summary__total-label">Tổng cộng</span>
                                        <span className="checkout-summary__total-value">{formatVnd(total)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="base-button base-button--contained checkout-submit"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                    {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                                </button>

                                <p className="checkout-cod-note">
                                    Thanh toán khi nhận hàng (COD)
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </StoreLayout>
    );
};

export default CheckoutPage;
