'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { List, useListRef, type RowComponentProps } from 'react-window';
import type { GroceryItemEntity } from '@/lib/models/entities';
import type { ShopCategoryAccent } from '@/components/pages/shop-home/category-accents';
import { GroceryProductCard } from '@/components/pages/shop-home/grocery-product-card';
import type { SortKey } from '@/components/pages/shop-home/category-filter-bar';

const MIN_CARD_WIDTH_PX = 175;
const GRID_GAP_PX = 14;
const ROW_HEIGHT_PX = 252 + GRID_GAP_PX;

type GroceryProductGridProps = {
    items: GroceryItemEntity[];
    sortKey: SortKey;
    cartQtyById: Record<string, number>;
    accent: ShopCategoryAccent;
    onAdd: (item: GroceryItemEntity) => void;
    onInc: (id: string) => void;
    onDec: (id: string) => void;
    /** Resets scroll position when filters change (e.g. category or search). */
    listResetKey: string;
    isLoading: boolean;
    isError: boolean;
    errorMessage?: string;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
};

type RowData = {
    rows: GroceryItemEntity[][];
    columnCount: number;
    cartQtyById: Record<string, number>;
    accent: ShopCategoryAccent;
    onAdd: (item: GroceryItemEntity) => void;
    onInc: (id: string) => void;
    onDec: (id: string) => void;
};

function GridRow({ index, style, rows, columnCount, cartQtyById, accent, onAdd, onInc, onDec }: RowComponentProps<RowData>) {
    const row = rows[index];
    if (!row) return null;
    return (
        <div style={{ ...style, paddingBottom: GRID_GAP_PX }}>
            <div
                className="grid gap-3.5"
                style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
            >
                {row.map((item) => (
                    <GroceryProductCard
                        key={item.id}
                        item={item}
                        quantityInCart={cartQtyById[item.id] ?? 0}
                        accent={accent}
                        onAdd={() => onAdd(item)}
                        onInc={() => onInc(item.id)}
                        onDec={() => onDec(item.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export function GroceryProductGrid({
    items,
    sortKey,
    cartQtyById,
    accent,
    onAdd,
    onInc,
    onDec,
    listResetKey,
    isLoading,
    isError,
    errorMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: GroceryProductGridProps) {
    const sorted = useMemo(() => {
        const next = [...items];
        if (sortKey === 'price-asc') next.sort((a, b) => Number(a.price) - Number(b.price));
        if (sortKey === 'price-desc') next.sort((a, b) => Number(b.price) - Number(a.price));
        if (sortKey === 'name') next.sort((a, b) => a.name.localeCompare(b.name));
        return next;
    }, [items, sortKey]);

    const [columnCount, setColumnCount] = useState(3);
    const listRef = useListRef(null);

    const rows = useMemo(() => {
        const r: GroceryItemEntity[][] = [];
        for (let i = 0; i < sorted.length; i += columnCount) {
            r.push(sorted.slice(i, i + columnCount));
        }
        return r;
    }, [sorted, columnCount]);

    useEffect(() => {
        listRef.current?.scrollToRow({ index: 0, behavior: 'instant' });
    }, [listResetKey]);

    const onResize = useCallback(({ width }: { width: number; height: number }) => {
        const cols = Math.max(1, Math.floor((width + GRID_GAP_PX) / (MIN_CARD_WIDTH_PX + GRID_GAP_PX)));
        setColumnCount(cols);
    }, []);

    const onRowsRendered = useCallback(
        ({ stopIndex }: { startIndex: number; stopIndex: number }) => {
            if (hasNextPage && !isFetchingNextPage && stopIndex >= rows.length - 2) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage, rows.length],
    );

    const rowProps: RowData = useMemo(
        () => ({ rows, columnCount, cartQtyById, accent, onAdd, onInc, onDec }),
        [rows, columnCount, cartQtyById, accent, onAdd, onInc, onDec],
    );

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-14 text-center text-muted-foreground">
                <p className="text-sm font-medium">{errorMessage ?? 'Could not load groceries.'}</p>
            </div>
        );
    }

    if (isLoading && !items.length) {
        return (
            <div className="h-[min(90vh,calc(100vh-14rem))] overflow-hidden">
                <div className="grid animate-pulse grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-3.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-[252px] rounded-[10px] border border-border bg-muted/70" />
                    ))}
                </div>
            </div>
        );
    }

    if (!sorted.length) {
        return (
            <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                <span className="text-4xl opacity-40" aria-hidden>
                    🔍
                </span>
                <p className="text-sm">No items found</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <List
                rowCount={rows.length}
                rowHeight={ROW_HEIGHT_PX}
                rowComponent={GridRow}
                rowProps={rowProps}
                listRef={listRef}
                onRowsRendered={onRowsRendered}
                onResize={onResize}
                overscanCount={3}
                style={{ height: 'min(90vh, calc(100vh - 14rem))' }}
                className="w-full [-webkit-overflow-scrolling:touch]"
            />
            {hasNextPage && isFetchingNextPage ? (
                <div className="flex h-10 items-center justify-center text-xs text-muted-foreground">
                    Loading more…
                </div>
            ) : null}
        </div>
    );
}
