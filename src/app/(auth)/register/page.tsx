import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { safeNextPath } from "@/lib/validators";

export const metadata: Metadata = { title: "Create Client Account", robots: { index: false, follow: false } };

type Props = PageProps<"/register">;

export default function RegisterPage({ searchParams }: Props) {
  return (
    <div className="w-full">
      <div className="mb-6 space-y-1 text-center">
        <h1 className="font-serif text-3xl text-[var(--color-ink)]">Create Client Account</h1>
        <p className="font-sans text-xs text-[var(--color-slate)]">
          Join our private collector circle for verified GIA/IGI acquisitions, direct atelier pricing, and armoured delivery.
        </p>
      </div>
      <Suspense fallback={<div className="skeleton h-96 rounded" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Form({ searchParams }: Pick<Props, "searchParams">) {
  const sp = await searchParams;
  const next = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  return <RegisterForm next={safeNextPath(next)} />;
}
