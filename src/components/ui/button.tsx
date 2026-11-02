import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button component synthesized from:
 * - shadcn/ui: Solid CVA foundation & accessible Radix alignment
 * - HeroUI: Tactile micro-scaling (active:scale-[0.98]) & soft modern curvatures
 * - Magic UI: Ambient depth, subtle luxury borders, and high-visibility contrast
 * - Cross-platform resilience: Semantic data-variant fallbacks for Windows & Mobile viewports
 */
export const buttonVariants = cva(
  "btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-anchor)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 select-none active:scale-[0.98] cursor-pointer touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "btn-primary bg-[var(--brand-anchor)] text-white hover:bg-[var(--brand-accent-deep)] border border-[var(--brand-anchor)] shadow-sm hover:shadow-md",
        primary:
          "btn-primary bg-[var(--brand-anchor)] text-white hover:bg-[var(--brand-accent-deep)] border border-[var(--brand-anchor)] shadow-sm hover:shadow-md",
        secondary:
          "btn-secondary bg-white text-[var(--color-ink)] border border-[var(--color-line-dark)] hover:bg-[var(--color-stone)] hover:border-[var(--brand-anchor)] shadow-xs",
        outline:
          "btn-secondary bg-transparent text-[var(--color-ink)] border border-[var(--color-line-strong)] hover:border-[var(--brand-anchor)] hover:bg-[var(--color-stone)]",
        ghost:
          "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-stone)] hover:text-[var(--brand-anchor)] shadow-none",
        gold:
          "bg-[var(--color-bronze)] text-white hover:bg-[#594226] border border-[var(--color-bronze)] shadow-sm hover:shadow-md",
        accent:
          "btn-primary bg-[var(--brand-anchor)] text-white hover:bg-[var(--brand-accent-deep)] border border-[var(--brand-anchor)] shadow-sm",
        danger:
          "bg-[var(--color-out)] text-white hover:bg-red-700 border border-[var(--color-out)] shadow-sm",
        destructive:
          "bg-[var(--color-out)] text-white hover:bg-red-700 border border-[var(--color-out)] shadow-sm",
      },
      size: {
        default: "h-11 min-h-[2.75rem] px-5 text-xs rounded-lg",
        sm: "h-9 min-h-[2.25rem] px-3.5 text-[11px] rounded-md",
        md: "h-11 min-h-[2.75rem] px-6 text-xs rounded-lg",
        lg: "h-13 min-h-[3.25rem] px-8 text-sm tracking-[0.08em] rounded-lg",
        xl: "h-14 min-h-[3.5rem] px-10 text-sm tracking-[0.14em] rounded-xl font-bold",
        icon: "h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] p-0 rounded-lg",
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
      variant = "primary",
      size = "md",
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
      leadingContent = <Loader2 className="h-3.5 w-3.5 animate-spin text-current" aria-hidden="true" />;
    }

    return (
      <button
        ref={ref}
        disabled={isInteractivityDisabled}
        data-variant={variant ?? "primary"}
        data-size={size ?? "md"}
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
