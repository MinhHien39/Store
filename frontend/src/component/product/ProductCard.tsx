"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { formatVnd } from "@/core/utils/currency";

export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    reviewCount: number;
    badge?: "sale" | "new" | "hot";
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <Link to={`${AppRoutePath.PRODUCTS}/${product.id}`} className="group block">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-muted mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {product.badge && (
                    <span
                        className={`type-label absolute top-0 left-0 px-3 py-1.5 text-[10px] text-white ${
                            product.badge === "sale" ? "bg-sale" : product.badge === "new" ? "bg-primary" : "bg-secondary"
                        }`}
                    >
                        {product.badge === "sale" ? `-${discount}%` : product.badge === "new" ? "NEW" : "HOT"}
                    </span>
                )}
                {/* Quick add - appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="type-label w-full bg-primary text-on-primary py-3.5 text-[11px] hover:bg-accent transition-colors duration-200">
                        カートに追加
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-1.5">
                <p className="text-[15px] font-medium leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {product.name}
                </p>
                <p className="type-label text-[10px] text-muted-foreground">{product.category}</p>
                <div className="flex items-center gap-2.5 pt-1">
                    {product.originalPrice && (
                        <span className="text-[14px] text-muted-foreground line-through" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatVnd(product.originalPrice)}</span>
                    )}
                    <span className={`text-[14px] font-semibold ${product.originalPrice ? "text-sale" : ""}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatVnd(product.price)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
