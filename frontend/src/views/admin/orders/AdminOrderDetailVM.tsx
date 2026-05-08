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
import { t } from "@/core/localized";
import { useAppContext } from "@/provider/AppContextProvider";
import type { Order } from "@/data/models/Order";

interface Config extends BaseConfig {
    order: Order | null;
    isLoading: boolean;
}

interface Action extends BaseAction<Config> {
    onUpdateStatus: (status: number) => void;
}

export const AdminOrderDetailVM: BaseViewModelFunc<Config, Action> = () => {
    const { id } = useParams<{ id: string }>();
    const { orderRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminOrderDetailVM.name,
        { order: null, isLoading: true }
    );

    const fetchOrder = async () => {
        if (!id) return;
        action.setNewConfig({ isLoading: true });
        const result = await orderRepository.adminGetOrderDetail(Number(id));
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({ order: result.data, isLoading: false });
        } else {
            globalUI.handleApiError(result.error);
            action.setNewConfig({ isLoading: false });
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const onUpdateStatus = async (status: number) => {
        if (!id) return;
        globalUI.showLoading();
        const result = await orderRepository.adminUpdateOrderStatus(Number(id), status);
        globalUI.hideLoading();
        if (result.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(t.admin.order.update_status_success());
            action.setNewConfig({ order: result.data });
        } else {
            globalUI.handleApiError(result.error);
        }
    };

    return { config, action: { ...action, onUpdateStatus } };
};
