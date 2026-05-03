'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useWebCategoriesQuery, useShopGroceryItemsInfiniteQuery } from '@/lib/hooks/queries/useShopQueries';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useAuthenticationStore, useShopCartStore } from '@/lib/hooks/stores';
import type { GroceryItemEntity } from '@/lib/models/entities';
import { ShopHeader } from '@/components/pages/shop-home/shop-header';
import { CategoryFilterBar, type SortKey } from '@/components/pages/shop-home/category-filter-bar';
import { GroceryProductGrid } from '@/components/pages/shop-home/grocery-product-grid';
import { ShopCartSidebar } from '@/components/pages/shop-home/shop-cart-sidebar';
import { SHOP_FIXED_ACCENT } from '@/components/pages/shop-home/category-accents';
import { cn } from '@/lib/utils/utils';
import { Input } from '@/components/ui/input';

export default function ShopHomePage() {
    const router = useRouter();
    const [searchRaw, setSearchRaw] = useState('');
    const debouncedSearch = useDebouncedValue(searchRaw, 350);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('default');
    const [cartOpen, setCartOpen] = useState(false);

    const hasHydrated = useAuthenticationStore((s) => s._hasHydrated);
    const isLoggedIn = useAuthenticationStore((s) => s.isLoggedIn);
    const logout = useAuthenticationStore((s) => s.logout);

    const handleSignOut = () => {
        logout();
        toast.success('Signed out');
    };

    const lines = useShopCartStore((s) => s.lines);
    const addOne = useShopCartStore((s) => s.addOne);
    const increment = useShopCartStore((s) => s.increment);
    const decrement = useShopCartStore((s) => s.decrement);
    const mergeStockFromCatalog = useShopCartStore((s) => s.mergeStockFromCatalog);

    const categoriesQuery = useWebCategoriesQuery();
    const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);

    useEffect(() => {
        if (categoriesQuery.isError && categoriesQuery.error) {
            toast.error(categoriesQuery.error.message ?? 'Could not load categories');
        }
    }, [categoriesQuery.isError, categoriesQuery.error]);

    const itemsQuery = useShopGroceryItemsInfiniteQuery({
        categoryId: selectedCategoryId ?? undefined,
        searchTerm: debouncedSearch.trim() || undefined,
    });
    const items = useMemo(() => itemsQuery.data?.pages.flatMap((p) => p.items) ?? [], [itemsQuery.data]);
    const totalFromApi = itemsQuery.data?.pages[0]?.meta?.total;

    useEffect(() => {
        if (items.length) mergeStockFromCatalog(items);
    }, [items, mergeStockFromCatalog]);

    const accent = SHOP_FIXED_ACCENT;

    const listResetKey = `${selectedCategoryId ?? 'all'}|${debouncedSearch.trim()}`;

    const sectionTitle =
        selectedCategoryId === null
            ? 'All Items'
            : categories.find((c) => c.id === selectedCategoryId)?.name ?? 'Items';

    const cartCount = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);

    const cartQtyById = useMemo(() => Object.fromEntries(lines.map((l) => [l.groceryItemId, l.quantity])), [lines]);

    const handleCheckout = () => {
        setCartOpen(false);
        router.push('/checkout');
    };

    const onAddProduct = (item: GroceryItemEntity) => {
        if (Number(item.quantity) <= 0) {
            toast.error('Out of stock');
            return;
        }
        addOne(item);
        toast.success(`${item.name} added`);
    };

    const itemCountDisplay =
        itemsQuery.isPending && !items.length
            ? '…'
            : totalFromApi != null && Number.isFinite(totalFromApi)
              ? `${items.length} / ${totalFromApi} item${totalFromApi !== 1 ? 's' : ''}`
              : `${items.length} item${items.length !== 1 ? 's' : ''}`;

    return (
        <div className="flex min-h-screen flex-col bg-[oklch(0.986_0.002_90)] dark:bg-background">
            <ShopHeader
                search={searchRaw}
                onSearchChange={setSearchRaw}
                cartCount={cartCount}
                onOpenCart={() => setCartOpen(true)}
                accent={accent}
                onSignOut={hasHydrated && isLoggedIn ? handleSignOut : undefined}
            />

            <div className={cn('flex min-h-0 flex-1', cartOpen && 'lg:mr-[min(360px,100vw-1rem)]')}>
                <main className={cn('mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col px-4 py-6 md:px-6')}>
                    <div className="mb-4 md:hidden">
                        <Input
                            value={searchRaw}
                            onChange={(e) => setSearchRaw(e.target.value)}
                            placeholder="Search groceries…"
                            className="h-11 rounded-lg bg-muted/70 text-[14px] shadow-none"
                            aria-label="Search groceries"
                        />
                    </div>

                    <CategoryFilterBar
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                        sortKey={sortKey}
                        onSortChange={setSortKey}
                    />

                    <div className="mb-4 flex items-baseline gap-2">
                        <h2 className="text-lg font-bold tracking-tight">{sectionTitle}</h2>
                        <span className="text-[13px] text-muted-foreground tabular-nums">{itemCountDisplay}</span>
                    </div>

                    <GroceryProductGrid
                        items={items}
                        sortKey={sortKey}
                        cartQtyById={cartQtyById}
                        accent={accent}
                        onAdd={onAddProduct}
                        onInc={increment}
                        onDec={decrement}
                        listResetKey={listResetKey}
                        isLoading={itemsQuery.isPending}
                        isError={itemsQuery.isError}
                        errorMessage={itemsQuery.error?.message}
                        fetchNextPage={itemsQuery.fetchNextPage}
                        hasNextPage={itemsQuery.hasNextPage ?? false}
                        isFetchingNextPage={itemsQuery.isFetchingNextPage}
                    />
                </main>
            </div>

            <ShopCartSidebar
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                lines={lines}
                subtotal={subtotal}
                accent={accent}
                onCheckout={handleCheckout}
                onInc={increment}
                onDec={decrement}
            />
        </div>
    );
}
