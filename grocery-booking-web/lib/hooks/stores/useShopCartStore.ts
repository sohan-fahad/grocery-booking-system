import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GroceryItemEntity } from '@/lib/models/entities';

export type ShopCartLine = {
    groceryItemId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    maxQuantity: number;
    imageUrl: string | null;
};

type ShopCartStore = {
    lines: ShopCartLine[];
    addOne: (item: GroceryItemEntity) => void;
    increment: (id: string) => void;
    decrement: (id: string) => void;
    removeLine: (id: string) => void;
    clear: () => void;
    mergeStockFromCatalog: (items: GroceryItemEntity[]) => void;
};

export const useShopCartStore = create<ShopCartStore>()(
    persist(
        (set, get) => ({
            lines: [],

            addOne: (item) => {
                const maxQty = Number(item.quantity);
                if (maxQty <= 0) return;
                set((state) => {
                    const next = [...state.lines];
                    const idx = next.findIndex((l) => l.groceryItemId === item.id);
                    const snapshot = lineFromProduct(item);

                    if (idx === -1) {
                        next.push({ ...snapshot, quantity: 1 });
                        return { lines: next };
                    }

                    const cap = Math.min(maxQty, next[idx].quantity + 1);
                    next[idx] = { ...next[idx], ...snapshot, quantity: cap };
                    return { lines: next };
                });
            },

            increment: (id) => {
                const line = get().lines.find((l) => l.groceryItemId === id);
                if (!line || line.quantity >= line.maxQuantity) return;
                set((state) => ({
                    lines: state.lines.map((l) =>
                        l.groceryItemId === id ? { ...l, quantity: l.quantity + 1 } : l,
                    ),
                }));
            },

            decrement: (id) => {
                set((state) => {
                    const next = state.lines
                        .map((l) =>
                            l.groceryItemId === id ? { ...l, quantity: l.quantity - 1 } : l,
                        )
                        .filter((l) => l.quantity > 0);
                    return { lines: next };
                });
            },

            removeLine: (id) =>
                set((state) => ({
                    lines: state.lines.filter((l) => l.groceryItemId !== id),
                })),

            clear: () => set({ lines: [] }),

            mergeStockFromCatalog: (items) => {
                const stockMap = Object.fromEntries(
                    items.map((i) => [i.id, Number(i.quantity)]),
                );
                set((state) => ({
                    lines: state.lines
                        .map((line) => {
                            const avail = stockMap[line.groceryItemId];
                            if (avail === undefined) return line;
                            return {
                                ...line,
                                maxQuantity: avail,
                                quantity: Math.min(line.quantity, Math.max(avail, 0)),
                            };
                        })
                        .filter((line) => line.quantity > 0),
                }));
            },
        }),
        {
            name: 'grocery-shop-cart',
            partialize: (s) => ({ lines: s.lines }),
        },
    ),
);

function lineFromProduct(item: GroceryItemEntity): Omit<ShopCartLine, 'quantity'> {
    return {
        groceryItemId: item.id,
        name: item.name,
        unitPrice: Number(item.price),
        maxQuantity: Number(item.quantity),
        imageUrl: item.image?.link ?? null,
    };
}
