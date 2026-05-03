'use client';

import { useQuery } from '@tanstack/react-query';
import { AdminOrderApiService, AdminOrdersParams } from '@/lib/services/api/admin-order.api.service';

export const adminOrdersQueryKey = (params: AdminOrdersParams) =>
    ['admin', 'orders', params] as const;

export function useAdminOrdersQuery(params: AdminOrdersParams) {
    return useQuery({
        queryKey: adminOrdersQueryKey(params),
        queryFn: async () => {
            const res = await AdminOrderApiService.list(params);
            if (!res.success) {
                throw new Error(res.message || 'Could not load orders');
            }
            return res;
        },
    });
}
