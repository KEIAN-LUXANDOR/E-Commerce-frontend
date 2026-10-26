"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { DiamondArt } from "@/components/art/DiamondArt";
import { formatINR } from "@/lib/format";
import { ORDER_STATUS_LABEL, type OrderItem, type OrderStatus, type ShippingAddress } from "@/lib/types/order";
import { cn } from "@/lib/utils";

const TONE: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-warn-bg text-warn",
  PAID: "bg-accent-muted text-accent-deep",
  SHIPPED: "bg-accent-muted text-accent-deep",
  DELIVERED: "bg-ok-bg text-ok",
  CANCELLED: "bg-stone-deep text-slate",
  REFUNDED: "bg-stone-deep text-slate",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn("inline-block px-2.5 py-1 text-xs font-medium uppercase tracking-[0.08em]", TONE[status])}>{ORDER_STATUS_LABEL[status]}</span>;
}

/** "12 Nov 2026, 4:05 pm" in India time. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso));
}

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PAID", label: "Paid" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

/** Paid → Shipped → Delivered, with the current step highlighted. */
export function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === "PENDING_PAYMENT" || status === "CANCELLED" || status === "REFUNDED") return null;
  const reached = STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Order progress">
      {STEPS.map((step, i) => {
        const done = i <= reached;
        return (
          <li key={step.status} className="flex flex-col gap-2" aria-current={i === reached ? "step" : undefined}>
            <span className={cn("h-1", done ? "bg-ink" : "bg-line")} />
            <span className={cn("flex items-center gap-1.5 text-sm", done ? "font-medium text-ink" : "text-slate")}>
              {done && <Check className="size-4" aria-hidden />}
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Time left to pay an unpaid order, counting down every second. */
export function PaymentCountdown({ expiresAt, onExpire }: { expiresAt: string; onExpire?: () => void }) {
  const [left, setLeft] = useState(() => new Date(expiresAt).getTime() - Date.now());
  useEffect(() => {
    const t = window.setInterval(() => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      setLeft(ms);
      if (ms <= 0) {
        window.clearInterval(t);
        onExpire?.();
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [expiresAt, onExpire]);
  if (left <= 0) return <span className="font-medium text-out">Time’s up</span>;
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return (
    <span className="font-medium tabular-nums" aria-live="off">
      {m}:{String(s).padStart(2, "0")}
    </span>
  );
}

export function OrderItems({ items }: { items: OrderItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.lineNumber} className="flex gap-4 py-4">
          <div className="relative size-16 shrink-0 border border-line bg-stone">
            {item.imageUrl && <Image src={item.imageUrl} alt="" fill unoptimized sizes="64px" className="object-contain" />}
            {!item.imageUrl && <DiamondArt shape="ROUND" className="h-full w-full p-2" />}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/diamond/${encodeURIComponent(item.productSlug)}`} className="font-medium hover:underline">
              {item.productName}
            </Link>
            {item.description && <p className="text-sm text-slate">{item.description}</p>}
            <p className="text-sm text-slate">Stock number {item.sku}</p>
          </div>
          <p className="tabular-nums">{formatINR(item.pricePaise)}</p>
        </li>
      ))}
    </ul>
  );
}

export function AddressBlock({ address }: { address: ShippingAddress }) {
  return (
    <address className="space-y-0.5 text-sm not-italic text-ink-secondary">
      <p className="font-medium text-ink">{address.fullName}</p>
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      {address.landmark && <p>Near {address.landmark}</p>}
      <p>
        {address.city}, {address.state} {address.pincode}
      </p>
      <p>Mobile {address.phone}</p>
    </address>
  );
}
