"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";

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
      await resetPassword(token, password);
      showToast("Password reset successfully", { tone: "success" });
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof ApiError ? (err.detail || "Failed to reset password") : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
      {error && (
        <div className="p-3.5 rounded-lg bg-out/10 border border-out/30 text-out text-sm text-center">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="resetpasswordform-f1" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
          New Password
        </label>
        <input id="resetpasswordform-f1"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 rounded-lg border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none transition-colors"
          placeholder="Minimum 8 characters"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        isLoading={loading}
        className="w-full shadow-md"
        rightIcon={!loading ? <ArrowRight className="size-4" /> : undefined}
      >
        Reset Password
      </Button>
    </form>
  );
}

export default ResetPasswordForm;