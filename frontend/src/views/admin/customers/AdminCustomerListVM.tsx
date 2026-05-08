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

interface CustomerItem {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    status: number;
    created_at: string;
}

interface Config extends BaseConfig {
    customers: CustomerItem[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    keyword: string;
    searchInput: string;
}

interface Action extends BaseAction<Config> {
    onSearch: (keyword: string) => void;
    onPageChange: (page: number) => void;
    setSearchInput: (value: string) => void;
    handleSearchSubmit: () => void;
}

export const AdminCustomerListVM: BaseViewModelFunc<Config, Action> = () => {
    const { storeUserRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminCustomerListVM.name,
        {
            customers: [],
            isLoading: true,
            page: 1,
            totalPages: 1,
            keyword: "",
            searchInput: "",
        }
    );

    const fetchCustomers = async (page: number = 1, keyword: string = "") => {
        action.setNewConfig({ isLoading: true });
        const params: Record<string, any> = { page, per_page: 20 };
        if (keyword) params.keyword = keyword;
        const result = await storeUserRepository.getList(params);
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({
                customers: (result.data.items || []) as CustomerItem[],
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
        fetchCustomers();
    }, []);

    const onSearch = (keyword: string) => {
        action.setNewConfig({ keyword });
        fetchCustomers(1, keyword);
    };

    const onPageChange = (page: number) => fetchCustomers(page, config.keyword);

    const setSearchInput = (value: string) => action.setNewConfig({ searchInput: value });

    const handleSearchSubmit = () => {
        onSearch(config.searchInput);
    };

    return {
        config,
        action: { ...action, onSearch, onPageChange, setSearchInput, handleSearchSubmit },
    };
};
