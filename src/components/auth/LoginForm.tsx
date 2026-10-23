"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormAlert, PasswordField, TextField } from "@/components/auth/FormParts";
import { login, resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { setSessionUser } from "@/lib/session";
import { normaliseEmail, validateLogin, type FieldErrors } from "@/lib/validators";

/**
 * POST /auth/login. Shows the backend's message for a wrong password (401)
 * and for the 15-minute lock after 5 wrong attempts (429).
 */
export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>();
  const [resendError, setResendError] = useState<string>();

  async function onResendVerification() {
    const normalizedEmail = normaliseEmail(email);
    if (!normalizedEmail) {
      setResendError("Enter your email address first.");
      setResendMessage(undefined);
      return;
    }

    setResendBusy(true);
    setResendError(undefined);
    setResendMessage(undefined);
    try {
      const response = await resendVerification(normalizedEmail);
      setResendMessage(response.message);
    } catch (err) {
      setResendError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setResendBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateLogin({ email, password });
    setErrors(found);
    setFormError(undefined);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      const user = await login({ email: normaliseEmail(email), password });
      setSessionUser(user);
      // Forget pages loaded while logged out, then go on
      router.refresh();
      router.replace(next);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        setFormError(err.message);
        // Clear the password after a failed attempt, as most sites do
        if (err.status === 401) setPassword("");
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {notice && !formError && <FormAlert tone="info">{notice}</FormAlert>}
      {formError && <FormAlert>{formError}</FormAlert>}
      {resendMessage && <FormAlert tone="info">{resendMessage}</FormAlert>}
      {resendError && <FormAlert>{resendError}</FormAlert>}
      <TextField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <p className="-mt-3 text-right text-sm">
        <Link href={`/forgot-password${next === "/account" ? "" : `?next=${encodeURIComponent(next)}`}`} className="link">
          Forgot password?
        </Link>
      </p>
      <button type="button" className="btn btn-secondary w-full" onClick={onResendVerification} disabled={resendBusy}>
        {resendBusy ? "Sending…" : "Resend verification email"}
      </button>
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-slate">
        New here?{" "}
        <Link href={next === "/account" ? "/register" : `/register?next=${encodeURIComponent(next)}`} className="link">
          Create an account
        </Link>
      </p>
    </form>
  );
}
