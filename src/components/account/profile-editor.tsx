"use client";

/**
 * Customer Profile Editor
 *
 * Manages customer account details, contact credentials, and concierge preferences:
 *   - Legal name & registered email
 *   - Phone with country code (+91 default)
 *   - SMS/WhatsApp real-time dispatch alerts toggle
 *   - Insured delivery verification method
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Accessible forms with clear error handling.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Phone, Bell, Save, LogOut } from "lucide-react";
import { useSession, setSessionUser } from "@/lib/session";
import { logout } from "@/lib/api/auth";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileEditor() {
  const router = useRouter();
  const session = useSession();

  const user = session.status === "user" ? session.user : null;

  const [fullName, setFullName] = React.useState(user ? user.fullName : "Aarav Mehta");
  const [email, setEmail] = React.useState(user ? user.email : "aarav.mehta@example.com");
  const [phone, setPhone] = React.useState(user && user.phone ? user.phone : "+91 98765 43210");
  const [whatsappAlerts, setWhatsappAlerts] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // Sync state if session updates
  React.useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    // Simulate saving profile preferences
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    setSavedSuccess(true);
    showToast("Profile preferences updated successfully.");
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // ignore
    }
    setSessionUser(null);
    showToast("You have been signed out of your account.");
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Primary Details Box */}
      <div className="border border-[var(--color-line)] bg-white p-6 md:p-8 space-y-6">
        <div className="border-b border-[var(--color-line)] pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-[var(--color-ink)]">Personal Dossier</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)] mt-1">
              Legal identity used for customs declarations & transit insurance
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-stone)] border border-[var(--color-line)]">
            <ShieldCheck className="size-3.5 text-emerald-700" />
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-emerald-800">
              KYC Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-slate)] block">
              Full Legal Name
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-slate)] block">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted)]" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-slate)] block">
              Verified Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted)]" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="pl-10 font-mono text-xs"
              />
            </div>
            <p className="font-mono text-[9px] text-[var(--color-muted)]">
              Used for armed delivery OTP handoff verification
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-slate)] block">
              Customer Tier
            </label>
            <div className="h-12 px-3.5 border border-[var(--color-line)] bg-[var(--color-stone)] flex items-center">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)]">
                Private Collector &bull; Atelier Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Security Preferences */}
      <div className="border border-[var(--color-line)] bg-white p-6 md:p-8 space-y-5">
        <div className="border-b border-[var(--color-line)] pb-3">
          <h3 className="font-serif text-lg text-[var(--color-ink)]">Logistics & Escort Alerts</h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)] mt-0.5">
            Choose how you receive transit milestone tracking updates
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="mt-1 size-4 rounded-none accent-[var(--color-ink)]"
            />
            <div>
              <p className="font-sans text-xs font-medium text-[var(--color-ink)]">
                Real-Time WhatsApp Armoured Transit Dispatch
              </p>
              <p className="font-mono text-[10px] text-[var(--color-slate)] mt-0.5">
                Receive live GPS departure times, tamper seal verification photographs, and arrival OTP direct to your WhatsApp.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 size-4 rounded-none accent-[var(--color-ink)]"
            />
            <div>
              <p className="font-sans text-xs font-medium text-[var(--color-ink)]">
                Email Dossier & Certificate Archives
              </p>
              <p className="font-mono text-[10px] text-[var(--color-slate)] mt-0.5">
                PDF copy of laboratory grading report and digital invoice sent immediately upon checkout.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div>
          {savedSuccess && (
            <p className="font-mono text-xs text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="size-4" /> Profile dossier saved successfully.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--color-slate)] hover:text-red-700 hover:border-red-300"
          >
            <LogOut className="size-3.5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
