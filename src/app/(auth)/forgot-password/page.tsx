import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { safeNextPath } from "@/lib/validators";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };

type Props = PageProps<"/forgot-password">;

export default function ForgotPasswordPage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-4xl">Forgot password?</h1>
      <p className="mt-2 text-slate">Enter your account email and we’ll send you a link to reset your password.</p>
      <div className="mt-8">
        <Suspense fallback={<div className="skeleton h-48 rounded" />}>
          <ForgotPasswordContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function ForgotPasswordContent({ searchParams }: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const value = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = safeNextPath(value);

  return (
    <>
      <ForgotPasswordForm />
      <p className="mt-5 text-center text-sm">
        <Link href={`/login${next === "/account" ? "" : `?next=${encodeURIComponent(next)}`}`} className="link">
          Back to log in
        </Link>
      </p>
    </>
  );
}
