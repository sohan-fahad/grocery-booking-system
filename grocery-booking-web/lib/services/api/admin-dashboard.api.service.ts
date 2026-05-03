import HttpClient from '../http.service';
import { IBaseResponse } from '@/lib/models/responses';

export type DashboardLowStockItem = {
    id: string;
    name: string;
    quantity: number;
    imageUrl: string | null;
};

export type DashboardRecentOrder = {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    isFirstOrder: boolean;
};

export type DashboardStats = {
    totalItems: number;
    newItemsThisWeek: number;
    totalOrders: number;
    ordersToday: number;
    totalRevenue: number;
    revenueChangePercent: number;
    lowStockCount: number;
    lowStockItems: DashboardLowStockItem[];
    recentOrders: DashboardRecentOrder[];
};

export class AdminDashboardApiService {
    static async getStats() {
        const response = await HttpClient.get<IBaseResponse<DashboardStats>>('/admin/dashboard/stats');
        return response.data;
    }
}
