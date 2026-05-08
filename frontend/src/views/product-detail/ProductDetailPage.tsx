"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import CatalogProductCard from "@/component/product/CatalogProductCard";
import ProductGallery from "@/component/product/ProductGallery";
import {
    MessageCircle, Loader2, ChevronRight, ShoppingCart,
    CheckCircle2, Tag, Truck, ShieldCheck, RotateCcw, ArrowLeft,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { formatVnd } from "@/core/utils/currency";
import { ProductDetailVM } from "./ProductDetailVM";
import "./styles.css";

const FACEBOOK_URL = "https://www.facebook.com/xh.456789";
const MESSENGER_URL = "https://m.me/xh.456789";

const ProductDetailPage: React.FC = () => {
    useLanguage();
    const { config, action } = ProductDetailVM();
    const { product, related, isLoading, error, addedToCart } = config;

    if (isLoading) {
        return (
            <StoreLayout>
                <div className="detail-loading">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            </StoreLayout>
        );
    }

    if (error || !product) {
        return (
            <StoreLayout>
                <div className="container-page detail-error">
                    <h2 className="detail-error__title">{t.store.product.not_found()}</h2>
                    <Link to={AppRoutePath.PRODUCTS} className="detail-error__link">
                        <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
                        {t.store.product.back_to_list()}
                    </Link>
                </div>
            </StoreLayout>
        );
    }

    const salePrice = product.sale_price;
    const basePrice = product.price;
    const hasSale = salePrice != null && basePrice != null && salePrice < basePrice;
    const discount = hasSale ? Math.round((1 - salePrice / basePrice) * 100) : 0;
    const sku = `#${String(product.id).padStart(6, '0')}`;
    const price = salePrice ?? basePrice;
    const detailRows = [
        product.category_name && { label: t.store.product.category_label(), value: product.category_name },
        product.brand_name && { label: t.store.product.brand_label(), value: product.brand_name },
        { label: t.store.product.sku(), value: sku },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <StoreLayout>
            <div className="container-page detail-page">
                {/* Breadcrumb */}
                <nav className="detail-breadcrumb" aria-label="breadcrumb">
                    <Link to={AppRoutePath.HOME} className="detail-breadcrumb__link">
                        {t.store.product.breadcrumb_home()}
                    </Link>
                    <ChevronRight size={13} />
                    <Link to={AppRoutePath.PRODUCTS} className="detail-breadcrumb__link">
                        {t.store.product.breadcrumb_products()}
                    </Link>
                    {product.category_name && (
                        <>
                            <ChevronRight size={13} />
                            <Link to={`${AppRoutePath.PRODUCTS}?category_id=${product.category_id}`} className="detail-breadcrumb__link">
                                {product.category_name}
                            </Link>
                        </>
                    )}
                    <ChevronRight size={13} />
                    <span className="detail-breadcrumb__current">{product.name}</span>
                </nav>

                {/* Hero: Gallery + Info */}
                <section className="detail-hero">
                    <ProductGallery
                        mainImage={product.main_image_url}
                        images={product.images ?? []}
                        productName={product.name}
                    />

                    <div className="detail-info">
                        {/* Chips */}
                        <div className="detail-chips">
                            {product.brand_name && (
                                <Link to={`${AppRoutePath.PRODUCTS}?brand_id=${product.brand_id}`} className="detail-chip detail-chip--brand">
                                    {product.brand_name}
                                </Link>
                            )}
                            {product.category_name && (
                                <Link to={`${AppRoutePath.PRODUCTS}?category_id=${product.category_id}`} className="detail-chip detail-chip--category">
                                    <Tag size={10} />
                                    {product.category_name}
                                </Link>
                            )}
                        </div>

                        <h1 className="type-title" style={{ wordBreak: "break-word" }}>{product.name}</h1>
                        <p className="detail-sku">{t.store.product.sku()}: {sku}</p>

                        {/* Price Card */}
                        <div className="detail-price-card">
                            <div className="detail-price-card__status">
                                <span>{t.store.product.in_stock()}</span>
                                <CheckCircle2 size={15} />
                            </div>
                            {hasSale ? (
                                <div className="detail-price-card__prices">
                                    <span className="detail-price-card__sale">{formatVnd(salePrice)}</span>
                                    <span className="detail-price-card__original">{formatVnd(basePrice)}</span>
                                    <span className="detail-price-card__discount">-{discount}%</span>
                                </div>
                            ) : (
                                <span className="detail-price-card__regular">{formatVnd(basePrice)}</span>
                            )}
                            <p className="detail-price-card__tax">{t.store.product.tax_included()}</p>
                        </div>

                        {product.short_description && (
                            <p className="detail-short-desc">{product.short_description}</p>
                        )}

                        {/* CTA */}
                        <button
                            className="btn btn-primary detail-cta"
                            onClick={action.handleAddToCart}
                        >
                            {addedToCart ? (
                                <><CheckCircle2 size={18} /> Đã thêm vào giỏ</>
                            ) : (
                                <><ShoppingCart size={18} /> {t.store.product.add_to_cart()}</>
                            )}
                        </button>

                        {/* Contact */}
                        <div className="detail-contact-grid">
                            <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="detail-contact-btn detail-contact-btn--messenger">
                                <MessageCircle size={16} />
                                {t.store.product.contact_messenger()}
                            </a>
                            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="detail-contact-btn detail-contact-btn--facebook">
                                <MessageCircle size={16} />
                                {t.store.product.contact_facebook()}
                            </a>
                        </div>

                        {/* Trust badges */}
                        <div className="detail-trust-grid">
                            {[
                                { icon: <Truck size={16} />, label: "Giao nhanh" },
                                { icon: <ShieldCheck size={16} />, label: "An toàn" },
                                { icon: <RotateCcw size={16} />, label: "Dễ đổi trả" },
                            ].map((item) => (
                                <div key={item.label} className="detail-trust-badge">
                                    {item.icon}
                                    <span className="detail-trust-badge__label">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Spec table */}
                        <div className="detail-spec-table">
                            {detailRows.map((row) => (
                                <div key={row.label} className="detail-spec-row">
                                    <span className="detail-spec-label">{row.label}</span>
                                    <span className="detail-spec-value">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Description */}
                {product.description && (
                    <section className="detail-desc-section">
                        <div className="detail-desc-card">
                            <div>
                                <span className="section-eyebrow">{formatVnd(price)}</span>
                                <h2 className="section-title">{t.store.product.description()}</h2>
                            </div>
                            <p className="detail-desc-text">{product.description}</p>
                        </div>
                    </section>
                )}

                {/* Related products */}
                {related.length > 0 && (
                    <section className="detail-related">
                        <div className="detail-related__header">
                            <Link to={AppRoutePath.PRODUCTS} className="detail-related__back">
                                <ArrowLeft size={15} />
                                {t.store.product.back_to_list()}
                            </Link>
                            <h2 className="section-title">{t.store.product.related_title()}</h2>
                        </div>
                        <div className="detail-related__grid">
                            {related.map((p) => (
                                <CatalogProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </StoreLayout>
    );
};

export default ProductDetailPage;
