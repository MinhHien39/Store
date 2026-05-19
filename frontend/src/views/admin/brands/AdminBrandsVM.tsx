import { useEffect } from "react";
import { useAppContext } from '@/provider/AppContextProvider';
import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from '@/core/base/BaseViewModel';
import { ApiResultType } from '@/core/api';
import { t } from '@/core/localized';
import type { Brand } from "@/data/models/Brand";
import Paging from "@/data/models/Paging";

interface Config extends BaseConfig {
    brands: Brand[];
    paging: Paging | null;
    isLoading: boolean;
    isModalOpen: boolean;
    editItem: Brand | null;
    deleteId: number | null;
    isDeleting: boolean;
    isSaving: boolean;
    formName: string;
    formDesc: string;
    formError: string;
    page: number;
    perPage: number;
}

interface Action extends BaseAction<Config> {
    openCreate: () => void;
    openEdit: (brand: Brand) => void;
    closeModal: () => void;
    setFormName: (v: string) => void;
    setFormDesc: (v: string) => void;
    handleSave: () => Promise<void>;
    setDeleteId: (id: number | null) => void;
    handleDelete: () => Promise<void>;
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
}

export const AdminBrandsVM: BaseViewModelFunc<Config, Action> = () => {
    const { brandRepository } = useAppContext();

    const { config, action, appNavigation, globalUI } = useBaseViewModel<Config>(
        AdminBrandsVM.name,
        {
            brands: [],
            paging: null,
            isLoading: true,
            isModalOpen: false,
            editItem: null,
            deleteId: null,
            isDeleting: false,
            isSaving: false,
            formName: '',
            formDesc: '',
            formError: '',
            page: 1,
            perPage: 20,
        }
    );

    const buildPaging = (totalCount: number, page = config.page, perPage = config.perPage) => new Paging().fromJson({
        current_page: page,
        per_page: perPage,
        total_count: totalCount,
        next_page: page * perPage < totalCount ? page + 1 : null,
    });

    const fetchBrands = async () => {
        config.isLoading = true;
        action.setNewConfig(config);
        const res = await brandRepository.getList();
        config.isLoading = false;
        if (res.type === ApiResultType.Success) {
            config.brands = res.data;
            config.paging = buildPaging(res.data.length);
        } else {
            globalUI.handleApiError(res.error);
        }
        action.setNewConfig(config);
    };

    const openCreate = () => {
        config.editItem = null;
        config.formName = '';
        config.formDesc = '';
        config.formError = '';
        config.isModalOpen = true;
        action.setNewConfig(config);
    };

    const openEdit = (brand: Brand) => {
        config.editItem = brand;
        config.formName = brand.name;
        config.formDesc = brand.description;
        config.formError = '';
        config.isModalOpen = true;
        action.setNewConfig(config);
    };

    const closeModal = () => {
        config.isModalOpen = false;
        action.setNewConfig(config);
    };

    const setFormName = (v: string) => {
        config.formName = v;
        config.formError = '';
        action.setNewConfig(config);
    };

    const setFormDesc = (v: string) => {
        config.formDesc = v;
        action.setNewConfig(config);
    };

    const handleSave = async () => {
        if (!config.formName.trim()) {
            config.formError = t.admin.common.name_required();
            action.setNewConfig(config);
            return;
        }
        config.isSaving = true;
        action.setNewConfig(config);
        const data = { name: config.formName.trim(), description: config.formDesc.trim() };
        const res = config.editItem
            ? await brandRepository.adminUpdate(config.editItem.id, data)
            : await brandRepository.adminCreate(data);
        config.isSaving = false;
        if (res.type === ApiResultType.Success) {
            config.isModalOpen = false;
            action.setNewConfig(config);
            globalUI.showSuccessAlert(config.editItem ? t.admin.brand.update_success() : t.admin.brand.create_success());
            await fetchBrands();
        } else {
            globalUI.handleApiError(res.error);
            action.setNewConfig(config);
        }
    };

    const setDeleteId = (id: number | null) => {
        config.deleteId = id;
        action.setNewConfig(config);
    };

    const handleDelete = async () => {
        if (config.deleteId === null) return;
        config.isDeleting = true;
        action.setNewConfig(config);
        const res = await brandRepository.adminDelete(config.deleteId);
        if (res.type === ApiResultType.Success) {
            config.brands = config.brands.filter(b => b.id !== config.deleteId);
            config.paging = buildPaging(config.brands.length);
            globalUI.showSuccessAlert(t.admin.brand.delete_success());
        } else {
            globalUI.handleApiError(res.error);
        }
        config.deleteId = null;
        config.isDeleting = false;
        action.setNewConfig(config);
    };

    const handlePageChange = (page: number) => {
        config.page = page;
        config.paging = buildPaging(config.brands.length, page, config.perPage);
        action.setNewConfig(config);
    };

    const handlePerPageChange = (perPage: number) => {
        config.page = 1;
        config.perPage = perPage;
        config.paging = buildPaging(config.brands.length, 1, perPage);
        action.setNewConfig(config);
    };

    useEffect(() => {
        action.onDidMount();
        fetchBrands();
        return () => action.onWillUnmount();
    }, []);

    return {
        config,
        action: {
            ...action,
            openCreate,
            openEdit,
            closeModal,
            setFormName,
            setFormDesc,
            handleSave,
            setDeleteId,
            handleDelete,
            handlePageChange,
            handlePerPageChange,
        },
        appNavigation,
    };
};
