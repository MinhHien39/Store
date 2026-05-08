"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import type { Product } from "@/data/models/Product";
import type { Category } from "@/data/models/Category";
import type { Brand } from "@/data/models/Brand";

interface Config extends BaseConfig {
    products: Product[];
    categories: Category[];
    brands: Brand[];
    isLoading: boolean;
    searchInput: string;
    keyword: string;
    categoryId: number | undefined;
    brandId: number | undefined;
    sort: string;
}

interface Action extends BaseAction<Config> {
    handleSearchChange: (value: string) => void;
    updateFilter: (key: string, value: string | undefined) => void;
    clearFilters: () => void;
}

export const ProductListVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository, categoryRepository, brandRepository } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const keyword = searchParams.get("keyword") || "";
    const categoryId = searchParams.get("category_id") ? Number(searchParams.get("category_id")) : undefined;
    const brandId = searchParams.get("brand_id") ? Number(searchParams.get("brand_id")) : undefined;
    const sort = searchParams.get("sort") || "newest";

    const { config, action } = useBaseViewModel<Config>(
        ProductListVM.name,
        {
            products: [],
            categories: [],
            brands: [],
            isLoading: true,
            searchInput: keyword,
            keyword,
            categoryId,
            brandId,
            sort,
        }
    );

    useEffect(() => {
        const loadMeta = async () => {
            const [catRes, brandRes] = await Promise.all([
                categoryRepository.getList(),
                brandRepository.getList(),
            ]);
            action.setNewConfig({
                categories: catRes.type === ApiResultType.Success ? catRes.data : [],
                brands: brandRes.type === ApiResultType.Success ? brandRes.data : [],
            });
        };
        loadMeta();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            action.setNewConfig({ isLoading: true });
            const res = await productRepository.getList({
                keyword,
                category_id: categoryId,
                brand_id: brandId,
                sort_by: sort === "newest" ? "created_at" : "price",
                sort_dir: sort === "price_asc" ? "asc" : "desc",
            });
            action.setNewConfig({
                products: res.type === ApiResultType.Success ? (res.data.items || []) : [],
                isLoading: false,
            });
        };
        loadProducts();
    }, [keyword, categoryId, brandId, sort]);

    const handleSearchChange = (value: string) => {
        action.setNewConfig({ searchInput: value });
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (value.trim()) {
                params.set("keyword", value.trim());
            } else {
                params.delete("keyword");
            }
            setSearchParams(params);
        }, 350);
    };

    const updateFilter = (key: string, value: string | undefined) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchParams({});
        action.setNewConfig({ searchInput: "" });
    };

    return {
        config: { ...config, keyword, categoryId, brandId, sort },
        action: { ...action, handleSearchChange, updateFilter, clearFilters },
    };
};
