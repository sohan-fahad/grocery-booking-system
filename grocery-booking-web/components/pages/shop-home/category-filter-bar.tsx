'use client';

import { cn } from '@/lib/utils/utils';
import type { CategoryEntity } from '@/lib/models/entities';
import { SHOP_FIXED_ACCENT } from '@/components/pages/shop-home/category-accents';

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name';

type CategoryFilterBarProps = {
    categories: CategoryEntity[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string | null) => void;
    sortKey: SortKey;
    onSortChange: (k: SortKey) => void;
};

export function CategoryFilterBar({
    categories,
    selectedCategoryId,
    onSelectCategory,
    sortKey,
    onSortChange,
}: CategoryFilterBarProps) {
    const accent = SHOP_FIXED_ACCENT;

    return (
        <div className="mb-5 flex flex-wrap items-center gap-2">
            <button
                type="button"
                role="tab"
                aria-selected={selectedCategoryId === null}
                onClick={() => onSelectCategory(null)}
                className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                    selectedCategoryId === null
                        ? cn(accent.chipActive, 'font-semibold')
                        : cn(accent.chipInactive, accent.chipInactiveHover),
                )}
            >
                All
            </button>

            {categories.map((cat) => {
                const active = cat.id === selectedCategoryId;

                return (
                    <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onSelectCategory(cat.id)}
                        className={cn(
                            'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                            active
                                ? cn(accent.chipActive, 'font-semibold')
                                : cn(accent.chipInactive, accent.chipInactiveHover),
                        )}
                    >
                        {cat.name}
                    </button>
                );
            })}

            <label className="ml-auto w-full pt-2 sm:w-auto sm:pt-0">
                <span className="sr-only">Sort</span>
                <select
                    value={sortKey}
                    onChange={(e) => onSortChange(e.target.value as SortKey)}
                    className={cn(
                        'h-10 w-full rounded-lg border border-input bg-background px-3 text-[13px] text-foreground sm:h-9 sm:min-w-[10.5rem]',
                        'outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35',
                    )}
                >
                    <option value="default">Sort: Featured</option>
                    <option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option>
                    <option value="name">Name A–Z</option>
                </select>
            </label>
        </div>
    );
}
