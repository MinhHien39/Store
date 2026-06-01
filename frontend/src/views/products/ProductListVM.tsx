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
import Paging from "@/data/models/Paging";
import { trackSearchResults, trackViewItemList } from "@/core/firebaseAnalytics";

interface Config extends BaseConfig {
    products: Product[];
    paging: Paging | null;
    categories: Category[];
    brands: Brand[];
    isLoading: boolean;
    searchInput: string;
    keyword: string;
    categoryId: number | undefined;
    brandId: number | undefined;
    sort: string;
    page: number;
    perPage: number;
}

interface Action extends BaseAction<Config> {
    handleSearchChange: (value: string) => void;
    updateFilter: (key: string, value: string | undefined) => void;
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
    clearFilters: () => void;
}

export const ProductListVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository, categoryRepository, brandRepository } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const trackedListingSignature = useRef<string>("");

    const keyword = searchParams.get("keyword") || "";
    const categoryId = searchParams.get("category_id") ? Number(searchParams.get("category_id")) : undefined;
    const brandId = searchParams.get("brand_id") ? Number(searchParams.get("brand_id")) : undefined;
    const sort = searchParams.get("sort") || "newest";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const perPage = searchParams.get("per_page") ? Number(searchParams.get("per_page")) : 20;

    const { config, action } = useBaseViewModel<Config>(
        ProductListVM.name,
        {
            products: [],
            paging: null,
            categories: [],
            brands: [],
            isLoading: true,
            searchInput: keyword,
            keyword,
            categoryId,
            brandId,
            sort,
            page,
            perPage,
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
                page,
                per_page: perPage,
            });
            const nextProducts =
                res.type === ApiResultType.Success ? (res.data.items || []) : [];
            action.setNewConfig({
                products: nextProducts,
                paging: res.type === ApiResultType.Success ? new Paging().fromJson(res.data.paging || {}) : null,
                isLoading: false,
            });

            if (res.type !== ApiResultType.Success) return;

            const itemListId = keyword
                ? "search_results"
                : categoryId
                    ? `category_${categoryId}`
                    : brandId
                        ? `brand_${brandId}`
                        : "all_products";
            const itemListName = keyword
                ? `Search: ${keyword}`
                : categoryId
                    ? `Category ${categoryId}`
                    : brandId
                        ? `Brand ${brandId}`
                        : "All Products";
            const signature = JSON.stringify({
                itemListId,
                keyword,
                categoryId,
                brandId,
                sort,
                page,
                perPage,
                ids: nextProducts.map((product) => product.id),
            });

            if (trackedListingSignature.current === signature) return;
            trackedListingSignature.current = signature;

            void trackViewItemList(nextProducts, itemListId, itemListName);
            if (keyword) {
                void trackSearchResults(keyword, nextProducts.length);
            }
        };
        loadProducts();
    }, [keyword, categoryId, brandId, sort, page, perPage]);

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
            params.set("page", "1");
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
        params.set("page", "1");
        setSearchParams(params);
    };

    const handlePageChange = (nextPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(nextPage));
        setSearchParams(params);
    };

    const handlePerPageChange = (nextPerPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("per_page", String(nextPerPage));
        params.set("page", "1");
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchParams({});
        action.setNewConfig({ searchInput: "" });
    };

    return {
        config: { ...config, keyword, categoryId, brandId, sort, page, perPage },
        action: { ...action, handleSearchChange, updateFilter, handlePageChange, handlePerPageChange, clearFilters },
    };
};
