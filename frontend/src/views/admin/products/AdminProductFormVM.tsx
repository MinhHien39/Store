"use client";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import { AppRoutePath } from "@/application/AppRoutePath";
import { t } from "@/core/localized";
import type { Product, ProductImage } from "@/data/models/Product";
import type { Category } from "@/data/models/Category";
import type { Brand } from "@/data/models/Brand";

interface ProductFormData {
    category_id: string;
    brand_id: string;
    name: string;
    short_description: string;
    description: string;
    price: string;
    sale_price: string;
    main_image_url: string;
    display_order: string;
}

interface FormErrors {
    [key: string]: string;
}

const emptyForm: ProductFormData = {
    category_id: "",
    brand_id: "",
    name: "",
    short_description: "",
    description: "",
    price: "",
    sale_price: "",
    main_image_url: "",
    display_order: "0",
};

interface Config extends BaseConfig {
    isEdit: boolean;
    categories: Category[];
    brands: Brand[];
    isLoading: boolean;
    isSaving: boolean;
    form: ProductFormData;
    errors: FormErrors;
    subImages: ProductImage[];
    mainImagePreview: string;
}

interface Action extends BaseAction<Config> {
    setFormField: (name: string, value: string) => void;
    setMainImagePreview: (url: string) => void;
    handleMainImageUpload: (file: File) => void;
    handleSubImagesUpload: (files: FileList) => void;
    removeSubImage: (imageId: number) => void;
    moveSubImage: (fromIndex: number, toIndex: number) => void;
    onSubmit: () => Promise<void>;
    onCancel: () => void;
}

export const AdminProductFormVM: BaseViewModelFunc<Config, Action> = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { productRepository, categoryRepository, brandRepository } = useAppContext();

    const { config, action, appNavigation } = useBaseViewModel<Config>(
        AdminProductFormVM.name,
        {
            isEdit,
            categories: [],
            brands: [],
            isLoading: true,
            isSaving: false,
            form: { ...emptyForm },
            errors: {},
            subImages: [],
            mainImagePreview: "",
        }
    );

    useEffect(() => {
        const load = async () => {
            const [catRes, brandRes] = await Promise.all([
                categoryRepository.getList(),
                brandRepository.getList(),
            ]);
            const categories = catRes.type === ApiResultType.Success ? catRes.data : [];
            const brands = brandRes.type === ApiResultType.Success ? brandRes.data : [];

            if (isEdit) {
                const prodRes = await productRepository.getById(Number(id));
                if (prodRes.type === ApiResultType.Success) {
                    const p = prodRes.data;
                    action.setNewConfig({
                        categories,
                        brands,
                        form: {
                            category_id: String(p.category_id),
                            brand_id: String(p.brand_id),
                            name: p.name,
                            short_description: p.short_description,
                            description: p.description,
                            price: String(p.price),
                            sale_price: p.sale_price ? String(p.sale_price) : "",
                            main_image_url: p.main_image_url,
                            display_order: String(p.display_order),
                        },
                        mainImagePreview: p.main_image_url,
                        subImages: p.images ?? [],
                        isLoading: false,
                    });
                    return;
                }
            }
            action.setNewConfig({ categories, brands, isLoading: false });
        };
        load();
    }, [id, isEdit]);

    const setFormField = (name: string, value: string) => {
        action.setNewConfig({
            form: { ...config.form, [name]: value },
            errors: (() => {
                const errs = { ...config.errors };
                delete errs[name];
                return errs;
            })(),
        });
    };

    const setMainImagePreview = (url: string) => {
        action.setNewConfig({
            mainImagePreview: url,
            form: { ...config.form, main_image_url: url },
        });
    };

    const handleMainImageUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        action.setNewConfig({
            mainImagePreview: url,
            form: { ...config.form, main_image_url: url },
        });
    };

    const handleSubImagesUpload = (files: FileList) => {
        const newImages: ProductImage[] = Array.from(files).map((file, idx) => ({
            id: Date.now() + idx,
            product_id: Number(id) || 0,
            image_url: URL.createObjectURL(file),
            sort_order: config.subImages.length + idx + 1,
        }));
        action.setNewConfig({ subImages: [...config.subImages, ...newImages] });
    };

    const removeSubImage = (imageId: number) => {
        action.setNewConfig({
            subImages: config.subImages.filter((img) => img.id !== imageId),
        });
    };

    const moveSubImage = (fromIndex: number, toIndex: number) => {
        const newArr = [...config.subImages];
        const [moved] = newArr.splice(fromIndex, 1);
        newArr.splice(toIndex, 0, moved);
        action.setNewConfig({
            subImages: newArr.map((img, idx) => ({ ...img, sort_order: idx + 1 })),
        });
    };

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!config.form.name.trim()) errs.name = t.admin.product.label_name();
        if (!config.form.category_id) errs.category_id = t.admin.product.select_category();
        if (!config.form.brand_id) errs.brand_id = t.admin.product.select_brand();
        if (!config.form.price || Number(config.form.price) <= 0) errs.price = t.admin.product.price_placeholder();
        if (config.form.sale_price && Number(config.form.sale_price) >= Number(config.form.price))
            errs.sale_price = t.admin.product.sale_price_placeholder();
        if (!config.form.main_image_url && !config.mainImagePreview)
            errs.main_image_url = t.admin.product.label_main_image();
        if (Object.keys(errs).length > 0) {
            action.setNewConfig({ errors: errs });
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        if (!validate()) return;
        action.setNewConfig({ isSaving: true });
        const data: Partial<Product> = {
            category_id: Number(config.form.category_id),
            brand_id: Number(config.form.brand_id),
            name: config.form.name,
            short_description: config.form.short_description,
            description: config.form.description,
            price: Number(config.form.price),
            sale_price: config.form.sale_price ? Number(config.form.sale_price) : null,
            main_image_url: config.form.main_image_url,
            display_order: Number(config.form.display_order),
        };
        const res = isEdit
            ? await productRepository.adminUpdate(Number(id), data)
            : await productRepository.adminCreate(data);
        action.setNewConfig({ isSaving: false });
        if (res.type === ApiResultType.Success) {
            appNavigation.to(AppRoutePath.ADMIN_PRODUCTS);
        }
    };

    const onCancel = () => {
        appNavigation.to(AppRoutePath.ADMIN_PRODUCTS);
    };

    return {
        config,
        action: {
            ...action,
            setFormField,
            setMainImagePreview,
            handleMainImageUpload,
            handleSubImagesUpload,
            removeSubImage,
            moveSubImage,
            onSubmit,
            onCancel,
        },
    };
};
