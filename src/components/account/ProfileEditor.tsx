"use client";

import {  useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut, Mail, ShieldAlert, CheckCircle2, UserRound } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { updateProfile } from "@/lib/api/profile";
import { resendVerification } from "@/lib/api/auth";
import { sessionStore } from "@/lib/session";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";

export function ProfileEditor() {
  const router = useRouter();
  const session = sessionStore.useSession();
  const user = session?.user;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  // Copy the logged-in user's details into the form once per user (derived state, no effect needed)
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  if (user && loadedFor !== user.email) {
    setLoadedFor(user.email);
    setFullName(user.fullName || "");
    setPhone(user.phone || "");
  }

  if (session.status === "loading") {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-line bg-surface p-12 text-slate shadow-xs">
        <Loader2 className="size-6 animate-spin text-ink" aria-hidden="true" />
        <span className="ml-3 text-sm">Loading your profile…</span>
      </div>
    );
  }

  if (session.status === "unauthenticated" || !user) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12 text-center shadow-xs space-y-4 max-w-lg">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-stone border border-line">
          <UserRound className="size-6 text-slate" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-ink">Sign in to view your profile</h2>
        <p className="text-sm text-slate leading-relaxed">
          Please log in to manage your contact details, orders, and diamond certificates.
        </p>
        <div className="pt-2">
          <Link href="/login?next=%2Faccount">
            <Button size="lg" className="w-full sm:w-auto">
              Sign In to Your Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  async function handleResendVerification() {
    if (!user?.email) return;
    setResending(true);
    try {
      await resendVerification(user.email);
      showToast("Verification link sent to your email", { tone: "success" });
    } catch (cause: unknown) {
      showToast(
        cause instanceof ApiError ? cause.detail || "Could not resend email" : "Could not resend verification email",
        { tone: "error" }
      );
    } finally {
      setResending(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setLoading(true);

    try {
      const updatedUser = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() ? phone.trim() : null,
      });
      sessionStore.setAuthenticated(updatedUser);
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

  const isUnchanged =
    fullName.trim() === (user.fullName || "") &&
    phone.trim() === (user.phone || "");

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* Email verification status banner */}
      {!user.emailVerified ? (
        <div className="rounded-2xl border border-low/40 bg-low-tint p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="size-5 text-low shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-medium text-ink text-sm">Email Verification Pending</h3>
              <p className="mt-1 text-xs text-slate leading-relaxed">
                We sent a verification link to <strong className="text-ink font-semibold">{user.email}</strong>.
                Email verification is required before placing orders or downloading high-resolution diamond certificates.
              </p>
            </div>
          </div>
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void handleResendVerification()}
              disabled={resending}
              isLoading={resending}
              leftIcon={!resending ? <Mail className="size-3.5" /> : undefined}
            >
              Resend Verification Email
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-ok/30 bg-ok-bg/40 px-4 py-3 flex items-center gap-2.5 text-xs text-ok font-medium">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Email Verified · Vault Access Authorized</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-out/10 border border-out/30 p-4 text-out text-sm text-center">
          {error}
        </div>
      )}

      {/* Profile Form */}
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate font-mono mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="w-full h-12 rounded-lg border border-line bg-stone px-4 text-sm font-mono text-slate cursor-not-allowed"
            />
            <p className="mt-1 text-[11px] text-muted">Account email cannot be modified.</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5 font-mono">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5 font-mono">
              Mobile Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full h-12 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
            />
            <p className="mt-1 text-[11px] text-muted">Used by the courier to arrange delivery.</p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={loading || isUnchanged}
              isLoading={loading}
              className="flex-1 shadow-md"
            >
              Save Changes
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleLogout}
              leftIcon={<LogOut className="size-4" />}
              className="flex-1"
            >
              Sign Out
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEditor;