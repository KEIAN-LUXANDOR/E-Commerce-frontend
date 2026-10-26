"use client";

import { useState } from "react";
import { FormAlert, PasswordField } from "@/components/auth/FormParts";
import { ApiError, clearCsrfToken } from "@/lib/api/client";
import { changePassword } from "@/lib/api/profile";

/** POST /account/change-password. You stay logged in; the backend emails a "password changed" notice. */
export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setFieldErrors({});
    setDone(undefined);
    if (next.length < 8 || next.length > 72) {
      setFieldErrors({ newPassword: "Use 8 to 72 characters." });
      return;
    }
    if (next !== confirm) {
      setFieldErrors({ confirm: "The two new passwords don’t match." });
      return;
    }
    setBusy(true);
    try {
      const res = await changePassword({ currentPassword: current, newPassword: next });
      // The session id changes after a password change, so get a fresh CSRF token next time
      clearCsrfToken();
      setDone(res.message);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
      setError(err instanceof Error ? err.message : "Couldn’t change your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="password-heading" className="max-w-2xl">
      <div className="border-b border-line pb-4">
        <h2 id="password-heading" className="text-3xl">
          Password
        </h2>
        <p className="mt-2 text-sm text-slate">Choose a password you don’t use anywhere else.</p>
      </div>
      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        {error && <FormAlert>{error}</FormAlert>}
        {done && <FormAlert tone="info">{done}</FormAlert>}
        <PasswordField label="Current password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} error={fieldErrors.currentPassword} />
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField label="New password" hint="8 to 72 characters" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} error={fieldErrors.newPassword} />
          <PasswordField label="New password again" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={fieldErrors.confirm} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy || !current || !next}>
          {busy ? "Changing…" : "Change password"}
        </button>
      </form>
    </section>
  );
}
