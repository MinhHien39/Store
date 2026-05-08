import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';

export interface DashboardSummary {
    total_revenue: number;
    total_orders: number;
    pending_orders: number;
    total_products: number;
    total_users: number;
}

export interface ChartDay {
    date: string;
    orders: number;
    revenue: number;
}

export interface DashboardChart {
    days: ChartDay[];
}

export interface DashboardRepository {
    getSummary(): Promise<ApiResult<DashboardSummary>>;
    getChart(days?: number): Promise<ApiResult<DashboardChart>>;
}

export class DashboardRepositoryImpl extends BaseRepository implements DashboardRepository {
    getSummary(): Promise<ApiResult<DashboardSummary>> {
        return this.safeCall(() =>
            this.apiService.get<DashboardSummary>('/api/v1/admin/dashboard/summary', {})
        );
    }

    getChart(days: number = 7): Promise<ApiResult<DashboardChart>> {
        return this.safeCall(() =>
            this.apiService.get<DashboardChart>('/api/v1/admin/dashboard/chart', { days })
        );
    }
}

export default DashboardRepositoryImpl;
