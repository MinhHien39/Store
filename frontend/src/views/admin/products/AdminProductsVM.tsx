import { useEffect, useRef } from "react";
import { useAppContext } from '@/provider/AppContextProvider';
import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from '@/core/base/BaseViewModel';
import { ApiResultType } from '@/core/api';
import type { Product, ProductImage } from "@/data/models/Product";
import type { Category } from "@/data/models/Category";
import type { Brand } from "@/data/models/Brand";
import { t } from '@/core/localized';
import { formatPriceInput, parsePriceInput } from '@/core/utils/currency';

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
    category_id: '',
    brand_id: '',
    name: '',
    short_description: '',
    description: '',
    price: '',
    sale_price: '',
    main_image_url: '',
    display_order: '0',
};

interface Config extends BaseConfig {
    products: Product[];
    isLoading: boolean;
    searchInput: string;
    keyword: string;
    deleteId: number | null;
    isDeleting: boolean;
    // Modal form
    isModalOpen: boolean;
    isModalLoading: boolean;
    editItem: Product | null;
    isSaving: boolean;
    categories: Category[];
    brands: Brand[];
    form: ProductFormData;
    formErrors: FormErrors;
    mainImagePreview: string;
    subImages: ProductImage[];
    isImporting: boolean;
}

interface Action extends BaseAction<Config> {
    handleSearchChange: (value: string) => void;
    setDeleteId: (id: number | null) => void;
    handleDelete: () => Promise<void>;
    openCreate: () => void;
    openEdit: (product: Product) => void;
    closeModal: () => void;
    setFormField: (name: string, value: string) => void;
    setMainImagePreview: (url: string) => void;
    handleMainImageUpload: (file: File) => void;
    handleSubImagesUpload: (files: FileList) => void;
    removeSubImage: (imageId: number) => void;
    moveSubImage: (fromIndex: number, toIndex: number) => void;
    handleSave: () => Promise<void>;
    handleCsvImport: (file: File | null) => Promise<void>;
}

