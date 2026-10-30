"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  MapPin,
  Phone,
  PackageCheck,
  Clock3,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { DiamondArt } from "@/components/art/DiamondArt";
import { formatPrice } from "@/lib/format";
import {
  ORDER_STATUS_LABEL,
  type OrderItem,
  type OrderStatus,
  type ShippingAddress,
} from "@/lib/types/order";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                DESIGN TOKENS                               */
/* -------------------------------------------------------------------------- */

const TONE: Record<OrderStatus, string> = {
  PENDING_PAYMENT:
    "border-amber-200 bg-amber-50 text-amber-900",
  PAID:
    "border-[#DCCBA8] bg-[#F1EBDD] text-[#66502D]",
  SHIPPED:
    "border-sky-200 bg-sky-50 text-sky-900",
  DELIVERED:
    "border-emerald-200 bg-emerald-50 text-emerald-900",
  CANCELLED:
    "border-stone-300 bg-stone-100 text-stone-700",
  REFUNDED:
    "border-purple-200 bg-purple-50 text-purple-900",
};

const CARD_SHADOW =
  "shadow-[0_6px_24px_rgba(41,37,31,0.05)]";

const CARD_HOVER =
  "transition-[border-color,box-shadow] duration-200 hover:border-[#CBB58D] hover:shadow-[0_10px_28px_rgba(41,37,31,0.08)]";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A88B58] focus-visible:ring-offset-2";

/* -------------------------------------------------------------------------- */
/*                              STATUS BADGE                                  */
/* -------------------------------------------------------------------------- */

export function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-full",
        "border px-3 py-1.5",
        "text-[11px] font-bold uppercase tracking-[0.08em]",
        TONE[status],
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  DATE                                      */
/* -------------------------------------------------------------------------- */

/** "12 Nov 2026, 4:05 pm" in India time. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

/* -------------------------------------------------------------------------- */
/*                              ORDER PROGRESS                                */
/* -------------------------------------------------------------------------- */

const STEPS: {
  status: OrderStatus;
  label: string;
}[] = [
  { status: "PAID", label: "Order confirmed" },
  { status: "SHIPPED", label: "On its way" },
  { status: "DELIVERED", label: "Delivered" },
];

