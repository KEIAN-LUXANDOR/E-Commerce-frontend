"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { login, resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { sessionStore } from "@/lib/session";
import { normaliseEmail, validateLogin, type FieldErrors } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setNeedsVerification(false);

    const normalizedEmail = normaliseEmail(email);
    const validation = validateLogin({ email: normalizedEmail, password });
    
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
      // V3 strictly requires an object
      const user = await login({ email: normalizedEmail, password });
      
      sessionStore.setAuthenticated(user);

      router.push("/account");
      router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403 && err.code === "EMAIL_NOT_VERIFIED") {
          setNeedsVerification(true);
          setError("Please verify your email address before logging in.");
        } else if (err.errors) {
          const apiErrors: FieldErrors = {};
          err.errors.forEach((e: any) => { apiErrors[e.field] = e.message; });
          setFieldErrors(apiErrors);
        } else {
          setError(err.detail || "Invalid email or password.");
        }
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await resendVerification(normaliseEmail(email));
      setError("Verification email sent! Please check your inbox.");
      setNeedsVerification(false);
    } catch (err: any) {
      setError(err.detail || "Failed to resend verification email.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      {error && (
        <div className="bg-out/5 border border-out p-4 text-sm text-out text-center">
          <p>{error}</p>
          {needsVerification && (
            <button
              type="button"
              onClick={handleResend}
              className="mt-3 font-medium underline hover:opacity-80 transition-opacity"
            >
              Resend verification email
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
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
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-xs font-medium text-ink uppercase tracking-widest">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-slate hover:text-ink transition-colors">
              Forgot?
            </Link>
          </div>
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
  className="w-full h-11 flex items-center justify-center
    bg-blue-800 text-white text-xs font-medium uppercase
    tracking-widest hover:bg-blue-900 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    "Login"
  )}
</button>


      <div className="text-center text-sm text-slate pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-ink hover:underline">
          Create Account
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;