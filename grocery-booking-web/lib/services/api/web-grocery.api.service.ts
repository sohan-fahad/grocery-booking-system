import HttpClient from '../http.service';
import { IBaseResponse } from '@/lib/models/responses';
import { GroceryItemEntity } from '@/lib/models/entities';

export type WebGroceryListParams = {
    searchTerm?: string;
    page?: number;
    limit?: number;
    categoryId?: string;
};

export class WebGroceryApiService {
    static async list(params?: WebGroceryListParams) {
        const query = new URLSearchParams();
        if (params?.searchTerm) query.set('searchTerm', params.searchTerm);
        if (params?.page != null) query.set('page', String(params.page));
        if (params?.limit != null) query.set('limit', String(params.limit));
        if (params?.categoryId) query.set('categoryId', params.categoryId);
        const qs = query.toString();
        const response = await HttpClient.get<IBaseResponse<GroceryItemEntity[]>>(
            `/web/grocery${qs ? `?${qs}` : ''}`,
        );
        return response.data;
    }
}
