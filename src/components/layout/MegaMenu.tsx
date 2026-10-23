"use client";

import * as React from "react";
import Link from "next/link";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { SHAPES } from "@/lib/catalog-labels";
import { ShieldCheck, BookOpen, Sparkles, ArrowRight } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="diamonds-mega-menu"
      role="region"
      aria-label="Loose Diamonds Catalog Navigation"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full z-40 border-b border-[var(--color-line)] bg-white shadow-[0_20px_40px_rgba(22,24,29,0.06)] animate-in fade-in-0 slide-in-from-top-2 duration-150"
    >
      <div className="page py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Column 1: Diamond Shapes Visual Grid (6 cols) */}
          <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-[var(--color-line)] pb-6 lg:pb-0 lg:pr-8">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)]">
                Browse By Silhouette
              </span>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-xs uppercase tracking-[0.08em] text-[var(--color-loupe)] hover:underline flex items-center gap-1 font-medium"
              >
                View All Shapes
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <ul className="mt-5 grid grid-cols-5 gap-3 sm:gap-4">
              {SHAPES.map((shapeItem) => (
                <li key={shapeItem.value}>
                  <Link
                    href={`/shop?shape=${shapeItem.slug}`}
                    onClick={onClose}
                    className="group flex flex-col items-center gap-2 p-2.5 border border-transparent hover:border-[var(--color-line)] hover:bg-[var(--color-stone)] transition-colors"
                  >
                    <ShapeIcon
                      shape={shapeItem.value}
                      detailed
                      className="size-11 text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-loupe)]"
                    />
                    <span className="text-xs tracking-[0.04em] text-[var(--color-slate)] group-hover:text-[var(--color-ink)] font-medium">
                      {shapeItem.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Origin & Carat Range Quick Links (3 cols) */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--color-line)] pb-6 lg:pb-0 lg:pr-8 space-y-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)] block pb-3 border-b border-[var(--color-line)]">
                Diamond Origin
              </span>
              <ul className="mt-4 space-y-2.5 text-xs tracking-[0.04em]">
                <li>
                  <Link
                    href="/shop/natural-diamonds"
                    onClick={onClose}
                    className="flex items-center justify-between text-[var(--color-ink)] hover:text-[var(--color-loupe)] font-medium"
                  >
                    <span>Natural Certified</span>
                    <span className="text-[10px] text-[var(--color-muted)] uppercase">GIA Monitored</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/lab-grown-diamonds"
                    onClick={onClose}
                    className="flex items-center justify-between text-[var(--color-ink)] hover:text-[var(--color-loupe)] font-medium"
                  >
                    <span>Lab-Grown Certified</span>
                    <span className="text-[10px] text-[var(--color-muted)] uppercase">IGI / GIA</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)] block pb-3 border-b border-[var(--color-line)]">
                Popular Carats
              </span>
              <ul className="mt-3.5 space-y-2 text-xs text-[var(--color-slate)]">
                <li>
                  <Link
                    href="/shop?carat=0.9-1.2"
                    onClick={onClose}
                    className="hover:text-[var(--color-loupe)] transition-colors"
                  >
                    1.00 Carat Solitaires
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?carat=1.4-1.7"
                    onClick={onClose}
                    className="hover:text-[var(--color-loupe)] transition-colors"
                  >
                    1.50 Carat Collector Stones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?carat=1.9-2.3"
                    onClick={onClose}
                    className="hover:text-[var(--color-loupe)] transition-colors"
                  >
                    2.00+ Carat Statement Diamonds
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Gemological Knowledge & Assurances (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)] block pb-3 border-b border-[var(--color-line)]">
                Education &amp; Science
              </span>
              <ul className="mt-4 space-y-3 text-xs tracking-[0.03em]">
                <li>
                  <Link
                    href="/education"
                    onClick={onClose}
                    className="group flex items-start gap-2.5 text-[var(--color-ink)] hover:text-[var(--color-loupe)]"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-[var(--color-slate)] group-hover:text-[var(--color-loupe)] mt-0.5" />
                    <div>
                      <p className="font-medium">The 4Cs Masterclass</p>
                      <p className="text-[11px] text-[var(--color-muted)]">Cut proportions, color spectrum &amp; clarity</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/education/reading-a-certificate"
                    onClick={onClose}
                    className="group flex items-start gap-2.5 text-[var(--color-ink)] hover:text-[var(--color-loupe)]"
                  >
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--color-slate)] group-hover:text-[var(--color-loupe)] mt-0.5" />
                    <div>
                      <p className="font-medium">Reading a Certificate</p>
                      <p className="text-[11px] text-[var(--color-muted)]">GIA &amp; IGI metrology breakdown</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/education/natural-vs-lab"
                    onClick={onClose}
                    className="group flex items-start gap-2.5 text-[var(--color-ink)] hover:text-[var(--color-loupe)]"
                  >
                    <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-slate)] group-hover:text-[var(--color-loupe)] mt-0.5" />
                    <div>
                      <p className="font-medium">Natural vs. Lab-Grown</p>
                      <p className="text-[11px] text-[var(--color-muted)]">Crystal structures and value truth</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Atelier Note */}
            <div className="bg-[var(--color-stone)] border border-[var(--color-line)] p-3.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink)]">
                Forensic Assurance
              </p>
              <p className="mt-1 text-xs text-[var(--color-slate)] leading-relaxed">
                Every stone is verified under 10x magnification against its laser inscription before tamper-evident dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
