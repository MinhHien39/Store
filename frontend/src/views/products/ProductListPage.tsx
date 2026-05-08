"use client";

import React from "react";
import StoreLayout from "@/component/layout/StoreLayout";
import CatalogProductCard from "@/component/product/CatalogProductCard";
import {
    ArrowDownUp,
    Award,
    FolderTree,
    Loader2,
    PackageSearch,
    Search,
    SlidersHorizontal,
    Sparkles,
    X,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { ProductListVM } from "./ProductListVM";
import "./styles.css";

const ProductListPage: React.FC = () => {
    useLanguage();
    const { config, action } = ProductListVM();
    const { products, categories, brands, isLoading, searchInput, keyword, categoryId, brandId, sort } = config;

    const hasFilters = Boolean(keyword || categoryId || brandId);
    const activeFilterCount = [keyword, categoryId, brandId].filter(Boolean).length;
    const selectedCategory = categories.find((c) => c.id === categoryId);
    const selectedBrand = brands.find((b) => b.id === brandId);

    const sortOptions = [
        { value: "newest", label: t.store.product.sort_newest() },
        { value: "price_asc", label: t.store.product.sort_price_asc() },
        { value: "price_desc", label: t.store.product.sort_price_desc() },
    ];

    return (
        <StoreLayout>
            {/* Header */}
            <section className="products-header">
                <div className="container-page products-header__inner motion-fade-up">
                    <div>
                        <div className="section-eyebrow">
                            <Sparkles size={16} />
                            {t.store.nav.products()}
                        </div>
                        <h1 className="type-title">{t.store.product.list_title()}</h1>
                        {!isLoading && (
                            <p className="section-subtitle">
                                {t.store.product.items_count({ count: products.length })}
                            </p>
                        )}
                    </div>

                    <div className="products-header__search">
                        <div className="search-input-wrapper products-header__search-wrap">
                            <Search size={17} className="search-icon" />
                            <input
                                type="search"
                                value={searchInput}
                                onChange={(event) => action.handleSearchChange(event.target.value)}
                                placeholder={t.store.product.search_placeholder()}
                                aria-label={t.store.product.search_placeholder()}
                                className="input"
                                style={{ borderRadius: "9999px" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container-page">
                <div className="products-layout">
                    {/* Filter sidebar */}
                    <aside className="products-filter">
                        <div className="products-filter__inner">
                            <div className="products-filter__header">
                                <p className="products-filter__title">
                                    <SlidersHorizontal size={15} />
                                    {t.store.product.filter()}
                                </p>
                                {activeFilterCount > 0 && (
                                    <span className="products-filter__count">{activeFilterCount}</span>
                                )}
                            </div>

                            <div className="products-filter__body">
                                {/* Sort */}
                                <div className="products-filter__section">
                                    <p className="products-filter__section-label">
                                        <ArrowDownUp size={13} />
                                        {t.store.product.sort()}
                                    </p>
                                    <div className="products-filter__options">
                                        {sortOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => action.updateFilter("sort", opt.value)}
                                                className={`products-filter__option${sort === opt.value ? " products-filter__option--active" : ""}`}
                                            >
                                                <span className="products-filter__option-dot" />
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="products-filter__section">
                                    <p className="products-filter__section-label">
                                        <FolderTree size={13} />
                                        {t.store.nav.categories()}
                                    </p>
                                    <div className="products-filter__chips">
                                        <button
                                            onClick={() => action.updateFilter("category_id", undefined)}
                                            className={`products-filter__chip${!categoryId ? " products-filter__chip--active" : ""}`}
                                        >
                                            {t.store.product.all_categories()}
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => action.updateFilter("category_id", String(category.id))}
                                                className={`products-filter__chip${categoryId === category.id ? " products-filter__chip--active" : ""}`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Brands */}
                                <div className="products-filter__section">
                                    <p className="products-filter__section-label">
                                        <Award size={13} />
                                        {t.store.nav.brands()}
                                    </p>
                                    <div className="products-filter__chips">
                                        <button
                                            onClick={() => action.updateFilter("brand_id", undefined)}
                                            className={`products-filter__chip${!brandId ? " products-filter__chip--active" : ""}`}
                                        >
                                            {t.store.product.all_brands()}
                                        </button>
                                        {brands.map((brand) => (
                                            <button
                                                key={brand.id}
                                                onClick={() => action.updateFilter("brand_id", String(brand.id))}
                                                className={`products-filter__chip${brandId === brand.id ? " products-filter__chip--active" : ""}`}
                                            >
                                                {brand.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {hasFilters && (
                                <button onClick={action.clearFilters} className="products-filter__clear">
                                    <X size={14} />
                                    {t.store.product.clear_filters()}
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Products */}
                    <div>
                        {/* Active filter pills */}
                        {hasFilters && !isLoading && (
                            <div className="products-active-filters">
                                <span className="products-active-filters__label">{t.store.product.filter()}:</span>
                                {keyword && (
                                    <button
                                        className="products-active-filters__pill"
                                        onClick={() => { action.updateFilter("keyword", undefined); action.handleSearchChange(""); }}
                                    >
                                        &ldquo;{keyword}&rdquo;
                                        <X size={12} />
                                    </button>
                                )}
                                {selectedCategory && (
                                    <button
                                        className="products-active-filters__pill"
                                        onClick={() => action.updateFilter("category_id", undefined)}
                                    >
                                        {selectedCategory.name}
                                        <X size={12} />
                                    </button>
                                )}
                                {selectedBrand && (
                                    <button
                                        className="products-active-filters__pill"
                                        onClick={() => action.updateFilter("brand_id", undefined)}
                                    >
                                        {selectedBrand.name}
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="products-loading">
                                <Loader2 size={34} className="animate-spin text-primary" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <PackageSearch size={52} className="empty-state-icon" />
                                <h3 className="empty-state-title">{t.store.product.empty_title()}</h3>
                                <p className="empty-state-desc" style={{ marginBottom: "20px" }}>{t.store.product.empty_desc()}</p>
                                <button onClick={action.clearFilters} className="btn btn-primary">
                                    {t.store.product.clear_filters()}
                                </button>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {products.map((product) => (
                                    <CatalogProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </StoreLayout>
    );
};

export default ProductListPage;
