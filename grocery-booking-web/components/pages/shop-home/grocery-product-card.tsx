'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils/utils';
import type { GroceryItemEntity } from '@/lib/models/entities';
import type { ShopCategoryAccent } from '@/components/pages/shop-home/category-accents';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/components/pages/shop-home/product-image-placeholder';
import Image from 'next/image';

type GroceryProductCardProps = {
    item: GroceryItemEntity;
    quantityInCart: number;
    accent: ShopCategoryAccent;
    onAdd: () => void;
    onInc: () => void;
    onDec: () => void;
};

export const GroceryProductCard = memo(function GroceryProductCard({
    item,
    quantityInCart,
    accent,
    onAdd,
    onInc,
    onDec,
}: GroceryProductCardProps) {
    const stock = Number(item.quantity);
    const outOfStock = stock <= 0;
    const lowStock = stock > 0 && stock < 8;
    const price = Number(item.price);
    const desc = item.description?.trim();


    return (
        <article
            className={cn(
                'flex flex-col overflow-hidden rounded-[10px] border border-border bg-card transition-[box-shadow,border-color]',
                !outOfStock && 'hover:border-primary/40 hover:shadow-[0_2px_14px_rgb(0_0_0/0.06)]',
                outOfStock && 'opacity-[0.62]',
            )}
        >
            <div className="relative flex h-[110px] shrink-0 items-center justify-center border-b border-border bg-muted/40 p-3">
                <Image
                    src={item?.image?.link?.trim() ?? PRODUCT_IMAGE_PLACEHOLDER}
                    alt={item.name ? `${item.name} product photo` : 'Product'}
                    width={100}
                    height={100}
                    sizes="(max-width: 640px) 45vw, 180px"
                    className="h-full w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                        const el = e.currentTarget;
                        if (!el.src.includes('product-placeholder.svg')) {
                            el.src = PRODUCT_IMAGE_PLACEHOLDER;
                        }
                    }}
                />

                {outOfStock && (
                    <span className="absolute top-2 right-2 rounded-full bg-[oklch(52%_0.18_25)] px-[7px] py-0.5 text-[10px] font-semibold tracking-wide text-white">
                        Out of Stock
                    </span>
                )}
                {!outOfStock && lowStock && (
                    <span className="absolute top-2 right-2 rounded-full bg-[oklch(60%_0.17_65)] px-[7px] py-0.5 text-[10px] font-semibold text-white">
                        Only {stock} left
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-0.5 px-[13px] pt-3 pb-1">
                <h3 className="text-[13px] font-semibold leading-snug">{item.name}</h3>
                {desc ? (
                    <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{desc}</p>
                ) : null}
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-border px-[13px] py-2.5">
                <p className="font-mono text-[15px] font-semibold tabular-nums">${price.toFixed(2)}</p>

                {outOfStock ? (
                    <button
                        type="button"
                        disabled
                        className="h-[30px] rounded-md bg-border px-[11px] text-[12px] font-semibold text-muted-foreground"
                    >
                        Unavailable
                    </button>
                ) : quantityInCart === 0 ? (
                    <button
                        type="button"
                        onClick={onAdd}
                        className={cn(
                            'flex h-[30px] items-center gap-1 rounded-md px-[11px] text-[12px] font-semibold text-white shadow-sm transition-colors',
                            accent.ctaBase,
                            accent.ctaHover,
                        )}
                    >
                        + Add
                    </button>
                ) : (
                    <div className={cn('flex h-[30px] items-stretch overflow-hidden rounded-md ring-2', accent.ringSoft)}>
                        <button
                            type="button"
                            onClick={onDec}
                            className={cn(
                                'w-[28px] text-[15px] font-semibold transition-colors hover:bg-muted',
                                'text-muted-foreground',
                            )}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="min-w-[28px] border-x border-border text-center align-middle font-mono text-[13px] font-bold leading-[28px]">
                            {quantityInCart}
                        </span>
                        <button
                            type="button"
                            onClick={onInc}
                            disabled={quantityInCart >= stock}
                            className={cn(
                                'w-[28px] text-[15px] font-semibold transition-colors hover:bg-muted disabled:opacity-40',
                                'text-muted-foreground',
                            )}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
});
