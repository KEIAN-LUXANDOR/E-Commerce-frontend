
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  PlugZap,
} from "lucide-react";

import {
  FeatureOffError,
  isEnabled,
  type Feature,
} from "@/config/features";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Admin Header                                                               */
/* -------------------------------------------------------------------------- */

export function AdminHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-7 border-b border-line pb-5 sm:mb-8 sm:pb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {back && (
            <Link
              href={back.href}
              className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate transition-colors hover:text-brand-anchor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-anchor/20"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              {back.label}
            </Link>
          )}

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-anchor">
            Administration
          </p>

          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Backend Integration State                                                 */
/* -------------------------------------------------------------------------- */

export function NotConnected({
  feature,
  endpoints,
  children,
}: {
  feature: Feature;
  endpoints: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      {/* Integration status */}
      <div className="flex flex-col gap-4 border-b border-line bg-stone/50 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-brand-anchor">
          <PlugZap className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl font-medium text-ink sm:text-2xl">
              Waiting for the backend
            </h2>

            <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate">
              Pending
            </span>
          </div>

          <p className="mt-1 text-xs text-slate">
            This feature is awaiting backend integration.
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <p className="max-w-2xl text-sm leading-6 text-ink-secondary">
          The interface is prepared. Live information will appear here once
          the required API endpoints are available and the corresponding
          feature switch is enabled.
        </p>

        {/* Required endpoints */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate">
              Required endpoints
            </h3>

            <span className="text-[10px] tabular-nums text-muted">
              {endpoints.length} {endpoints.length === 1 ? "endpoint" : "endpoints"}
            </span>
          </div>

          <ul className="space-y-2">
            {endpoints.map((endpoint) => (
              <li
                key={endpoint}
                className="group flex min-w-0 items-center gap-3 rounded-lg border border-line bg-stone/40 px-3.5 py-3 transition-colors hover:border-brand-accent/50 hover:bg-stone/70"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-brand-accent" />

                <code className="min-w-0 flex-1 break-all text-xs leading-5 text-ink-secondary">
                  {endpoint}
                </code>

                <span className="shrink-0 rounded-md border border-line bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted">
                  API
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Developer guidance */}
        <div className="rounded-lg border border-brand-accent-muted bg-brand-accent-muted/30 p-4">
          <div className="flex items-start gap-3">
            <PlugZap className="mt-0.5 size-4 shrink-0 text-brand-anchor" />

            <div className="min-w-0 text-xs leading-6 text-ink-secondary">
              <p className="font-semibold text-ink">
                Integration instructions
              </p>

              <p className="mt-1">
                Refer to{" "}
                <code className="font-medium text-brand-anchor">
                  docs/API-ENDPOINTS.md
                </code>{" "}
                and enable{" "}
                <code className="font-medium text-brand-anchor">
                  {feature}
                </code>{" "}
                in{" "}
                <code className="font-medium text-brand-anchor">
                  src/config/features.ts
                </code>
                .
              </p>
            </div>
          </div>
        </div>

        {children && <div className="border-t border-line pt-5">{children}</div>}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Admin Query                                                                */
/* -------------------------------------------------------------------------- */

export interface AdminQuery<T> {
  data: T | undefined;
  error: string | undefined;
  loading: boolean;
  off: boolean;
  reload: () => void;
}

/** Loads data for an admin screen, unless its feature is switched off. */
export function useAdminQuery<T>(
  feature: Feature,
  load: () => Promise<T>,
  deps: unknown[],
): AdminQuery<T> {
  const switchedOff = !isEnabled(feature);

  const [missing, setMissing] = useState(false);
  const off = switchedOff || missing;

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
      .then((result) => {
        if (!active) return;

        setData(result);
        setError(undefined);
      })
      .catch((e: unknown) => {
        if (!active || e instanceof FeatureOffError) return;

        if (e instanceof ApiError && e.code === "NOT_AVAILABLE") {
          setMissing(true);
          return;
        }

        setError(
          e instanceof Error ? e.message : "Couldn’t load this.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [off, run, tick]);

  return {
    data,
    error,
    loading,
    off,
    reload: () => setTick((current) => current + 1),
  };
}

/* -------------------------------------------------------------------------- */
/* Statistics                                                                 */
/* -------------------------------------------------------------------------- */

export function StatCard({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string;
  note?: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate">
          {label}
        </p>

        {href && (
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-stone text-slate transition-all group-hover:border-brand-accent group-hover:bg-white group-hover:text-brand-anchor">
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>

      <p className="mt-4 break-words font-serif text-3xl font-medium tabular-nums tracking-tight text-ink sm:text-4xl">
        {value}
      </p>

      {note && (
        <p className="mt-2 text-xs leading-relaxed text-slate">
          {note}
        </p>
      )}
    </>
  );

  const cardClass = cn(
    "relative block overflow-hidden rounded-xl border border-line bg-white p-5 sm:p-6",
    "transition-all duration-200",
    href &&
      "group cursor-pointer hover:-translate-y-0.5 hover:border-brand-accent/70 hover:bg-stone/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-anchor/20",
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {body}
      </Link>
    );
  }

  return <div className={cardClass}>{body}</div>;
}

/* -------------------------------------------------------------------------- */
/* Content Panel                                                              */
/* -------------------------------------------------------------------------- */

export function Panel({
  title,
  children,
  className,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-white",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex min-h-[64px] items-center justify-between gap-3 border-b border-line bg-stone/40 px-5 py-4 sm:px-6">
          {title && (
            <h2 className="min-w-0 font-serif text-xl font-medium tracking-tight text-ink sm:text-2xl">
              {title}
            </h2>
          )}

          {action && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {action}
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Admin Table                                                                */
/* -------------------------------------------------------------------------- */

export function AdminTable({
  children,
  minWidth = "48rem",
}: {
  children: React.ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table
        className={cn(
          "w-full text-left text-sm",
          "[&_td]:px-4 [&_td]:py-4",
          "[&_th]:px-4 [&_th]:py-3.5",
          "[&_thead]:bg-stone/60",
          "[&_thead_th]:whitespace-nowrap",
          "[&_thead_th]:text-[10px]",
          "[&_thead_th]:font-semibold",
          "[&_thead_th]:uppercase",
          "[&_thead_th]:tracking-[0.12em]",
          "[&_thead_th]:text-slate",
          "[&_tbody_tr]:border-t [&_tbody_tr]:border-line",
          "[&_tbody_tr]:transition-colors",
          "[&_tbody_tr:hover]:bg-stone/50",
          "[&_tbody_td]:text-ink-secondary",
        )}
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading State                                                              */
/* -------------------------------------------------------------------------- */

export function Loading() {
  return (
    <div
      className="space-y-5 rounded-xl border border-line bg-white p-5 sm:p-6"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="skeleton h-5 w-36 rounded-md" />
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>

      <div className="space-y-2">
        <div className="skeleton h-10 w-1/3 rounded-md" />
        <div className="skeleton h-3 w-2/3 rounded-md" />
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <div className="skeleton h-11 w-full rounded-lg" />
        <div className="skeleton h-11 w-full rounded-lg" />
        <div className="skeleton h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error State                                                                */
/* -------------------------------------------------------------------------- */

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-out/30 bg-out-bg p-4 sm:p-5"
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-out/20 bg-white/60 text-out">
        <AlertCircle className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-out">
          Something went wrong
        </p>

        <p className="mt-1 break-words text-sm leading-relaxed text-out">
          {message}
        </p>
      </div>
    </div>
  );
}
