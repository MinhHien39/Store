"use client";

import { useEffect } from "react";
import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import type { ProductViewStats } from "@/data/models/ProductView";

interface Config extends BaseConfig {
    stats: ProductViewStats[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    keyword: string;
}

interface Action extends BaseAction<Config> {
    onPageChange: (page: number) => void;
    onSearch: (keyword: string) => void;
}

export const AdminProductViewsVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminProductViewsVM.name,
        {
            stats: [],
            isLoading: true,
            page: 1,
            totalPages: 1,
            keyword: "",
        }
    );

    const fetchStats = async (page: number = 1, keyword: string = "") => {
        action.setNewConfig({ isLoading: true });
        const params: Record<string, any> = { page, per_page: 20 };
        if (keyword.trim()) params.keyword = keyword.trim();

        const result = await productRepository.adminGetViewStats(params);
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({
                stats: result.data.items || [],
                page,
                totalPages: result.data.paging?.total_pages || 1,
                isLoading: false,
            });
        } else {
            globalUI.handleApiError(result.error);
            action.setNewConfig({ isLoading: false });
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onPageChange = (page: number) => fetchStats(page, config.keyword);

    const onSearch = (keyword: string) => {
        action.setNewConfig({ keyword });
        fetchStats(1, keyword);
    };

    return {
        config,
        action: { ...action, onPageChange, onSearch },
    };
};
