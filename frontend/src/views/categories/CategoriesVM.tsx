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
import Paging from "@/data/models/Paging";

interface Config extends BaseConfig {
    categories: Category[];
    paging: Paging | null;
    isLoading: boolean;
    page: number;
    perPage: number;
}

interface Action extends BaseAction<Config> {
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
}

export const CategoriesVM: BaseViewModelFunc<Config, Action> = () => {
    const { categoryRepository } = useAppContext();

    const { config, action } = useBaseViewModel<Config>(
        CategoriesVM.name,
        {
            categories: [],
            paging: null,
            isLoading: true,
            page: 1,
            perPage: 12,
        }
    );

    useEffect(() => {
        const load = async () => {
            const res = await categoryRepository.getList();
            const items = res.type === ApiResultType.Success ? res.data : [];
            action.setNewConfig({
                categories: items,
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
                total_count: config.categories.length,
                next_page: page * perPage < config.categories.length ? page + 1 : null,
            }),
        });
    };

    const handlePageChange = (page: number) => refreshPaging(page, config.perPage);

    const handlePerPageChange = (perPage: number) => refreshPaging(1, perPage);

    return { config, action: { ...action, handlePageChange, handlePerPageChange } };
};
