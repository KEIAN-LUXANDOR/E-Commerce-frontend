import { Suspense } from "react";
import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Keian Luxandor",
  description: "Reset your Keian Luxandor account password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page heading */}
      <header className="space-y-3 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl border border-line bg-stone text-slate">
          <KeyRound className="size-5" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Reset Password
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate">
            Choose a new password to securely access your private client
            account.
          </p>
        </div>
      </header>

      {/* Reset form */}
      <Suspense
        fallback={
          <div className="flex h-32 items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-line border-t-ink" />
            <span className="sr-only">Loading reset form...</span>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
