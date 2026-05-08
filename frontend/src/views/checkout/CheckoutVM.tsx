"use client";

import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import { useCart, CartItem } from "@/provider/CartProvider";
import { t } from "@/core/localized";

interface CheckoutForm {
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    notes: string;
}

interface Config extends BaseConfig {
    form: CheckoutForm;
    errors: Record<string, string>;
    isSubmitting: boolean;
    orderSuccess: boolean;
    orderId: number | null;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

interface Action extends BaseAction<Config> {
    handleFieldChange: (name: string, value: string) => void;
    onSubmit: () => Promise<void>;
}

export const CheckoutVM: BaseViewModelFunc<Config, Action> = () => {
    const { orderRepository } = useAppContext();
    const { items, subtotal, clearCart } = useCart();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        CheckoutVM.name,
        {
            form: {
                shipping_name: "",
                shipping_phone: "",
                shipping_address: "",
                notes: "",
            },
            errors: {},
            isSubmitting: false,
            orderSuccess: false,
            orderId: null,
            items: [],
            subtotal: 0,
            shipping: 0,
            total: 0,
        }
    );

    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    const handleFieldChange = (name: string, value: string) => {
        action.setNewConfig({
            form: { ...config.form, [name]: value },
            errors: (() => {
                const errs = { ...config.errors };
                delete errs[name];
                return errs;
            })(),
        });
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!config.form.shipping_name.trim()) errs.shipping_name = "Vui lòng nhập họ tên";
        if (!config.form.shipping_phone.trim()) errs.shipping_phone = "Vui lòng nhập số điện thoại";
        else if (config.form.shipping_phone.trim().length < 8) errs.shipping_phone = "Số điện thoại không hợp lệ";
        if (!config.form.shipping_address.trim()) errs.shipping_address = "Vui lòng nhập địa chỉ giao hàng";
        else if (config.form.shipping_address.trim().length < 5) errs.shipping_address = "Địa chỉ quá ngắn";
        if (Object.keys(errs).length > 0) {
            action.setNewConfig({ errors: errs });
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        if (!validate() || items.length === 0) return;
        action.setNewConfig({ isSubmitting: true });
        const res = await orderRepository.createOrder({
            items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
            shipping_name: config.form.shipping_name.trim(),
            shipping_phone: config.form.shipping_phone.trim(),
            shipping_address: config.form.shipping_address.trim(),
            notes: config.form.notes.trim() || null,
        });
        action.setNewConfig({ isSubmitting: false });
        if (res.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(t.store.checkout.order_success());
            clearCart();
            action.setNewConfig({ orderSuccess: true, orderId: res.data.id });
        } else {
            const msg = res.error?.message || t.store.checkout.order_error();
            globalUI.showErrorAlert(msg);
            action.setNewConfig({ errors: { _global: msg } });
        }
    };

    return {
        config: { ...config, items, subtotal, shipping, total },
        action: { ...action, handleFieldChange, onSubmit },
    };
};
