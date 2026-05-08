"use client";

import React from "react";
import { useEffect } from "react";
import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import type { Order } from "@/data/models/Order";

interface Config extends BaseConfig {
    orders: Order[];
    isLoading: boolean;
    page: number;
    totalPages: number;
}

interface Action extends BaseAction<Config> {
    onPageChange: (page: number) => void;
    refresh: () => void;
}

export const OrderListVM: BaseViewModelFunc<Config, Action> = () => {
    const { orderRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        OrderListVM.name,
        {
            orders: [],
            isLoading: true,
            page: 1,
            totalPages: 1,
        }
    );

    const fetchOrders = async (page: number = 1) => {
        action.setNewConfig({ isLoading: true });
        const result = await orderRepository.getMyOrders({ page, per_page: 10 });
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

    const onPageChange = (page: number) => fetchOrders(page);
    const refresh = () => fetchOrders(config.page);

    return {
        config,
        action: { ...action, onPageChange, refresh },
    };
};
