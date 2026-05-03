'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AdminDashboardApiService, type DashboardStats } from '@/lib/services/api';
import { cn } from '@/lib/utils/utils';

function StatCard({
    label,
    value,
    sub,
    subIcon,
    subColor = 'text-muted-foreground',
    valueColor,
}: {
    label: string;
    value: string | number;
    sub: string;
    subIcon?: React.ReactNode;
    subColor?: string;
    valueColor?: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">{label}</p>
            <p className={cn('mt-2 text-4xl font-bold text-foreground', valueColor)}>{value}</p>
            <div className={cn('mt-1.5 flex items-center gap-1 text-sm', subColor)}>
                {subIcon}
                <span>{sub}</span>
            </div>
        </div>
    );
}

function StockBadge({ quantity }: { quantity: number }) {
    if (quantity === 0) {
        return (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600">
                Out of Stock
            </span>
        );
    }
    return (
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-600">
            Low Stock
        </span>
    );
}

export function DashboardHomePage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await AdminDashboardApiService.getStats();
            if (!res.success) {
                toast.error(res.message || 'Failed to load dashboard');
                return;
            }
            setStats(res.data);
        } catch {
            toast.error('Failed to load dashboard');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <Button variant="outline" size="sm" onClick={() => void fetchStats()} disabled={isLoading}>
                    <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
                    Refresh
                </Button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Total Items"
                    value={stats?.totalItems ?? '—'}
                    sub={`${stats?.newItemsThisWeek ?? 0} this week`}
                    subIcon={<TrendingUp className="h-3.5 w-3.5" />}
                    subColor="text-green-600"
                />
                <StatCard
                    label="Total Orders"
                    value={stats?.totalOrders ?? '—'}
                    sub={`${stats?.ordersToday ?? 0} today`}
                    subIcon={<TrendingUp className="h-3.5 w-3.5" />}
                    subColor="text-green-600"
                />
                <StatCard
                    label="Revenue"
                    value={stats ? `$${Number(stats.totalRevenue).toFixed(2)}` : '—'}
                    sub={`${stats?.revenueChangePercent ?? 0}% vs last week`}
                    subIcon={<TrendingUp className="h-3.5 w-3.5" />}
                    subColor="text-green-600"
                />
                <StatCard
                    label="Low Stock"
                    value={stats?.lowStockCount ?? '—'}
                    valueColor={stats && stats.lowStockCount > 0 ? 'text-amber-500' : undefined}
                    sub="needs restock"
                    subIcon={<AlertTriangle className="h-3.5 w-3.5" />}
                    subColor={stats && stats.lowStockCount > 0 ? 'text-amber-500' : 'text-muted-foreground'}
                />
            </div>

            {/* Two-panel row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Low Stock Alerts */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-start justify-between px-5 pt-5 pb-3">
                        <div>
                            <p className="font-semibold text-foreground">Low Stock Alerts</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Items below threshold</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/items">View All</Link>
                        </Button>
                    </div>
                    <div className="divide-y divide-border">
                        {isLoading && !stats ? (
                            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading…</div>
                        ) : !stats?.lowStockItems.length ? (
                            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                                All items are well stocked.
                            </div>
                        ) : (
                            stats.lowStockItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                                    <div className="h-9 w-9 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                width={36}
                                                height={36}
                                                className="object-cover h-full w-full"
                                            />
                                        ) : (
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.quantity} unit{item.quantity !== 1 ? 's' : ''} remaining
                                        </p>
                                    </div>
                                    <StockBadge quantity={item.quantity} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-start justify-between px-5 pt-5 pb-3">
                        <div>
                            <p className="font-semibold text-foreground">Recent Orders</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Last 5 orders placed</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/orders">View All</Link>
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                                    <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                    <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                                    <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading && !stats ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                                            Loading…
                                        </td>
                                    </tr>
                                ) : !stats?.recentOrders.length ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                                            No orders yet.
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-5 py-3.5">
                                                <code className="text-xs text-muted-foreground">{order.orderNumber}</code>
                                            </td>
                                            <td className="px-5 py-3.5 font-medium text-foreground max-w-[140px]">
                                                <span className="truncate block">{order.customerName}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right tabular-nums font-medium">
                                                ${Number(order.totalAmount).toFixed(2)}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {order.isFirstOrder ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-medium">
                                                        First Buy
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="font-medium">
                                                        Repeat
                                                    </Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
