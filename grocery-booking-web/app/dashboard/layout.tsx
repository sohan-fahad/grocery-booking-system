import type { Metadata } from "next";
import AuthGuard from "@/components/layout/auth-guard";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";

export const metadata: Metadata = {
    title: "Dashboard - Grocery Booking",
    description: "Dashboard for grocery booking",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard requiredRole="admin">
            <div className="flex h-screen overflow-hidden">
                <DashboardSidebar />
                <main className="flex-1 overflow-y-auto bg-background">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}