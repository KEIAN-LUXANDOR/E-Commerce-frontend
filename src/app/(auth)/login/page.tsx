import * as React from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Luxandor",
  description: "Sign in to your Luxandor account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-platinum px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 shadow-sm border border-line">
        <div>
          <h2 className="mt-6 text-center text-2xl font-serif tracking-widest text-ink">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-slate">
            Welcome back to Luxandor
          </p>
        </div>
        {/* Removed the incompatible next and notice props */}
        <LoginForm />
      </div>
    </div>
  );
}