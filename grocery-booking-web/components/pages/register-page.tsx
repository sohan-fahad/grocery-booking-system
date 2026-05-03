'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    User,
    UserPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthenticationStore } from '@/lib/hooks/stores';
import { RegisterInput, registerSchema } from '@/lib/schemas';
import { AuthApiService } from '@/lib/services/api';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { setIsLoggedIn, setUser, setToken } = useAuthenticationStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            phoneNumber: '',
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);

        try {
            const regRes = await AuthApiService.signUp(data);

            if (!regRes?.success) {
                toast.error(regRes?.message ?? 'Registration failed');
                return;
            }

            const loginRes = await AuthApiService.signIn({
                email: data.email,
                password: data.password,
            });

            if (!loginRes?.success) {
                toast.success('Account created. Please sign in.');
                router.push('/auth');
                return;
            }

            const loggedInUser = loginRes.data?.user;
            setUser(loggedInUser ?? null);
            setToken(loginRes.data?.token ?? null);
            setIsLoggedIn(true);
            toast.success('Welcome!');
            router.push(loggedInUser?.role === 'admin' ? '/dashboard' : '/');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="mx-auto w-full max-w-md">
                <div className="rounded-lg bg-secondary p-8 shadow-lg">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="h-8 w-8 text-primary" />
                        </div>
                        <Text
                            as="h2"
                            size="3xl"
                            weight="bold"
                            align="center"
                            className="mb-2 text-foreground"
                        >
                            Create account
                        </Text>
                        <Text size="lg" color="muted" align="center">
                            Sign up to start booking groceries
                        </Text>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                        <div className="space-y-2">
                            <Input
                                {...register('name')}
                                label="Full name"
                                type="text"
                                autoComplete="name"
                                placeholder="Your name"
                                leftIcon={<User className="h-4 w-4" />}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                {...register('email')}
                                label="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                leftIcon={<Mail className="h-4 w-4" />}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                {...register('phoneNumber')}
                                label="Phone (optional)"
                                type="tel"
                                autoComplete="tel"
                                placeholder="11-digit number"
                                leftIcon={<Phone className="h-4 w-4" />}
                                error={!!errors.phoneNumber}
                                helperText={
                                    errors.phoneNumber?.message ??
                                    'Leave blank or enter exactly 11 digits'
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                {...register('password')}
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Create a password"
                                leftIcon={<Lock className="h-4 w-4" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="transition-colors hover:text-primary"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </div>

                        <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span>Create account</span>
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <Text size="sm" color="muted">
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                                onClick={() => router.push('/auth')}
                            >
                                Sign in
                            </button>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}
