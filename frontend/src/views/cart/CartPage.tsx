"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { formatVnd } from "@/core/utils/currency";
import { ArrowLeft } from "lucide-react";
import { CartVM } from "./CartVM";
import "./styles.css";

const CartPage: React.FC = () => {
    useLanguage();
    const { config, action } = CartVM();
    const { items, subtotal, shipping, total } = config;

    return (
        <StoreLayout>
            <div className="container-page cart-page">
                <h1 className="cart-title">
                    {t.store.cart.title()}
                </h1>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="cart-empty__icon"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        <h3 className="cart-empty__title">{t.store.cart.empty_title()}</h3>
                        <p className="cart-empty__desc">{t.store.cart.empty_desc()}</p>
                        <Link to={AppRoutePath.PRODUCTS} className="cart-empty__btn">
                            {t.store.cart.continue_shopping()}
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Items */}
                        <div className="cart-items">
                            {items.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <Link to={`${AppRoutePath.PRODUCTS}/${item.id}`} className="cart-item__image">
                                        <img src={item.image} alt={item.name} className="cart-item__img" />
                                    </Link>
                                    <div className="cart-item__info">
                                        <div>
                                            <Link to={`${AppRoutePath.PRODUCTS}/${item.id}`} className="cart-item__name">
                                                {item.name}
                                            </Link>
                                            <p className="cart-item__category">{item.category_name}</p>
                                        </div>
                                        <div className="cart-item__bottom">
                                            <div className="cart-qty">
                                                <button onClick={() => action.updateQuantity(item.id, item.quantity - 1)} className="cart-qty__btn" aria-label="Giảm">−</button>
                                                <span className="cart-qty__value">{item.quantity}</span>
                                                <button onClick={() => action.updateQuantity(item.id, item.quantity + 1)} className="cart-qty__btn" aria-label="Tăng">+</button>
                                            </div>
                                            <div className="cart-item__right">
                                                <p className="cart-item__price">{formatVnd((item.sale_price ?? item.price) * item.quantity)}</p>
                                                <button onClick={() => action.removeItem(item.id)} className="cart-item__remove">
                                                    {t.store.cart.remove()}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Link to={AppRoutePath.PRODUCTS} className="cart-back">
                                <ArrowLeft size={14} />
                                {t.store.cart.continue_shopping()}
                            </Link>
                        </div>

                        {/* Summary */}
                        <div className="cart-summary">
                            <h3 className="cart-summary__title">{t.store.cart.order_summary()}</h3>
                            <div className="cart-summary__rows">
                                <div className="cart-summary__row">
                                    <span className="cart-summary__label">{t.store.cart.subtotal()}</span>
                                    <span className="cart-summary__value">{formatVnd(subtotal)}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span className="cart-summary__label">{t.store.cart.shipping()}</span>
                                    <span className={`cart-summary__value ${shipping === 0 ? "cart-summary__value--free" : ""}`}>
                                        {shipping === 0 ? t.store.cart.shipping_free() : formatVnd(shipping)}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="cart-summary__note">{t.store.cart.free_shipping_notice()}</p>
                                )}
                                <div className="cart-summary__total">
                                    <span className="cart-summary__total-label">{t.store.cart.total()}</span>
                                    <span className="cart-summary__total-value">{formatVnd(total)}</span>
                                </div>
                            </div>
                            <Link to={AppRoutePath.CHECKOUT} className="cart-checkout-btn">
                                {t.store.cart.checkout()}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
};


export default CartPage;
