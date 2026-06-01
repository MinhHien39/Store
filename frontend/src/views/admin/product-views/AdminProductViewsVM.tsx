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
import type { ProductViewChartItem, ProductViewStats, ProductViewStatsSummary } from "@/data/models/ProductView";

const PRODUCT_VIEW_PAGE_SIZE = 8;

interface Config extends BaseConfig {
    stats: ProductViewStats[];
    chart: ProductViewChartItem[];
    summary: ProductViewStatsSummary;
    isLoading: boolean;
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    keyword: string;
    month: string;
    year: string;
    source: string;
    deviceType: string;
}

interface Action extends BaseAction<Config> {
    onPageChange: (page: number) => void;
    onApplyFilters: (filters: Partial<Pick<Config, "keyword" | "month" | "year" | "source" | "deviceType">>) => void;
}

export const AdminProductViewsVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminProductViewsVM.name,
        {
            stats: [],
            chart: [],
            summary: {
                total_views: 0,
                authenticated_views: 0,
                anonymous_views: 0,
                unique_visitors: 0,
                web_views: 0,
                mobile_views: 0,
                desktop_views: 0,
                tablet_views: 0,
            },
            isLoading: true,
            page: 1,
            perPage: PRODUCT_VIEW_PAGE_SIZE,
            totalItems: 0,
            totalPages: 1,
            keyword: "",
            month: "",
            year: "",
            source: "",
            deviceType: "",
        }
    );

    const fetchStats = async (
        page: number = 1,
        filters: Partial<Pick<Config, "keyword" | "month" | "year" | "source" | "deviceType">> = {}
    ) => {
        const nextFilters = {
            keyword: filters.keyword ?? config.keyword,
            month: filters.month ?? config.month,
            year: filters.year ?? config.year,
            source: filters.source ?? config.source,
            deviceType: filters.deviceType ?? config.deviceType,
        };
        action.setNewConfig({ isLoading: true });
        const params: Record<string, any> = { page, per_page: PRODUCT_VIEW_PAGE_SIZE };
        if (nextFilters.keyword.trim()) params.keyword = nextFilters.keyword.trim();
        if (nextFilters.month) params.month = Number(nextFilters.month);
        if (nextFilters.year) params.year = Number(nextFilters.year);
        if (nextFilters.source) params.source = nextFilters.source;
        if (nextFilters.deviceType) params.device_type = nextFilters.deviceType;

        const result = await productRepository.adminGetViewStats(params);
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({
                stats: result.data.items || [],
                chart: result.data.chart || [],
                summary: result.data.summary || {
                    total_views: 0,
                    authenticated_views: 0,
                    anonymous_views: 0,
                    unique_visitors: 0,
                    web_views: 0,
                    mobile_views: 0,
                    desktop_views: 0,
                    tablet_views: 0,
                },
                page,
                perPage: result.data.paging?.per_page || PRODUCT_VIEW_PAGE_SIZE,
                totalItems: result.data.paging?.total_count || result.data.items?.length || 0,
                totalPages: result.data.paging?.total_pages || 1,
                ...nextFilters,
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

    const onPageChange = (page: number) => fetchStats(page);

    const onApplyFilters = (filters: Partial<Pick<Config, "keyword" | "month" | "year" | "source" | "deviceType">>) => {
        action.setNewConfig(filters);
        fetchStats(1, filters);
    };

    return {
        config,
        action: { ...action, onPageChange, onApplyFilters },
    };
};
