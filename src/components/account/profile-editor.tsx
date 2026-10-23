"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { FormAlert, TextField } from "@/components/auth/FormParts";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";
import { logout } from "@/lib/api/auth";
import { setSessionUser, useSession } from "@/lib/session";
import type { User } from "@/lib/types/auth";

export function ProfileEditor() {
  const session = useSession();
  const user = session.status === "user" ? session.user : null;

  if (!user) {
    return (
      <div aria-busy="true" className="space-y-4">
        <div className="skeleton h-7 w-44 rounded" />
        <div className="skeleton h-48 rounded" />
      </div>
    );
  }

  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [fullName, setFullName] = React.useState(user.fullName);
  const [phone, setPhone] = React.useState(user.phone ?? "");
  const [error, setError] = React.useState<string>();
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [saved, setSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const hasChanges =
    fullName.trim() !== user.fullName || phone.trim() !== (user.phone ?? "");

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setFieldErrors({});
    setSaved(false);
    setIsSaving(true);

    try {
      const updatedUser = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || null,
      });
      setSessionUser(updatedUser);
      setFullName(updatedUser.fullName);
      setPhone(updatedUser.phone ?? "");
      setSaved(true);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
        setFieldErrors(cause.fieldErrors);
      } else {
        setError("We couldn’t save your details. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    setError(undefined);
    setIsLoggingOut(true);
    try {
      await logout();
      setSessionUser(null);
      router.replace("/");
      router.refresh();
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setSessionUser(null);
        router.replace("/");
        router.refresh();
        return;
      }
      setError(
        cause instanceof ApiError
          ? cause.message
          : "We couldn’t sign you out. Please try again.",
      );
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSave} className="space-y-6">
        <section aria-labelledby="profile-heading" className="space-y-6">
          <div className="border-b border-line pb-4">
            <h2 id="profile-heading" className="font-serif text-3xl font-normal text-ink">
              Personal details
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Keep your name and phone number up to date for delivery.
            </p>
          </div>

          {error && <FormAlert>{error}</FormAlert>}

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Full name"
              autoComplete="name"
              maxLength={100}
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setSaved(false);
                setError(undefined);
                setFieldErrors((current) => {
                  const next = { ...current };
                  delete next.fullName;
                  return next;
                });
              }}
              error={fieldErrors.fullName}
              required
            />
            <TextField
              label="Email address"
              type="email"
              autoComplete="email"
              value={user.email}
              readOnly
              hint="Email changes aren’t available here."
            />
            <TextField
              label="Phone number"
              type="tel"
              autoComplete="tel-national"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                setSaved(false);
                setError(undefined);
                setFieldErrors((current) => {
                  const next = { ...current };
                  delete next.phone;
                  return next;
                });
              }}
              error={fieldErrors.phone}
              hint="Optional. Enter a 10-digit Indian mobile number."
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
            <Button type="submit" disabled={!hasChanges} isLoading={isSaving}>
              Save changes
            </Button>
            {saved && (
              <p role="status" className="text-sm text-emerald-800">
                Your details have been saved.
              </p>
            )}
          </div>
        </section>
      </form>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="text-sm text-slate">Signed in as {user.email}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoggingOut}
          isLoading={isLoggingOut}
          leftIcon={!isLoggingOut ? <LogOut className="size-3.5" aria-hidden /> : undefined}
          onClick={() => void handleLogout()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
