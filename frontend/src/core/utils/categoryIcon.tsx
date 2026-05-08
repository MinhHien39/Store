import type { LucideIcon } from "lucide-react";
import {
    Camera,
    Cable,
    Headphones,
    Home,
    Laptop,
    Package,
    Router,
    Shirt,
    ShoppingBag,
    Smartphone,
    TabletSmartphone,
    Watch,
} from "lucide-react";

export const DEFAULT_CATEGORY_ICON = "package";

export const CATEGORY_ICON_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
    { value: "smartphone", label: "Phone", icon: Smartphone },
    { value: "laptop", label: "Laptop", icon: Laptop },
    { value: "tablet", label: "Tablet", icon: TabletSmartphone },
    { value: "cable", label: "Accessory", icon: Cable },
    { value: "watch", label: "Watch", icon: Watch },
    { value: "headphones", label: "Headphones", icon: Headphones },
    { value: "camera", label: "Camera", icon: Camera },
    { value: "router", label: "Network", icon: Router },
    { value: "shopping-bag", label: "Shopping", icon: ShoppingBag },
    { value: "shirt", label: "Fashion", icon: Shirt },
    { value: "home", label: "Home", icon: Home },
    { value: DEFAULT_CATEGORY_ICON, label: "Package", icon: Package },
];

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = CATEGORY_ICON_OPTIONS.reduce(
    (map, item) => ({
        ...map,
        [item.value]: item.icon,
    }),
    {} as Record<string, LucideIcon>,
);

export const getCategoryIcon = (icon?: string | null, fallbackIndex = 0): LucideIcon => {
    if (icon && CATEGORY_ICON_MAP[icon]) {
        return CATEGORY_ICON_MAP[icon];
    }

    return CATEGORY_ICON_OPTIONS[fallbackIndex % CATEGORY_ICON_OPTIONS.length].icon;
};
