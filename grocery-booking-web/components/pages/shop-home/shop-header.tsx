'use client';

import Link from 'next/link';
import { LogOut, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { Input } from '@/components/ui/input';
import type { ShopCategoryAccent } from '@/components/pages/shop-home/category-accents';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useAuthenticationStore } from '@/lib/hooks/stores';

type ShopHeaderProps = {
    search: string;
    onSearchChange: (v: string) => void;
    cartCount: number;
    onOpenCart: () => void;
    accent: ShopCategoryAccent;
    onSignOut?: () => void;
};

export function ShopHeader({
    search,
    onSearchChange,
    cartCount,
    onOpenCart,
    accent,
    onSignOut,
}: ShopHeaderProps) {

    const user = useAuthenticationStore((s) => s.user);

    const handleSignOut = () => {
        onSignOut?.();
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background px-4 md:px-6">
            <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-3 md:gap-4">
                <Link
                    href="/"
                    className="shrink-0 cursor-pointer font-bold text-lg tracking-tight text-foreground md:text-xl"
                >
                    groci<span className="text-primary">fy</span>
                </Link>

                <div className="relative hidden max-w-[480px] flex-1 md:block">
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search groceries…"
                        className="h-9 rounded-lg bg-muted/50 text-sm shadow-none md:text-[14px]"
                        aria-label="Search groceries"
                    />
                </div>

                <div className="ml-auto flex items-center gap-1">
                    {user ? <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="Account menu"
                            >
                                <Avatar className="cursor-pointer">
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt=""
                                        className="grayscale"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44" align="end">
                            <DropdownMenuGroup>
                                {user?.role === 'user' ? (
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">My Orders</Link>
                                    </DropdownMenuItem>
                                ) : user?.role === 'admin' ? (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/orders">Orders</Link>
                                        </DropdownMenuItem>
                                    </>
                                ) : null}
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <LogOut className="size-3.5 shrink-0" aria-hidden />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu> : <Link href="/auth">Login</Link>}

                    <button
                        type="button"
                        onClick={onOpenCart}
                        className={cn(
                            'ml-0.5 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-white transition-colors md:ml-1 md:px-3.5',
                            accent.ctaBase,
                            accent.ctaHover,
                        )}
                    >
                        <ShoppingCart className="size-4 shrink-0" aria-hidden />
                        <span className="hidden sm:inline">Cart</span>
                        <span className="inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold leading-none text-neutral-900">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
