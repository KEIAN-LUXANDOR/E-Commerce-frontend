"use client";

/**
 * Packing Desk & Armoured Logistics Station
 *
 * Internal workstation for gemologists and vault packaging staff:
 *   - Live queue of reserved diamonds awaiting physical dispatch
 *   - Barcode scanner simulation for diamond cert / serial
 *   - 4-point forensic checklist (Loupe, Dossier, Cassette, Tamper Seal)
 *   - Waybill (AWB) and customs manifest generation trigger
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Explicit status updates and accessible form inputs.
 */

import * as React from "react";
import {
  Scan,
  ShieldCheck,
  CheckSquare,
  Square,
  Truck,
  Printer,
  FileCheck,
  AlertCircle,
  Gem,
} from "lucide-react";
import { formatINR } from "@/lib/format";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PackingQueueOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  diamondTitle: string;
  certNumber: string;
  certLab: "GIA" | "IGI";
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  pricePaise: number;
  deliveryCity: string;
  courier: string;
  securityBagNumber?: string;
  isInspected?: boolean;
}

const INITIAL_QUEUE: PackingQueueOrder[] = [
  {
    orderId: "KL-2026-99014",
    customerName: "Pooja Singhania",
    customerPhone: "+91 98200 11223",
    diamondTitle: "2.51 ct Oval Solitaire (Natural)",
    certNumber: "6298144210",
    certLab: "GIA",
    shape: "Oval",
    carat: 2.51,
    color: "D",
    clarity: "VVS1",
    pricePaise: 165000000, // ₹16,50,000
    deliveryCity: "New Delhi",
    courier: "Sequel Secure Armoured Transit",
  },
  {
    orderId: "KL-2026-99015",
    customerName: "Vikramaditya Roy",
    customerPhone: "+91 98310 99887",
    diamondTitle: "1.80 ct Emerald Solitaire (Lab-Grown)",
    certNumber: "5189201940",
    certLab: "IGI",
    shape: "Emerald",
    carat: 1.8,
    color: "E",
    clarity: "VS1",
    pricePaise: 24000000, // ₹2,40,000
    deliveryCity: "Bengaluru",
    courier: "Malca-Amit Luxury Logistics",
  },
];

