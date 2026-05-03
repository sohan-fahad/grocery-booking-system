'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    AdminOrderApiService,
    type AdminOrdersParams,
} from '@/lib/services/api/admin-order.api.service';

const PAGE_SIZE = 10;

export const dashboardOrdersListQueryRoot = ['admin', 'orders', 'list'] as const;

export function dashboardOrdersListQueryKey(params: AdminOrdersParams) {
    return [...dashboardOrdersListQueryRoot, params] as const;
}

export function useDashboardOrders() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, debouncedSearch]);

    const queryParams = useMemo<AdminOrdersParams>(
        () => ({
            page,
            limit: PAGE_SIZE,
            ...(statusFilter ? { status: statusFilter } : {}),
            ...(debouncedSearch.trim() ? { searchTerm: debouncedSearch.trim() } : {}),
        }),
        [page, statusFilter, debouncedSearch],
    );

    const { data: res, isPending, isError, refetch } = useQuery({
        queryKey: dashboardOrdersListQueryKey(queryParams),
        queryFn: async () => {
            const out = await AdminOrderApiService.list(queryParams);
            if (!out.success) {
                throw new Error(out.message || 'Could not load orders');
            }
            return out;
        },
    });

    const orders = res?.data ?? [];
    const total = res?.meta?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const handleStatusChange = useCallback((value: string) => {
        setStatusFilter(value);
    }, []);

    return {
        isPending,
        isError,
        refetch,
        page,
        setPage,
        statusFilter,
        handleStatusChange,
        searchTerm,
        setSearchTerm,
        orders,
        total,
        totalPages,
    };
}
