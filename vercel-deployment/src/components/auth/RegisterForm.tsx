"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { register, resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { normaliseEmail, validateRegister, type FieldErrors } from "@/lib/validators";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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
    const errors = validateRegister({
      email: normalizedEmail,
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
    });

    // Check for client-side validation errors
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        phone: phone.trim() ? phone.trim() : undefined,
      });
      setRegistered(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.errors && err.errors.length > 0) {
          const apiErrors: FieldErrors = {};
          err.errors.forEach(({ field, message }) => {
            apiErrors[field] = message;
          });
          setFieldErrors(apiErrors);
        } else {
          setError(
            err.detail ||
            err.title ||
            "Registration failed. An account with this email may already exist."
          );
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
      <section className="space-y-5 text-center" aria-live="polite">
        <div className="rounded-xl border border-ok/30 bg-ok-bg/30 p-6 space-y-3">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-ok text-white">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="font-serif text-2xl text-ink">Check your email</h2>
          <p className="text-sm text-slate leading-relaxed">
            We sent a verification link to <strong className="text-ink font-semibold">{email}</strong>. Please verify your address before signing in.
          </p>
        </div>
        {error && <p role="status" className="text-sm text-slate">{error}</p>}
        <div className="space-y-3 pt-2">
          <Button
            type="button"
            onClick={() => void handleResendVerification()}
            disabled={resending}
            size="lg"
            className="w-full"
            isLoading={resending}
          >
            Resend verification email
          </Button>
          <Link href="/login" className="block w-full">
            <Button variant="secondary" size="lg" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      {error && (
        <div className="rounded-lg bg-out/10 border border-out/30 p-3.5 text-sm text-out text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full h-12 rounded-lg border bg-surface px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-loupe/20 transition-all ${
              fieldErrors.fullName ? "border-out focus:border-out" : "border-line focus:border-ink"
            }`}
            placeholder="e.g. Riya Shah"
            required
          />
          {fieldErrors.fullName && <p className="mt-1 text-xs text-out">{fieldErrors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full h-12 rounded-lg border bg-surface px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-loupe/20 transition-all ${
              fieldErrors.email ? "border-out focus:border-out" : "border-line focus:border-ink"
            }`}
            placeholder="e.g. riya@example.com"
            required
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-out">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
            Mobile Number (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full h-12 rounded-lg border bg-surface px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-loupe/20 transition-all ${
              fieldErrors.phone ? "border-out focus:border-out" : "border-line focus:border-ink"
            }`}
            placeholder="10-digit Indian mobile number"
          />
          {fieldErrors.phone && <p className="mt-1 text-xs text-out">{fieldErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
            Password *
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full h-12 rounded-lg border bg-surface px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-loupe/20 transition-all ${
              fieldErrors.password ? "border-out focus:border-out" : "border-line focus:border-ink"
            }`}
            placeholder="Minimum 8 characters"
            required
          />
          {fieldErrors.password && <p className="mt-1 text-xs text-out">{fieldErrors.password}</p>}
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full h-13 shadow-md"
          isLoading={loading}
          rightIcon={!loading ? <ArrowRight className="size-4" /> : undefined}
        >
          Create Account
        </Button>
      </div>

      <div className="text-center text-sm text-slate pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          Sign In →
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;