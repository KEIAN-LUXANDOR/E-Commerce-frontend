import Link from "next/link";
import { ShieldCheck, FileCheck2, Truck, RotateCcw } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { MarketSelector } from "@/components/market/MarketSelector";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-anchor text-white">
      {/* Promise Strip */}
      <div className="border-b border-line bg-sand text-ink">
        <div className="page grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <FileCheck2 className="h-5 w-5 shrink-0 text-ink mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ink">GIA &amp; IGI Certified</p>
              <p className="text-xs text-slate mt-0.5">
                Every loose diamond includes its original grading report.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-ink mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ink">Checked Before Dispatch</p>
              <p className="text-xs text-slate mt-0.5">
                Laser inscription and grades verified in our Pune showroom.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 shrink-0 text-ink mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ink">Delivery Arrangements</p>
              <p className="text-xs text-slate mt-0.5">
                Complimentary delivery in India. International shipping is confirmed by request.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="h-5 w-5 shrink-0 text-ink mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ink">{site.returnDays}-Day Returns</p>
              <p className="text-xs text-slate mt-0.5">
                Full refund with the original certificate intact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="page grid grid-cols-1 gap-10 py-14 text-white md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <Logo className="[&_img]:brightness-0 [&_img]:invert" />
          <p className="max-w-sm text-sm text-white/70 leading-relaxed">
            {site.description}
          </p>
          <div className="text-xs text-white/65 space-y-1">
            {site.addressLine && <p>{site.addressLine}</p>}
            {site.hours && <p>Hours: {site.hours}</p>}
            {site.phone && (
              <p>
                Phone:{" "}
                <a href={`tel:${site.phone}`} className="text-white/90 transition-colors hover:text-[#D5C09A] hover:underline">
                  {site.phone}
                </a>
              </p>
            )}
            {site.email && (
              <p>
                Email:{" "}
                <a href={`mailto:${site.email}`} className="text-white/90 transition-colors hover:text-[#D5C09A] hover:underline">
                  {site.email}
                </a>
              </p>
            )}
          </div>
          <div className="pt-2 max-w-sm">
            <NewsletterForm />
          </div>
          <div className="max-w-sm pt-2">
            <MarketSelector />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E7D8BD]">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            <li>
              <Link href="/diamonds" className="transition-colors hover:text-[#E7D8BD]">
                All Diamonds
              </Link>
            </li>
            <li>
              <Link href="/diamonds/natural" className="transition-colors hover:text-[#E7D8BD]">
                Natural Diamonds
              </Link>
            </li>
            <li>
              <Link href="/diamonds/lab-grown" className="transition-colors hover:text-[#E7D8BD]">
                Lab-Grown Diamonds
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="transition-colors hover:text-[#E7D8BD]">
                Saved Wishlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E7D8BD]">Learn</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            <li>
              <Link href="/education" className="transition-colors hover:text-[#E7D8BD]">
                Education Hub
              </Link>
            </li>
            <li>
              <Link href="/education/4cs" className="transition-colors hover:text-[#E7D8BD]">
                The 4Cs Explained
              </Link>
            </li>
            <li>
              <Link href="/education/natural-vs-lab" className="transition-colors hover:text-[#E7D8BD]">
                Natural vs. Lab-Grown
              </Link>
            </li>
            <li>
              <Link href="/education/shapes" className="transition-colors hover:text-[#E7D8BD]">
                Diamond Shapes
              </Link>
            </li>
            <li>
              <Link href="/education/reading-a-certificate" className="transition-colors hover:text-[#E7D8BD]">
                Reading a Certificate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E7D8BD]">Customer Care</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            <li>
              <Link href="/contact" className="transition-colors hover:text-[#E7D8BD]">
                Contact &amp; Showroom Visit
              </Link>
            </li>
            <li>
              <Link href="/order-tracking" className="transition-colors hover:text-[#E7D8BD]">
                Track an Order
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition-colors hover:text-[#E7D8BD]">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="transition-colors hover:text-[#E7D8BD]">
                Shipping &amp; Delivery
              </Link>
            </li>
            <li>
              <Link href="/returns" className="transition-colors hover:text-[#E7D8BD]">
                Returns Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Row */}
      <div className="border-t border-white/15 bg-[#162C26] py-6">
        <div className="page flex flex-col gap-3 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              © <CurrentYear /> {site.legalName || site.name}. All rights reserved.
            </span>
            {site.gstin && <span>GSTIN: {site.gstin}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-[#E7D8BD]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#E7D8BD]">
              Terms of Service
            </Link>
            <Link href="/returns" className="transition-colors hover:text-[#E7D8BD]">
              Refunds &amp; Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;