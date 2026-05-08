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
import { useCart } from "@/provider/CartProvider";
import type { Product } from "@/data/models/Product";

interface Config extends BaseConfig {
    product: Product | null;
    related: Product[];
    isLoading: boolean;
    error: boolean;
    addedToCart: boolean;
}

interface Action extends BaseAction<Config> {
    handleAddToCart: () => void;
}

export const ProductDetailVM: BaseViewModelFunc<Config, Action> = () => {
    const { id } = useParams<{ id: string }>();
    const { productRepository } = useAppContext();
    const { addItem } = useCart();

    const { config, action } = useBaseViewModel<Config>(
        ProductDetailVM.name,
        {
            product: null,
            related: [],
            isLoading: true,
            error: false,
            addedToCart: false,
        }
    );

    useEffect(() => {
        const load = async () => {
            action.setNewConfig({ isLoading: true, error: false });
            const productId = Number(id);
            const res = await productRepository.getById(productId);
            if (res.type === ApiResultType.Success) {
                const product = res.data;
                if (product.category_id) {
                    const relRes = await productRepository.getList({
                        category_id: product.category_id,
                        per_page: 5,
                    });
                    const relatedItems =
                        relRes.type === ApiResultType.Success
                            ? (relRes.data.items || [])
                                .filter((p: Product) => p.id !== product.id)
                                .slice(0, 4)
                            : [];
                    action.setNewConfig({ product, related: relatedItems, isLoading: false });
                } else {
                    action.setNewConfig({ product, related: [], isLoading: false });
                }
            } else {
                action.setNewConfig({ error: true, isLoading: false });
            }
        };
        load();
    }, [id]);

    const handleAddToCart = () => {
        const { product } = config;
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            sale_price: product.sale_price ?? null,
            image: product.main_image_url,
            category_name: product.category_name,
        });
        action.setNewConfig({ addedToCart: true });
        setTimeout(() => action.setNewConfig({ addedToCart: false }), 2000);
    };

    return {
        config,
        action: { ...action, handleAddToCart },
    };
};
