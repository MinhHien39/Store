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
import Paging from "@/data/models/Paging";

interface Config extends BaseConfig {
    brands: Brand[];
    paging: Paging | null;
    isLoading: boolean;
    page: number;
    perPage: number;
}

interface Action extends BaseAction<Config> {
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
}

export const BrandsVM: BaseViewModelFunc<Config, Action> = () => {
    const { brandRepository } = useAppContext();

    const { config, action } = useBaseViewModel<Config>(
        BrandsVM.name,
        {
            brands: [],
            paging: null,
            isLoading: true,
            page: 1,
            perPage: 12,
        }
    );

    useEffect(() => {
        const load = async () => {
            const res = await brandRepository.getList();
            const items = res.type === ApiResultType.Success ? res.data : [];
            action.setNewConfig({
                brands: items,
                paging: new Paging().fromJson({
                    current_page: config.page,
                    per_page: config.perPage,
                    total_count: items.length,
                    next_page: items.length > config.perPage ? 2 : null,
                }),
                isLoading: false,
            });
        };
        load();
    }, []);

    const refreshPaging = (page: number, perPage: number) => {
        action.setNewConfig({
            page,
            perPage,
            paging: new Paging().fromJson({
                current_page: page,
                per_page: perPage,
                total_count: config.brands.length,
                next_page: page * perPage < config.brands.length ? page + 1 : null,
            }),
        });
    };

    const handlePageChange = (page: number) => refreshPaging(page, config.perPage);

    const handlePerPageChange = (perPage: number) => refreshPaging(1, perPage);

    return { config, action: { ...action, handlePageChange, handlePerPageChange } };
};
