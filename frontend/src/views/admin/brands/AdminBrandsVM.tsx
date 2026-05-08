import { useEffect } from "react";
import { useAppContext } from '@/provider/AppContextProvider';
import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from '@/core/base/BaseViewModel';
import { ApiResultType } from '@/core/api';
import { t } from '@/core/localized';
import type { Brand } from "@/data/models/Brand";

interface Config extends BaseConfig {
    brands: Brand[];
    isLoading: boolean;
    isModalOpen: boolean;
    editItem: Brand | null;
    deleteId: number | null;
    isDeleting: boolean;
    isSaving: boolean;
    formName: string;
    formDesc: string;
    formError: string;
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
}

export const AdminBrandsVM: BaseViewModelFunc<Config, Action> = () => {
    const { brandRepository } = useAppContext();

    const { config, action, appNavigation, globalUI } = useBaseViewModel<Config>(
        AdminBrandsVM.name,
        {
            brands: [],
            isLoading: true,
            isModalOpen: false,
            editItem: null,
            deleteId: null,
            isDeleting: false,
            isSaving: false,
            formName: '',
            formDesc: '',
            formError: '',
        }
    );

    const fetchBrands = async () => {
        config.isLoading = true;
        action.setNewConfig(config);
        const res = await brandRepository.getList();
        config.isLoading = false;
        if (res.type === ApiResultType.Success) {
            config.brands = res.data;
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
            globalUI.showSuccessAlert(t.admin.brand.delete_success());
        } else {
            globalUI.handleApiError(res.error);
        }
        config.deleteId = null;
        config.isDeleting = false;
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
        },
        appNavigation,
    };
};
