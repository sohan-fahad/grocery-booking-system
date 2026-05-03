'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    adminGroceryQueryRoot,
    useAdminGroceryItemsQuery,
} from '@/lib/hooks/queries/useAdminGroceryItemsQuery';

export const DASHBOARD_ITEMS_PAGE_SIZE = 10;

export function useDashboardItems() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data: res, isPending, isError, refetch } = useAdminGroceryItemsQuery({
        page,
        limit: DASHBOARD_ITEMS_PAGE_SIZE,
        searchTerm: debouncedSearch || undefined,
    });

    const invalidateList = useCallback(() => {
        void queryClient.invalidateQueries({ queryKey: adminGroceryQueryRoot });
    }, [queryClient]);

    const items = res?.data ?? [];
    const total = res?.meta?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / DASHBOARD_ITEMS_PAGE_SIZE));

    return {
        search,
        setSearch,
        page,
        setPage,
        items,
        total,
        totalPages,
        isPending,
        isError,
        refetch,
        invalidateList,
    };
}
