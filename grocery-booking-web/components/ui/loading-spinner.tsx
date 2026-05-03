'use client';

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    variant?: "primary" | "secondary" | "white" | "muted";
    className?: string;
    fullScreen?: boolean;
    text?: string;
}

const LoadingSpinner = ({
    size = "md",
    variant = "primary",
    className,
    fullScreen = false,
    text
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        xs: "h-4 w-4 border-2",
        sm: "h-6 w-6 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-3",
        xl: "h-16 w-16 border-4",
    };

    const variantClasses = {
        primary: "border-primary/20 border-t-primary",
        secondary: "border-secondary/20 border-t-secondary",
        white: "border-white/20 border-t-white",
        muted: "border-muted/20 border-t-muted",
    };

    const spinner = (
        <div className={cn("flex flex-col items-center justify-center gap-3", !fullScreen && className)}>
            <div
                className={cn(
                    "rounded-full animate-spin",
                    sizeClasses[size],
                    variantClasses[variant]
                )}
            />
            {text && (
                <p className="text-sm text-muted-foreground">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
                className
            )}>
                {spinner}
            </div>
        );
    }

    return spinner;
};

export { LoadingSpinner };