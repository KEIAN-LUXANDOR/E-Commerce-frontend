
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import { listOrders } from "@/lib/api/orders";
import type { OrderListPage } from "@/lib/types/order";
import { formatPrice } from "@/lib/format";
import {
  formatDateTime,
  OrderStatusBadge,
} from "@/components/orders/OrderBits";

const PAGE_SIZE = 10;

export function OrderHistory() {
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState<OrderListPage>();
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [error, setError] = useState<{
    page: number;
    message: string;
  }>();

  useEffect(() => {
    let active = true;

    listOrders(page, PAGE_SIZE)
      .then((result) => {
        if (!active) return;

        setOrders(result);
        setLoadedPage(page);
        setError(undefined);
      })
      .catch((cause: unknown) => {
        if (!active) return;

        setError({
          page,
          message:
            cause instanceof Error
              ? cause.message
              : "Could not load your orders.",
        });
      });

    return () => {
      active = false;
    };
  }, [page, retryCount]);

  const isLoading = loadedPage !== page && error?.page !== page;

  const handleRetry = () => {
    setError(undefined);
    setLoadedPage(null);
    setRetryCount((current) => current + 1);
  };

  /* Loading */
  if (isLoading) {
    return (
      <section
        role="status"
        aria-live="polite"
        aria-label="Loading your orders"
        className="space-y-5"
      >
        <div className="flex items-end justify-between border-b border-line pb-5">
          <div>
            <div className="skeleton h-7 w-40" />
            <div className="skeleton mt-2 h-3 w-52" />
          </div>
          <div className="skeleton h-3 w-20" />
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-[1.25rem] border border-line bg-surface p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="skeleton h-3 w-24" />
                <div className="skeleton mt-2 h-5 w-36" />
              </div>
              <div className="skeleton h-7 w-24 rounded-full" />
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-2 h-4 w-2/3 max-w-full" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-3">
              <div className="skeleton h-9 w-full" />
              <div className="skeleton h-9 w-full" />
              <div className="skeleton col-span-2 h-9 w-full sm:col-span-1" />
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-slate">
          Gathering your purchase history…
        </p>
      </section>
    );
  }

  /* Error */
  if (error?.page === page) {
    return (
      <section
        role="alert"
        className="relative overflow-hidden rounded-[1.5rem] border border-line bg-surface px-5 py-12 text-center sm:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full border border-line"
        />

        <div className="relative mx-auto flex size-12 items-center justify-center rounded-2xl border border-line bg-stone">
          <RefreshCw className="size-4 text-brand-anchor" />
        </div>

        <h3 className="relative mt-5 font-serif text-2xl tracking-tight text-ink">
          We couldn&apos;t load your orders
        </h3>

        <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate">
          {error.message}
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="relative mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-loupe-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <RefreshCw className="size-3.5" />
          Try again
        </button>
      </section>
    );
  }

  /* Empty */
  if (!orders?.items.length) {
    return (
      <section className="relative isolate overflow-hidden rounded-[1.5rem] border border-line bg-surface px-5 py-14 text-center sm:px-10 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full border border-line"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 -z-10 size-48 rounded-full border border-line"
        />

        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-line bg-stone text-brand-anchor">
          <ShoppingBag className="size-5" />
        </div>

        <h3 className="mt-6 font-serif text-2xl tracking-tight text-ink sm:text-3xl">
          Nothing here just yet.
        </h3>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate">
          Your orders will find a home here. In the meantime,
          take a look at our diamond collection.
        </p>

        <Link
          href="/diamonds"
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-white transition-colors hover:bg-loupe-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Explore diamonds
          <ArrowUpRight className="size-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      {/* Section heading */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <h3 className="font-serif text-2xl tracking-tight text-ink sm:text-[30px]">
            Your purchases
          </h3>

          <p className="mt-1.5 text-sm text-slate">
            A record of the pieces you&apos;ve chosen.
          </p>
        </div>

        <p className="pb-1 text-xs text-slate">
          Page{" "}
          <span className="font-medium text-ink">{page + 1}</span>
          {" "}of{" "}
          <span className="font-medium text-ink">
            {orders.totalPages}
          </span>
        </p>
      </div>

      {/* Order list */}
      <ul className="space-y-3 sm:space-y-4">
        {orders.items.map((order) => (
          <li key={order.orderNumber}>
            <Link
              href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
              aria-label={`View order ${order.orderNumber}`}
              className="group relative block overflow-hidden rounded-[1.25rem] border border-line bg-surface transition-all duration-300 hover:border-brand-accent hover:shadow-[0_10px_30px_rgba(15,31,55,0.055)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              {/* Organic curved accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full border border-line/80 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-1"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-20 size-52 rounded-full border border-line/60"
              />

              <div className="relative p-4 sm:p-5 lg:p-6">
                {/* Order reference and status */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium tracking-wide text-slate">
                      Order number
                    </p>

                    <p className="mt-1.5 text-base font-semibold tracking-tight text-ink sm:text-lg">
                      #{order.orderNumber}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <OrderStatusBadge status={order.status} />

                    <span
                      aria-hidden="true"
                      className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-slate transition-all duration-200 group-hover:border-brand-accent group-hover:bg-stone group-hover:text-brand-anchor"
                    >
                      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                {/* Purchased item */}
                <div className="mt-5 border-t border-line pt-4 sm:mt-6 sm:pt-5">
                  <p className="text-[11px] font-medium tracking-wide text-slate">
                    Purchased item
                  </p>

                  <p className="mt-2 break-words text-sm leading-relaxed text-ink sm:text-[15px]">
                    {order.firstItemName}

                    {order.itemCount > 1 && (
                      <span className="ml-1.5 text-xs text-slate">
                        and {order.itemCount - 1} more
                      </span>
                    )}
                  </p>
                </div>

                {/* Order information */}
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-4 sm:mt-6 sm:grid-cols-[1.3fr_0.8fr_1fr] sm:gap-5 sm:pt-5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium tracking-wide text-slate">
                      Order date
                    </p>

                    <time
                      dateTime={order.createdAt}
                      className="mt-2 block text-xs font-medium leading-relaxed text-ink sm:text-sm"
                    >
                      {formatDateTime(order.createdAt)}
                    </time>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium tracking-wide text-slate">
                      Items
                    </p>

                    <p className="mt-2 text-xs font-medium text-ink sm:text-sm">
                      {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-line bg-stone/40 px-3.5 py-3 sm:col-span-1 sm:block sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <p className="text-[11px] font-medium tracking-wide text-slate">
                      Order total
                    </p>

                    <p className="font-serif text-xl tracking-tight text-ink sm:mt-2 sm:text-[26px]">
                      {formatPrice(order.totalPaise)}
                    </p>
                  </div>
                </div>

                {/* Mobile detail hint */}
                <div className="mt-4 flex items-center justify-end border-t border-line pt-3 sm:hidden">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-anchor">
                    View order details
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {orders.totalPages > 1 && (
        <nav
          aria-label="Order pages"
          className="flex flex-col gap-3 rounded-[1.25rem] border border-line bg-surface p-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
        >
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((current) => current - 1)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-medium text-ink transition-colors hover:border-brand-accent hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>

          <p
            aria-live="polite"
            className="text-center text-xs text-slate"
          >
            Page{" "}
            <span className="font-semibold text-ink">{page + 1}</span>
            {" "}of{" "}
            <span className="font-semibold text-ink">
              {orders.totalPages}
            </span>
          </p>

          <button
            type="button"
            disabled={page + 1 >= orders.totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-loupe-deep disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </section>
  );
}

export default OrderHistory;
