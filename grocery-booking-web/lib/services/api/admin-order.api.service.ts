import HttpClient from '../http.service';
import { IBaseResponse } from '@/lib/models/responses';
import type { OrderEntity } from '@/lib/models/entities';

export type AdminOrdersParams = {
    page: number;
    limit: number;
    status?: string;
    searchTerm?: string;
};

export class AdminOrderApiService {
    static async list(params: AdminOrdersParams) {
        const qs = new URLSearchParams({
            page: String(params.page),
            limit: String(params.limit),
            ...(params.status ? { status: params.status } : {}),
            ...(params.searchTerm?.trim() ? { searchTerm: params.searchTerm.trim() } : {}),
        }).toString();
        const response = await HttpClient.get<IBaseResponse<OrderEntity[]>>(`/admin/orders?${qs}`);
        return response.data;
    }

    static async getById(id: string) {
        const response = await HttpClient.get<IBaseResponse<OrderEntity>>(`/admin/orders/${id}`);
        return response.data;
    }
}
