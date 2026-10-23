import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label displayed above the input field */
  label?: string;
  /** Helper hint displayed below the input field */
  helperText?: string;
  /** Error message displayed below the input field when invalid */
  error?: string;
  /** Optional element rendered on the right inside the input (e.g. eye toggle, currency symbol) */
  rightAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      id,
      rightAdornment,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique input ID for accessibility linkage if not provided
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);

    // Compute description ID for aria-describedby
    let describedBy: string | undefined;
    if (hasError) {
      describedBy = errorId;
    } else if (helperText) {
      describedBy = helperId;
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-[0.06em] text-[var(--color-ink)]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={describedBy}
            className={cn(
              "h-12 w-full rounded-[3px] border bg-white px-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-colors",
              "focus:outline-none focus:ring-1 focus:ring-[var(--color-loupe)] focus:border-[var(--color-loupe)]",
              "disabled:cursor-not-allowed disabled:bg-[var(--color-stone)] disabled:opacity-60",
              hasError
                ? "border-[var(--color-out)] focus:border-[var(--color-out)] focus:ring-[var(--color-out)]"
                : "border-[var(--color-line)] hover:border-[var(--color-line-dark)]",
              rightAdornment && "pr-10",
              className
            )}
            {...props}
          />

          {rightAdornment && (
            <div className="absolute right-3 flex items-center text-[var(--color-slate)]">
              {rightAdornment}
            </div>
          )}
        </div>

        {hasError && (
          <p id={errorId} className="text-xs text-[var(--color-out)]" role="alert">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-[var(--color-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
