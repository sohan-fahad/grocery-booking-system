export type ShopCategoryAccent = {
    chipInactive: string;
    chipInactiveHover: string;
    chipActive: string;
    ctaBase: string;
    ctaHover: string;
    ringSoft: string;
};

export const CATEGORY_CATEGORY_ACCENTS: ShopCategoryAccent[] = [
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-emerald-500/70 hover:text-emerald-800',
        chipActive: 'border-emerald-600 bg-emerald-600 text-white',
        ctaBase: 'bg-emerald-600',
        ctaHover: 'hover:bg-emerald-700',
        ringSoft: 'ring-emerald-500/35',
    },
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-sky-500/70 hover:text-sky-800',
        chipActive: 'border-sky-600 bg-sky-600 text-white',
        ctaBase: 'bg-sky-600',
        ctaHover: 'hover:bg-sky-700',
        ringSoft: 'ring-sky-500/35',
    },
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-violet-500/70 hover:text-violet-800',
        chipActive: 'border-violet-600 bg-violet-600 text-white',
        ctaBase: 'bg-violet-600',
        ctaHover: 'hover:bg-violet-700',
        ringSoft: 'ring-violet-500/35',
    },
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-amber-500/70 hover:text-amber-900',
        chipActive: 'border-amber-600 bg-amber-600 text-white',
        ctaBase: 'bg-amber-600',
        ctaHover: 'hover:bg-amber-700',
        ringSoft: 'ring-amber-500/35',
    },
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-rose-500/70 hover:text-rose-800',
        chipActive: 'border-rose-600 bg-rose-600 text-white',
        ctaBase: 'bg-rose-600',
        ctaHover: 'hover:bg-rose-700',
        ringSoft: 'ring-rose-500/35',
    },
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-cyan-500/70 hover:text-cyan-800',
        chipActive: 'border-cyan-600 bg-cyan-600 text-white',
        ctaBase: 'bg-cyan-600',
        ctaHover: 'hover:bg-cyan-700',
        ringSoft: 'ring-cyan-500/35',
    },
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-fuchsia-500/70 hover:text-fuchsia-800',
        chipActive: 'border-fuchsia-600 bg-fuchsia-600 text-white',
        ctaBase: 'bg-fuchsia-600',
        ctaHover: 'hover:bg-fuchsia-700',
        ringSoft: 'ring-fuchsia-500/35',
    },
    {
        chipInactive: 'border-neutral-300 bg-background text-muted-foreground',
        chipInactiveHover: 'hover:border-lime-500/70 hover:text-lime-900',
        chipActive: 'border-lime-600 bg-lime-600 text-white',
        ctaBase: 'bg-lime-600',
        ctaHover: 'hover:bg-lime-700',
        ringSoft: 'ring-lime-500/35',
    },
];

export function accentPaletteAt(tabVisualIndex: number): ShopCategoryAccent {
    const n = CATEGORY_CATEGORY_ACCENTS.length;
    return CATEGORY_CATEGORY_ACCENTS[((tabVisualIndex % n) + n) % n];
}

/** Single accent for the shop — category selection does not change theme colors. */
export const SHOP_FIXED_ACCENT: ShopCategoryAccent = CATEGORY_CATEGORY_ACCENTS[0];
