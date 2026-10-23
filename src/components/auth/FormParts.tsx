"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

/** Labelled input with a hint and an error message that screen readers announce with the field. */
export function TextField({ label, hint, error, optional, className, ...input }: FieldProps) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-slate"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-slate">
          {hint}
        </p>
      )}
      <input id={id} {...input} aria-invalid={!!error} aria-describedby={describedBy} className={`field mt-1.5 ${error ? "border-out" : ""}`} />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-out">
          {error}
        </p>
      )}
    </div>
  );
}

/** Password input with a show/hide button. */
export function PasswordField({ label, hint, error, className, ...input }: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-slate">
          {hint}
        </p>
      )}
      <div className="relative mt-1.5">
        <input
          id={id}
          {...input}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`field pr-12 ${error ? "border-out" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate hover:text-ink"
        >
          {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-out">
          {error}
        </p>
      )}
    </div>
  );
}

/** Message box above a form, announced when it appears. */
export function FormAlert({ tone = "error", children }: { tone?: "error" | "info"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-[3px] border px-4 py-3 text-sm ${tone === "error" ? "border-out/40 bg-[#fbf1f1] text-out" : "border-line bg-surface text-ink"}`}
    >
      {children}
    </div>
  );
}
