"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { login, resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { sessionStore } from "@/lib/session";
import { normaliseEmail, safeNextPath, validateLogin, type FieldErrors } from "@/lib/validators";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const normalizedEmail = normaliseEmail(email);
    const errors = validateLogin({ email: normalizedEmail, password });
    
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    
    try {
      const user = await login({ email: normalizedEmail, password });
      sessionStore.setAuthenticated(user);

      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(safeNextPath(next));
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 403 && err.code === "EMAIL_NOT_VERIFIED") {
          setError("Please verify your email address before logging in.");
        } else if (err.errors) {
          setFieldErrors(Object.fromEntries(err.errors.map(({ field, message }) => [field, message])));
        } else {
          setError(err.detail || "Invalid email or password.");
        }
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
      setLoading(false);
    }
  }

  async function handleResend() {
    setVerificationMessage("");
    try {
      await resendVerification(normaliseEmail(email));
      setVerificationMessage("If verification is needed, a new email has been sent.");
    } catch (err: unknown) {
      setVerificationMessage(err instanceof Error ? err.message : "Could not resend verification email.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      {error && (
        <div className="rounded-lg bg-out/10 border border-out/30 p-3.5 text-sm text-out text-center">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
            Email Address
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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-ink uppercase tracking-wider">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-slate hover:text-ink transition-colors font-medium">
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full h-12 rounded-lg border bg-surface px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-loupe/20 transition-all ${
              fieldErrors.password ? "border-out focus:border-out" : "border-line focus:border-ink"
            }`}
            placeholder="Enter your password"
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
          Sign In
        </Button>
      </div>

      {verificationMessage && <p role="status" className="text-center text-sm text-slate">{verificationMessage}</p>}
      <button
        type="button"
        onClick={() => void handleResend()}
        disabled={!email.trim()}
        className="w-full py-1 text-center text-xs font-medium uppercase tracking-wider text-slate hover:text-ink underline underline-offset-4 disabled:opacity-40 disabled:no-underline transition-colors"
      >
        Resend verification email
      </button>

      <div className="text-center text-sm text-slate pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-ink hover:underline">
          Create Account →
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;