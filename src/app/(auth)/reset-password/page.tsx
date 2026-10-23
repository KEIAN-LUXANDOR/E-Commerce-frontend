import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

type Props = PageProps<"/reset-password">;

export default function ResetPasswordPage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-4xl">Reset your password</h1>
      <p className="mt-2 text-slate">Choose a new password for your account.</p>
      <div className="mt-8">
        <Suspense fallback={<div className="skeleton h-48 rounded" />}>
          <ResetPasswordContent searchParams={searchParams} />
        </Suspense>
      </div>
      <p className="mt-5 text-center text-sm">
        <Link href="/login" className="link">Back to log in</Link>
      </p>
    </div>
  );
}

async function ResetPasswordContent({ searchParams }: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const token = Array.isArray(sp.token) ? sp.token[0] : sp.token;

  if (!token) {
    return <FormAlertMissingToken />;
  }

  return <ResetPasswordForm token={token} />;
}

function FormAlertMissingToken() {
  return <p role="alert" className="text-sm text-out">This reset link is incomplete. Request a new password reset link.</p>;
}
