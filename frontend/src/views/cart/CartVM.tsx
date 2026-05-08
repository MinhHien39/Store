"use client";

import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { useCart, CartItem } from "@/provider/CartProvider";

interface Config extends BaseConfig {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

interface Action extends BaseAction<Config> {
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
}

export const CartVM: BaseViewModelFunc<Config, Action> = () => {
    const { items, updateQuantity, removeItem, subtotal } = useCart();

    const { config, action } = useBaseViewModel<Config>(
        CartVM.name,
        {
            items: [],
            subtotal: 0,
            shipping: 0,
            total: 0,
        }
    );

    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    return {
        config: { ...config, items, subtotal, shipping, total },
        action: { ...action, updateQuantity, removeItem },
    };
};
