import type { Product } from "@/data/models/Product";
import type { CartItem } from "@/provider/CartProvider";
import { getFirebaseApp, shouldLoadFirebaseAnalyticsOnClient } from "@/core/firebase";

const CURRENCY = "VND";

type AnalyticsItem = {
    item_id: string;
    item_name: string;
    item_brand?: string;
    item_category?: string;
    price?: number;
    discount?: number;
    quantity?: number;
    item_list_id?: string;
    item_list_name?: string;
    index?: number;
};

type AnalyticsParams = Record<
    string,
    string | number | boolean | undefined | null | AnalyticsItem[]
>;

type ProductLike = Pick<
    Product,
    "id" | "name" | "price" | "sale_price" | "category_name" | "brand_name"
>;
type CartLike = Pick<
    CartItem,
    "id" | "name" | "price" | "sale_price" | "quantity" | "category_name"
>;

let analyticsInstancePromise: Promise<unknown | null> | null = null;
let analyticsDisabled = false;

const sanitizeParams = (params: AnalyticsParams = {}): Record<string, unknown> =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
    );

const getClientAnalytics = async (): Promise<unknown | null> => {
    if (analyticsDisabled) return null;
    if (!shouldLoadFirebaseAnalyticsOnClient()) return null;
    if (analyticsInstancePromise) return analyticsInstancePromise;

    analyticsInstancePromise = (async () => {
        try {
            const app = getFirebaseApp();
            if (!app) return null;

            const { getAnalytics, isSupported } = await import("firebase/analytics");
            if (!(await isSupported())) return null;

            return getAnalytics(app);
        } catch (error) {
            analyticsDisabled = true;
            if (process.env.NODE_ENV !== "production") {
                console.warn("Firebase analytics disabled after init failure.", error);
            }
            return null;
        }
    })().catch((error) => {
        analyticsDisabled = true;
        if (process.env.NODE_ENV !== "production") {
            console.warn("Firebase analytics disabled after promise failure.", error);
        }
        return null;
    });

    return analyticsInstancePromise;
};

export const logAnalyticsEvent = async (
    eventName: string,
    params?: AnalyticsParams
): Promise<void> => {
    try {
        const analytics = await getClientAnalytics();
        if (!analytics) return;

        const { logEvent } = await import("firebase/analytics");
        logEvent(analytics as never, eventName as never, sanitizeParams(params) as never);
    } catch (error) {
        analyticsDisabled = true;
        if (process.env.NODE_ENV !== "production") {
            console.warn(`Firebase analytics disabled after "${eventName}" failed.`, error);
        }
    }
};

const getPrice = (item: ProductLike | CartLike): number => item.sale_price ?? item.price;

const getDiscount = (item: ProductLike | CartLike): number | undefined => {
    if (item.sale_price == null || item.sale_price >= item.price) return undefined;
    return item.price - item.sale_price;
};

const buildItem = (
    item: ProductLike | CartLike,
    extra?: Partial<AnalyticsItem>
): AnalyticsItem => ({
    item_id: String(item.id),
    item_name: item.name,
    item_brand: "brand_name" in item ? item.brand_name || undefined : undefined,
    item_category: item.category_name || undefined,
    price: getPrice(item),
    discount: getDiscount(item),
    quantity: "quantity" in item ? item.quantity : undefined,
    ...extra,
});

export const trackPageView = async (pathname: string, search = ""): Promise<void> => {
    if (typeof window === "undefined") return;

    await logAnalyticsEvent("page_view", {
        page_path: `${pathname}${search}`,
        page_location: window.location.href,
        page_title: document.title,
    });
};

export const trackSearchResults = async (
    searchTerm: string,
    resultsCount: number
): Promise<void> => {
    await logAnalyticsEvent("search", {
        search_term: searchTerm,
        results_count: resultsCount,
    });
};

export const trackViewItemList = async (
    products: Product[],
    itemListId: string,
    itemListName: string
): Promise<void> => {
    await logAnalyticsEvent("view_item_list", {
        item_list_id: itemListId,
        item_list_name: itemListName,
        items: products.map((product, index) =>
            buildItem(product, {
                item_list_id: itemListId,
                item_list_name: itemListName,
                index: index + 1,
            })
        ),
    });
};

export const trackSelectItem = async (
    product: Product,
    itemListId?: string,
    itemListName?: string,
    index?: number
): Promise<void> => {
    await logAnalyticsEvent("select_item", {
        item_list_id: itemListId,
        item_list_name: itemListName,
        items: [
            buildItem(product, {
                item_list_id: itemListId,
                item_list_name: itemListName,
                index,
            }),
        ],
    });
};

export const trackViewItem = async (product: Product): Promise<void> => {
    await logAnalyticsEvent("view_item", {
        currency: CURRENCY,
        value: getPrice(product),
        items: [buildItem(product)],
    });
};

export const trackAddToCart = async (
    product: Product,
    quantity = 1
): Promise<void> => {
    await logAnalyticsEvent("add_to_cart", {
        currency: CURRENCY,
        value: getPrice(product) * quantity,
        items: [buildItem(product, { quantity })],
    });
};

export const trackViewCart = async (
    items: CartItem[],
    total: number
): Promise<void> => {
    await logAnalyticsEvent("view_cart", {
        currency: CURRENCY,
        value: total,
        items: items.map((item) => buildItem(item)),
    });
};

export const trackBeginCheckout = async (
    items: CartItem[],
    total: number
): Promise<void> => {
    await logAnalyticsEvent("begin_checkout", {
        currency: CURRENCY,
        value: total,
        items: items.map((item) => buildItem(item)),
    });
};

export const trackPurchase = async (payload: {
    transactionId: string;
    items: CartItem[];
    total: number;
    shipping: number;
}): Promise<void> => {
    await logAnalyticsEvent("purchase", {
        transaction_id: payload.transactionId,
        currency: CURRENCY,
        value: payload.total,
        shipping: payload.shipping,
        items: payload.items.map((item) => buildItem(item)),
    });
};

export const trackLogin = async (method = "password"): Promise<void> => {
    await logAnalyticsEvent("login", { method });
};

export const trackSignUp = async (method = "password"): Promise<void> => {
    await logAnalyticsEvent("sign_up", { method });
};

export const trackException = async (
    description: string,
    fatal = false
): Promise<void> => {
    await logAnalyticsEvent("exception", {
        description: description.slice(0, 200),
        fatal,
    });
};
