'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import type { OrderEntity } from '@/lib/models/entities';
import { cn } from '@/lib/utils/utils';
import { useDashboardOrders } from '@/lib/hooks/queries/useDashboardOrders';

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleString(undefined, {
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

function shortUuid(id: string) {
    return `${id.slice(0, 8)}…`;
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

export function DashboardOrdersPage() {
    const {
        isPending,
        isError,
        refetch,
        page,
        setPage,
        statusFilter,
        handleStatusChange,
        searchTerm,
        setSearchTerm,
        orders,
        total,
        totalPages,
    } = useDashboardOrders();

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Orders</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {total} total order{total !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by id, name, email…"
                        className="h-9 w-[min(100vw-2rem,200px)]"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isPending}>
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-right">Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Placed</TableHead>
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                    Loading orders…
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-destructive">
                                    Failed to load orders.
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell>
                                        <code className="text-xs text-muted-foreground">{shortUuid(o.id)}</code>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <div className="truncate font-medium">
                                            {o.user?.name ?? '—'}
                                        </div>
                                        <div className="truncate text-xs text-muted-foreground">
                                            {o.user?.email ?? o.userId}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">{o.items?.length ?? 0}</TableCell>
                                    <TableCell className="text-right font-mono tabular-nums font-semibold">
                                        ${Number(o.totalAmount).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(o.status)} className="capitalize">
                                            {o.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {formatDate(o.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 shrink-0" asChild>
                                            <Link href={`/dashboard/orders/${o.id}`} aria-label="View order details">
                                                <ChevronRight className="size-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) setPage((p) => p - 1);
                                }}
                                className={cn(page <= 1 && 'pointer-events-none opacity-50')}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="px-4 text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages) setPage((p) => p + 1);
                                }}
                                className={cn(page >= totalPages && 'pointer-events-none opacity-50')}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
