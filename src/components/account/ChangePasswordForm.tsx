"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/stores";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await apiFetch("/account/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      showToast("Password updated successfully", { tone: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to update password.");
        if (err.errors) {
          const fe: Record<string, string> = {};
          err.errors.forEach((e: any) => { fe[e.field] = e.message; });
          setFieldErrors(fe);
        }
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && <div className="p-3 bg-out/10 text-out text-sm">{error}</div>}
      <div>
        <label className="block text-xs font-medium uppercase mb-1">Current Password</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full h-10 border px-3 text-sm"
        />
        {fieldErrors.currentPassword && <p className="text-xs text-out mt-1">{fieldErrors.currentPassword}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium uppercase mb-1">New Password</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-10 border px-3 text-sm"
        />
        {fieldErrors.newPassword && <p className="text-xs text-out mt-1">{fieldErrors.newPassword}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-ink text-white text-xs uppercase tracking-widest font-medium"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Update Password"}
      </button>
    </form>
  );
}

export default ChangePasswordForm;