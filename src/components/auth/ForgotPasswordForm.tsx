"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to send password reset instructions.");
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-4 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-serif font-medium text-ink">Check your email</h2>
        <p className="text-sm text-slate">
          If an account exists for <strong className="text-ink font-semibold">{email}</strong>, you will receive password reset instructions.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button variant="secondary" size="md">
              Return to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
      {error && (
        <div className="rounded-lg bg-out/10 border border-out/30 p-3.5 text-sm text-out text-center">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 rounded-lg border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none transition-colors"
          placeholder="e.g. riya@example.com"
          required
        />
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={loading}
        className="w-full shadow-md"
        rightIcon={!loading ? <ArrowRight className="size-4" /> : undefined}
      >
        Send Reset Instructions
      </Button>

      <div className="text-center text-sm text-slate">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          Sign In →
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;