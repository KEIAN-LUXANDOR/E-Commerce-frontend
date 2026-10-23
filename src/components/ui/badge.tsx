import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Luxury Badge component for gemological grades and inventory status.
 * Subtle, soft curvature and clear, human-readable variants.
 */
export const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.04em] uppercase transition-colors select-none rounded-full",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-stone)] text-[var(--color-ink)] border border-[var(--color-line)]",
        secondary:
          "bg-[var(--color-stone-deep)] text-[var(--color-ink)] border-transparent",
        outline:
          "bg-transparent text-[var(--color-ink)] border border-[var(--color-line-dark)]",
        stone:
          "bg-[var(--color-stone-deep)] text-[var(--color-ink)] border-transparent",
        ok:
          "bg-[var(--color-ok-bg)] text-[var(--color-ok)] border border-[var(--color-ok)]/20",
        success:
          "bg-[var(--color-ok-bg)] text-[var(--color-ok)] border border-[var(--color-ok)]/20",
        warn:
          "bg-[var(--color-low-bg)] text-[var(--color-low)] border border-[var(--color-low)]/20",
        error:
          "bg-[var(--color-out-bg)] text-[var(--color-out)] border border-[var(--color-out)]/20",
        destructive:
          "bg-[var(--color-out-bg)] text-[var(--color-out)] border border-[var(--color-out)]/20",
        cert:
          "bg-white text-[var(--color-loupe)] border border-[var(--color-loupe)]/30 font-semibold shadow-2xs",
        gold:
          "border border-[var(--brand-accent)] bg-[var(--brand-accent)]/10 text-[var(--color-ink)] font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional bullet dot indicator */
  withDot?: boolean;
}

export function Badge({
  className,
  variant,
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  let dotColorClass = "bg-[var(--color-ink)]";

  if (variant === "ok" || variant === "success") {
    dotColorClass = "bg-[var(--color-ok)]";
  } else if (variant === "warn") {
    dotColorClass = "bg-[var(--color-low)]";
  } else if (variant === "error" || variant === "destructive") {
    dotColorClass = "bg-[var(--color-out)]";
  } else if (variant === "cert") {
    dotColorClass = "bg-[var(--color-loupe)]";
  } else if (variant === "gold") {
    dotColorClass = "bg-[var(--brand-accent)]";
  }

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {withDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full mr-0.5 shrink-0", dotColorClass)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
