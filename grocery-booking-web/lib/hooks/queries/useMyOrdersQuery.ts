'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderApiService } from '@/lib/services/api/order.api.service';

export const userOrdersQueryKey = ['user', 'orders'] as const;

export function useMyOrdersQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: userOrdersQueryKey,
        queryFn: async () => {
            const res = await OrderApiService.listMine();
            if (!res.success) {
                throw new Error(res.message || 'Could not load orders');
            }
            return res.data ?? [];
        },
        enabled: options?.enabled ?? true,
    });
}

export function usePlaceOrderMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Parameters<typeof OrderApiService.placeOrder>[0]) => {
            const res = await OrderApiService.placeOrder(payload);
            if (!res.success) {
                throw new Error(res.message || 'Could not place order');
            }
            return res.data;
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: userOrdersQueryKey });
        },
    });
}
