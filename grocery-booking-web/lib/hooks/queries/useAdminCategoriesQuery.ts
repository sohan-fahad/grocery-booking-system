'use client';

import { useQuery } from '@tanstack/react-query';
import { CategoryApiService } from '@/lib/services/api';

export const adminCategoriesPickerQueryKey = ['admin', 'categories', 'picker'] as const;

export function useAdminCategoriesQuery() {
    return useQuery({
        queryKey: adminCategoriesPickerQueryKey,
        queryFn: async () => {
            const res = await CategoryApiService.getAll({ limit: 100 });
            if (!res.success) throw new Error(res.message || 'Could not load categories');
            return res.data ?? [];
        },
        staleTime: 60_000,
    });
}