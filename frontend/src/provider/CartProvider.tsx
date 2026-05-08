"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    sale_price: number | null;
    image: string;
    quantity: number;
    category_name?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
}

const CART_STORAGE_KEY = "store_cart";

const CartContext = createContext<CartContextType | null>(null);

const getAvailableStorages = (): Storage[] => {
    if (typeof window === "undefined") return [];

    const storages: Storage[] = [];

    try {
        if (window.localStorage) storages.push(window.localStorage);
    } catch {}

    try {
        if (window.sessionStorage) storages.push(window.sessionStorage);
    } catch {}

    return storages;
};

const loadCart = (): CartItem[] => {
    for (const storage of getAvailableStorages()) {
        try {
            const raw = storage.getItem(CART_STORAGE_KEY);
            if (!raw) continue;

            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        } catch {}
    }

    return [];
};

const saveCart = (items: CartItem[]) => {
    for (const storage of getAvailableStorages()) {
        try {
            storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {}
    }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        setItems(loadCart());
    }, []);

    useEffect(() => {
        saveCart(items);
    }, [items]);

    const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...item, quantity }];
        });
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }, []);

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + (i.sale_price ?? i.price) * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