export function OrderProgress({
  status,
}: {
  status: OrderStatus;
}) {
  if (
    status === "PENDING_PAYMENT" ||
    status === "CANCELLED" ||
    status === "REFUNDED"
  ) {
    return null;
  }

  const reached = STEPS.findIndex(
    (step) => step.status === status,
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "border border-[#DDD3C2]",
        "bg-gradient-to-br from-white via-[#FAF8F3] to-[#F0E8DA]",
        "p-4 sm:p-5 lg:p-6",
        CARD_SHADOW,
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#C5A46D]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        {/* Heading */}

        <div className="mb-6 flex items-center gap-3 sm:mb-7">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#DCCBA8] bg-[#EFE5D3] text-[#80643A]">
            <PackageCheck className="size-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-[#29251F] sm:text-lg">
              Your delivery journey
            </h3>

            <p className="mt-0.5 text-xs leading-relaxed text-[#62594C] sm:text-sm">
              Follow your order every step of the way
            </p>
          </div>
        </div>

        {/* Progress */}

        <ol
          className="relative grid grid-cols-3 gap-1"
          aria-label="Order progress"
        >
          {/* Background connector */}

          <span
            className="absolute left-[16.6667%] right-[16.6667%] top-5 h-0.5 rounded-full bg-[#D7CCBA] sm:top-6"
            aria-hidden
          />

          {/* Completed connector */}

          <span
            className="absolute left-[16.6667%] top-5 h-0.5 rounded-full bg-[#8D7043] transition-[width] duration-500 sm:top-6"
            style={{
              width: `${(Math.max(0, reached) / 3) * 100}%`,
            }}
            aria-hidden
          />

          {STEPS.map((step, index) => {
            const done = index <= reached;
            const current = index === reached;

            return (
              <li
                key={step.status}
                className="relative z-10 flex min-w-0 flex-col items-center text-center"
                aria-current={current ? "step" : undefined}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    "border-2 transition-all duration-300 sm:size-12",
                    done
                      ? "border-[#8D7043] bg-[#29251F] text-[#E8D5AE] shadow-[0_0_0_4px_rgba(168,139,88,0.13)]"
                      : "border-[#D7CCBA] bg-white text-[#81786B]",
                    current &&
                      "shadow-[0_0_0_6px_rgba(168,139,88,0.13)]",
                  )}
                >
                  {done ? (
                    <Check className="size-4 sm:size-5" />
                  ) : (
                    <span className="text-sm font-bold">
                      {index + 1}
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "mt-3 text-[11px] font-bold leading-snug sm:text-xs",
                    done
                      ? "text-[#29251F]"
                      : "text-[#766D60]",
                  )}
                >
                  {step.label}
                </p>

                {current && (
                  <span
                    className={cn(
                      "mt-2 inline-flex items-center rounded-full",
                      "border border-[#DCCBA8] bg-[#EFE5D3]",
                      "px-2.5 py-1",
                      "text-[9px] font-bold uppercase tracking-wider text-[#66502D]",
                    )}
                  >
                    Current stage
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             PAYMENT COUNTDOWN                              */
/* -------------------------------------------------------------------------- */

/** Time left to pay an unpaid order, counting down every second. */
export function PaymentCountdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string;
  onExpire?: () => void;
}) {
  const [left, setLeft] = useState(
    () => new Date(expiresAt).getTime() - Date.now(),
  );

  const onExpireRef = useRef(onExpire);
  const hasExpired = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    hasExpired.current = false;

    const updateCountdown = () => {
      const remaining =
        new Date(expiresAt).getTime() - Date.now();

      setLeft(remaining);

      if (remaining <= 0 && !hasExpired.current) {
        hasExpired.current = true;
        window.clearInterval(timer);
        onExpireRef.current?.();
      }
    };

    const timer = window.setInterval(
      updateCountdown,
      1000,
    );

    updateCountdown();

    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (left <= 0) {
    return (
      <span
        className={cn(
          "inline-flex min-h-9 items-center gap-2 rounded-full",
          "border border-red-200 bg-red-50 px-3.5 py-2",
          "text-xs font-bold text-red-800",
        )}
      >
        <Clock3 className="size-4 shrink-0" />
        Payment time expired
      </span>
    );
  }

  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);

  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-full",
        "border border-[#DCCBA8] bg-[#EFE5D3]",
        "px-3.5 py-2",
        "text-sm font-bold tabular-nums text-[#29251F]",
      )}
      aria-live="off"
    >
      <Clock3 className="size-4 shrink-0 text-[#80643A]" />

      {minutes}:{String(seconds).padStart(2, "0")}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                ORDER ITEMS                                 */
/* -------------------------------------------------------------------------- */

export function OrderItems({
  items,
}: {
  items: OrderItem[];
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl",
        "border border-[#E4DDD1] bg-white",
        "p-4 sm:p-5",
        CARD_SHADOW,
      )}
    >
      {/* Heading */}

      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-tight text-[#29251F] sm:text-lg">
            Your jewellery
          </h3>

          <p className="mt-1 text-xs text-[#62594C] sm:text-sm">
            Carefully selected for you
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E6D9C0] bg-[#F2EBDD] text-[#80643A]">
          <PackageCheck className="size-5" />
        </div>
      </div>

      {/* Items */}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.lineNumber}
            className={cn(
              "group flex flex-col gap-3 rounded-2xl",
              "border border-[#EAE4D9]",
              "bg-gradient-to-br from-white to-[#FAF8F3]",
              "p-3 sm:p-4",
              "transition-[border-color,box-shadow] duration-200",
              "hover:border-[#CBB58D]",
              "hover:shadow-[0_8px_22px_rgba(41,37,31,0.06)]",
              "sm:flex-row sm:items-center sm:gap-4",
            )}
          >
            {/* Product information */}

            <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
              {/* Image */}

              <div className="relative size-[68px] shrink-0 overflow-hidden rounded-xl border border-[#DED5C6] bg-[#F1EDE5] p-1 sm:size-20">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <DiamondArt
                    shape="ROUND"
                    className="h-full w-full p-2"
                  />
                )}
              </div>

              {/* Details */}

              <div className="min-w-0 flex-1 py-0.5">
                <Link
                  href={`/diamond/${encodeURIComponent(item.productSlug)}`}
                  className={cn(
                    "group/link inline-flex max-w-full items-center gap-1.5",
                    "text-sm font-bold leading-snug text-[#29251F] sm:text-base",
                    "underline decoration-[#B99B68] decoration-1 underline-offset-4",
                    "transition-colors duration-200 hover:text-[#80643A]",
                    FOCUS_RING,
                  )}
                >
                  <span className="min-w-0 break-words">
                    {item.productName}
                  </span>

                  <ArrowUpRight
                    className={cn(
                      "size-4 shrink-0 text-[#80643A]",
                      "transition-transform duration-200",
                      "group-hover/link:translate-x-0.5",
                      "group-hover/link:-translate-y-0.5",
                    )}
                  />
                </Link>

                {item.description && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#62594C] sm:text-sm">
                    {item.description}
                  </p>
                )}

                {/* SKU */}

                <div className="mt-2.5 inline-flex max-w-full items-center rounded-lg border border-[#E4D9C6] bg-[#F0E9DC] px-2.5 py-1.5">
                  <span className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#5E5140]">
                    Stock No. {item.sku}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}

            <div
              className={cn(
                "flex items-center justify-between gap-3",
                "rounded-xl border border-[#E5DDD0]",
                "bg-[#F3F0E9] px-3.5 py-3",
                "sm:min-w-[140px] sm:flex-col",
                "sm:items-end sm:justify-center sm:gap-1.5",
                "sm:px-4 sm:py-3.5",
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#62594C]">
                Item price
              </span>

              <p className="text-sm font-bold tabular-nums text-[#5E4728] sm:text-base">
                {formatPrice(item.pricePaise)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DELIVERY ADDRESS                              */
/* -------------------------------------------------------------------------- */

export function AddressBlock({
  address,
}: {
  address: ShippingAddress;
}) {
  return (
    <section
      className={cn(
        "group relative overflow-hidden rounded-3xl",
        "border border-[#DDD3C2]",
        "bg-gradient-to-br from-white via-[#FAF8F3] to-[#F0E8DA]",
        "p-4 sm:p-5",
        CARD_SHADOW,
        CARD_HOVER,
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-[#C5A46D]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        {/* Address heading */}

<div className="mb-5 flex min-w-0 items-center gap-2 sm:mb-6 sm:gap-3">
  <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#DCCBA8] bg-[#EFE5D3] text-[#80643A] sm:size-11">
      <MapPin className="size-5" />
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="whitespace-nowrap text-sm font-bold leading-snug tracking-tight text-[#29251F] sm:text-base">
        Delivery address
      </h3>

      <p className="mt-1 whitespace-nowrap text-[10px] leading-snug text-[#62594C] sm:text-xs">
        Where your order will arrive
      </p>
    </div>
  </div>

  <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-1.5 text-[8px] font-bold leading-none text-emerald-900 sm:gap-1.5 sm:px-2.5 sm:text-[10px]">
    <ShieldCheck className="size-3 shrink-0 sm:size-3.5" />
    <span>Secure</span>
  </div>
</div>

        {/* Address details */}

        <div className="rounded-2xl border border-[#E4DDD1] bg-white/90 p-3.5 sm:p-4">
          <p className="text-sm font-bold text-[#29251F] sm:text-base">
            {address.fullName}
          </p>

          <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-[#514A40] sm:text-sm">
            <p>{address.line1}</p>

            {address.line2 && (
              <p>{address.line2}</p>
            )}

            {address.landmark && (
              <p>Near {address.landmark}</p>
            )}

            <p className="font-semibold text-[#29251F]">
              {address.city}, {address.state}{" "}
              {address.pincode}
            </p>
          </div>

          {/* Contact */}

          <div className="mt-4 flex items-center gap-3 border-t border-[#EAE4D9] pt-3.5 sm:pt-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#E6D9C0] bg-[#F2EBDD] text-[#80643A]">
              <Phone className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#756B5D]">
                Contact number
              </p>

              <p className="mt-0.5 text-sm font-bold text-[#29251F]">
                {address.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}