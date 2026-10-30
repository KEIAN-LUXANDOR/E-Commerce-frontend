
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(
          err.detail || "Failed to send password reset instructions.",
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="px-6 py-9 text-center sm:px-9 sm:py-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-stone text-ink">
            <CheckCircle2 className="size-8" strokeWidth={1.5} />
          </div>

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate">
            Password recovery
          </p>

          <h2 className="font-serif text-2xl font-medium text-ink">
            Check your email
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate">
            If an account exists for{" "}
            <strong className="break-all font-semibold text-ink">
              {email.trim()}
            </strong>
            , you will receive password reset instructions shortly.
          </p>

          <div className="mt-7 rounded-lg border border-line bg-stone/40 p-4 text-left">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-slate" />
              <p className="text-xs leading-5 text-slate">
                Please check your inbox and spam folder. The reset link may
                take a few moments to arrive.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <Link href="/login">
              <Button variant="secondary" size="md" className="w-full">
                <ArrowLeft className="mr-2 size-4" />
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-line bg-stone/40 px-4 py-3">
          <ShieldCheck className="size-3.5 text-slate" />
          <span className="text-[11px] text-slate">
            Your account security matters to us
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
      >
        <div className="mb-7">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-stone text-ink">
            <Mail className="size-5" strokeWidth={1.6} />
          </div>

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate">
            Account recovery
          </p>

          <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
            Forgot your password?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate">
            No worries. Enter the email address associated with your account
            and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-out/30 bg-out/10 px-4 py-3 text-sm leading-5 text-out"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="forgot-password-email"
            className="mb-2 block text-xs font-semibold text-ink"
          >
            Email Address
          </label>

          <input
            id="forgot-password-email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-lg border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            placeholder="Enter your registered email"
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={loading}
          disabled={loading || !email.trim()}
          className="mt-6 w-full"
          rightIcon={
            !loading ? <ArrowRight className="size-4" /> : undefined
          }
        >
          Send Reset Instructions
        </Button>

        <div className="mt-6 border-t border-line pt-5 text-center">
          <p className="text-sm text-slate">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-ink underline-offset-4 transition-colors hover:text-slate hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>

      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate">
        <ShieldCheck className="size-3.5" />
        Secure password recovery
      </p>
    </div>
  );
}

export default ForgotPasswordForm;
