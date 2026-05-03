import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "strong" | "em" | "small"
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl"
    color?: "default" | "muted" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info"
    weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold"
    align?: "left" | "center" | "right" | "justify"
    decoration?: "none" | "underline" | "line-through"
    transform?: "none" | "uppercase" | "lowercase" | "capitalize"
    truncate?: boolean
}

const Text = React.forwardRef<HTMLElement, TextProps>(
    ({
        as = "p",
        className = "",
        size = "base",
        color = "default",
        weight = "normal",
        align = "left",
        decoration = "none",
        transform = "none",
        truncate = false,
        children,
        ...props
    }, ref) => {

        const sizeClasses = {
            xs: "text-xs",
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
            "3xl": "text-3xl",
            "4xl": "text-4xl",
            "5xl": "text-5xl",
            "6xl": "text-6xl",
        }

        const colorClasses = {
            default: "text-white",
            muted: "text-muted-foreground",
            primary: "text-primary",
            secondary: "text-secondary",
            destructive: "text-destructive",
            success: "text-success",
            warning: "text-warning",
            info: "text-info",
        }

        const weightClasses = {
            light: "font-light",
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
            extrabold: "font-extrabold",
        }

        const alignClasses = {
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
        }

        const decorationClasses = {
            none: "no-underline",
            underline: "underline",
            "line-through": "line-through",
        }

        const transformClasses = {
            none: "normal-case",
            uppercase: "uppercase",
            lowercase: "lowercase",
            capitalize: "capitalize",
        }

        const Component = as as keyof React.JSX.IntrinsicElements

        return React.createElement(
            Component,
            {
                className: cn(
                    sizeClasses[size],
                    colorClasses[color],
                    weightClasses[weight],
                    alignClasses[align],
                    decorationClasses[decoration],
                    transformClasses[transform],
                    truncate && "truncate",
                    className
                ),
                ref,
                ...props,
            },
            children
        )
    }
)

Text.displayName = "Text"

export { Text }