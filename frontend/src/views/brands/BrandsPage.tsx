"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import StoreLayout from "@/component/layout/StoreLayout";
import Pagination from "@/component/pagination/Pagination";
import { ArrowRight, Award, BadgeCheck, Loader2 } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { BrandsVM } from "./BrandsVM";
import "./styles.css";

const BrandsPage: React.FC = () => {
    useLanguage();
    const { config, action } = BrandsVM();
    const { brands, paging, isLoading, page, perPage } = config;
    const pagedBrands = brands.slice((page - 1) * perPage, page * perPage);

    return (
        <StoreLayout>
            <section className="brands-header">
                <div className="container-page brands-header__inner">
                    <div className="section-eyebrow">
                        <Award size={16} />
                        Store
                    </div>
                    <h1 className="type-title">{t.store.nav.brands()}</h1>
                    <p className="section-subtitle">
                        Các thương hiệu được sắp xếp rõ ràng để bạn xem sản phẩm nhanh hơn.
                    </p>
                </div>
            </section>

            <section className="container-page brands-content">
                {isLoading ? (
                    <div className="brands-loading">
                        <Loader2 size={34} className="animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                    <div className="brands-grid">
                        {pagedBrands.map((brand) => (
                            <Link
                                key={brand.id}
                                to={`${AppRoutePath.PRODUCTS}?brand_id=${brand.id}`}
                                className="brands-card"
                            >
                                <div className="brands-card__top">
                                    <span className="brands-card__icon">
                                        <BadgeCheck size={26} />
                                    </span>
                                    <ArrowRight size={20} className="brands-card__arrow" />
                                </div>
                                <h2 className="brands-card__name">{brand.name}</h2>
                                {brand.description && (
                                    <p className="brands-card__desc">{brand.description}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                    {paging && (
                        <Pagination
                            props={{
                                paging,
                                onPageChange: action.handlePageChange,
                                onPerPageChange: action.handlePerPageChange,
                                style: { marginTop: 28 },
                            }}
                        />
                    )}
                    </>
                )}
            </section>
        </StoreLayout>
    );
};

export default BrandsPage;
