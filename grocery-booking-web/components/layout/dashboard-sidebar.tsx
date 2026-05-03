'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBasket, Package, ClipboardList, Tag } from 'lucide-react';
import { useAuthenticationStore } from '@/lib/hooks/stores';
import { cn } from '@/lib/utils/index';

const navSections = [
    {
        label: 'Overview',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'Catalog',
        items: [
            { label: 'Categories', href: '/dashboard/categories', icon: Tag },
            { label: 'Grocery Items', href: '/dashboard/items', icon: ShoppingBasket },
        ],
    },
    {
        label: 'Sales',
        items: [
            { label: 'Orders', href: '/dashboard/orders', icon: ClipboardList },
        ],
    },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { user } = useAuthenticationStore();

    const isActive = (href: string) =>
        href === '/dashboard' ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="w-56 h-screen flex flex-col shrink-0 bg-[oklch(0.13_0_0)] text-white">
            {/* Logo */}
            <div className="px-5 pt-6 pb-5">
                <span className="text-primary font-bold text-xl italic tracking-tight">grocify</span>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] mt-0.5">Admin Dashboard</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
                {navSections.map((section) => (
                    <div key={section.label}>
                        <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-[0.12em] text-white/30 uppercase">
                            {section.label}
                        </p>
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors',
                                                active
                                                    ? 'bg-primary/15 text-primary font-medium'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                            )}
                                        >
                                            <item.icon className="w-4 h-4 shrink-0" />
                                            <span className="flex-1">{item.label}</span>
                                            {'badge' in item && item.badge !== undefined && (
                                                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold leading-none">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* User footer */}
            <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                    {user?.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.name ?? 'Admin'}</p>
                    <p className="text-[11px] text-white/40 truncate">{user?.email ?? 'admin@grocify.com'}</p>
                </div>
            </div>
        </aside>
    );
}
