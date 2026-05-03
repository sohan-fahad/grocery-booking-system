'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useAuthenticationStore } from '@/lib/hooks/stores/useAuthenticationStore';
import { SessionUtils } from '@/lib/utils/session.utils';
import { useMyOrdersQuery } from '@/lib/hooks/queries/useMyOrdersQuery';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import type { OrderEntity } from '@/lib/models/entities';

export default function MyOrdersPage() {
    const router = useRouter();
    const hasHydrated = useAuthenticationStore((s) => s._hasHydrated);
    const user = useAuthenticationStore((s) => s.user);

    const ordersQuery = useMyOrdersQuery({
        enabled:
            !!(hasHydrated && SessionUtils.getToken() && user?.role === 'user'),
    });

    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (!hasHydrated) return;
        const ok = !!(SessionUtils.getToken() && user?.role === 'user');
        if (!ok) router.replace('/auth');
    }, [hasHydrated, user, router]);

    if (!hasHydrated) return null;

    if (!SessionUtils.getToken() || user?.role !== 'user') return null;

    return (
        <div className="min-h-screen bg-[oklch(0.986_0.002_90)] px-4 py-8 pb-16 dark:bg-background md:py-12">
            <div className="mx-auto flex max-w-3xl flex-col gap-8">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">My orders</h1>
                        <p className="text-sm text-muted-foreground">Fulfillment-linked history from our API.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/">Continue shopping</Link>
                        </Button>
                    </div>
                </header>

                <OrdersBody
                    expanded={expanded}
                    setExpanded={setExpanded}
                    data={ordersQuery.data}
                    pending={ordersQuery.isPending}
                    errorMsg={ordersQuery.error?.message}
                />
            </div>
        </div>
    );
}

function OrdersBody(props: {
    expanded: string | null;
    setExpanded: (id: string | null) => void;
    data: OrderEntity[] | undefined;
    pending: boolean;
    errorMsg?: string;
}) {
    if (props.pending && !props.data) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/80" />
                ))}
            </div>
        );
    }

    if (props.errorMsg) {
        return (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
                {props.errorMsg}
            </p>
        );
    }

    const orders = props.data ?? [];
    if (!orders.length) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-20 text-muted-foreground">
                <span className="text-4xl opacity-40" aria-hidden>
                    📋
                </span>
                <p className="text-sm">No orders yet</p>
                <Button asChild>
                    <Link href="/">Start shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-3">
            {orders.map((o) => (
                <li
                    key={o.id}
                    className={cn(
                        'overflow-hidden rounded-[10px] border border-border bg-card transition-colors',
                        props.expanded === o.id ? 'shadow-sm' : '',
                    )}
                >
                    <button
                        type="button"
                        className={cn(
                            'flex w-full flex-wrap items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/60',
                            'md:flex-nowrap',
                        )}
                        onClick={() => props.setExpanded(props.expanded === o.id ? null : o.id)}
                    >
                        <code className="text-[11px] text-muted-foreground shrink-0">
                            {shortId(o.id)}
                        </code>
                        <span className="flex min-w-[8rem] flex-1 flex-wrap items-center gap-2 text-sm font-semibold">
                            <span>{o.items?.length ?? 0} items</span>
                            <OrderStatusBadge status={o.status} />
                        </span>
                        <span className="font-mono text-[15px] font-bold shrink-0">
                            ${Number(o.totalAmount).toFixed(2)}
                        </span>
                        <time className="text-xs text-muted-foreground shrink-0">
                            {formatWhen(o.createdAt)}
                        </time>
                        <ChevronRight
                            className={cn(
                                'size-5 shrink-0 text-muted-foreground transition-transform md:ml-auto',
                                props.expanded === o.id ? 'rotate-90' : '',
                            )}
                        />
                    </button>

                    {props.expanded === o.id ? (
                        <div className="border-t border-border px-5 py-4">
                            <ul className="flex flex-col gap-2">
                                {(o.items ?? []).map((it) => (
                                    <li
                                        key={it.id}
                                        className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 text-[13px]"
                                    >
                                        <span className="min-w-0 flex-1 font-medium">
                                            {it.groceryItem?.name ?? 'Item'}
                                        </span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            × {it.quantity}
                                        </span>
                                        <span className="font-mono text-[13px] font-semibold">
                                            $
                                            {(Number(it.unitPrice) * it.quantity).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}

function shortId(uuid: string) {
    return `…${uuid.slice(-6)}`;
}

function formatWhen(raw: string) {
    try {
        return new Date(raw).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return raw;
    }
}

function OrderStatusBadge({ status }: { status: OrderEntity['status'] }) {
    const label = status.slice(0, 1).toUpperCase() + status.slice(1);
    const cls =
        status === 'pending'
            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
            : status === 'confirmed'
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                : status === 'delivered'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-100';

    return (
        <span className={cn('ml-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium', cls)}>
            {label}
        </span>
    );
}
