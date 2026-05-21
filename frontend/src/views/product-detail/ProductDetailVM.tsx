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
import { useAuthContext } from "@/provider/AuthContextProvider";
import { useCart } from "@/provider/CartProvider";
import type { Product } from "@/data/models/Product";
import type { ProductReview, ProductReviewSummary } from "@/data/models/ProductReview";

interface Config extends BaseConfig {
    product: Product | null;
    related: Product[];
    reviews: ProductReview[];
    reviewSummary: ProductReviewSummary | null;
    isLoading: boolean;
    reviewsLoading: boolean;
    error: boolean;
    addedToCart: boolean;
    reviewRating: number;
    reviewComment: string;
    isSubmittingReview: boolean;
}

interface Action extends BaseAction<Config> {
    handleAddToCart: () => void;
    handleSubmitReview: () => Promise<void>;
    fetchReviews: (productId: number) => Promise<void>;
}

export const ProductDetailVM: BaseViewModelFunc<Config, Action> = () => {
    const { id } = useParams<{ id: string }>();
    const { productRepository } = useAppContext();
    const { isAuthenticated } = useAuthContext();
    const { addItem } = useCart();
    const trackedProductIds = useRef<Set<number>>(new Set());

    const { config, action } = useBaseViewModel<Config>(
        ProductDetailVM.name,
        {
            product: null,
            related: [],
            reviews: [],
            reviewSummary: null,
            isLoading: true,
            reviewsLoading: false,
            error: false,
            addedToCart: false,
            reviewRating: 5,
            reviewComment: "",
            isSubmittingReview: false,
        }
    );

    const fetchReviews = async (productId: number) => {
        action.setNewConfig({ reviewsLoading: true });
        const result = await productRepository.getReviews(productId, { page: 1, per_page: 20 });
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({
                reviews: result.data.items || [],
                reviewSummary: result.data.summary,
                reviewsLoading: false,
            });
        } else {
            action.setNewConfig({ reviewsLoading: false });
        }
    };

    useEffect(() => {
        const getOrCreateLocalId = (key: string, prefix: string) => {
            const existing = localStorage.getItem(key);
            if (existing) return existing;

            const cryptoValue = window.crypto?.randomUUID?.();
            const value = cryptoValue || `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            localStorage.setItem(key, value);
            return value;
        };

        const trackProductView = async (productId: number) => {
            if (trackedProductIds.current.has(productId)) return;
            trackedProductIds.current.add(productId);

            await productRepository.trackView(productId, {
                anonymous_id: getOrCreateLocalId("store_anonymous_id", "anon"),
                session_id: getOrCreateLocalId("store_session_id", "session"),
                viewed_path: window.location.pathname,
                locale: navigator.language,
                screen_width: window.innerWidth,
                screen_height: window.innerHeight,
            });
        };

        const load = async () => {
            action.setNewConfig({ isLoading: true, error: false });
            const productId = Number(id);
            const res = await productRepository.getById(productId);
            if (res.type === ApiResultType.Success) {
                const product = res.data;
                trackProductView(product.id);
                fetchReviews(product.id);
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

    const handleSubmitReview = async () => {
        const { product, reviewRating, reviewComment, isSubmittingReview } = config;
        if (!product || isSubmittingReview || !isAuthenticated) return;

        action.setNewConfig({ isSubmittingReview: true });
        const result = await productRepository.createOrUpdateReview(product.id, {
            rating: reviewRating,
            comment: reviewComment,
        });
        action.setNewConfig({ isSubmittingReview: false });

        if (result.type === ApiResultType.Success) {
            action.setNewConfig({ reviewComment: "", reviewRating: 5 });
            await fetchReviews(product.id);
        }
    };

    return {
        config,
        action: { ...action, handleAddToCart, handleSubmitReview, fetchReviews },
    };
};
