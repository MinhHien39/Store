import { useEffect } from "react";
import { useAppContext } from '@/provider/AppContextProvider';
import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from '@/core/base/BaseViewModel';
import { ApiResultType } from '@/core/api';
import { t } from '@/core/localized';
import type { Category } from "@/data/models/Category";
import { DEFAULT_CATEGORY_ICON } from "@/core/utils/categoryIcon";

interface Config extends BaseConfig {
    categories: Category[];
    isLoading: boolean;
    isModalOpen: boolean;
    editItem: Category | null;
    deleteId: number | null;
    isDeleting: boolean;
    isSaving: boolean;
    formName: string;
    formDesc: string;
    formIcon: string;
    formError: string;
}

interface Action extends BaseAction<Config> {
    openCreate: () => void;
    openEdit: (cat: Category) => void;
    closeModal: () => void;
    setFormName: (v: string) => void;
    setFormDesc: (v: string) => void;
    setFormIcon: (v: string) => void;
    handleSave: () => Promise<void>;
    setDeleteId: (id: number | null) => void;
    handleDelete: () => Promise<void>;
}

export const AdminCategoriesVM: BaseViewModelFunc<Config, Action> = () => {
    const { categoryRepository } = useAppContext();

    const { config, action, appNavigation, globalUI } = useBaseViewModel<Config>(
        AdminCategoriesVM.name,
        {
            categories: [],
            isLoading: true,
            isModalOpen: false,
            editItem: null,
            deleteId: null,
            isDeleting: false,
            isSaving: false,
            formName: '',
            formDesc: '',
            formIcon: DEFAULT_CATEGORY_ICON,
            formError: '',
        }
    );

    const fetchCategories = async () => {
        config.isLoading = true;
        action.setNewConfig(config);
        const res = await categoryRepository.getList();
        config.isLoading = false;
        if (res.type === ApiResultType.Success) {
            config.categories = res.data;
        } else {
            globalUI.handleApiError(res.error);
        }
        action.setNewConfig(config);
    };

    const openCreate = () => {
        config.editItem = null;
        config.formName = '';
        config.formDesc = '';
        config.formIcon = DEFAULT_CATEGORY_ICON;
        config.formError = '';
        config.isModalOpen = true;
        action.setNewConfig(config);
    };

    const openEdit = (cat: Category) => {
        config.editItem = cat;
        config.formName = cat.name;
        config.formDesc = cat.description;
        config.formIcon = cat.icon || DEFAULT_CATEGORY_ICON;
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

    const setFormIcon = (v: string) => {
        config.formIcon = v;
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
        const data = {
            name: config.formName.trim(),
            description: config.formDesc.trim(),
            icon: config.formIcon,
        };
        const res = config.editItem
            ? await categoryRepository.adminUpdate(config.editItem.id, data)
            : await categoryRepository.adminCreate(data);
        config.isSaving = false;
        if (res.type === ApiResultType.Success) {
            config.isModalOpen = false;
            action.setNewConfig(config);
            globalUI.showSuccessAlert(config.editItem ? t.admin.category.update_success() : t.admin.category.create_success());
            await fetchCategories();
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
        const res = await categoryRepository.adminDelete(config.deleteId);
        if (res.type === ApiResultType.Success) {
            config.categories = config.categories.filter(c => c.id !== config.deleteId);
            globalUI.showSuccessAlert(t.admin.category.delete_success());
        } else {
            globalUI.handleApiError(res.error);
        }
        config.deleteId = null;
        config.isDeleting = false;
        action.setNewConfig(config);
    };

    useEffect(() => {
        action.onDidMount();
        fetchCategories();
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
            setFormIcon,
            handleSave,
            setDeleteId,
            handleDelete,
        },
        appNavigation,
    };
};
