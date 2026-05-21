"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import AdUnit from "@/component/common/AdUnit";
import CatalogProductCard from "@/component/product/CatalogProductCard";
import ProductGallery from "@/component/product/ProductGallery";
import {
    MessageCircle, Loader2, ChevronRight, ShoppingCart,
    CheckCircle2, Tag, Truck, ShieldCheck, RotateCcw, ArrowLeft,
    Send, Star,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { ADSENSE_SLOTS } from "@/core/adsense";
import { formatVnd } from "@/core/utils/currency";
import { useAuthContext } from "@/provider/AuthContextProvider";
import { ProductDetailVM } from "./ProductDetailVM";
import "./styles.css";

const FACEBOOK_URL = "https://www.facebook.com/xh.456789";
const MESSENGER_URL = "https://m.me/xh.456789";

const ProductDetailPage: React.FC = () => {
    useLanguage();
    const { config, action } = ProductDetailVM();
    const { isAuthenticated } = useAuthContext();
    const {
        product,
        related,
        reviews,
        reviewSummary,
        reviewsLoading,
        isLoading,
        error,
        addedToCart,
        reviewRating,
        reviewComment,
        isSubmittingReview,
    } = config;

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
    const averageRating = reviewSummary?.average_rating ?? 0;
    const totalReviews = reviewSummary?.total_reviews ?? 0;
    const detailRows = [
        product.category_name && { label: t.store.product.category_label(), value: product.category_name },
        product.brand_name && { label: t.store.product.brand_label(), value: product.brand_name },
        { label: t.store.product.sku(), value: sku },
    ].filter(Boolean) as { label: string; value: string }[];
    const renderStars = (rating: number, size: number = 16) => (
        <span className="detail-stars" aria-label={`${rating} stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={star <= Math.round(rating) ? "detail-star detail-star--filled" : "detail-star"}
                />
            ))}
        </span>
    );

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

                        <div className="detail-rating-summary detail-rating-summary--compact">
                            {renderStars(averageRating)}
                            <span className="detail-rating-summary__score">{averageRating.toFixed(1)}</span>
                            <span className="detail-rating-summary__count">({totalReviews} đánh giá)</span>
                        </div>

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

                <AdUnit adSlot={ADSENSE_SLOTS.productDetail} className="ad-section__unit detail-ad" />

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

                <section className="detail-reviews-section">
                    <div className="detail-reviews-head">
                        <div>
                            <span className="section-eyebrow">Reviews</span>
                            <h2 className="section-title">Đánh giá sản phẩm</h2>
                        </div>
                        <div className="detail-review-score">
                            <strong>{averageRating.toFixed(1)}</strong>
                            {renderStars(averageRating, 18)}
                            <span>{totalReviews} đánh giá</span>
                        </div>
                    </div>

                    <div className="detail-rating-breakdown">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviewSummary?.rating_counts?.[rating] ?? 0;
                            const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                            return (
                                <div key={rating} className="detail-rating-breakdown__row">
                                    <span>{rating} sao</span>
                                    <div className="detail-rating-breakdown__track">
                                        <span style={{ width: `${percent}%` }} />
                                    </div>
                                    <strong>{count}</strong>
                                </div>
                            );
                        })}
                    </div>

                    <div className="detail-review-form">
                        {isAuthenticated ? (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    action.handleSubmitReview();
                                }}
                            >
                                <div className="detail-review-form__stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="detail-review-star-btn"
                                            onClick={() => action.setNewConfig({ reviewRating: star })}
                                            aria-label={`Đánh giá ${star} sao`}
                                        >
                                            <Star
                                                size={24}
                                                className={star <= reviewRating ? "detail-star detail-star--filled" : "detail-star"}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="detail-review-textarea"
                                    value={reviewComment}
                                    onChange={(event) => action.setNewConfig({ reviewComment: event.target.value })}
                                    placeholder="Viết nhận xét của bạn..."
                                    maxLength={2000}
                                />
                                <button className="btn btn-primary detail-review-submit" disabled={isSubmittingReview}>
                                    {isSubmittingReview ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Gửi đánh giá
                                </button>
                            </form>
                        ) : (
                            <div className="detail-review-login">
                                <span>Đăng nhập để đánh giá sản phẩm này.</span>
                                <Link to={AppRoutePath.LOGIN} className="btn btn-sm btn-outline">Đăng nhập</Link>
                            </div>
                        )}
                    </div>

                    <div className="detail-review-list">
                        {reviewsLoading ? (
                            <div className="detail-review-empty">
                                <Loader2 size={22} className="animate-spin text-primary" />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="detail-review-empty">Chưa có đánh giá nào.</div>
                        ) : (
                            reviews.map((review) => (
                                <article key={review.id} className="detail-review-item">
                                    <div className="detail-review-item__head">
                                        <div>
                                            <strong>{review.user_name || "Khách hàng"}</strong>
                                            <span>{new Date(review.created_at).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>
                                    {review.comment && <p>{review.comment}</p>}
                                </article>
                            ))
                        )}
                    </div>
                </section>

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
