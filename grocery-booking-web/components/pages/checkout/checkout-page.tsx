'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { UserEntity } from '@/lib/models/entities';
import { useAuthenticationStore } from '@/lib/hooks/stores/useAuthenticationStore';
import { SessionUtils } from '@/lib/utils/session.utils';
import { useShopCartStore } from '@/lib/hooks/stores/use-shop-cart-store';
import { usePlaceOrderMutation } from '@/lib/hooks/queries/useMyOrdersQuery';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { CATEGORY_CATEGORY_ACCENTS } from '@/components/pages/shop-home/category-accents';

type Step = 1 | 2;

const accent = CATEGORY_CATEGORY_ACCENTS[0];

export default function CheckoutPage() {
    const router = useRouter();
    const hasHydrated = useAuthenticationStore((s) => s._hasHydrated);
    const user = useAuthenticationStore((s) => s.user);

    useEffect(() => {
        if (!hasHydrated) return;
        const token = SessionUtils.getToken();
        const allowed = !!(token && user && user.role === 'user');
        if (!allowed) {
            toast.warning('Please sign in with a shopper account to continue.', {
                duration: 4000,
            });
            router.replace('/auth');
        }
    }, [hasHydrated, user, router]);

    if (!hasHydrated) return null;

    const tokenOk = !!(SessionUtils.getToken() && user?.role === 'user');
    if (!tokenOk) return null;

    return <CheckoutForm key={user.id} shopper={user} />;
}

function CheckoutForm({ shopper }: { shopper: UserEntity }) {
    const router = useRouter();
    const lines = useShopCartStore((s) => s.lines);
    const clear = useShopCartStore((s) => s.clear);

    const hasHydrated = useAuthenticationStore((s) => s._hasHydrated);

    const [orderFinished, setOrderFinished] = useState(false);
    const [step, setStep] = useState<Step>(1);

    const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
    const placeMutation = usePlaceOrderMutation();

    useEffect(() => {
        if (!hasHydrated || orderFinished) return;
        if (lines.length === 0) {
            toast.info('Your cart is empty.', { duration: 2500 });
            router.replace('/');
        }
    }, [lines.length, hasHydrated, router, orderFinished]);

    async function submitOrder() {
        try {
            await placeMutation.mutateAsync(
                lines.map((l) => ({
                    groceryItemId: l.groceryItemId,
                    quantity: l.quantity,
                })),
            );
            setOrderFinished(true);
            toast.success(`Thanks, ${shopper.name?.trim().split(/\s+/)[0] || 'friend'} — your order is in.`);
            router.push('/orders');
            clear();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Checkout failed.';
            toast.error(msg);
        }
    }

    if (!lines.length && !orderFinished) return null;

    const totalsBlock = (
        <>
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery</span>
                <span>Free</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border pt-2 text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
        </>
    );

    const orderLines = lines.map((l) => (
        <div
            key={l.groceryItemId}
            className="flex items-center gap-2.5 border-b border-border py-2 last:border-0"
        >
            <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">× {l.quantity}</p>
            </div>
            <p className="font-mono text-[13px] font-semibold tabular-nums">
                ${(l.unitPrice * l.quantity).toFixed(2)}
            </p>
        </div>
    ));

    return (
        <div className="min-h-screen bg-[oklch(0.986_0.002_90)] px-4 py-8 pb-24 dark:bg-background md:py-12">
            <div className="mx-auto max-w-xl">
                <Button variant="outline" size="sm" type="button" asChild className="mb-6">
                    <Link href="/">← Back to shop</Link>
                </Button>

                <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
                    <StepBadge index={1} label="Review order" active={step === 1} done={step > 1} />
                    <Divider />
                    <StepBadge index={2} label="Confirm" active={step === 2} done={step > 2} />
                </div>

                {step === 1 && (
                    <>
                        <section className="mb-4 rounded-[10px] border border-border bg-card p-5">
                            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                Order summary
                            </h3>
                            <div>{orderLines}</div>
                        </section>
                        <section className="mb-6 rounded-[10px] border border-border bg-card p-5">{totalsBlock}</section>
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className={cn(
                                'w-full rounded-lg py-3.5 text-[14px] font-bold text-white transition-colors shadow-sm',
                                accent.ctaBase,
                                accent.ctaHover,
                            )}
                        >
                            Review & Confirm →
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <section className="mb-4 rounded-[10px] border border-border bg-card p-5">
                            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                Confirm items
                            </h3>
                            <div>{orderLines}</div>
                        </section>
                        <section className="mb-6 rounded-[10px] border border-border bg-card p-5">{totalsBlock}</section>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                ← Back
                            </Button>
                            <button
                                type="button"
                                disabled={placeMutation.isPending}
                                className={cn(
                                    'flex-[2] rounded-lg py-3 text-[15px] font-bold text-white shadow-sm transition-colors disabled:opacity-55',
                                    accent.ctaBase,
                                    accent.ctaHover,
                                )}
                                onClick={() => void submitOrder()}
                            >
                                {placeMutation.isPending ? 'Submitting…' : '✓ Place order'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StepBadge(props: { index: number; label: string; active: boolean; done: boolean }) {
    return (
        <div className={cn('flex items-center gap-2', props.active ? 'font-semibold text-foreground' : '')}>
            <span
                className={cn(
                    'flex size-7 items-center justify-center rounded-full border-[1.5px] border-border text-[11px] font-bold',
                    props.done &&
                    cn('border-transparent bg-muted shadow-inner shadow-black/10', accent.ringSoft, 'ring-2'),
                    props.active && cn(accent.ctaBase, 'border-transparent text-white shadow-sm'),
                    !props.done && !props.active && 'bg-background text-muted-foreground',
                )}
            >
                {props.index}
            </span>
            <span>{props.label}</span>
        </div>
    );
}

function Divider() {
    return <span className="mx-2 hidden h-px min-w-[2rem] shrink-0 bg-border sm:inline-block lg:min-w-[4rem]" />;
}
