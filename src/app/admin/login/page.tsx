"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { login } from "@/lib/api/auth";
import { sessionStore } from "@/lib/session";
import { ApiError } from "@/lib/api/client";

function isAdminUser(role?: string | null): boolean {
  if (!role) return false;
  const r = role.toUpperCase();
  return r === "ADMIN" || r === "OWNER";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // V3 strictly requires a single object for the payload
      const user = await login({ email, password });
      
      // Block customers from accessing the admin panel
      if (!isAdminUser(user?.role)) {
        await sessionStore.logout();
        setError("This account is a Customer account. Use the store login instead, or sign in with an Owner / Admin account.");
        setLoading(false);
        return;
      }

      // V3 strict state update
      sessionStore.setAuthenticated(user);
      
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.detail || "Invalid email or password.");
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-platinum p-4">
      <div className="w-full max-w-md bg-surface p-8 border border-line shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center bg-ink text-white mb-4 rounded-full">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-medium text-ink">Luxandor Admin</h1>
          <p className="text-sm text-slate mt-2">Sign in to manage the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-out/10 border border-out text-out text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-4 flex items-center justify-center bg-ink text-white text-xs font-medium uppercase tracking-widest hover:bg-loupe-deep transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}