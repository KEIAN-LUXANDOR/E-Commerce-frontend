"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck, ExternalLink, Loader2, Award } from "lucide-react";
import { listOrders } from "@/lib/api/orders";
import { site } from "@/lib/site";
import type { OrderSummary } from "@/lib/types/order";

interface CertificateRecord {
  orderNumber: string;
  productName: string;
  description: string;
  imageUrl: string | null;
  lab: "GIA" | "IGI" | "HRD" | "Certified";
  reportNumber?: string;
  verifyUrl?: string;
}

export default function AccountVaultPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void listOrders(0, 50)
      .then((res) => {
        if (!active) return;
        setOrders(res.items);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load vault certificates.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Filter confirmed orders (PAID, SHIPPED, DELIVERED)
  const confirmedOrders = orders.filter(
    (o) => o.status === "PAID" || o.status === "SHIPPED" || o.status === "DELIVERED"
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="font-serif text-3xl font-normal text-ink">
          Gemological Certificate Vault
        </h2>
        <p className="mt-1 text-sm text-slate">
          Your immutable digital archive of official GIA and IGI laboratory grading dossiers.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate">
          <Loader2 className="size-6 animate-spin mx-auto text-ink" />
          <p className="mt-3 text-xs uppercase tracking-widest">Opening Secure Vault...</p>
        </div>
      ) : confirmedOrders.length === 0 ? (
        <section aria-labelledby="vault-empty-heading" className="border border-line bg-surface p-10 sm:p-14 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-stone text-ink">
            <Award className="size-6 text-loupe" aria-hidden="true" />
          </div>
          <h3 id="vault-empty-heading" className="mt-5 font-serif text-2xl font-normal text-ink">
            Your vault is currently empty
          </h3>
          <p className="mt-2 text-sm max-w-md mx-auto leading-relaxed text-slate">
            When you purchase certified natural or lab-grown loose diamonds from Keian Luxandor, their official GIA and IGI grading certificates, laser inscription records, and legal proof of acquisition will be securely archived here.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/diamonds" className="btn btn-primary text-xs uppercase tracking-widest px-6 py-3">
              Explore Certified Diamonds
              <ArrowRight className="size-3.5 ml-1 inline-block" />
            </Link>
            <Link href="/contact" className="btn btn-secondary text-xs uppercase tracking-widest px-6 py-3">
              Request Past Offline Dossier
            </Link>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-wider text-slate">
            Active Records ({confirmedOrders.length} {confirmedOrders.length === 1 ? "Acquisition" : "Acquisitions"})
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {confirmedOrders.map((order) => (
              <div key={order.orderNumber} className="border border-line bg-surface p-6 space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <span className="inline-block border border-line bg-platinum px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ink font-semibold">
                      Order #{order.orderNumber}
                    </span>
                    <h4 className="font-serif text-lg font-medium text-ink mt-2">
                      {order.firstItemName}
                    </h4>
                  </div>
                  <ShieldCheck className="size-5 text-ok shrink-0 mt-1" />
                </div>

                <div className="text-xs text-slate space-y-1 font-mono">
                  <p>Certified Laboratory: GIA / IGI</p>
                  <p>Status: Authenticated &amp; Transferred</p>
                </div>

                <div className="pt-2 border-t border-line flex items-center justify-between">
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="text-xs font-medium text-ink hover:underline flex items-center gap-1"
                  >
                    View Order Dossier &rarr;
                  </Link>
                  <a
                    href="https://www.gia.edu/report-check-landing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-loupe hover:underline flex items-center gap-1"
                  >
                    GIA Verify
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
