import { useEffect } from "react";
import { useAppContext } from '@/provider/AppContextProvider';
import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from '@/core/base/BaseViewModel';
import { ApiResultType } from '@/core/api';
import type { DashboardSummary } from "@/data/repository/DashboardRepository";
import type { Category } from "@/data/models/Category";
import type { Brand } from "@/data/models/Brand";

interface Config extends BaseConfig {
    summary: DashboardSummary | null;
    categories: Category[];
    brands: Brand[];
    isLoading: boolean;
}

interface Action extends BaseAction<Config> {}

export const AdminDashboardVM: BaseViewModelFunc<Config, Action> = () => {
    const { dashboardRepository, categoryRepository, brandRepository } = useAppContext();

    const { config, action, appNavigation, globalUI } = useBaseViewModel<Config>(
        AdminDashboardVM.name,
        {
            summary: null,
            categories: [],
            brands: [],
            isLoading: true,
        }
    );

    const loadAll = async () => {
        action.setNewConfig({ isLoading: true });
        const [summaryRes, catRes, brandRes] = await Promise.all([
            dashboardRepository.getSummary(),
            categoryRepository.getList(),
            brandRepository.getList(),
        ]);
        const updates: Partial<Config> = { isLoading: false };
        if (summaryRes.type === ApiResultType.Success) updates.summary = summaryRes.data;
        else globalUI.handleApiError(summaryRes.error);
        if (catRes.type === ApiResultType.Success) updates.categories = catRes.data;
        if (brandRes.type === ApiResultType.Success) updates.brands = brandRes.data;
        action.setNewConfig(updates);
    };

    useEffect(() => {
        action.onDidMount();
        loadAll();
        return () => action.onWillUnmount();
    }, []);

    return { config, action: { ...action }, appNavigation };
};
