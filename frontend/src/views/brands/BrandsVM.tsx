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
import type { Brand } from "@/data/models/Brand";

interface Config extends BaseConfig {
    brands: Brand[];
    isLoading: boolean;
}

interface Action extends BaseAction<Config> {}

export const BrandsVM: BaseViewModelFunc<Config, Action> = () => {
    const { brandRepository } = useAppContext();

    const { config, action } = useBaseViewModel<Config>(
        BrandsVM.name,
        {
            brands: [],
            isLoading: true,
        }
    );

    useEffect(() => {
        const load = async () => {
            const res = await brandRepository.getList();
            action.setNewConfig({
                brands: res.type === ApiResultType.Success ? res.data : [],
                isLoading: false,
            });
        };
        load();
    }, []);

    return { config, action: { ...action } };
};
