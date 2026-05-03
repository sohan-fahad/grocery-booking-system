import HttpClient from "../http.service";
import { IBaseResponse } from "@/lib/models/responses";
import { GroceryItemEntity } from "@/lib/models/entities";

export interface CreateItemInput {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    file?: File;
    categoryId?: string;
}

export interface UpdateItemInput {
    name?: string;
    description?: string;
    price?: number;
    imageId?: string;
    categoryId?: string;
}

export interface InventoryCircularItemInput {
    groceryItemId: string;
    action: 'add' | 'subtract' | 'set';
    quantity: number;
}

export interface InventoryCircularInput {
    title: string;
    reason?: string;
    items: InventoryCircularItemInput[];
}

export class ItemApiService {
    static async getAll(params?: { searchTerm?: string; page?: number; limit?: number }) {
        const query = new URLSearchParams();
        if (params?.searchTerm) query.set('searchTerm', params.searchTerm);
        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        const qs = query.toString();
        const response = await HttpClient.get<IBaseResponse<GroceryItemEntity[]>>(
            `/admin/grocery${qs ? `?${qs}` : ''}`
        );
        return response.data;
    }

    static async create(data: CreateItemInput) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('price', String(data.price));
        formData.append('quantity', String(data.quantity));
        if (data.file) formData.append('file', data.file);
        if (data.categoryId) formData.append('categoryId', data.categoryId);

        const response = await HttpClient.post<IBaseResponse<GroceryItemEntity>>('/admin/grocery', {
            body: formData,
        });
        return response.data;
    }

    static async update(id: string, data: UpdateItemInput) {
        const response = await HttpClient.patch<IBaseResponse<GroceryItemEntity>>(`/admin/grocery/${id}`, {
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    }

    static async delete(id: string) {
        const response = await HttpClient.delete<IBaseResponse<void>>(`/admin/grocery/${id}`, {});
        return response.data;
    }

    static async updateInventory(data: InventoryCircularInput) {
        const response = await HttpClient.post<IBaseResponse<any>>('/admin/inventory/circular', {
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    }
}
