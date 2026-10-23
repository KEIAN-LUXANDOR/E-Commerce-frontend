import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { verifyEmail } from "@/lib/api/auth";

export const metadata: Metadata = { title: "Verify Email | Keian Luxandor", robots: { index: false, follow: false } };

type Props = PageProps<"/verify-email">;

function getVerificationRole(verified: boolean, hasToken: boolean): "status" | "alert" {
  if (verified) {
    return "status";
  }
  if (hasToken) {
    return "alert";
  }
  return "status";
}

function getVerificationTextColor(verified: boolean, hasToken: boolean): string {
  if (verified || !hasToken) {
    return "text-[var(--color-slate)]";
  }
  return "text-red-700";
}

export default function VerifyEmailPage({ searchParams }: Props) {
  return (
    <div className="w-full text-center space-y-6">
      <div className="space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-loupe)] block">
          Cryptographic Verification
        </span>
        <h1 className="font-serif text-3xl text-[var(--color-ink)]">Client Identity Verification</h1>
      </div>

      <Suspense fallback={<div className="skeleton mt-5 h-24 rounded" />}>
        <VerifyEmailContent searchParams={searchParams} />
      </Suspense>

      <Link
        href="/login"
        className="btn btn-primary w-full text-xs uppercase tracking-wider py-3 inline-block text-center mt-4"
      >
        Proceed to Client Sign In
      </Link>
    </div>
  );
}

async function VerifyEmailContent({ searchParams }: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const token = Array.isArray(sp.token) ? sp.token[0] : sp.token;
  let message: string;
  let verified = false;

  if (!token) {
    message = "This cryptographic verification token is incomplete or missing. Please request a fresh email link.";
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

  const role = getVerificationRole(verified, Boolean(token));
  const textColor = getVerificationTextColor(verified, Boolean(token));

  return (
    <div
      role={role}
      className={`p-6 border ${
        verified
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-[var(--color-line)] bg-[var(--color-stone)]"
      } space-y-3`}
    >
      {verified ? (
        <CheckCircle2 className="size-8 text-emerald-700 mx-auto" />
      ) : (
        <ShieldAlert className="size-8 text-amber-700 mx-auto" />
      )}
      <p className={`font-sans text-xs ${textColor} leading-relaxed`}>{message}</p>
      {verified && (
        <p className="font-mono text-[10px] text-emerald-800 uppercase tracking-wider">
          Vault Authentication Clearance Granted
        </p>
      )}
    </div>
  );
}
