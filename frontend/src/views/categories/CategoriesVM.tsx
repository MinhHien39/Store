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
import type { Category } from "@/data/models/Category";

interface Config extends BaseConfig {
    categories: Category[];
    isLoading: boolean;
}

interface Action extends BaseAction<Config> {}

export const CategoriesVM: BaseViewModelFunc<Config, Action> = () => {
    const { categoryRepository } = useAppContext();

    const { config, action } = useBaseViewModel<Config>(
        CategoriesVM.name,
        {
            categories: [],
            isLoading: true,
        }
    );

    useEffect(() => {
        const load = async () => {
            const res = await categoryRepository.getList();
            action.setNewConfig({
                categories: res.type === ApiResultType.Success ? res.data : [],
                isLoading: false,
            });
        };
        load();
    }, []);

    return { config, action: { ...action } };
};
