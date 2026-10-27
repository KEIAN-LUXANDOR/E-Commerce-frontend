"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/stores";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Passes both required arguments (token and newPassword)
      await resetPassword(token, password);
      showToast("Password reset successfully", { tone: "success" });
      router.push("/login");
    } catch (err: any) {
      setError(err instanceof ApiError ? (err.detail || "Failed to reset password") : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      {error && <div className="p-3 bg-out/10 text-out text-sm text-center">{error}</div>}
      <div>
        <label className="block text-xs font-medium uppercase tracking-widest mb-2">New Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-11 border bg-surface px-4 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-ink text-white text-xs uppercase tracking-widest"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Reset Password"}
      </button>
    </form>
  );
}

export default ResetPasswordForm;