import Link from "next/link";
import { ShieldCheck, FileCheck2, Truck, RotateCcw } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { CurrentYear } from "@/components/layout/CurrentYear";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface text-ink">
      {/* Promise Strip */}
      <div className="border-b border-line bg-platinum/60">
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
              <p className="text-sm font-medium text-ink">Insured Delivery</p>
              <p className="text-xs text-slate mt-0.5">
                Sealed, tamper-evident transit insured to your doorstep.
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
      <div className="page grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-slate leading-relaxed">
            {site.description}
          </p>
          <div className="text-xs text-slate space-y-1">
            {site.addressLine && <p>{site.addressLine}</p>}
            {site.hours && <p>Hours: {site.hours}</p>}
            {site.phone && (
              <p>
                Phone:{" "}
                <a href={`tel:${site.phone}`} className="text-ink hover:underline">
                  {site.phone}
                </a>
              </p>
            )}
            {site.email && (
              <p>
                Email:{" "}
                <a href={`mailto:${site.email}`} className="text-ink hover:underline">
                  {site.email}
                </a>
              </p>
            )}
          </div>
          <div className="pt-2 max-w-sm">
            <NewsletterForm />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate">
            <li>
              <Link href="/diamonds" className="hover:text-ink transition-colors">
                All Diamonds
              </Link>
            </li>
            <li>
              <Link href="/diamonds/natural" className="hover:text-ink transition-colors">
                Natural Diamonds
              </Link>
            </li>
            <li>
              <Link href="/diamonds/lab-grown" className="hover:text-ink transition-colors">
                Lab-Grown Diamonds
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-ink transition-colors">
                Saved Wishlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Learn</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate">
            <li>
              <Link href="/education" className="hover:text-ink transition-colors">
                Education Hub
              </Link>
            </li>
            <li>
              <Link href="/education/4cs" className="hover:text-ink transition-colors">
                The 4Cs Explained
              </Link>
            </li>
            <li>
              <Link href="/education/natural-vs-lab" className="hover:text-ink transition-colors">
                Natural vs. Lab-Grown
              </Link>
            </li>
            <li>
              <Link href="/education/shapes" className="hover:text-ink transition-colors">
                Diamond Shapes
              </Link>
            </li>
            <li>
              <Link href="/education/reading-a-certificate" className="hover:text-ink transition-colors">
                Reading a Certificate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Customer Care</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate">
            <li>
              <Link href="/contact" className="hover:text-ink transition-colors">
                Contact &amp; Showroom Visit
              </Link>
            </li>
            <li>
              <Link href="/order-tracking" className="hover:text-ink transition-colors">
                Track an Order
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-ink transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-ink transition-colors">
                Shipping &amp; Insurance
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-ink transition-colors">
                Returns Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Row */}
      <div className="border-t border-line py-6">
        <div className="page flex flex-col gap-3 text-xs text-slate sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              © <CurrentYear /> {site.legalName || site.name}. All rights reserved.
            </span>
            {site.gstin && <span>GSTIN: {site.gstin}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-ink transition-colors">
              Terms of Service
            </Link>
            <Link href="/returns" className="hover:text-ink transition-colors">
              Refunds &amp; Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;