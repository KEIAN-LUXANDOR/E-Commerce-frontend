
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { ApiError } from "@/lib/api/client";
import { verifyEmail } from "@/lib/api/auth";

export const metadata: Metadata = {
  title: "Verify Email | Keian Luxandor",
  robots: { index: false, follow: false },
};

type Props = PageProps<"/verify-email">;

export default function VerifyEmailPage({ searchParams }: Props) {
  return (
    <div className="w-full min-w-0 space-y-7 text-center">
      <header className="space-y-3">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-stone px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
          <ShieldCheck className="size-3.5 text-loupe" />
          Account Security
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Verify Your Email
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate">
            Confirm your email address to activate your private client account
            and access your account services.
          </p>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="space-y-3 rounded-xl border border-line bg-stone/50 px-5 py-8">
            <div className="skeleton mx-auto size-9 rounded-full" />
            <div className="skeleton mx-auto h-3 w-3/4 rounded" />
            <div className="skeleton mx-auto h-2.5 w-1/2 rounded" />
          </div>
        }
      >
        <VerifyEmailContent searchParams={searchParams} />
      </Suspense>

      <div className="space-y-4">
        <Link
          href="/login"
          className="btn btn-primary group inline-flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
        >
          Proceed to Sign In
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <p className="text-xs leading-5 text-muted">
          Need another verification link?{" "}
          <Link
            href="/register"
            className="font-medium text-loupe underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Return to registration
          </Link>
        </p>
      </div>
    </div>
  );
}

async function VerifyEmailContent({
  searchParams,
}: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const token = Array.isArray(sp.token) ? sp.token[0] : sp.token;

  let message: string;
  let verified = false;

  if (!token) {
    message =
      "The verification link is incomplete or missing. Please request a fresh verification email and try again.";
  } else {
    try {
      const response = await verifyEmail(token);
      message = response.message;
      verified = true;
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
      message = error.message;
    }
  }

  return (
    <div
      role={verified ? "status" : "alert"}
      aria-live={verified ? "polite" : "assertive"}
      className={`space-y-4 rounded-xl border px-5 py-6 sm:px-6 ${
        verified
          ? "border-ok/25 bg-ok-bg"
          : "border-out/20 bg-out-bg"
      }`}
    >
      <div
        className={`mx-auto flex size-12 items-center justify-center rounded-full ${
          verified ? "bg-ok/10" : "bg-out/10"
        }`}
      >
        {verified ? (
          <CheckCircle2 className="size-6 text-ok" />
        ) : (
          <ShieldAlert className="size-6 text-out" />
        )}
      </div>

      <div className="space-y-2">
        <h2
          className={`font-serif text-xl font-medium tracking-tight ${
            verified ? "text-ink" : "text-out"
          }`}
        >
          {verified ? "Email Successfully Verified" : "Verification Required"}
        </h2>

        <p className="mx-auto max-w-sm text-sm leading-6 text-slate">
          {message}
        </p>
      </div>

      {verified && (
        <div className="border-t border-ok/15 pt-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ok">
            Client Account Authentication Confirmed
          </p>
        </div>
      )}
    </div>
  );
}
