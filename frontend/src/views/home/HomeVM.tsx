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
import type { Product } from "@/data/models/Product";
import type { Category } from "@/data/models/Category";
import type { Brand } from "@/data/models/Brand";

interface Config extends BaseConfig {
    categories: Category[];
    brands: Brand[];
    products: Product[];
    isLoading: boolean;
}

interface Action extends BaseAction<Config> {}

export const HomeVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository, categoryRepository, brandRepository } = useAppContext();

    const { config, action } = useBaseViewModel<Config>(
        HomeVM.name,
        {
            categories: [],
            brands: [],
            products: [],
            isLoading: true,
        }
    );

    useEffect(() => {
        const load = async () => {
            action.setNewConfig({ isLoading: true });
            const [catRes, brandRes, prodRes] = await Promise.all([
                categoryRepository.getList(),
                brandRepository.getList(),
                productRepository.getList({ sort_by: "created_at", sort_dir: "desc", per_page: 12 }),
            ]);
            action.setNewConfig({
                categories: catRes.type === ApiResultType.Success ? catRes.data : [],
                brands: brandRes.type === ApiResultType.Success ? brandRes.data : [],
                products:
                    prodRes.type === ApiResultType.Success
                        ? prodRes.data.items || []
                        : [],
                isLoading: false,
            });
        };
        load();
    }, []);

    return { config, action: { ...action } };
};
