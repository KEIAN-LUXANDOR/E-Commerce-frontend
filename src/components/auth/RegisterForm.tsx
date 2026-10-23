"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormAlert, PasswordField, TextField } from "@/components/auth/FormParts";
import { login, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { setSessionUser } from "@/lib/session";
import { normaliseEmail, normalisePhone, validateRegister, type FieldErrors } from "@/lib/validators";

/**
 * POST /auth/register, then logs the new customer straight in (register itself doesn't start a session).
 * 400 shows each field's message next to it; 409 explains the email is already registered.
 */
export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [emailTaken, setEmailTaken] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateRegister(values);
    setErrors(found);
    setFormError(undefined);
    setEmailTaken(false);
    if (Object.keys(found).length) return;

    const email = normaliseEmail(values.email);
    const phone = values.phone.trim() ? normalisePhone(values.phone) : undefined;
    setBusy(true);
    try {
      await register({ fullName: values.fullName.trim(), email, password: values.password, ...(phone ? { phone } : {}) });
    } catch (err) {
      setBusy(false);
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        if (err.status === 409) {
          setEmailTaken(true);
          setErrors({ email: err.message });
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      return;
    }

    // Account created: log in with the same details
    try {
      const user = await login({ email, password: values.password });
      setSessionUser(user);
      // Forget pages loaded while logged out, then go on
      router.refresh();
      router.replace(next);
    } catch {
      router.replace(`/login?created=1&next=${encodeURIComponent(next)}`);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {formError && <FormAlert>{formError}</FormAlert>}
      <TextField label="Full name" name="name" autoComplete="name" value={values.fullName} onChange={set("fullName")} error={errors.fullName} maxLength={100} />
      <div>
        <TextField label="Email" type="email" name="email" autoComplete="email" inputMode="email" value={values.email} onChange={set("email")} error={errors.email} />
        {emailTaken && (
          <p className="mt-1.5 text-sm">
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="link">
              Log in with this email instead
            </Link>
          </p>
        )}
      </div>
      <TextField
        label="Mobile number"
        optional
        hint="For delivery updates. 10 digits, no need for +91."
        type="tel"
        name="phone"
        autoComplete="tel-national"
        inputMode="tel"
        value={values.phone}
        onChange={set("phone")}
        error={errors.phone}
      />
      <PasswordField
        label="Password"
        hint="At least 8 characters."
        name="password"
        autoComplete="new-password"
        value={values.password}
        onChange={set("password")}
        error={errors.password}
      />
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Creating your account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-slate">
        Already have an account?{" "}
        <Link href={next === "/account" ? "/login" : `/login?next=${encodeURIComponent(next)}`} className="link">
          Log in
        </Link>
      </p>
    </form>
  );
}
