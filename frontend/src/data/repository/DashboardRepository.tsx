import BaseRepository from './BaseRepository';
import { ApiResult } from '@/core/api';

export interface DashboardSummary {
    total_revenue: number;
    total_orders: number;
    pending_orders: number;
    total_products: number;
    total_users: number;
}

export interface DashboardRepository {
    getSummary(): Promise<ApiResult<DashboardSummary>>;
}

export class DashboardRepositoryImpl extends BaseRepository implements DashboardRepository {
    getSummary(): Promise<ApiResult<DashboardSummary>> {
        return this.safeCall(() =>
            this.apiService.get<DashboardSummary>('/api/v1/admin/dashboard/summary', {})
        );
    }
}

export default DashboardRepositoryImpl;
