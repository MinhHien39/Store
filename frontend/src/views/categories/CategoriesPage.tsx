"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import {
    ArrowRight,
    Camera,
    Cable,
    Headphones,
    Laptop,
    Loader2,
    Package,
    Router,
    Smartphone,
    TabletSmartphone,
    Watch,
} from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { CategoriesVM } from "./CategoriesVM";
import "./styles.css";

const iconMap = [Smartphone, Laptop, TabletSmartphone, Cable, Watch, Headphones, Camera, Router];

const CategoriesPage: React.FC = () => {
    useLanguage();
    const { config } = CategoriesVM();
    const { categories, isLoading } = config;

    return (
        <StoreLayout>
            <section className="categories-header">
                <div className="container-page categories-header__inner">
                    <div className="section-eyebrow">
                        <Package size={16} />
                        Store
                    </div>
                    <h1 className="type-title">{t.store.nav.categories()}</h1>
                    <p className="section-subtitle">
                        Chọn danh mục để xem nhanh các sản phẩm phù hợp.
                    </p>
                </div>
            </section>

            <section className="container-page categories-content">
                {isLoading ? (
                    <div className="categories-loading">
                        <Loader2 size={34} className="animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((category, index) => {
                            const Icon = iconMap[index % iconMap.length];
                            return (
                                <Link
                                    key={category.id}
                                    to={`${AppRoutePath.PRODUCTS}?category_id=${category.id}`}
                                    className="categories-card"
                                >
                                    <div className="categories-card__top">
                                        <span className="categories-card__icon">
                                            <Icon size={26} />
                                        </span>
                                        <ArrowRight size={20} className="categories-card__arrow" />
                                    </div>
                                    <h2 className="categories-card__name">{category.name}</h2>
                                    {category.description && (
                                        <p className="categories-card__desc">{category.description}</p>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </StoreLayout>
    );
};

export default CategoriesPage;
