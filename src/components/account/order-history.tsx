"use client";

/**
 * Customer Order History & Gemological Acquisitions
 *
 * Displays past and active diamond orders with full provenance:
 *   - Order number, acquisition date, formatted INR totals
 *   - Current physical transit stage with OrderStepper
 *   - Itemized diamonds with GIA/IGI cert numbers
 *   - Direct actions: Track Live Transit, View Certificate, Download Invoice
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Responsive card layouts with high-density data.
 */

import * as React from "react";
import Link from "next/link";
import { Download, ExternalLink, ShieldCheck, Gem } from "lucide-react";
import { formatINR } from "@/lib/format";
import { showToast } from "@/lib/stores";
import { OrderStepper, type TransitMilestoneKey } from "@/components/account/order-stepper";

export interface OrderItem {
  id: string;
  title: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  certificateNumber: string;
  certificateLab: "GIA" | "IGI";
  pricePaise: number;
}

export interface CustomerOrder {
  orderId: string;
  date: string;
  status: TransitMilestoneKey;
  totalPaise: number;
  paymentMethod: string;
  awbNumber: string;
  courier: string;
  items: OrderItem[];
}

export const SAMPLE_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    orderId: "KL-2026-98214",
    date: "2026-10-21",
    status: "ARMED_TRANSIT",
    totalPaise: 92700000, // ₹9,27,000 (inc GST)
    paymentMethod: "Razorpay (HDFC NetBanking)",
    awbNumber: "SEQ-IN-9812401",
    courier: "Sequel Secure Armoured Escort",
    items: [
      {
        id: "dia-round-200",
        title: "2.00 ct Round Brilliant Solitaire",
        shape: "Round",
        carat: 2.0,
        color: "D",
        clarity: "VVS1",
        cut: "Excellent",
        certificateNumber: "2287654321",
        certificateLab: "GIA",
        pricePaise: 90000000,
      },
    ],
  },
  {
    orderId: "KL-2026-89102",
    date: "2026-09-14",
    status: "DELIVERED",
    totalPaise: 49440000, // ₹4,94,400
    paymentMethod: "Wire Transfer / RTGS",
    awbNumber: "MALCA-884192",
    courier: "Malca-Amit Luxury Logistics",
    items: [
      {
        id: "dia-oval-150",
        title: "1.52 ct Oval Cut Solitaire",
        shape: "Oval",
        carat: 1.52,
        color: "E",
        clarity: "VS1",
        cut: "Very Good",
        certificateNumber: "5123987114",
        certificateLab: "IGI",
        pricePaise: 48000000,
      },
    ],
  },
];

export function OrderHistory() {
  const [orders] = React.useState<CustomerOrder[]>(SAMPLE_CUSTOMER_ORDERS);

  if (orders.length === 0) {
    return (
      <div className="border border-[var(--color-line)] bg-white p-12 text-center">
        <Gem className="size-8 mx-auto text-[var(--color-muted)] mb-3" />
        <h3 className="font-serif text-lg text-[var(--color-ink)]">No Diamond Acquisitions Yet</h3>
        <p className="font-mono text-xs text-[var(--color-slate)] mt-1 max-w-sm mx-auto">
          When you reserve loose natural or lab-grown solitaires, their certificates and transit updates will be archived here.
        </p>
        <Link
          href="/diamonds/natural"
          className="mt-6 inline-flex h-11 items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 text-white font-mono text-xs uppercase tracking-[0.08em] hover:bg-[var(--color-slate)] transition-colors"
        >
          Explore Loose Solitaires
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => {
        let badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
        let badgeText = "In Armoured Transit";

        if (order.status === "DELIVERED") {
          badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
          badgeText = "Delivered to Vault";
        } else if (order.status === "CONFIRMED") {
          badgeStyle = "bg-blue-50 text-blue-800 border-blue-200";
          badgeText = "Order Confirmed";
        }

        return (
          <div
            key={order.orderId}
            className="border border-[var(--color-line)] bg-white shadow-sm overflow-hidden"
          >
            {/* Header bar */}
            <div className="bg-[var(--color-stone)] border-b border-[var(--color-line)] p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)]">
                    {order.orderId}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border ${badgeStyle}`}
                  >
                    {badgeText}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[var(--color-slate)]">
                  Acquired on {order.date} &bull; Paid via {order.paymentMethod}
                </p>
              </div>

              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Total Insured Acquisition
                </p>
                <p className="font-mono text-lg font-semibold text-[var(--color-ink)]">
                  {formatINR(order.totalPaise)}
                </p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="p-5 md:p-6 border-b border-[var(--color-line)] bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)]">
                  Escort Service: <span className="text-[var(--color-ink)] font-semibold">{order.courier}</span>
                </p>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  AWB #{order.awbNumber}
                </span>
              </div>
              <OrderStepper currentStage={order.status} />
            </div>

            {/* Items list */}
            <div className="divide-y divide-[var(--color-line)]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 bg-[var(--color-stone)] border border-[var(--color-line)] flex items-center justify-center shrink-0">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-slate)]">
                        {item.shape}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-[var(--color-ink)]">{item.title}</h4>
                      <p className="font-mono text-xs text-[var(--color-slate)] mt-0.5">
                        {item.carat} ct &bull; Color {item.color} &bull; Clarity {item.clarity} &bull; Cut {item.cut}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--color-muted)] mt-0.5 flex items-center gap-1.5">
                        <ShieldCheck className="size-3 text-emerald-700" />
                        {item.certificateLab} Dossier #{item.certificateNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-mono text-sm font-semibold text-[var(--color-ink)]">
                      {formatINR(item.pricePaise)}
                    </p>
                    <a
                      href={`https://www.gia.edu/report-check?reportno=${item.certificateNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)] hover:text-[var(--color-ink)] mt-1 underline"
                    >
                      <span>{`Verify ${item.certificateLab}`}</span>
                      <ExternalLink className="size-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Actions Footer */}
            <div className="p-4 bg-[var(--color-stone)] border-t border-[var(--color-line)] flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/order-tracking?orderId=${order.orderId}`}
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)] underline hover:text-[var(--color-slate)]"
              >
                Track Live GPS & Delivery OTP &rarr;
              </Link>

              <button
                type="button"
                onClick={() =>
                  showToast(
                    `Generating official GST Tax Invoice PDF for ${order.orderId}...`,
                    "info"
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-line)] bg-white font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              >
                <Download className="size-3.5" />
                <span>GST Tax Invoice (PDF)</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
