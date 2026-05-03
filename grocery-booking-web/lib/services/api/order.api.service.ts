import HttpClient from '../http.service';
import { IBaseResponse } from '@/lib/models/responses';
import { OrderEntity } from '@/lib/models/entities';

export type CreateOrderItemInput = {
    groceryItemId: string;
    quantity: number;
};

export class OrderApiService {
    static async placeOrder(items: CreateOrderItemInput[]) {
        const response = await HttpClient.post<IBaseResponse<OrderEntity>>('/web/orders', {
            body: JSON.stringify({ items }),
        });
        return response.data;
    }

    static async listMine() {
        const response = await HttpClient.get<IBaseResponse<OrderEntity[]>>('/web/orders/mine');
        return response.data;
    }

    static async getById(id: string) {
        const response = await HttpClient.get<IBaseResponse<OrderEntity>>(`/web/orders/${id}`);
        return response.data;
    }
}