export function PackingDesk() {
  const [orders, setOrders] = React.useState<PackingQueueOrder[]>(INITIAL_QUEUE);
  const [selectedOrder, setSelectedOrder] = React.useState<PackingQueueOrder>(INITIAL_QUEUE[0]);

  // Scanner simulator
  const [scannedInput, setScannedInput] = React.useState("");
  const [barcodeMatched, setBarcodeMatched] = React.useState(false);

  // 4-point Checklist
  const [checkLoupe, setCheckLoupe] = React.useState(false);
  const [checkDossier, setCheckDossier] = React.useState(false);
  const [checkCassette, setCheckCassette] = React.useState(false);
  const [checkSeal, setCheckSeal] = React.useState(false);

  // Bag serial
  const [securitySealNumber, setSecuritySealNumber] = React.useState("SEAL-IN-984421");
  const [dispatchedSuccess, setDispatchedSuccess] = React.useState(false);

  const allChecksPassed =
    barcodeMatched && checkLoupe && checkDossier && checkCassette && checkSeal;

  function handleScanBarcode(e: React.FormEvent) {
    e.preventDefault();
    if (scannedInput.trim() === selectedOrder.certNumber) {
      setBarcodeMatched(true);
      showToast(`Laser inscription cert #${selectedOrder.certNumber} verified.`, "info");
    } else {
      showToast(
        `Scanned barcode "${scannedInput}" does not match diamond cert #${selectedOrder.certNumber}!`,
        "error"
      );
    }
  }

  function handleSelectOrder(order: PackingQueueOrder) {
    setSelectedOrder(order);
    setScannedInput("");
    setBarcodeMatched(false);
    setCheckLoupe(false);
    setCheckDossier(false);
    setCheckCassette(false);
    setCheckSeal(false);
    setDispatchedSuccess(false);
  }

  function handleDispatchArmouredLogistics() {
    if (!allChecksPassed) return;
    setDispatchedSuccess(true);
    // Remove from queue after delay
    setTimeout(() => {
      const remaining = orders.filter((o) => o.orderId !== selectedOrder.orderId);
      setOrders(remaining);
      if (remaining.length > 0) {
        handleSelectOrder(remaining[0]);
      }
    }, 2500);
  }

  return (
    <div className="space-y-8">
      {/* Station Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-ink)]">
            Forensic Packing & Fulfilment Desk
          </h1>
          <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
            Station #04 &bull; Certified Gemologist Calibration: Active
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--color-line)]">
          <ShieldCheck className="size-4 text-emerald-700" />
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)]">
            Audit Stream Encrypted
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Packing Queue */}
        <div className="lg:col-span-1 border border-[var(--color-line)] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
            <h2 className="font-serif text-lg text-[var(--color-ink)]">Awaiting Verification</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider bg-[var(--color-stone)] px-2 py-0.5 border border-[var(--color-line)]">
              {`${orders.length} in Vault`}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-[var(--color-slate)] font-mono text-xs">
              All active orders have been sealed and handed to armoured escorts.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const isSelected = o.orderId === selectedOrder.orderId;
                let cardClass =
                  "border border-[var(--color-line)] bg-[var(--color-stone)] hover:bg-white";
                if (isSelected) {
                  cardClass =
                    "border-2 border-[var(--color-ink)] bg-white shadow-xs";
                }

                return (
                  <button
                    key={o.orderId}
                    type="button"
                    onClick={() => handleSelectOrder(o)}
                    className={`w-full text-left p-3.5 transition-all ${cardClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[var(--color-ink)]">
                        {o.orderId}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--color-slate)]">
                        {o.deliveryCity}
                      </span>
                    </div>
                    <p className="font-serif text-sm text-[var(--color-ink)] mt-1 truncate">
                      {o.diamondTitle}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-line)]/60 text-[10px] font-mono text-[var(--color-slate)]">
                      <span>Cert #{o.certNumber}</span>
                      <span className="font-semibold text-[var(--color-ink)]">
                        {formatINR(o.pricePaise)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Inspection & Checklist Station */}
        {orders.length > 0 && selectedOrder && (
          <div className="lg:col-span-2 space-y-6">
            {/* Diamond Dossier Card */}
            <div className="border border-[var(--color-line)] bg-white p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    Target Solitaire
                  </span>
                  <h3 className="font-serif text-2xl text-[var(--color-ink)]">
                    {selectedOrder.diamondTitle}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
                    Recipient & Escort Destination
                  </span>
                  <span className="font-mono text-xs font-semibold text-[var(--color-ink)] block">
                    {selectedOrder.customerName} &bull; {selectedOrder.deliveryCity}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-slate)]">
                    {selectedOrder.customerPhone}
                  </span>
                </div>
              </div>

              {/* Barcode Scanner Simulator */}
              <div className="bg-[var(--color-stone)] border border-[var(--color-line)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scan className="size-4 text-[var(--color-ink)]" />
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--color-ink)]">
                      Laser Inscription Barcode Matcher
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--color-slate)]">
                    {`Expected: #${selectedOrder.certNumber}`}
                  </span>
                </div>

                <form onSubmit={handleScanBarcode} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Scan barcode or type ${selectedOrder.certNumber}`}
                    value={scannedInput}
                    onChange={(e) => setScannedInput(e.target.value)}
                    className="font-mono text-xs bg-white uppercase"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="font-mono text-xs uppercase shrink-0"
                  >
                    Simulate Scan
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setScannedInput(selectedOrder.certNumber);
                      setBarcodeMatched(true);
                    }}
                    className="font-mono text-xs uppercase shrink-0"
                  >
                    Auto-Verify
                  </Button>
                </form>

                {barcodeMatched ? (
                  <p className="font-mono text-xs text-emerald-800 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="size-4" />
                    Laser girdle inscription #{selectedOrder.certNumber} matched with 100% confidence.
                  </p>
                ) : (
                  <p className="font-mono text-[10px] text-[var(--color-muted)]">
                    Scan the barcode on the physical diamond cassette to unlock the release checklist.
                  </p>
                )}
              </div>

              {/* 4-Point Gemological Protocol Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif text-lg text-[var(--color-ink)]">
                  Mandatory Gemological Protocol Checklist
                </h4>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setCheckLoupe(!checkLoupe)}
                    className="w-full flex items-center gap-3 p-3 border border-[var(--color-line)] bg-[var(--color-stone)] hover:bg-white text-left transition-colors"
                  >
                    {checkLoupe ? (
                      <CheckSquare className="size-4 text-[var(--color-ink)] shrink-0" />
                    ) : (
                      <Square className="size-4 text-[var(--color-muted)] shrink-0" />
                    )}
                    <span className="font-sans text-xs text-[var(--color-ink)]">
                      1. Forensic 10x Loupe Inspection: Verified pavilion symmetry and laser inscription on girdle.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckDossier(!checkDossier)}
                    className="w-full flex items-center gap-3 p-3 border border-[var(--color-line)] bg-[var(--color-stone)] hover:bg-white text-left transition-colors"
                  >
                    {checkDossier ? (
                      <CheckSquare className="size-4 text-[var(--color-ink)] shrink-0" />
                    ) : (
                      <Square className="size-4 text-[var(--color-muted)] shrink-0" />
                    )}
                    <span className="font-sans text-xs text-[var(--color-ink)]">
                      2. Official Laboratory Dossier: Original laminated {selectedOrder.certLab} certificate enclosed.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckCassette(!checkCassette)}
                    className="w-full flex items-center gap-3 p-3 border border-[var(--color-line)] bg-[var(--color-stone)] hover:bg-white text-left transition-colors"
                  >
                    {checkCassette ? (
                      <CheckSquare className="size-4 text-[var(--color-ink)] shrink-0" />
                    ) : (
                      <Square className="size-4 text-[var(--color-muted)] shrink-0" />
                    )}
                    <span className="font-sans text-xs text-[var(--color-ink)]">
                      3. Presentation Cassette: Solitaire locked inside velvet presentation case with tamper security tag.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckSeal(!checkSeal)}
                    className="w-full flex items-center gap-3 p-3 border border-[var(--color-line)] bg-[var(--color-stone)] hover:bg-white text-left transition-colors"
                  >
                    {checkSeal ? (
                      <CheckSquare className="size-4 text-[var(--color-ink)] shrink-0" />
                    ) : (
                      <Square className="size-4 text-[var(--color-muted)] shrink-0" />
                    )}
                    <span className="font-sans text-xs text-[var(--color-ink)]">
                      4. Serialized Tamper Pouch: Sealed in armoured transport bag #{securitySealNumber}.
                    </span>
                  </button>
                </div>
              </div>

              {/* Waybill & Dispatch Trigger */}
              <div className="border-t border-[var(--color-line)] pt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Generating customs declaration manifest for ${selectedOrder.orderId}...`,
                      "info"
                    )
                  }
                  className="inline-flex items-center gap-2 border border-[var(--color-line)] bg-white px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-stone)]"
                >
                  <Printer className="size-3.5" />
                  <span>Print Customs Manifest</span>
                </button>

                <Button
                  type="button"
                  disabled={!allChecksPassed || dispatchedSuccess}
                  onClick={handleDispatchArmouredLogistics}
                  className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider bg-[var(--color-ink)] hover:bg-[var(--color-slate)]"
                >
                  <Truck className="size-4" />
                  <span>
                    {dispatchedSuccess
                      ? "Armoured Waybill Generated!"
                      : `Dispatch to ${selectedOrder.courier}`}
                  </span>
                </Button>
              </div>

              {dispatchedSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 font-mono text-xs flex items-center gap-2">
                  <ShieldCheck className="size-5 shrink-0" />
                  <span>
                    Dossier {selectedOrder.orderId} successfully sealed and signed over to Sequel armoured transport! Real-time SMS dispatched with delivery OTP.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
