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
import type { ProductReview } from "@/data/models/ProductReview";
import { t } from "@/core/localized";

const PRODUCT_REVIEW_PAGE_SIZE = 20;

interface Config extends BaseConfig {
    reviews: ProductReview[];
    isLoading: boolean;
    isDeleting: boolean;
    deleteId: number | null;
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    keyword: string;
    statusFilter: number | null;
}

interface Action extends BaseAction<Config> {
    onPageChange: (page: number) => void;
    onSearch: (keyword: string) => void;
    onFilterStatus: (status: number | null) => void;
    onUpdateStatus: (reviewId: number, status: number) => void;
    setDeleteId: (reviewId: number | null) => void;
    handleDelete: () => void;
}

export const AdminProductReviewsVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminProductReviewsVM.name,
        {
            reviews: [],
            isLoading: true,
            isDeleting: false,
            deleteId: null,
            page: 1,
            perPage: PRODUCT_REVIEW_PAGE_SIZE,
            totalItems: 0,
            totalPages: 1,
            keyword: "",
            statusFilter: null,
        }
    );

    const fetchReviews = async (
        page: number = 1,
        keyword: string = config.keyword,
        status: number | null = config.statusFilter,
    ) => {
        action.setNewConfig({ isLoading: true });
        const perPage = config.perPage || PRODUCT_REVIEW_PAGE_SIZE;
        const params: Record<string, any> = { page, per_page: perPage };
        if (keyword.trim()) params.keyword = keyword.trim();
        if (status !== null) params.status = status;

        const result = await productRepository.adminGetReviews(params);
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({
                reviews: result.data.items || [],
                page,
                keyword,
                statusFilter: status,
                perPage: result.data.paging?.per_page || perPage,
                totalItems: result.data.paging?.total_count || result.data.items?.length || 0,
                totalPages: result.data.paging?.total_pages || 1,
                isLoading: false,
            });
        } else {
            globalUI.handleApiError(result.error);
            action.setNewConfig({ isLoading: false });
        }
    };

    useEffect(() => {
        fetchReviews(1, "", null);
    }, []);

    const onPageChange = (page: number) => fetchReviews(page);

    const onSearch = (keyword: string) => fetchReviews(1, keyword, config.statusFilter);

    const onFilterStatus = (status: number | null) => fetchReviews(1, config.keyword, status);

    const onUpdateStatus = async (reviewId: number, status: number) => {
        globalUI.showLoading();
        const result = await productRepository.adminUpdateReviewStatus(reviewId, status);
        globalUI.hideLoading();

        if (result.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(t.admin.productReview.update_success());
            fetchReviews(config.page, config.keyword, config.statusFilter);
        } else {
            globalUI.handleApiError(result.error);
        }
    };

    const setDeleteId = (reviewId: number | null) => {
        action.setNewConfig({ deleteId: reviewId });
    };

    const handleDelete = async () => {
        if (config.deleteId === null) return;

        action.setNewConfig({ isDeleting: true });
        const result = await productRepository.adminDeleteReview(config.deleteId);

        if (result.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(t.admin.productReview.delete_success());
            action.setNewConfig({ isDeleting: false, deleteId: null });
            fetchReviews(config.page, config.keyword, config.statusFilter);
        } else {
            globalUI.handleApiError(result.error);
            action.setNewConfig({ isDeleting: false });
        }
    };

    return {
        config,
        action: {
            ...action,
            onPageChange,
            onSearch,
            onFilterStatus,
            onUpdateStatus,
            setDeleteId,
            handleDelete,
        },
    };
};
