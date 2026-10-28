"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { updateProfile } from "@/lib/api/profile";
import { sessionStore } from "@/lib/session";
import { showToast } from "@/lib/stores";

export function ProfileEditor() {
  const router = useRouter();
  const session = sessionStore.useSession();
  const user = session?.user;

  const currentName = user?.fullName ?? "";
  const [editedName, setEditedName] = useState<string | null>(null);
  const name = editedName ?? currentName;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (session.status !== "authenticated" || !user) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setLoading(true);

    try {
      const updatedUser = await updateProfile({ fullName: name.trim(), phone: user.phone });
      sessionStore.setAuthenticated(updatedUser);
      setEditedName(updatedUser.fullName);
      showToast("Profile updated successfully", { tone: "success" });
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to update profile.");
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
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
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
            required
          />
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading || name.trim() === currentName}
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