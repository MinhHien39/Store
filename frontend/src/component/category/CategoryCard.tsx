"use client";

import React from "react";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";

export interface Category {
    id: number;
    name: string;
    image: string;
    productCount: number;
}

interface CategoryCardProps {
    category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
    return (
        <Link to={`${AppRoutePath.CATEGORIES}/${category.id}`} className="group block relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <h3 className="text-white text-lg md:text-xl font-bold italic" style={{ fontFamily: 'var(--font-heading)' }}>{category.name}</h3>
                <p className="type-label text-white/60 text-[10px] mt-1">{category.productCount}点の商品</p>
            </div>
        </Link>
    );
};

export default CategoryCard;
