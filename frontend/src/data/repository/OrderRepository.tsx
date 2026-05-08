import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';
import type { Order } from '@/data/models/Order';

export interface OrderListResponse {
    items: Order[];
    paging: Record<string, any>;
}

export interface OrderRepository {
    // User
    createOrder(data: Record<string, any>): Promise<ApiResult<Order>>;
    getMyOrders(params?: Record<string, any>): Promise<ApiResult<OrderListResponse>>;
    getMyOrderDetail(orderId: number): Promise<ApiResult<Order>>;
    // Admin
    adminGetOrders(params?: Record<string, any>): Promise<ApiResult<OrderListResponse>>;
    adminGetOrderDetail(orderId: number): Promise<ApiResult<Order>>;
    adminUpdateOrderStatus(orderId: number, status: number): Promise<ApiResult<Order>>;
}

export class OrderRepositoryImpl extends BaseRepository implements OrderRepository {
    createOrder(data: Record<string, any>): Promise<ApiResult<Order>> {
        return this.safeCall(() =>
            this.apiService.post<Order>('/api/v1/orders', data)
        );
    }

    getMyOrders(params?: Record<string, any>): Promise<ApiResult<OrderListResponse>> {
        return this.safeCall(() =>
            this.apiService.get<OrderListResponse>('/api/v1/orders', params || {})
        );
    }

    getMyOrderDetail(orderId: number): Promise<ApiResult<Order>> {
        return this.safeCall(() =>
            this.apiService.get<Order>(`/api/v1/orders/${orderId}`, {})
        );
    }

    adminGetOrders(params?: Record<string, any>): Promise<ApiResult<OrderListResponse>> {
        return this.safeCall(() =>
            this.apiService.get<OrderListResponse>('/api/v1/admin/orders', params || {})
        );
    }

    adminGetOrderDetail(orderId: number): Promise<ApiResult<Order>> {
        return this.safeCall(() =>
            this.apiService.get<Order>(`/api/v1/admin/orders/${orderId}`, {})
        );
    }

    adminUpdateOrderStatus(orderId: number, status: number): Promise<ApiResult<Order>> {
        return this.safeCall(() =>
            this.apiService.patch<Order>(`/api/v1/admin/orders/${orderId}/status`, { status })
        );
    }
}

export default OrderRepositoryImpl;
