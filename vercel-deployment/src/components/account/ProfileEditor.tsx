
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { ApiError } from "@/lib/api/client";
import { updateProfile } from "@/lib/api/profile";
import { resendVerification } from "@/lib/api/auth";
import { sessionStore } from "@/lib/session";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/* Shared UI                                                                  */
/* -------------------------------------------------------------------------- */

function ProfileAvatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="relative grid size-16 shrink-0 place-items-center rounded-2xl border border-line bg-stone text-brand-anchor">
      <span className="font-serif text-2xl font-medium">
        {initials || <UserRound className="size-7" />}
      </span>

      <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-surface bg-brand-anchor text-white">
        <BadgeCheck className="size-3" />
      </span>
    </div>
  );
}

function SectionHeading({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-xs text-slate">{description}</p>
      </div>

      <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-stone text-brand-anchor">
        {icon}
      </div>
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold tracking-wide text-ink"
    >
      {children}
    </label>
  );
}

function SecurityItem({
  icon,
  title,
  description,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-stone text-brand-anchor">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ink">{title}</p>
          {status}
        </div>
        <p className="mt-1 text-[11px] leading-5 text-slate">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile Editor                                                             */
/* -------------------------------------------------------------------------- */

export function ProfileEditor() {
  const router = useRouter();
  const session = sessionStore.useSession();
  const user = session?.user;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  if (user && loadedFor !== user.email) {
    setLoadedFor(user.email);
    setFullName(user.fullName || "");
    setPhone(user.phone || "");
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-4 text-sm text-ink outline-none transition-all placeholder:text-muted hover:border-slate focus:border-brand-anchor focus:ring-2 focus:ring-brand-anchor/10";

  if (session.status === "loading") {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-line bg-surface px-6 py-12 text-slate">
        <Loader2 className="size-5 animate-spin text-brand-anchor" />
        <span className="ml-3 text-sm">Loading your profile...</span>
      </div>
    );
  }

  if (session.status === "unauthenticated" || !user) {
    return (
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface p-6 text-center sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full border border-line/70" />

        <div className="relative mx-auto mb-5 grid size-16 place-items-center rounded-2xl border border-line bg-stone text-brand-anchor">
          <CircleUserRound className="size-7" />
        </div>

        <h2 className="relative font-serif text-2xl font-medium text-ink sm:text-3xl">
          Your account awaits
        </h2>

        <p className="relative mx-auto mt-3 max-w-sm text-sm leading-6 text-slate">
          Sign in to manage your personal details, orders, and diamond
          certificates.
        </p>

        <div className="relative mt-7">
          <Link href="/login?next=%2Faccount" className="inline-block">
            <Button size="lg" className="w-full sm:w-auto">
              Sign In to Your Account
              <ArrowUpRight className="ml-2 size-4" />
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
      showToast("Verification link sent to your email", {
        tone: "success",
      });
    } catch (cause: unknown) {
      showToast(
        cause instanceof ApiError
          ? cause.detail || "Could not resend email"
          : "Could not resend verification email",
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
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred."
        );
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
    <div className="w-full max-w-5xl space-y-6 sm:space-y-7">
      {/* Profile overview */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full border border-line/60" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <ProfileAvatar name={user.fullName || user.email || "User"} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate">
                Personal account
              </p>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-stone px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate">
                <span className="size-1.5 rounded-full bg-brand-accent" />
                Active
              </span>
            </div>

            <h2 className="mt-2 break-words font-serif text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              {user.fullName || "Your Profile"}
            </h2>

            <p className="mt-1 break-all text-sm text-slate">
              {user.email}
            </p>
          </div>

          <div className="hidden shrink-0 border-l border-line pl-7 sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Account status
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-ink">
              <ShieldCheck className="size-4 text-brand-anchor" />
              In good standing
            </p>
          </div>
        </div>
      </section>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.85fr)] lg:gap-6">
        {/* Left column: Profile form */}
        <div className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-2xl border border-line bg-surface">
            <SectionHeading
              title="Personal details"
              description="Manage your contact information"
              icon={<UserRound className="size-4" />}
            />

            <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-7">
              {/* Email */}
              <div className="space-y-2">
                <FieldLabel htmlFor="email">Email address</FieldLabel>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate" />

                  <input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    autoComplete="email"
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-line bg-stone pl-11 pr-20 text-sm text-slate outline-none"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-line bg-surface px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted">
                    Locked
                  </span>
                </div>

                <p className="text-[11px] text-muted">
                  Your account email cannot be changed.
                </p>
              </div>

              {/* Name and phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="name">
                    Full name <span className="text-brand-accent">*</span>
                  </FieldLabel>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate" />

                    <input
                      id="name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="phone">
                    Mobile number{" "}
                    <span className="ml-1 font-normal text-muted">
                      (Optional)
                    </span>
                  </FieldLabel>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate" />

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="e.g. 9876543210"
                      className={inputClass}
                    />
                  </div>

                  <p className="text-[11px] leading-5 text-muted">
                    Used for delivery coordination.
                  </p>
                </div>
              </div>

              {/* Form feedback */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-out/30 bg-out/10 p-4 text-sm text-out"
                >
                  <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                  <p className="min-w-0 break-words">{error}</p>
                </div>
              )}

              {/* Save actions */}
              <div className="flex flex-col-reverse gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="size-4" />}
                  className="w-full sm:w-auto"
                >
                  Sign Out
                </Button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {!isUnchanged && (
                    <span className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-brand-anchor">
                      <span className="size-1.5 rounded-full bg-brand-accent" />
                      Unsaved changes
                    </span>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || isUnchanged}
                    isLoading={loading}
                    className="w-full sm:w-auto"
                  >
                    Save Changes
                    {!loading && <ChevronRight className="ml-1 size-4" />}
                  </Button>
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Right column: Account security */}
        <aside className="min-w-0 space-y-5">
          {/* Verification */}
          <section className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <div className="grid size-9 place-items-center rounded-xl border border-line bg-stone text-brand-anchor">
                <ShieldCheck className="size-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-ink">
                  Account security
                </h3>
                <p className="mt-0.5 text-[11px] text-slate">
                  Verification and protection
                </p>
              </div>
            </div>

            <div className="px-5">
              <SecurityItem
                icon={<Mail className="size-4" />}
                title="Email verification"
                description={
                  user.emailVerified
                    ? "Your email address has been successfully verified."
                    : "Your email address still needs verification."
                }
                status={
                  user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ok">
                      <Check className="size-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="rounded-full border border-low/30 bg-low-tint px-2 py-1 text-[9px] font-semibold text-low">
                      Pending
                    </span>
                  )
                }
              />

              <div className="border-t border-line">
                <SecurityItem
                  icon={<LockKeyhole className="size-4" />}
                  title="Account protection"
                  description="Your account is accessed through your registered sign-in credentials."
                  status={
                    <span className="text-[10px] font-medium text-slate">
                      Enabled
                    </span>
                  }
                />
              </div>

              <div className="border-t border-line">
                <SecurityItem
                  icon={<Phone className="size-4" />}
                  title="Contact information"
                  description={
                    phone.trim()
                      ? "A mobile number is saved to your profile."
                      : "Add a mobile number to help coordinate deliveries."
                  }
                  status={
                    <span className="text-[10px] font-medium text-slate">
                      {phone.trim() ? "Added" : "Optional"}
                    </span>
                  }
                />
              </div>
            </div>

            {!user.emailVerified && (
              <div className="border-t border-line bg-low-tint/60 p-5">
                <div className="flex items-start gap-2.5">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-low" />
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      Verification required
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate">
                      Verify your email to access ordering and high-resolution
                      diamond certificates.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void handleResendVerification()}
                  disabled={resending}
                  isLoading={resending}
                  leftIcon={
                    !resending ? <Mail className="size-3.5" /> : undefined
                  }
                  className="mt-4 w-full"
                >
                  Resend Verification Email
                </Button>
              </div>
            )}

            {user.emailVerified && (
              <div className="border-t border-line bg-ok-bg/30 px-5 py-3">
                <p className="flex items-center gap-2 text-[11px] font-medium text-ok">
                  <BadgeCheck className="size-4" />
                  Your email verification is complete.
                </p>
              </div>
            )}
          </section>

          {/* Account information */}
          <section className="relative overflow-hidden rounded-2xl border border-line bg-stone/50 p-5">
            <div className="pointer-events-none absolute -bottom-16 -right-14 size-40 rounded-full border border-line/70" />

            <div className="relative">
              <div className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-brand-anchor">
                <ShieldCheck className="size-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-ink">
                Your details, protected.
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate">
                Your contact information helps us manage your orders and
                coordinate secure delivery. Keep your details up to date for a
                smoother experience.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ProfileEditor;
