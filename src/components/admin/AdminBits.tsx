"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PlugZap } from "lucide-react";
import { FeatureOffError, isEnabled, type Feature } from "@/config/features";
import { cn } from "@/lib/utils";

/** Page title with an optional action on the right. */
export function AdminHeader({ title, description, action, back }: { title: string; description?: string; action?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="text-sm text-slate hover:text-ink hover:underline">
            ← {back.label}
          </Link>
        )}
        <h1 className="mt-1 text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * Shown on a screen whose backend endpoint isn't built yet. The screen itself is finished;
 * switching the feature on in src/config/features.ts makes it live.
 */
export function NotConnected({ feature, endpoints, children }: { feature: Feature; endpoints: string[]; children?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line-dark bg-white p-6">
      <p className="flex items-center gap-2 font-serif text-2xl">
        <PlugZap className="size-5 text-accent-deep" aria-hidden /> Waiting for the backend
      </p>
      <p className="mt-2 max-w-2xl text-sm text-slate">
        This screen is ready. It will show live data once these endpoints are built (see <code className="bg-stone px-1">docs/API-ENDPOINTS.md</code>) and the{" "}
        <code className="bg-stone px-1">{feature}</code> switch in <code className="bg-stone px-1">src/config/features.ts</code> is turned on.
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {endpoints.map((e) => (
          <li key={e}>
            <code className="bg-stone px-1.5 py-0.5">{e}</code>
          </li>
        ))}
      </ul>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export interface AdminQuery<T> {
  data: T | undefined;
  error: string | undefined;
  loading: boolean;
  off: boolean;
  reload: () => void;
}

/** Loads data for an admin screen, unless its feature is switched off. */
export function useAdminQuery<T>(feature: Feature, load: () => Promise<T>, deps: unknown[]): AdminQuery<T> {
  const off = !isEnabled(feature);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(!off);
  const [tick, setTick] = useState(0);
  // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps -- dependencies are supplied by each query caller
  const run = useCallback(load, deps);

  useEffect(() => {
    if (off) return;
    let active = true;
    run()
      .then((d) => {
        if (!active) return;
        setData(d);
        setError(undefined);
      })
      .catch((e: unknown) => {
        if (!active || e instanceof FeatureOffError) return;
        setError(e instanceof Error ? e.message : "Couldn’t load this.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [off, run, tick]);

  return { data, error, loading, off, reload: () => setTick((t) => t + 1) };
}

export function StatCard({ label, value, note, href }: { label: string; value: string; note?: string; href?: string }) {
  const body = (
    <>
      <p className="text-xs uppercase tracking-[0.1em] text-slate">{label}</p>
      <p className="mt-2 font-serif text-3xl tabular-nums">{value}</p>
      {note && <p className="mt-1 text-sm text-slate">{note}</p>}
    </>
  );
  if (href) {
    return (
      <Link href={href} className="block border border-line bg-white p-5 hover:border-ink">
        {body}
      </Link>
    );
  }
  return <div className="border border-line bg-white p-5">{body}</div>;
}

/** White panel with an optional heading. */
export function Panel({ title, children, className, action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={cn("border border-line bg-white p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-2xl">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Simple table wrapper that scrolls sideways on phones. */
export function AdminTable({ children, minWidth = "48rem" }: { children: React.ReactNode; minWidth?: string }) {
  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full text-left text-sm [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_thead]:bg-stone [&_thead_th]:text-xs [&_thead_th]:font-medium [&_thead_th]:uppercase [&_thead_th]:tracking-[0.08em] [&_thead_th]:text-slate [&_tbody_tr]:border-t [&_tbody_tr]:border-line" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Loading() {
  return <div className="skeleton h-48" aria-busy="true" aria-label="Loading" />;
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="border border-out/30 bg-out-bg p-4 text-sm text-out">
      {message}
    </p>
  );
}
