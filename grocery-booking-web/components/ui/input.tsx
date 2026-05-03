import * as React from "react";
import { cn } from "@/lib/utils";

type CustomInputSize = "sm" | "default" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "outline" | "filled" | "ghost";
  size?: CustomInputSize;
  error?: boolean;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className = "",
    variant = "default",
    size = "default",
    error = false,
    helperText,
    label,
    leftIcon,
    rightIcon,
    ...props
  }, ref) => {

    const baseClasses =
      "flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base text-foreground shadow-none transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-input/50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80";

    const variantClasses = {
      default: "hover:border-muted-foreground/30",
      outline: "border-2 border-input bg-transparent dark:bg-transparent",
      filled:
        "border-transparent bg-muted hover:bg-muted/90 focus-visible:border-input focus-visible:bg-background",
      ghost:
        "border-transparent bg-transparent hover:bg-accent/50 focus-visible:border-input focus-visible:bg-background",
    };

    const sizeClasses = {
      sm: "h-8 px-2 text-xs",
      default: "h-9 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    };

    const errorClasses = error
      ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
      : "";

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            errorClasses,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
          aria-invalid={error || props["aria-invalid"]}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground [&_svg]:size-4">
            {rightIcon}
          </div>
        )}
      </div>
    );

    if (label || helperText) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="block text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {inputElement}
          {helperText && (
            <p className={cn(
              "block text-xs",
              error ? "text-destructive" : "text-muted-foreground"
            )}>
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = "Input";

export { Input };