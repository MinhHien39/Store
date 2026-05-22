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
                    <h1 className="checkout-success__title">{t.store.checkout.success_title()}</h1>
                    <p className="checkout-success__desc">{t.store.checkout.success_desc()}</p>
                    <p className="checkout-success__order-id">#{String(orderId).padStart(6, '0')}</p>
                    <p className="checkout-success__note">{t.store.checkout.success_note()}</p>
                    <div className="checkout-success__actions">
                        <Link to={AppRoutePath.ORDERS} className="base-button base-button--contained">
                            {t.store.checkout.view_order()}
                        </Link>
                        <Link to={AppRoutePath.PRODUCTS} className="base-button base-button--outline">
                            {t.store.cart.continue_shopping()}
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
                    <h1 className="checkout-empty__title">{t.store.cart.empty_title()}</h1>
                    <p className="checkout-empty__desc">{t.store.checkout.empty_desc()}</p>
                    <Link to={AppRoutePath.PRODUCTS} className="base-button base-button--contained">
                        {t.store.checkout.view_products()}
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
                    {t.store.checkout.back_to_cart()}
                </Link>

                <h1 className="checkout-title">{t.store.checkout.title()}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="checkout-layout">
                        {/* Shipping form */}
                        <div className="checkout-form">
                            <div className="card checkout-form__inner">
                                <h2 className="checkout-form__title">{t.store.checkout.shipping_info()}</h2>

                                {errors._global && (
                                    <div className="checkout-form__error">{errors._global}</div>
                                )}

                                <div className="checkout-form__fields">
                                    <div>
                                        <label className="label">{t.store.checkout.shipping_name()} <span className="text-destructive">*</span></label>
                                        <input name="shipping_name" value={form.shipping_name} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder={t.store.checkout.shipping_name_placeholder()} className={inputClass(!!errors.shipping_name)} />
                                        {errors.shipping_name && <p className="checkout-form__field-error">{errors.shipping_name}</p>}
                                    </div>
                                    <div>
                                        <label className="label">{t.store.checkout.shipping_phone()} <span className="text-destructive">*</span></label>
                                        <input name="shipping_phone" value={form.shipping_phone} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder={t.store.checkout.shipping_phone_placeholder()} className={inputClass(!!errors.shipping_phone)} />
                                        {errors.shipping_phone && <p className="checkout-form__field-error">{errors.shipping_phone}</p>}
                                    </div>
                                    <div>
                                        <label className="label">{t.store.checkout.shipping_address()} <span className="text-destructive">*</span></label>
                                        <input name="shipping_address" value={form.shipping_address} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder={t.store.checkout.shipping_address_placeholder()} className={inputClass(!!errors.shipping_address)} />
                                        {errors.shipping_address && <p className="checkout-form__field-error">{errors.shipping_address}</p>}
                                    </div>
                                    <div>
                                        <label className="label">{t.store.checkout.notes()}</label>
                                        <textarea name="notes" value={form.notes} onChange={(e) => action.handleFieldChange(e.target.name, e.target.value)} placeholder={t.store.checkout.notes_placeholder()} rows={3} className="textarea" />
                                    </div>
                                </div>

                                <div className="checkout-form__footer">
                                    <div className="checkout-form__badge">
                                        <ShieldCheck size={14} /> {t.store.checkout.secure_info()}
                                    </div>
                                    <div className="checkout-form__badge">
                                        <Truck size={14} /> {t.store.checkout.nationwide_delivery()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="checkout-summary">
                            <div className="checkout-summary__inner">
                                <h3 className="checkout-summary__title">{t.store.checkout.order_summary_items({ count: items.length })}</h3>

                                <div className="checkout-summary__items">
                                    {items.map(item => (
                                        <div key={item.id} className="checkout-summary__item">
                                            <div className="checkout-summary__item-img">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className="checkout-summary__item-info">
                                                <p className="checkout-summary__item-name">{item.name}</p>
                                                <p className="checkout-summary__item-qty">{t.store.checkout.quantity_short()}: {item.quantity}</p>
                                            </div>
                                            <p className="checkout-summary__item-price">{formatVnd((item.sale_price ?? item.price) * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkout-summary__totals">
                                    <div className="checkout-summary__row">
                                        <span className="checkout-summary__row-label">{t.store.cart.subtotal()}</span>
                                        <span className="checkout-summary__row-value">{formatVnd(subtotal)}</span>
                                    </div>
                                    <div className="checkout-summary__row">
                                        <span className="checkout-summary__row-label">{t.store.cart.shipping()}</span>
                                        <span className={`checkout-summary__row-value ${shipping === 0 ? 'checkout-summary__row-value--free' : ''}`}>
                                            {shipping === 0 ? t.store.cart.shipping_free() : formatVnd(shipping)}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="checkout-cod-note">{t.store.cart.free_shipping_notice()}</p>
                                    )}
                                    <div className="checkout-summary__total-row">
                                        <span className="checkout-summary__total-label">{t.store.cart.total()}</span>
                                        <span className="checkout-summary__total-value">{formatVnd(total)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="base-button base-button--contained checkout-submit"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                    {isSubmitting ? t.store.checkout.processing() : t.store.checkout.place_order()}
                                </button>

                                <p className="checkout-cod-note">
                                    {t.store.checkout.cod_note()}
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
