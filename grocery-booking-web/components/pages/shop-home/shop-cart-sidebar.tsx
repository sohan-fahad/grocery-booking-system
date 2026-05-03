'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import type { ShopCategoryAccent } from '@/components/pages/shop-home/category-accents';
import type { ShopCartLine } from '@/lib/hooks/stores/use-shop-cart-store';
import { useAuthenticationStore } from '@/lib/hooks/stores';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/components/pages/shop-home/product-image-placeholder';

type ShopCartSidebarProps = {
    open: boolean;
    onClose: () => void;
    lines: ShopCartLine[];
    subtotal: number;
    accent: ShopCategoryAccent;
    onCheckout: () => void;
    onInc: (id: string) => void;
    onDec: (id: string) => void;
};

export function ShopCartSidebar({
    open,
    onClose,
    lines,
    subtotal,
    accent,
    onCheckout,
    onInc,
    onDec,
}: ShopCartSidebarProps) {
    const user = useAuthenticationStore((s) => s.user);
    return (
        <>
            {/* <button
                type="button"
                aria-label="Dismiss cart backdrop"
                className={cn(
                    'fixed inset-0 z-40 bg-black/15 transition-opacity',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={onClose}
            /> */}

            <aside
                aria-hidden={!open}
                className={cn(
                    'fixed top-[60px] right-0 z-50 flex h-[calc(100vh-60px)] w-[min(100vw-1rem,360px)] max-w-[100vw] flex-col border-l border-border bg-card shadow-xl transition-transform duration-300',
                    open ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h2 className="text-base font-bold">Your Cart</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
                        aria-label="Close cart"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {lines.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-14 text-center text-muted-foreground">
                            <span className="text-[40px] opacity-40" aria-hidden>
                                🛒
                            </span>
                            <p className="text-[13px]">Your cart is empty</p>
                            <p className="max-w-[12rem] text-xs">Add items from the shelf to continue.</p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-0.5">
                            {lines.map((line) => {
                                const each = Number(line.unitPrice);
                                const lineTotal = each * line.quantity;
                                const thumbSrc =
                                    line.imageUrl?.trim() || PRODUCT_IMAGE_PLACEHOLDER;
                                return (
                                    <li
                                        key={line.groceryItemId}
                                        className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 hover:bg-muted/70"
                                    >
                                        <span className="flex size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                            <img
                                                src={thumbSrc}
                                                alt=""
                                                className="size-10 object-cover"
                                                onError={(e) => {
                                                    const el = e.currentTarget;
                                                    if (!el.src.includes('product-placeholder.svg')) {
                                                        el.src = PRODUCT_IMAGE_PLACEHOLDER;
                                                    }
                                                }}
                                            />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[13px] font-semibold">{line.name}</p>
                                            <p className="font-mono text-[12px] text-muted-foreground">
                                                ${each.toFixed(2)} each
                                            </p>
                                        </div>
                                        <div className="flex items-stretch overflow-hidden rounded-md border border-border">
                                            <button
                                                type="button"
                                                onClick={() => onDec(line.groceryItemId)}
                                                className="w-[26px] bg-muted/60 text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
                                            >
                                                −
                                            </button>
                                            <span className="min-w-[26px] border-x border-border text-center align-middle font-mono text-[12px] font-bold leading-[26px]">
                                                {line.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => onInc(line.groceryItemId)}
                                                disabled={line.quantity >= line.maxQuantity}
                                                className="w-[26px] bg-muted/60 text-muted-foreground transition-colors hover:bg-border hover:text-foreground disabled:opacity-35"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="min-w-[3rem] shrink-0 text-right font-mono text-[13px] font-semibold tabular-nums">
                                            ${lineTotal.toFixed(2)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {lines.length > 0 ? (
                    <footer className="border-t border-border px-5 py-3.5">
                        <dl className="mb-3 flex flex-col gap-1.5 text-[13px]">
                            <div className="flex justify-between text-muted-foreground">
                                <dt>Subtotal</dt>
                                <dd className="font-mono tabular-nums">${subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <dt>Delivery</dt>
                                <dd>Free</dd>
                            </div>
                            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
                                <dt>Total</dt>
                                <dd className="font-mono tabular-nums">${subtotal.toFixed(2)}</dd>
                            </div>
                        </dl>
                        <button
                            type="button"
                            onClick={onCheckout}
                            className={cn(
                                'mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg font-bold text-[14px] text-white shadow-sm transition-colors',
                                accent.ctaBase,
                                accent.ctaHover,
                            )}
                        >
                            Checkout →
                        </button>

                        <p className="text-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
                            >
                                Keep shopping
                            </button>
                        </p>

                        {user ? null : <p className="mt-4 text-center text-[11px] text-muted-foreground">
                            Prefer to book later?{' '}
                            <Link href="/auth" className="font-medium text-foreground underline-offset-2 hover:underline">
                                Sign in
                            </Link>
                        </p>}
                    </footer>
                ) : null}
            </aside>
        </>
    );
}
