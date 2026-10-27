"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { sessionStore } from "@/lib/session";
import { showToast } from "@/lib/stores";
import type { User } from "@/lib/types/auth";

export function ProfileEditor() {
  const router = useRouter();
  const session = sessionStore.useSession();
  const user = session?.user;

  // Safely extract the name field, bypassing the strict AuthUser slim type
  const currentName = user ? ((user as any).name || (user as any).firstName || "") : "";

  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (session.status !== "authenticated" || !user) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Update profile via backend
      const updatedUser = await apiFetch<User>("/account/profile", {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      
      // Update local session state (cast to any to satisfy strict AuthUser type)
      sessionStore.setAuthenticated(updatedUser as any);
      showToast("Profile updated successfully", { tone: "success" });
      router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to update profile.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await sessionStore.logout();
    router.push("/login");
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-lg font-medium text-ink mb-6">Personal Information</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-out/5 border border-out text-out text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={user.email || ""}
            disabled
            className="w-full h-11 border border-line bg-platinum px-4 text-sm text-slate cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-slate">Email cannot be changed.</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
            required
          />
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading || name === currentName}
            className="h-11 flex-1 flex items-center justify-center bg-ink text-white text-xs font-medium uppercase tracking-widest hover:bg-loupe-deep transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="h-11 flex-1 flex items-center justify-center border border-line bg-surface text-ink text-xs font-medium uppercase tracking-widest hover:bg-platinum transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEditor;