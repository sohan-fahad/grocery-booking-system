'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthenticationStore } from '@/lib/hooks/stores';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useIsJWTValid } from '@/lib/hooks';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: string;
    redirectTo?: string;
    unauthorizedRedirectTo?: string;
}

const AuthGuard = ({
    children,
    requiredRole,
    redirectTo = '/auth',
    unauthorizedRedirectTo = '/',
}: AuthGuardProps) => {
    const router = useRouter();
    const isJWTValid = useIsJWTValid();
    const { isLoggedIn, user, _hasHydrated } = useAuthenticationStore();

    const isAuthenticated = isJWTValid && isLoggedIn && user;
    const hasRequiredRole = !requiredRole || user?.role === requiredRole;

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!isJWTValid || !isLoggedIn) {
            router.replace(redirectTo);
            return;
        }
        if (requiredRole && user?.role !== requiredRole) {
            router.replace(unauthorizedRedirectTo);
        }
    }, [_hasHydrated, isJWTValid, isLoggedIn, user, router, redirectTo, requiredRole, unauthorizedRedirectTo]);

    if (!_hasHydrated || !isAuthenticated || !hasRequiredRole) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" text="Redirecting..." />
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
