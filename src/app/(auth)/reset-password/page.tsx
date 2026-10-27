import * as React from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Luxandor",
  description: "Reset your Luxandor account password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-platinum px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 shadow-sm border border-line">
        <div>
          <h2 className="mt-6 text-center text-2xl font-serif tracking-widest text-ink">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-slate">
            Enter your new password below
          </p>
        </div>
        <React.Suspense fallback={<div className="text-center text-sm text-slate">Loading...</div>}>
          <ResetPasswordForm />
        </React.Suspense>
      </div>
    </div>
  );
}