"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { register, resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { normaliseEmail, validateRegister, type FieldErrors } from "@/lib/validators";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const normalizedEmail = normaliseEmail(email);
    const validation = validateRegister({ email: normalizedEmail, password, fullName, phone: "" });

    if (!validation.valid) {
      if (typeof validation.errors === "string") {
        setError(validation.errors);
      } else if (validation.errors) {
        setFieldErrors(validation.errors as FieldErrors);
      }
      return;
    }

    setLoading(true);

    try {
      await register({ fullName, email: normalizedEmail, password });
      setRegistered(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const apiErrors: FieldErrors = {};
          err.errors.forEach(({ field, message }) => { apiErrors[field] = message; });
          setFieldErrors(apiErrors);
        } else {
          setError(err.detail || "Registration failed.");
        }
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    setResending(true);
    setError("");
    try {
      await resendVerification(normaliseEmail(email));
      setError("If verification is needed, a new email has been sent.");
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Could not resend verification email.");
    } finally {
      setResending(false);
    }
  }

  if (registered) {
    return (
      <section className="space-y-4 text-center" aria-live="polite">
        <h2 className="font-serif text-2xl">Check your email</h2>
        <p className="text-sm text-slate">We sent a verification link to {email}. Verify your address before signing in.</p>
        {error && <p role="status" className="text-sm text-slate">{error}</p>}
        <button type="button" onClick={() => void handleResendVerification()} disabled={resending} className="btn btn-primary min-h-11 w-full justify-center">
          {resending ? "Sending…" : "Resend verification email"}
        </button>
        <Link href="/login" className="btn btn-secondary min-h-11 w-full justify-center">Back to sign in</Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      {error && (
        <div className="bg-out/5 border border-out p-4 text-sm text-out text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full h-11 border bg-surface px-4 text-sm text-ink focus:outline-none focus:ring-1 transition-colors ${
              fieldErrors.fullName ? "border-out focus:border-out focus:ring-out" : "border-line focus:border-ink focus:ring-ink"
            }`}
            required
          />
          {fieldErrors.fullName && <p className="mt-1 text-xs text-out">{fieldErrors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full h-11 border bg-surface px-4 text-sm text-ink focus:outline-none focus:ring-1 transition-colors ${
              fieldErrors.email ? "border-out focus:border-out focus:ring-out" : "border-line focus:border-ink focus:ring-ink"
            }`}
            required
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-out">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full h-11 border bg-surface px-4 text-sm text-ink focus:outline-none focus:ring-1 transition-colors ${
              fieldErrors.password ? "border-out focus:border-out focus:ring-out" : "border-line focus:border-ink focus:ring-ink"
            }`}
            required
          />
          {fieldErrors.password && <p className="mt-1 text-xs text-out">{fieldErrors.password}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 flex items-center justify-center bg-ink text-white text-xs font-medium uppercase tracking-widest hover:bg-loupe-deep transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
      </button>

      <div className="text-center text-sm text-slate pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;