import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button variant definitions following shadcn/ui standards and luxury aesthetics:
 * - Subtle luxury curvature (rounded-md)
 * - Clear, high-contrast states with smooth hover transitions
 * - Zero nested ternaries in rendering logic
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium uppercase tracking-[0.08em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-loupe)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none shadow-2xs active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-ink)] text-white hover:bg-[var(--color-loupe)] active:bg-[var(--color-loupe-deep)] border border-[var(--color-ink)]",
        primary:
          "bg-[var(--color-ink)] text-white hover:bg-[var(--color-loupe)] active:bg-[var(--color-loupe-deep)] border border-[var(--color-ink)]",
        secondary:
          "bg-white text-[var(--color-ink)] border border-[var(--color-line-dark)] hover:bg-[var(--color-stone)] hover:border-[var(--color-ink)] active:bg-[var(--color-stone-deep)]",
        outline:
          "bg-transparent text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-ink)] hover:bg-[var(--color-stone)]",
        ghost:
          "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-stone)] hover:text-[var(--color-loupe)] shadow-none",
        accent:
          "bg-[var(--color-loupe)] text-white hover:bg-[var(--color-loupe-deep)] border border-[var(--color-loupe)]",
        danger:
          "bg-[var(--color-out)] text-white hover:opacity-90 border border-[var(--color-out)]",
        destructive:
          "bg-[var(--color-out)] text-white hover:opacity-90 border border-[var(--color-out)]",
      },
      size: {
        default: "h-11 px-5 text-xs",
        sm: "h-9 px-3.5 text-[0.6875rem]",
        md: "h-11 px-5 text-xs",
        lg: "h-13 px-8 text-sm tracking-[0.08em]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, renders a spinning loader and disables interaction */
  isLoading?: boolean;
  /** Optional icon rendered before the children */
  leftIcon?: React.ReactNode;
  /** Optional icon rendered after the children */
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isInteractivityDisabled = disabled || isLoading;

    let leadingContent = leftIcon;
    if (isLoading) {
      leadingContent = <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />;
    }

    return (
      <button
        ref={ref}
        disabled={isInteractivityDisabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {leadingContent}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
