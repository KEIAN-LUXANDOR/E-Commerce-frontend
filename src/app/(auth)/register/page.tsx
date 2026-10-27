import * as React from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Luxandor",
  description: "Create a new Luxandor account.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-platinum px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 shadow-sm border border-line">
        <div>
          <h2 className="mt-6 text-center text-2xl font-serif tracking-widest text-ink">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate">
            Join Luxandor for exclusive collections
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}