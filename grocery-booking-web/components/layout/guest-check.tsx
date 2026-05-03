'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthenticationStore } from '@/lib/hooks/stores';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useIsJWTValid } from '@/lib/hooks';

interface GuestCheckProps {
    children: React.ReactNode;
    redirectTo?: string;
}

const GuestCheck = ({ children, redirectTo = '/dashboard' }: GuestCheckProps) => {
    const router = useRouter();
    const isJWTValid = useIsJWTValid();
    const { isLoggedIn, user } = useAuthenticationStore();

    useEffect(() => {
        if (isJWTValid && isLoggedIn && user) {
            router.replace(redirectTo);
        }
    }, [isJWTValid, isLoggedIn, user, router, redirectTo]);

    if (isJWTValid && isLoggedIn) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" text="Redirecting..." />
            </div>
        );
    }

    return <>{children}</>;
};

export default GuestCheck;