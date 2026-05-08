"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import CatalogProductCard from "@/component/product/CatalogProductCard";
import {
    ArrowRight,
    Award,
    BadgeCheck,
    ChevronRight,
    Loader2,
    Package,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Truck,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { formatVnd } from "@/core/utils/currency";
import { getCategoryIcon } from "@/core/utils/categoryIcon";
import { HomeVM } from "./HomeVM";
import "./styles.css";

const HomePage: React.FC = () => {
    useLanguage();
    const { config } = HomeVM();
    const { categories, brands, products, isLoading } = config;

    if (isLoading) {
        return (
            <StoreLayout>
                <div className="home-loading">
                    <Loader2 size={34} className="animate-spin text-primary" />
                </div>
            </StoreLayout>
        );
    }

    const featuredProducts = products.filter((product) => product.sale_price != null).slice(0, 4);
    const latestProducts = products.slice(0, 8);
    const heroProduct = latestProducts[0];
    const heroSideProducts = latestProducts.slice(1, 3);

    return (
        <StoreLayout>
            {/* Hero */}
            <section className="home-hero">
                <div className="container-page home-hero__inner">
                    <div className="home-hero__left motion-fade-up">
                        <div className="section-eyebrow">
                            <Sparkles size={16} />
                            Store
                        </div>
                        <h1 className="home-hero__title">{t.store.home.hero_tagline()}</h1>
                        <p className="home-hero__subtitle">
                            {t.store.home.hero_subtitle()} {t.store.home.hero_description()}
                        </p>
                        <div className="home-hero__ctas">
                            <Link to={AppRoutePath.PRODUCTS} className="base-button base-button--contained base-button--lg">
                                {t.store.home.hero_cta()}
                                <ArrowRight size={19} />
                            </Link>
                            <Link to={AppRoutePath.CATEGORIES} className="base-button base-button--outline base-button--lg">
                                {t.store.home.categories_title()}
                            </Link>
                        </div>
                        <div className="home-hero__stats">
                            {[
                                { value: `${categories.length}+`, label: t.store.home.categories_title() },
                                { value: `${brands.length}+`, label: t.store.home.brands_title() },
                                { value: `${products.length}+`, label: t.store.home.latest_title() },
                            ].map((item) => (
                                <div key={item.label} className="home-hero__stat">
                                    <p className="home-hero__stat-value">{item.value}</p>
                                    <p className="home-hero__stat-label">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="home-hero__right motion-fade-up motion-delay-2">
                        <div className="home-hero__glow" />
                        <div className="home-hero__cards">
                            <div className="home-hero__featured">
                                <div className="home-hero__featured-inner">
                                    <div className="home-hero__featured-grid">
                                        <div className="home-hero__featured-image">
                                            {heroProduct?.main_image_url ? (
                                                <img
                                                    src={heroProduct.main_image_url}
                                                    alt={heroProduct.name}
                                                    className="home-hero__featured-img"
                                                />
                                            ) : (
                                                <div className="home-hero__featured-empty">
                                                    <Package size={72} strokeWidth={1.4} />
                                                </div>
                                            )}
                                            {heroProduct?.sale_price != null && (
                                                <span className="home-hero__sale-badge">{t.store.home.sale_badge()}</span>
                                            )}
                                        </div>
                                        <div className="home-hero__featured-info">
                                            <div>
                                                <div className="home-hero__featured-badge">
                                                    <BadgeCheck size={14} />
                                                    {t.store.home.featured_badge()}
                                                </div>
                                                <h2 className="home-hero__featured-name">
                                                    {heroProduct?.name || t.store.home.featured_fallback_name()}
                                                </h2>
                                                <p className="home-hero__featured-desc">
                                                    {heroProduct?.short_description || t.store.home.featured_fallback_desc()}
                                                </p>
                                            </div>
                                            <div className="home-hero__featured-bottom">
                                                <div>
                                                    <p className="home-hero__featured-price-label">{t.store.home.price_label()}</p>
                                                    <p className="home-hero__featured-price">
                                                        {heroProduct ? formatVnd(heroProduct.sale_price ?? heroProduct.price) : "--"}
                                                    </p>
                                                </div>
                                                {heroProduct && (
                                                    <Link to={`${AppRoutePath.PRODUCTS}/${heroProduct.id}`} className="base-button base-button--contained base-button--sm">
                                                        {t.store.home.detail_cta()}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="home-hero__side-grid">
                                {heroSideProducts.map((product) => (
                                    <Link key={product.id} to={`${AppRoutePath.PRODUCTS}/${product.id}`} className="home-hero__side-card">
                                        <img src={product.main_image_url} alt={product.name} className="home-hero__side-img" />
                                        <div className="home-hero__side-info">
                                            <p className="home-hero__side-name">{product.name}</p>
                                            <p className="home-hero__side-brand">{product.brand_name}</p>
                                            <p className="home-hero__side-price">{formatVnd(product.sale_price ?? product.price)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="home-trust">
                <div className="container-page">
                    <div className="home-trust__grid">
                        {[
                            { icon: Truck, text: t.store.home.trust_delivery_title(), detail: t.store.home.trust_delivery_detail() },
                            { icon: ShieldCheck, text: t.store.home.trust_authentic_title(), detail: t.store.home.trust_authentic_detail() },
                            { icon: Headphones, text: t.store.home.trust_support_title(), detail: t.store.home.trust_support_detail() },
                            { icon: TrendingUp, text: t.store.home.trust_price_title(), detail: t.store.home.trust_price_detail() },
                        ].map(({ icon: Icon, text, detail }) => (
                            <div key={text} className="home-trust__item">
                                <span className="home-trust__icon"><Icon size={20} /></span>
                                <span className="home-trust__text">
                                    <span className="home-trust__title">{text}</span>
                                    <span className="home-trust__detail">{detail}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="home-section">
                <div className="container-page">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow"><Package size={16} /> {t.store.home.browse_label()}</div>
                            <h2 className="section-title">{t.store.home.categories_title()}</h2>
                        </div>
                        <Link to={AppRoutePath.CATEGORIES} className="base-button base-button--outline">
                            {t.store.home.view_all()} <ChevronRight size={17} />
                        </Link>
                    </div>
                    <div className="home-category-grid">
                        {categories.slice(0, 8).map((cat, index) => {
                            const Icon = getCategoryIcon(cat.icon, index);
                            return (
                                <Link key={cat.id} to={`${AppRoutePath.PRODUCTS}?category_id=${cat.id}`} className="home-category-card">
                                    <div className="home-category-card__top">
                                        <span className="home-category-card__icon"><Icon size={23} /></span>
                                        <span className="home-category-card__arrow"><ChevronRight size={18} /></span>
                                    </div>
                                    <h3 className="home-category-card__name">{cat.name}</h3>
                                    {cat.description && <p className="home-category-card__desc">{cat.description}</p>}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Brands */}
            <section className="home-section home-section--white">
                <div className="container-page">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow"><Award size={16} /> {t.store.home.makers_label()}</div>
                            <h2 className="section-title">{t.store.home.brands_title()}</h2>
                        </div>
                        <Link to={AppRoutePath.BRANDS} className="base-button base-button--outline">
                            {t.store.home.view_all()} <ChevronRight size={17} />
                        </Link>
                    </div>
                    <div className="home-brand-grid">
                        {brands.slice(0, 8).map((brand) => (
                            <Link key={brand.id} to={`${AppRoutePath.PRODUCTS}?brand_id=${brand.id}`} className="home-brand-card">
                                <span className="home-brand-card__icon"><Award size={22} /></span>
                                <span className="home-brand-card__info">
                                    <span className="home-brand-card__name">{brand.name}</span>
                                    {brand.description && <span className="home-brand-card__desc">{brand.description}</span>}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured / Sale */}
            {featuredProducts.length > 0 && (
                <section className="home-section">
                    <div className="container-page">
                        <div className="section-header">
                            <div>
                                <div className="section-eyebrow"><TrendingUp size={16} /> Sale</div>
                                <h2 className="section-title">{t.store.home.featured_title()}</h2>
                            </div>
                            <Link to={AppRoutePath.PRODUCTS} className="base-button base-button--outline">
                                {t.store.home.view_all()} <ChevronRight size={17} />
                            </Link>
                        </div>
                        <div className="home-product-grid">
                            {featuredProducts.map((product) => (
                                <CatalogProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Products */}
            <section className="home-section home-section--white">
                <div className="container-page">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow"><Sparkles size={16} /> Latest</div>
                            <h2 className="section-title">{t.store.home.latest_title()}</h2>
                        </div>
                        <Link to={`${AppRoutePath.PRODUCTS}?sort=newest`} className="base-button base-button--outline">
                            {t.store.home.view_all()} <ChevronRight size={17} />
                        </Link>
                    </div>
                    <div className="home-product-grid">
                        {latestProducts.map((product) => (
                            <CatalogProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </StoreLayout>
    );
};

export default HomePage;
