
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { login, resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { sessionStore } from "@/lib/session";
import {
  normaliseEmail,
  safeNextPath,
  validateLogin,
  type FieldErrors,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";

const INPUT_CLASS =
  "h-12 w-full min-w-0 rounded-lg border bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-muted transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [verificationFeedback, setVerificationFeedback] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  function clearFieldError(field: "email" | "password") {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setError("");
    setVerificationFeedback(null);
    clearFieldError("email");
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setError("");
    clearFieldError("password");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setFieldErrors({});
    setVerificationFeedback(null);

    const normalizedEmail = normaliseEmail(email);

    const errors = validateLogin({
      email: normalizedEmail,
      password,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const user = await login({
        email: normalizedEmail,
        password,
      });

      sessionStore.setAuthenticated(user);

      const next = new URLSearchParams(window.location.search).get("next");

      router.replace(safeNextPath(next));
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 403 && err.code === "EMAIL_NOT_VERIFIED") {
          setError("Please verify your email address before logging in.");
        } else if (err.errors) {
          setFieldErrors(
            Object.fromEntries(
              err.errors.map(({ field, message }) => [field, message]),
            ),
          );
        } else {
          setError(err.detail || "Invalid email or password.");
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred.",
        );
      }

      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email.trim() || resending || loading) return;

    setVerificationFeedback(null);
    setResending(true);

    try {
      await resendVerification(normaliseEmail(email));

      setVerificationFeedback({
        message: "If verification is needed, a new email has been sent.",
        isError: false,
      });
    } catch (err: unknown) {
      setVerificationFeedback({
        message:
          err instanceof Error
            ? err.message
            : "Could not resend verification email.",
        isError: true,
      });
    } finally {
      setResending(false);
    }
  }

  const emailError = Boolean(fieldErrors.email);
  const passwordError = Boolean(fieldErrors.password);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-w-0 space-y-6"
      aria-busy={loading}
    >
      {/* General error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-out/30 bg-out/10 px-4 py-3.5"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-out" />
          <p className="min-w-0 text-sm leading-5 text-out">{error}</p>
        </div>
      )}

      {/* Credentials */}
      <div className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-xs font-semibold tracking-wide text-ink"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate"
              strokeWidth={1.7}
            />

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              aria-invalid={emailError}
              aria-describedby={emailError ? "login-email-error" : undefined}
              className={`${INPUT_CLASS} ${
                emailError
                  ? "border-out focus:border-out focus:ring-out/10"
                  : "border-line hover:border-slate/60 focus:border-ink focus:ring-ink/10"
              }`}
              placeholder="Enter your registered email"
              required
              disabled={loading}
            />
          </div>

          {fieldErrors.email && (
            <p id="login-email-error" className="mt-1.5 text-xs text-out">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold tracking-wide text-ink"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="shrink-0 text-xs font-medium text-slate transition-colors hover:text-ink hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate"
              strokeWidth={1.7}
            />

            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              aria-invalid={passwordError}
              aria-describedby={
                passwordError ? "login-password-error" : undefined
              }
              className={`h-12 w-full min-w-0 rounded-lg border bg-surface pl-11 pr-12 text-sm text-ink placeholder:text-muted transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                passwordError
                  ? "border-out focus:border-out focus:ring-out/10"
                  : "border-line hover:border-slate/60 focus:border-ink focus:ring-ink/10"
              }`}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded text-slate transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {fieldErrors.password && (
            <p id="login-password-error" className="mt-1.5 text-xs text-out">
              {fieldErrors.password}
            </p>
          )}
        </div>
      </div>

      {/* Sign in */}
      <Button
        type="submit"
        size="lg"
        className="h-13 w-full"
        isLoading={loading}
        disabled={loading}
        rightIcon={
          !loading ? <ArrowRight className="size-4" /> : undefined
        }
      >
        Sign In
      </Button>

      {/* Verification */}
      <section
        aria-label="Email verification"
        className="rounded-xl border border-line bg-stone/40 p-4 sm:p-5"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-slate">
            <Mail className="size-4" strokeWidth={1.7} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-5 text-ink">
              Haven&apos;t verified your email?
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate">
              Request another verification email to activate your account.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={!email.trim() || resending || loading}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-ink transition-colors hover:text-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {resending ? (
            <>
              <span className="size-3 animate-spin rounded-full border-2 border-slate/30 border-t-ink" />
              Sending verification email...
            </>
          ) : (
            <>
              Resend verification email
              <ArrowRight className="size-3.5" />
            </>
          )}
        </button>

        {verificationFeedback && (
          <p
            role={verificationFeedback.isError ? "alert" : "status"}
            aria-live={verificationFeedback.isError ? "assertive" : "polite"}
            className={`mt-3 rounded-lg border px-3 py-2.5 text-xs leading-5 ${
              verificationFeedback.isError
                ? "border-out/30 bg-out/10 text-out"
                : "border-line bg-surface text-slate"
            }`}
          >
            {verificationFeedback.message}
          </p>
        )}
      </section>

      {/* Registration */}
      <div className="border-t border-line pt-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-1 text-sm text-slate">
          <span>Don&apos;t have an account?</span>

          <Link
            href="/register"
            className="whitespace-nowrap font-semibold text-ink underline-offset-4 transition-colors hover:text-slate hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
