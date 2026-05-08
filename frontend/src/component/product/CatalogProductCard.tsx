"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { AppRoutePath } from "@/application/AppRoutePath";
import type { Product } from "@/data/models/Product";
import { formatVnd } from "@/core/utils/currency";
import styles from "./CatalogProductCard.module.css";

interface CatalogProductCardProps {
    product: Product;
}

const CatalogProductCard: React.FC<CatalogProductCardProps> = ({ product }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const salePrice = product.sale_price;
    const basePrice = product.price;
    const hasImage = Boolean(product.main_image_url) && !imageFailed;
    const hasSale = salePrice != null && basePrice != null && salePrice < basePrice;
    const discount = hasSale
        ? Math.round((1 - salePrice / basePrice) * 100)
        : 0;
    const displayPrice = salePrice ?? basePrice;

    return (
        <Link
            to={`${AppRoutePath.PRODUCTS}/${product.id}`}
            className={styles.card}
        >
            <div className={styles.imageFrame}>
                {hasImage ? (
                    <img
                        src={product.main_image_url}
                        alt={product.name}
                        className={styles.image}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className={styles.imageFallback}>
                        <Package size={30} strokeWidth={1.7} />
                        <span>{product.name}</span>
                    </div>
                )}
                {hasSale && (
                    <span className={styles.saleBadge}>
                        -{discount}%
                    </span>
                )}
            </div>

            <div className={styles.body}>
                <div className={styles.meta}>
                    {product.category_name && <span>{product.category_name}</span>}
                    {product.category_name && product.brand_name && <span>·</span>}
                    {product.brand_name && <span>{product.brand_name}</span>}
                </div>
                <h3 className={styles.title}>
                    {product.name}
                </h3>
                {product.short_description && (
                    <p className={styles.description}>
                        {product.short_description}
                    </p>
                )}
                <div className={styles.priceRow}>
                    {hasSale ? (
                        <>
                            <span className={styles.salePrice} style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {formatVnd(salePrice)}
                            </span>
                            <span className={styles.originalPrice} style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {formatVnd(basePrice)}
                            </span>
                        </>
                    ) : (
                        <span className={styles.regularPrice} style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {formatVnd(displayPrice)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CatalogProductCard;
