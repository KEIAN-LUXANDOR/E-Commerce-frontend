"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormAlert, PasswordField, TextField } from "@/components/auth/FormParts";
import { login, logout } from "@/lib/api/auth";
import { setSessionUser } from "@/lib/session";

/** Logs in with the normal account endpoint, then only lets ADMIN accounts in. */
export function AdminLoginForm({ next, denied }: { next: string; denied: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(denied ? "That account doesn’t have admin access." : undefined);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      const user = await login({ email: email.trim(), password });
      if (user.role !== "ADMIN") {
        await logout().catch(() => undefined);
        setSessionUser(null);
        setError("That account doesn’t have admin access.");
        setBusy(false);
        return;
      }
      setSessionUser(user);
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t log in.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <TextField label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordField label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="btn btn-primary w-full" disabled={busy || !email || !password}>
        {busy ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
