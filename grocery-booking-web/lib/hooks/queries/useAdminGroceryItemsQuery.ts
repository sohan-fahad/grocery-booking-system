'use client';

import { useQuery } from '@tanstack/react-query';
import { ItemApiService } from '@/lib/services/api/item.api.service';

export type AdminGroceryListParams = {
    page: number;
    limit: number;
    searchTerm?: string;
};

export const adminGroceryQueryRoot = ['admin', 'grocery'] as const;

export const adminGroceryItemsQueryKey = (params: AdminGroceryListParams) =>
    [...adminGroceryQueryRoot, 'list', params] as const;

const adminGroceryPickerQueryKey = [...adminGroceryQueryRoot, 'picker'] as const;

/** Paginated admin grocery list (dashboard table). */
export function useAdminGroceryItemsQuery(params: AdminGroceryListParams) {
    return useQuery({
        queryKey: adminGroceryItemsQueryKey(params),
        queryFn: async () => {
            const res = await ItemApiService.getAll({
                page: params.page,
                limit: params.limit,
                searchTerm: params.searchTerm,
            });
            if (!res.success) {
                throw new Error(res.message || 'Could not load items');
            }
            return res;
        },
    });
}

export function useAdminGroceryItemsPickerQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: adminGroceryPickerQueryKey,
        queryFn: async () => {
            const res = await ItemApiService.getAll({ page: 1, limit: 500 });
            if (!res.success) {
                throw new Error(res.message || 'Could not load items');
            }
            return res.data ?? [];
        },
        enabled: options?.enabled ?? false,
        staleTime: 60_000,
    });
}
