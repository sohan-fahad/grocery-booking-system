'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { AdminOrderApiService } from '@/lib/services/api';
import type { OrderEntity } from '@/lib/models/entities';
import { cn } from '@/lib/utils/utils';

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

function statusVariant(
    status: OrderEntity['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'pending':
            return 'secondary';
        case 'confirmed':
            return 'default';
        case 'delivered':
            return 'outline';
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
}

export function DashboardOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = typeof params?.id === 'string' ? params.id : '';

    const [order, setOrder] = useState<OrderEntity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const fetchOrder = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setNotFound(false);
        try {
            const res = await AdminOrderApiService.getById(id);
            if (!res.success) {
                if (String(res.message).toLowerCase().includes('not found')) {
                    setNotFound(true);
                }
                toast.error(res.message || 'Failed to load order');
                setOrder(null);
                return;
            }
            setOrder(res.data ?? null);
        } catch {
            toast.error('Failed to load order');
            setOrder(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchOrder();
    }, [fetchOrder]);

    if (!id) {
        return (
            <div className="p-6">
                <p className="text-muted-foreground">Invalid order.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
                    <Link href="/dashboard/orders">
                        <ArrowLeft className="size-4" />
                        All orders
                    </Link>
                </Button>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => void fetchOrder()} disabled={isLoading}>
                        <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
                        Refresh
                    </Button>
                </div>
            </div>

            {isLoading && !order ? (
                <p className="text-muted-foreground">Loading order…</p>
            ) : notFound || !order ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="text-muted-foreground">Order not found.</p>
                    <Button variant="link" className="mt-2" onClick={() => router.push('/dashboard/orders')}>
                        Back to orders
                    </Button>
                </div>
            ) : (
                <>
                    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold text-foreground">Order details</h1>
                                <Badge variant={statusVariant(order.status)} className="capitalize">
                                    {order.status}
                                </Badge>
                            </div>
                            <p className="mt-1 font-mono text-xs text-muted-foreground break-all">{order.id}</p>
                            <p className="mt-2 text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-mono text-2xl font-bold tabular-nums">
                                ${Number(order.totalAmount).toFixed(2)}
                            </p>
                        </div>
                    </header>

                    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Customer
                        </h2>
                        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-muted-foreground">Name</dt>
                                <dd className="font-medium">{order.user?.name ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Email</dt>
                                <dd className="font-medium break-all">{order.user?.email ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">User ID</dt>
                                <dd className="font-mono text-xs text-muted-foreground break-all">{order.userId}</dd>
                            </div>
                            {order.user?.role ? (
                                <div>
                                    <dt className="text-muted-foreground">Role</dt>
                                    <dd className="font-medium capitalize">{order.user.role}</dd>
                                </div>
                            ) : null}
                        </dl>
                    </section>

                    <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Unit price</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Line total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(order.items ?? []).map((line) => {
                                    const unit = Number(line.unitPrice);
                                    const lineTotal = unit * line.quantity;
                                    const name = line.groceryItem?.name ?? line.groceryItemId;
                                    return (
                                        <TableRow key={line.id}>
                                            <TableCell className="font-medium">{name}</TableCell>
                                            <TableCell className="text-right font-mono tabular-nums text-sm">
                                                ${unit.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
                                            <TableCell className="text-right font-mono font-semibold tabular-nums">
                                                ${lineTotal.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </section>
                </>
            )}
        </div>
    );
}
