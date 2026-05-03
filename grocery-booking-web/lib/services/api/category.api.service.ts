import HttpClient from '../http.service';
import { IBaseResponse } from '@/lib/models/responses';
import { CategoryEntity, CategoryWithProductsEntity } from '@/lib/models/entities';

export interface CreateCategoryInput {
    name: string;
    description?: string;
}

export interface UpdateCategoryInput {
    name?: string;
    description?: string;
}

export class CategoryApiService {
    static async getAll(params?: { searchTerm?: string; page?: number; limit?: number }) {
        const query = new URLSearchParams();
        if (params?.searchTerm) query.set('searchTerm', params.searchTerm);
        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        const qs = query.toString();
        const response = await HttpClient.get<IBaseResponse<CategoryEntity[]>>(
            `/admin/categories${qs ? `?${qs}` : ''}`,
        );
        return response.data;
    }

    static async getWithProducts() {
        const response = await HttpClient.get<IBaseResponse<CategoryWithProductsEntity[]>>(
            '/web/categories/with-products',
        );
        return response.data;
    }

    static async create(data: CreateCategoryInput) {
        const response = await HttpClient.post<IBaseResponse<CategoryEntity>>('/admin/categories', {
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    }

    static async update(id: string, data: UpdateCategoryInput) {
        const response = await HttpClient.patch<IBaseResponse<CategoryEntity>>(`/admin/categories/${id}`, {
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    }

    static async delete(id: string) {
        const response = await HttpClient.delete<IBaseResponse<void>>(`/admin/categories/${id}`, {});
        return response.data;
    }
}
