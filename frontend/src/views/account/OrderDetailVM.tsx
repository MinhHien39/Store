"use client";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
    order: Order | null;
    isLoading: boolean;
}

interface Action extends BaseAction<Config> {}

export const OrderDetailVM: BaseViewModelFunc<Config, Action> = () => {
    const { id } = useParams<{ id: string }>();
    const { orderRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        OrderDetailVM.name,
        { order: null, isLoading: true }
    );

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            action.setNewConfig({ isLoading: true });
            const result = await orderRepository.getMyOrderDetail(Number(id));
            if (result.type === ApiResultType.Success) {
                action.setNewConfig({ order: result.data, isLoading: false });
            } else {
                globalUI.handleApiError(result.error);
                action.setNewConfig({ isLoading: false });
            }
        };
        fetchOrder();
    }, [id]);

    return { config, action: { ...action } };
};
