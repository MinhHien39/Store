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
import { t } from "@/core/localized";

interface CustomerItem {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    status: number;
    created_at: string;
}

interface CustomerForm {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    status: string;
}

interface CustomerFormErrors {
    fullName?: string;
    email?: string;
    password?: string;
}

const initialForm: CustomerForm = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    status: "1",
};

const CUSTOMER_PAGE_SIZE = 20;

interface Config extends BaseConfig {
    customers: CustomerItem[];
    isLoading: boolean;
    isModalOpen: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    editItem: CustomerItem | null;
    deleteId: number | null;
    form: CustomerForm;
    formErrors: CustomerFormErrors;
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    keyword: string;
    searchInput: string;
}

interface Action extends BaseAction<Config> {
    onSearch: (keyword: string) => void;
    onPageChange: (page: number) => void;
    setSearchInput: (value: string) => void;
    handleSearchSubmit: () => void;
    openCreate: () => void;
    openEdit: (customer: CustomerItem) => void;
    closeModal: () => void;
    setFormField: (field: keyof CustomerForm, value: string) => void;
    handleSave: () => Promise<void>;
    setDeleteId: (id: number | null) => void;
    handleDelete: () => Promise<void>;
}

export const AdminCustomerListVM: BaseViewModelFunc<Config, Action> = () => {
    const { storeUserRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminCustomerListVM.name,
        {
            customers: [],
            isLoading: true,
            isModalOpen: false,
            isSaving: false,
            isDeleting: false,
            editItem: null,
            deleteId: null,
            form: initialForm,
            formErrors: {},
            page: 1,
            perPage: CUSTOMER_PAGE_SIZE,
            totalItems: 0,
            totalPages: 1,
            keyword: "",
            searchInput: "",
        }
    );

    const fetchCustomers = async (page: number = 1, keyword: string = "") => {
        action.setNewConfig({ isLoading: true });
        const perPage = config.perPage || CUSTOMER_PAGE_SIZE;
        const params: Record<string, any> = { page, per_page: perPage };
        if (keyword) params.keyword = keyword;
        const result = await storeUserRepository.getList(params);
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({
                customers: (result.data.items || []) as CustomerItem[],
                page,
                perPage: result.data.paging?.per_page || perPage,
                totalItems: result.data.paging?.total_count || result.data.items?.length || 0,
                totalPages: result.data.paging?.total_pages || 1,
                keyword,
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

    const openCreate = () => {
        action.setNewConfig({
            isModalOpen: true,
            editItem: null,
            form: initialForm,
            formErrors: {},
        });
    };

    const openEdit = (customer: CustomerItem) => {
        action.setNewConfig({
            isModalOpen: true,
            editItem: customer,
            form: {
                fullName: customer.full_name || "",
                email: customer.email || "",
                phone: customer.phone || "",
                password: "",
                status: String(customer.status ?? 1),
            },
            formErrors: {},
        });
    };

    const closeModal = () => {
        action.setNewConfig({ isModalOpen: false, editItem: null, formErrors: {} });
    };

    const setFormField = (field: keyof CustomerForm, value: string) => {
        action.setNewConfig({
            form: { ...config.form, [field]: value },
            formErrors: { ...config.formErrors, [field]: undefined },
        });
    };

    const validateForm = () => {
        const errors: CustomerFormErrors = {};
        if (!config.form.fullName.trim()) errors.fullName = t.admin.customer.full_name_required();
        if (!config.form.email.trim()) {
            errors.email = t.admin.customer.email_required();
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.form.email.trim())) {
            errors.email = t.admin.customer.email_invalid();
        }
        if (!config.editItem && config.form.password.trim().length < 6) {
            errors.password = t.admin.customer.password_required();
        }
        if (config.editItem && config.form.password.trim() && config.form.password.trim().length < 6) {
            errors.password = t.admin.customer.password_min();
        }
        action.setNewConfig({ formErrors: errors });
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        action.setNewConfig({ isSaving: true });
        const payload: Record<string, any> = {
            full_name: config.form.fullName.trim(),
            email: config.form.email.trim(),
            phone: config.form.phone.trim(),
            status: Number(config.form.status),
        };
        if (config.form.password.trim()) payload.password = config.form.password.trim();

        const result = config.editItem
            ? await storeUserRepository.update(config.editItem.id, payload)
            : await storeUserRepository.create(payload);

        if (result.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(config.editItem ? t.admin.customer.update_success() : t.admin.customer.create_success());
            action.setNewConfig({ isSaving: false, isModalOpen: false, editItem: null });
            await fetchCustomers(config.editItem ? config.page : 1, config.keyword);
        } else {
            globalUI.handleApiError(result.error);
            action.setNewConfig({ isSaving: false });
        }
    };

    const setDeleteId = (id: number | null) => {
        action.setNewConfig({ deleteId: id });
    };

    const handleDelete = async () => {
        if (config.deleteId === null) return;

        action.setNewConfig({ isDeleting: true });
        const result = await storeUserRepository.deleteUser(config.deleteId);
        if (result.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(t.admin.customer.delete_success());
            action.setNewConfig({ deleteId: null, isDeleting: false });
            await fetchCustomers(config.page, config.keyword);
        } else {
            globalUI.handleApiError(result.error);
            action.setNewConfig({ isDeleting: false });
        }
    };

    return {
        config,
        action: {
            ...action,
            onSearch,
            onPageChange,
            setSearchInput,
            handleSearchSubmit,
            openCreate,
            openEdit,
            closeModal,
            setFormField,
            handleSave,
            setDeleteId,
            handleDelete,
        },
    };
};
