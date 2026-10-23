import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/validators";

export const metadata: Metadata = { title: "Client Login", robots: { index: false, follow: false } };

type Props = PageProps<"/login">;

export default function LoginPage({ searchParams }: Props) {
  return (
    <div className="w-full">
      <div className="mb-6 space-y-1 text-center">
        <h1 className="font-serif text-3xl text-[var(--color-ink)]">Client Authentication</h1>
        <p className="font-sans text-xs text-[var(--color-slate)]">
          Sign in to access your private diamond vault, order dossiers, and lab reports.
        </p>
      </div>
      <Suspense fallback={<div className="skeleton h-64 rounded" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Form({ searchParams }: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return (
    <LoginForm
      next={safeNextPath(first(sp.next))}
      notice={first(sp.created) ? "Your account is ready. Log in to continue." : undefined}
    />
  );
}
