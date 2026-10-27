"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { sessionStore } from "@/lib/session";
import { ApiError } from "@/lib/api/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password });
      const role = user?.role?.toUpperCase();
      if (role !== "ADMIN" && role !== "OWNER") {
        setError("Unauthorized role for admin portal.");
        setLoading(false);
        return;
      }
      sessionStore.setAuthenticated(user);
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err instanceof ApiError ? (err.detail || "Login failed") : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 bg-surface border">
      <h2 className="text-xl font-medium text-ink">Admin Sign In</h2>
      {error && <div className="text-out text-sm">{error}</div>}
      <div>
        <label className="block text-xs uppercase mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 border px-3 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs uppercase sm:mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 border px-3 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-ink text-white text-xs uppercase tracking-widest"
      >
        Sign In
      </button>
    </form>
  );
}

export default AdminLoginForm;