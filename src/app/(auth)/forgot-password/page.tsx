
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { safeNextPath } from "@/lib/validators";

export const metadata: Metadata = {
  title: "Forgot Password | Keian Luxandor",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = PageProps<"/forgot-password">;

export default function ForgotPasswordPage({ searchParams }: Props) {
  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page heading */}
      <header className="space-y-3 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl border border-line bg-stone text-slate">
          <KeyRound className="size-5" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Forgot password?
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate">
            Enter your registered email address and we&apos;ll send you a secure
            link to reset your password.
          </p>
        </div>
      </header>

      {/* Reset form */}
      <Suspense
        fallback={
          <div
            className="h-48 animate-pulse rounded-xl border border-line bg-stone/40"
            aria-label="Loading password reset form"
          />
        }
      >
        <ForgotPasswordContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ForgotPasswordContent({
  searchParams,
}: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const value = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = safeNextPath(value);

  const loginHref =
    next === "/account"
      ? "/login"
      : `/login?next=${encodeURIComponent(next)}`;

  return (
    <div className="space-y-5">
      <ForgotPasswordForm />

      <div className="border-t border-line pt-5 text-center">
        <Link
          href={loginHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
