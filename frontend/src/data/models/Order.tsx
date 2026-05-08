export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product_name?: string;
    product_image?: string;
}

export enum OrderStatus {
    PENDING = 1,
    CONFIRMED = 2,
    SHIPPING = 3,
    DELIVERED = 4,
    CANCELLED = 5,
}

export namespace OrderStatus {
    const LabelMap: Record<OrderStatus, string> = {
        [OrderStatus.PENDING]: "Chờ xác nhận",
        [OrderStatus.CONFIRMED]: "Đã xác nhận",
        [OrderStatus.SHIPPING]: "Đang giao",
        [OrderStatus.DELIVERED]: "Đã giao",
        [OrderStatus.CANCELLED]: "Đã hủy",
    };

    const ColorMap: Record<OrderStatus, string> = {
        [OrderStatus.PENDING]: "text-yellow-600 bg-yellow-50",
        [OrderStatus.CONFIRMED]: "text-blue-600 bg-blue-50",
        [OrderStatus.SHIPPING]: "text-purple-600 bg-purple-50",
        [OrderStatus.DELIVERED]: "text-green-600 bg-green-50",
        [OrderStatus.CANCELLED]: "text-red-600 bg-red-50",
    };

    export const Values: OrderStatus[] = [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.SHIPPING,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
    ];

    export const getLabel = (status: OrderStatus | number): string => {
        return LabelMap[status as OrderStatus] ?? "";
    };

    export const getColor = (status: OrderStatus | number): string => {
        return ColorMap[status as OrderStatus] ?? "";
    };
}

export interface Order {
    id: number;
    user_id: number;
    status: number;
    total_amount: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}

export default Order;
