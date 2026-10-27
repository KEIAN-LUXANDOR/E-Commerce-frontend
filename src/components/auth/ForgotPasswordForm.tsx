"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api/client";

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
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to send password reset instructions.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-4">
        <h2 className="text-xl font-medium text-ink">Check your email</h2>
        <p className="text-sm text-slate">
          If an account exists for {email}, you will receive password reset instructions.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 text-xs font-medium uppercase tracking-widest text-ink hover:underline"
        >
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      {error && (
        <div className="bg-out/5 border border-out p-4 text-sm text-out text-center">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 flex items-center justify-center bg-ink text-white text-xs font-medium uppercase tracking-widest hover:bg-loupe-deep transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Instructions"}
      </button>

      <div className="text-center text-sm text-slate">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-ink hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;