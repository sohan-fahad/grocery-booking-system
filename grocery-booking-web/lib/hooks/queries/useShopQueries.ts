import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { WebCategoryApiService } from '@/lib/services/api/web-category.api.service';
import { WebGroceryApiService } from '@/lib/services/api/web-grocery.api.service';
import type { IBaseResponse } from '@/lib/models/responses';
import type { GroceryItemEntity } from '@/lib/models/entities';

export const SHOP_GROCERY_PAGE_SIZE = 24;

export const shopQueryKeys = {
    categories: ['shop', 'web-categories'] as const,
    groceryItemsInfinite: (filters: { categoryId: string | null; searchTerm: string | null }) =>
        ['shop', 'web-grocery-infinite', filters] as const,
};

type GroceryListPage = {
    items: GroceryItemEntity[];
    meta: IBaseResponse<GroceryItemEntity[]>['meta'];
};

export function useWebCategoriesQuery() {
    return useQuery({
        queryKey: shopQueryKeys.categories,
        queryFn: async () => {
            const res = await WebCategoryApiService.list({ limit: 10 });
            if (!res.success) throw new Error(res.message || 'Could not load categories');
            const list = [...(res.data ?? [])];
            list.sort((a, b) => a.name.localeCompare(b.name));
            return list;
        },
        staleTime: 5 * 60_000,
    });
}

export function useShopGroceryItemsInfiniteQuery(filters: {
    categoryId?: string;
    searchTerm?: string;
}) {
    const categoryKey = filters.categoryId ?? null;
    const searchKey = filters.searchTerm?.trim() || null;

    return useInfiniteQuery({
        queryKey: shopQueryKeys.groceryItemsInfinite({ categoryId: categoryKey, searchTerm: searchKey }),
        queryFn: async ({ pageParam }): Promise<GroceryListPage> => {
            const res = await WebGroceryApiService.list({
                categoryId: filters.categoryId,
                searchTerm: searchKey ?? undefined,
                page: pageParam,
                limit: SHOP_GROCERY_PAGE_SIZE,
            });
            if (!res.success) throw new Error(res.message || 'Could not load items');
            return {
                items: res.data ?? [],
                meta: res.meta,
            };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const limit = lastPage.meta?.limit ?? SHOP_GROCERY_PAGE_SIZE;
            const total = lastPage.meta?.total;
            const loaded = allPages.reduce((acc, p) => acc + p.items.length, 0);
            if (total != null && Number.isFinite(total)) {
                return loaded < total ? allPages.length + 1 : undefined;
            }
            return lastPage.items.length < limit ? undefined : allPages.length + 1;
        },
        staleTime: 60_000,
    });
}
