import type { Metadata } from "next";
import GuestCheck from "@/components/layout/guest-check";

export const metadata: Metadata = {
    title: "Auth - Grocery Booking",
    description: "Sign in to your account and start booking groceries",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <GuestCheck>
            {children}
        </GuestCheck>
    );
}