export const AdminProductsVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository, categoryRepository, brandRepository } = useAppContext();
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const pendingMainImageFileRef = useRef<File | null>(null);
    const pendingSubFilesRef = useRef<File[]>([]);
    const pendingSubIdSetRef = useRef<Set<number>>(new Set());

    const { config, action, appNavigation, globalUI } = useBaseViewModel<Config>(
        AdminProductsVM.name,
        {
            products: [],
            isLoading: true,
            searchInput: '',
            keyword: '',
            deleteId: null,
            isDeleting: false,
            isModalOpen: false,
            isModalLoading: false,
            editItem: null,
            isSaving: false,
            categories: [],
            brands: [],
            form: { ...emptyForm },
            formErrors: {},
            mainImagePreview: '',
            subImages: [],
            isImporting: false,
        }
    );

    const loadProducts = async (kw?: string) => {
        action.setNewConfig({ isLoading: true });
        const res = await productRepository.adminGetList({ keyword: kw ?? config.keyword, sort_by: 'created_at', sort_dir: 'desc' });
        if (res.type === ApiResultType.Success) {
            action.setNewConfig({ products: res.data.items || [], isLoading: false });
        } else {
            globalUI.handleApiError(res.error);
            action.setNewConfig({ isLoading: false });
        }
    };

    const loadCategoriesAndBrands = async () => {
        if (config.categories.length > 0 && config.brands.length > 0) return;
        const [catRes, brandRes] = await Promise.all([
            categoryRepository.getList(),
            brandRepository.getList(),
        ]);
        const updates: Partial<Config> = {};
        if (catRes.type === ApiResultType.Success) updates.categories = catRes.data;
        if (brandRes.type === ApiResultType.Success) updates.brands = brandRes.data;
        action.setNewConfig(updates);
    };

    const openCreate = async () => {
        pendingMainImageFileRef.current = null;
        pendingSubFilesRef.current = [];
        pendingSubIdSetRef.current = new Set();
        action.setNewConfig({
            editItem: null,
            form: { ...emptyForm },
            formErrors: {},
            mainImagePreview: '',
            subImages: [],
            isModalOpen: true,
            isModalLoading: true,
        });
        await loadCategoriesAndBrands();
        action.setNewConfig({ isModalLoading: false });
    };

    const openEdit = async (product: Product) => {
        pendingMainImageFileRef.current = null;
        pendingSubFilesRef.current = [];
        pendingSubIdSetRef.current = new Set();
        action.setNewConfig({
            editItem: product,
            form: {
                category_id: String(product.category_id),
                brand_id: String(product.brand_id),
                name: product.name,
                short_description: product.short_description,
                description: product.description,
                price: formatPriceInput(String(product.price)),
                sale_price: product.sale_price ? formatPriceInput(String(product.sale_price)) : '',
                main_image_url: product.main_image_url,
                display_order: String(product.display_order),
            },
            formErrors: {},
            mainImagePreview: product.main_image_url,
            subImages: product.images ?? [],
            isModalOpen: true,
            isModalLoading: true,
        });

        // Load fresh product data with images
        const prodRes = await productRepository.getById(product.id);
        if (prodRes.type === ApiResultType.Success) {
            const p = prodRes.data;
            action.setNewConfig({
                form: {
                    category_id: String(p.category_id),
                    brand_id: String(p.brand_id),
                    name: p.name,
                    short_description: p.short_description,
                    description: p.description,
                    price: formatPriceInput(String(p.price)),
                    sale_price: p.sale_price ? formatPriceInput(String(p.sale_price)) : '',
                    main_image_url: p.main_image_url,
                    display_order: String(p.display_order),
                },
                mainImagePreview: p.main_image_url,
                subImages: p.images ?? [],
            });
        }
        await loadCategoriesAndBrands();
        action.setNewConfig({ isModalLoading: false });
    };

    const closeModal = () => {
        config.isModalOpen = false;
        action.setNewConfig(config);
    };

    const setFormField = (name: string, value: string) => {
        const formatted = (name === 'price' || name === 'sale_price') ? formatPriceInput(value) : value;
        config.form = { ...config.form, [name]: formatted };
        if (config.formErrors[name]) {
            const errs = { ...config.formErrors };
            delete errs[name];
            config.formErrors = errs;
        }
        action.setNewConfig(config);
    };

    const setMainImagePreview = (url: string) => {
        // URL typed manually — clear any pending file
        pendingMainImageFileRef.current = null;
        config.mainImagePreview = url;
        config.form = { ...config.form, main_image_url: url };
        action.setNewConfig(config);
    };

    const handleMainImageUpload = (file: File) => {
        // Store file; upload happens in handleSave after product create/update
        pendingMainImageFileRef.current = file;
        config.mainImagePreview = URL.createObjectURL(file);
        // Don't store blob URL in form — leave empty so we know upload is pending
        config.form = { ...config.form, main_image_url: '' };
        action.setNewConfig(config);
    };

    const handleSubImagesUpload = (files: FileList) => {
        const newImages: ProductImage[] = Array.from(files).map((file, idx) => {
            const tempId = Date.now() + idx;
            pendingSubFilesRef.current = [...pendingSubFilesRef.current, file];
            pendingSubIdSetRef.current.add(tempId);
            return {
                id: tempId,
                product_id: config.editItem?.id || 0,
                image_url: URL.createObjectURL(file),
                sort_order: config.subImages.length + idx + 1,
            };
        });
        config.subImages = [...config.subImages, ...newImages];
        action.setNewConfig(config);
    };

    const removeSubImage = (imageId: number) => {
        if (pendingSubIdSetRef.current.has(imageId)) {
            const pendingList = config.subImages.filter(img => pendingSubIdSetRef.current.has(img.id));
            const removingIndex = pendingList.findIndex(img => img.id === imageId);
            if (removingIndex !== -1) {
                pendingSubFilesRef.current = pendingSubFilesRef.current.filter((_, i) => i !== removingIndex);
            }
            pendingSubIdSetRef.current.delete(imageId);
        }
        config.subImages = config.subImages.filter((img) => img.id !== imageId);
        action.setNewConfig(config);
    };

    const moveSubImage = (fromIndex: number, toIndex: number) => {
        const newArr = [...config.subImages];
        const [moved] = newArr.splice(fromIndex, 1);
        newArr.splice(toIndex, 0, moved);
        config.subImages = newArr.map((img, idx) => ({ ...img, sort_order: idx + 1 }));
        action.setNewConfig(config);
    };

    const handleCsvImport = async (file: File | null) => {
        if (!file) {
            globalUI.showWarningAlert(t.admin.product.import_choose_file());
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            globalUI.showWarningAlert(t.admin.product.import_invalid_file());
            return;
        }

        action.setNewConfig({ isImporting: true });

        const formData = new FormData();
        formData.append("file", file);

        const res = await productRepository.adminImportCsv(formData);

        if (res.type === ApiResultType.Success) {
            const summary = t.admin.product.import_result_summary({
                total: res.data.total_rows,
                created: res.data.created_count,
                updated: res.data.updated_count,
                skipped: res.data.skipped_count,
            });

            if (res.data.skipped_count > 0) {
                const firstError = res.data.errors[0]?.message;
                const message = firstError
                    ? `${summary} ${t.admin.product.import_first_error()}: ${firstError}`
                    : summary;
                globalUI.showWarningAlert(message);
            } else {
                globalUI.showSuccessAlert(summary);
            }

            await loadProducts(config.keyword);
        } else {
            globalUI.handleApiError(res.error);
        }

        action.setNewConfig({ isImporting: false });
    };

    const validate = (): boolean => {
        const errs: FormErrors = {};
        const f = config.form;
        if (!f.name.trim()) errs.name = t.admin.product.label_name();
        if (!f.category_id) errs.category_id = t.admin.product.select_category();
        if (!f.brand_id) errs.brand_id = t.admin.product.select_brand();
        if (!f.price || Number(parsePriceInput(f.price)) <= 0) errs.price = t.admin.product.price_placeholder();
        if (f.sale_price && Number(parsePriceInput(f.sale_price)) >= Number(parsePriceInput(f.price))) errs.sale_price = t.admin.product.sale_price_placeholder();
        if (!pendingMainImageFileRef.current && !f.main_image_url && !config.mainImagePreview) errs.main_image_url = t.admin.product.label_main_image();
        config.formErrors = errs;
        action.setNewConfig(config);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        config.isSaving = true;
        action.setNewConfig(config);

        const f = config.form;
        const data: Partial<Product> = {
            category_id: Number(f.category_id),
            brand_id: Number(f.brand_id),
            name: f.name,
            short_description: f.short_description,
            description: f.description,
            price: Number(parsePriceInput(f.price)),
            sale_price: f.sale_price ? Number(parsePriceInput(f.sale_price)) : null,
            // If a file is pending upload, omit main_image_url; it will be set after upload
            main_image_url: pendingMainImageFileRef.current ? undefined : f.main_image_url,
            display_order: Number(f.display_order),
        };

        const res = config.editItem
            ? await productRepository.adminUpdate(config.editItem.id, data)
            : await productRepository.adminCreate(data);

        if (res.type !== ApiResultType.Success) {
            config.isSaving = false;
            globalUI.handleApiError(res.error);
            action.setNewConfig(config);
            return;
        }

        const productId = res.data.id;

        // Upload main image file if pending
        if (pendingMainImageFileRef.current) {
            const mainRes = await productRepository.adminUploadMainImage(productId, pendingMainImageFileRef.current);
            pendingMainImageFileRef.current = null;
            if (mainRes.type !== ApiResultType.Success) {
                config.isSaving = false;
                globalUI.handleApiError(mainRes.error);
                action.setNewConfig(config);
                return;
            }
        }

        // Upload pending sub-images if any
        if (pendingSubFilesRef.current.length > 0) {
            const formData = new FormData();
            pendingSubFilesRef.current.forEach((file) => formData.append('files', file));
            await productRepository.adminUploadImages(productId, formData);
            pendingSubFilesRef.current = [];
            pendingSubIdSetRef.current.clear();
        }

        config.isSaving = false;
        config.isModalOpen = false;
        action.setNewConfig(config);
        globalUI.showSuccessAlert(config.editItem ? t.admin.product.update_success() : t.admin.product.create_success());
        await loadProducts();
    };

    const handleSearchChange = (value: string) => {
        config.searchInput = value;
        action.setNewConfig(config);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            config.keyword = value.trim();
            action.setNewConfig(config);
            loadProducts(value.trim());
        }, 400);
    };

    const setDeleteId = (id: number | null) => {
        config.deleteId = id;
        action.setNewConfig(config);
    };

    const handleDelete = async () => {
        if (config.deleteId === null) return;
        action.setNewConfig({ isDeleting: true });
        const res = await productRepository.adminDelete(config.deleteId);
        if (res.type === ApiResultType.Success) {
            action.setNewConfig({
                products: config.products.filter(p => p.id !== config.deleteId),
                deleteId: null,
                isDeleting: false,
            });
            globalUI.showSuccessAlert(t.admin.product.delete_success());
        } else {
            globalUI.handleApiError(res.error);
            action.setNewConfig({ deleteId: null, isDeleting: false });
        }
    };

    useEffect(() => {
        action.onDidMount();
        loadProducts();
        return () => {
            action.onWillUnmount();
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return {
        config,
        action: {
            ...action,
            handleSearchChange,
            setDeleteId,
            handleDelete,
            openCreate,
            openEdit,
            closeModal,
            setFormField,
            setMainImagePreview,
            handleMainImageUpload,
            handleSubImagesUpload,
            removeSubImage,
            moveSubImage,
            handleSave,
            handleCsvImport,
        },
        appNavigation,
    };
};
