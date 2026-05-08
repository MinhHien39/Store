"use client";

import { useEffect } from "react";
import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { t } from "@/core/localized";
import { useAppContext } from "@/provider/AppContextProvider";
import type { Order } from "@/data/models/Order";

interface Config extends BaseConfig {
    orders: Order[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    statusFilter: number | null;
}

interface Action extends BaseAction<Config> {
    onPageChange: (page: number) => void;
    onFilterStatus: (status: number | null) => void;
    onUpdateStatus: (orderId: number, status: number) => void;
}

export const AdminOrderListVM: BaseViewModelFunc<Config, Action> = () => {
    const { orderRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminOrderListVM.name,
        {
            orders: [],
            isLoading: true,
            page: 1,
            totalPages: 1,
            statusFilter: null,
        }
    );

    const fetchOrders = async (page: number = 1, status: number | null = null) => {
        action.setNewConfig({ isLoading: true });
        const params: Record<string, any> = { page, per_page: 20 };
        if (status !== null) params.status = status;
        const result = await orderRepository.adminGetOrders(params);
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({
                orders: result.data.items || [],
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
        fetchOrders();
    }, []);

    const onPageChange = (page: number) => fetchOrders(page, config.statusFilter);

    const onFilterStatus = (status: number | null) => {
        action.setNewConfig({ statusFilter: status });
        fetchOrders(1, status);
    };

    const onUpdateStatus = async (orderId: number, status: number) => {
        globalUI.showLoading();
        const result = await orderRepository.adminUpdateOrderStatus(orderId, status);
        globalUI.hideLoading();
        if (result.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(t.admin.order.update_status_success());
            fetchOrders(config.page, config.statusFilter);
        } else {
            globalUI.handleApiError(result.error);
        }
    };

    return {
        config,
        action: { ...action, onPageChange, onFilterStatus, onUpdateStatus },
    };
};
