"use client";

import { useEffect, useRef } from "react";
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
import { formatPriceInput, parsePriceInput } from "@/core/utils/currency";
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
    // Track pending File objects to upload after product save
    const pendingFilesRef = useRef<File[]>([]);
    // Track which subImage IDs are pending (blob URLs, not yet on server)
    const pendingIdSetRef = useRef<Set<number>>(new Set());
    // Track pending main image file (to upload after product save)
    const pendingMainImageFileRef = useRef<File | null>(null);

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
                            price: formatPriceInput(String(p.price)),
                            sale_price: p.sale_price ? formatPriceInput(String(p.sale_price)) : "",
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
        const formatted = (name === 'price' || name === 'sale_price')
            ? formatPriceInput(value)
            : value;
        action.setNewConfig({
            form: { ...config.form, [name]: formatted },
            errors: (() => {
                const errs = { ...config.errors };
                delete errs[name];
                return errs;
            })(),
        });
    };

    const setMainImagePreview = (url: string) => {
        // URL typed manually — clear any pending file upload
        pendingMainImageFileRef.current = null;
        action.setNewConfig({
            mainImagePreview: url,
            form: { ...config.form, main_image_url: url },
        });
    };

    const handleMainImageUpload = (file: File) => {
        // Store file; actual upload happens in onSubmit after product is created
        pendingMainImageFileRef.current = file;
        const previewUrl = URL.createObjectURL(file);
        action.setNewConfig({
            mainImagePreview: previewUrl,
            // Don't save blob URL to form — leave as empty so we know it needs uploading
            form: { ...config.form, main_image_url: "" },
        });
    };

    const handleSubImagesUpload = (files: FileList) => {
        const fileArray = Array.from(files);
        const newImages: ProductImage[] = fileArray.map((file, idx) => {
            const tempId = Date.now() + idx;
            pendingFilesRef.current = [...pendingFilesRef.current, file];
            pendingIdSetRef.current.add(tempId);
            return {
                id: tempId,
                product_id: Number(id) || 0,
                image_url: URL.createObjectURL(file),
                sort_order: config.subImages.length + idx + 1,
            };
        });
        action.setNewConfig({ subImages: [...config.subImages, ...newImages] });
    };

    const removeSubImage = (imageId: number) => {
        // If it's a pending image, remove the corresponding File too
        if (pendingIdSetRef.current.has(imageId)) {
            const pendingList = config.subImages.filter(img => pendingIdSetRef.current.has(img.id));
            const removingIndex = pendingList.findIndex(img => img.id === imageId);
            if (removingIndex !== -1) {
                pendingFilesRef.current = pendingFilesRef.current.filter((_, i) => i !== removingIndex);
            }
            pendingIdSetRef.current.delete(imageId);
        }
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
        if (!config.form.price || Number(parsePriceInput(config.form.price)) <= 0) errs.price = t.admin.product.price_placeholder();
        if (config.form.sale_price && Number(parsePriceInput(config.form.sale_price)) >= Number(parsePriceInput(config.form.price)))
            errs.sale_price = t.admin.product.sale_price_placeholder();
        // main image is valid if a file is pending upload OR a URL is already set
        if (!pendingMainImageFileRef.current && !config.form.main_image_url && !config.mainImagePreview)
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
            price: Number(parsePriceInput(config.form.price)),
            sale_price: config.form.sale_price ? Number(parsePriceInput(config.form.sale_price)) : null,
            // If a file is pending, omit main_image_url for now; we'll update it after upload
            main_image_url: pendingMainImageFileRef.current ? undefined : config.form.main_image_url,
            display_order: Number(config.form.display_order),
        };
        const res = isEdit
            ? await productRepository.adminUpdate(Number(id), data)
            : await productRepository.adminCreate(data);
        if (res.type !== ApiResultType.Success) {
            action.setNewConfig({ isSaving: false });
            return;
        }
        const productId = res.data.id;
        // Upload main image file if pending, then update product with the server URL
        if (pendingMainImageFileRef.current) {
            const mainRes = await productRepository.adminUploadMainImage(productId, pendingMainImageFileRef.current);
            pendingMainImageFileRef.current = null;
            if (mainRes.type !== ApiResultType.Success) {
                action.setNewConfig({ isSaving: false });
                return;
            }
        }
        // Upload pending sub images if any
        if (pendingFilesRef.current.length > 0) {
            const formData = new FormData();
            pendingFilesRef.current.forEach((file) => formData.append('files', file));
            await productRepository.adminUploadImages(productId, formData);
            pendingFilesRef.current = [];
            pendingIdSetRef.current.clear();
        }
        action.setNewConfig({ isSaving: false });
        appNavigation.to(AppRoutePath.ADMIN_PRODUCTS);
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
