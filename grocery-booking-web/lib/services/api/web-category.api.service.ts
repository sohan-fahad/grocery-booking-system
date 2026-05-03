import HttpClient from '../http.service';
import { IBaseResponse } from '@/lib/models/responses';
import { CategoryEntity } from '@/lib/models/entities';

export type WebCategoryListParams = {
    searchTerm?: string;
    page?: number;
    limit?: number;
};

export class WebCategoryApiService {
    static async list(params?: WebCategoryListParams) {
        const query = new URLSearchParams();
        if (params?.searchTerm) query.set('searchTerm', params.searchTerm);
        if (params?.page != null) query.set('page', String(params.page));
        if (params?.limit != null) query.set('limit', String(params.limit));
        const qs = query.toString();
        const response = await HttpClient.get<IBaseResponse<CategoryEntity[]>>(
            `/web/categories${qs ? `?${qs}` : ''}`,
        );
        return response.data;
    }
}
