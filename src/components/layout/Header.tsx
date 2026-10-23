"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, ArrowLeftRight } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { Logo } from "@/components/layout/Logo";
import { MiniCartDrawer } from "@/components/layout/MiniCartDrawer";
import { SearchBox } from "@/components/layout/SearchBox";
import { AccountLink } from "@/components/store/AccountLink";
import { Dialog } from "@/components/ui/dialog";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { SHAPES } from "@/lib/catalog-labels";
import { site } from "@/lib/site";
import { setMiniCartOpen, useCart, useWishlist, useCompare } from "@/lib/stores";
import type { StoreCategory } from "@/lib/types/store";

const categoryHref = (slug: string) => `/shop/${encodeURIComponent(slug)}`;

function getWishlistAriaLabel(count: number): string {
  if (count <= 0) {
    return "Wishlist";
  }
  const noun = count === 1 ? "item" : "items";
  return `Wishlist, ${count} ${noun}`;
}

function getCartAriaLabel(count: number): string {
  const noun = count === 1 ? "item" : "items";
  return `Cart, ${count} ${noun}`;
}

/**
 * Reads the current path to highlight active links. Rendered only in browser.
 */
export function HeaderWithPath({ categories }: { categories: StoreCategory[] }) {
  const pathname = usePathname();
  return <Header categories={categories} pathname={pathname} />;
}

export function Header({
  categories,
  pathname,
}: {
  categories: StoreCategory[];
  pathname: string;
}) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = useCart().length;
  const wishCount = useWishlist().length;
  const compareCount = useCompare().length;
  const navRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaMenuOpen(false);
    setMobileNav(false);
    setMobileSearch(false);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaMenuOpen(false);
      }
    }
    function onDocumentClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  const handleHoverMenu = (shouldOpen: boolean) => {
    window.clearTimeout(hoverTimer.current);
    const delay = shouldOpen ? 80 : 160;
    hoverTimer.current = window.setTimeout(() => {
      setMegaMenuOpen(shouldOpen);
    }, delay);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[3px] focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Main Header */}
      <header className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md transition-all ${
        scrolled
          ? "border-b-2 border-[var(--brand-accent)] shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          : "border-b border-[var(--color-line)]"
      }`}>
        <div className="page flex h-16 items-center justify-between gap-3 lg:gap-8">
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="-ml-2 grid size-10 place-items-center rounded-none text-[var(--color-ink)] hover:bg-[var(--color-stone)] lg:hidden transition-colors"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          {/* Luxury Logo */}
          <Logo className="shrink-0" />

          {/* Desktop Navigation */}
          <nav
            ref={navRef}
            aria-label="Main Navigation"
            className="hidden h-full lg:flex items-center"
            onMouseLeave={() => handleHoverMenu(false)}
          >
            <ul className="flex h-full items-stretch gap-1 text-xs font-medium uppercase tracking-[0.08em]">
              {/* Diamonds Catalog with Mega Menu Trigger */}
              <li
                className="flex items-center"
                onMouseEnter={() => handleHoverMenu(true)}
              >
                <button
                  type="button"
                  aria-expanded={megaMenuOpen}
                  aria-controls="diamonds-mega-menu"
                  onClick={() => setMegaMenuOpen((prev) => !prev)}
                  data-active={megaMenuOpen || pathname.startsWith("/shop") || pathname.startsWith("/product")}
                  className={`header-nav-link flex items-center gap-1.5 px-3.5 py-2 text-[var(--color-ink)] hover:text-[var(--color-loupe)] transition-colors ${
                    megaMenuOpen ? "text-[var(--color-loupe)]" : ""
                  }`}
                >
                  <span>Diamonds</span>
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </li>

              {/* Direct Category Links */}
              {categories.slice(0, 3).map((category) => {
                const isActive = pathname === categoryHref(category.slug);
                return (
                  <li key={category.id} className="flex items-center">
                    <Link
                      href={categoryHref(category.slug)}
                      aria-current={isActive ? "page" : undefined}
                      data-active={isActive}
                      className={`header-nav-link flex items-center px-3.5 py-2 text-[var(--color-ink)] hover:text-[var(--color-loupe)] transition-colors ${
                        isActive ? "text-[var(--color-loupe)] font-semibold" : ""
                      }`}
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}

              {/* Education Link */}
              <li className="flex items-center">
                <Link
                  href="/education"
                  aria-current={pathname.startsWith("/education") ? "page" : undefined}
                  data-active={pathname.startsWith("/education")}
                  className={`header-nav-link flex items-center px-3.5 py-2 text-[var(--color-ink)] hover:text-[var(--color-loupe)] transition-colors ${
                    pathname.startsWith("/education") ? "text-[var(--color-loupe)] font-semibold" : ""
                  }`}
                >
                  Education &amp; 4Cs
                </Link>
              </li>

              {/* About Atelier Link */}
              <li className="flex items-center">
                <Link
                  href="/about"
                  aria-current={pathname === "/about" ? "page" : undefined}
                  data-active={pathname === "/about"}
                  className={`header-nav-link flex items-center px-3.5 py-2 text-[var(--color-ink)] hover:text-[var(--color-loupe)] transition-colors ${
                    pathname === "/about" ? "text-[var(--color-loupe)] font-semibold" : ""
                  }`}
                >
                  About
                </Link>
              </li>

              {/* Contact Concierge Link */}
              <li className="flex items-center">
                <Link
                  href="/contact"
                  aria-current={pathname === "/contact" ? "page" : undefined}
                  data-active={pathname === "/contact"}
                  className={`header-nav-link flex items-center px-3.5 py-2 text-[var(--color-ink)] hover:text-[var(--color-loupe)] transition-colors ${
                    pathname === "/contact" ? "text-[var(--color-loupe)] font-semibold" : ""
                  }`}
                >
                  Concierge
                </Link>
              </li>
            </ul>

            {/* Mega Menu Overlay */}
            <MegaMenu
              isOpen={megaMenuOpen}
              onClose={() => setMegaMenuOpen(false)}
              onMouseEnter={() => handleHoverMenu(true)}
              onMouseLeave={() => handleHoverMenu(false)}
            />
          </nav>

          {/* Right Action Icons: Search, Compare, Wishlist, Account, Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            <SearchBox className="hidden w-64 md:block xl:w-80" />

            <button
              type="button"
              onClick={() => setMobileSearch(true)}
              className="grid size-10 place-items-center rounded-full text-ink hover:bg-stone md:hidden transition-colors"
              aria-label="Search diamonds"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>

            {/* Compare Action */}
            <Link
              href="/compare"
              prefetch={false}
              className="relative hidden size-10 place-items-center rounded-full text-ink hover:bg-stone sm:grid transition-colors"
              aria-label={`Compare diamonds, ${compareCount} selected`}
            >
              <ArrowLeftRight className="size-4" aria-hidden="true" />
              <CountBadge count={compareCount} />
            </Link>

            {/* Wishlist Action */}
            <Link
              href="/wishlist"
              prefetch={false}
              className="relative hidden size-10 place-items-center rounded-full text-ink hover:bg-stone sm:grid transition-colors"
              aria-label={getWishlistAriaLabel(wishCount)}
            >
              <Heart className="size-4" aria-hidden="true" />
              <CountBadge count={wishCount} />
            </Link>

            <AccountLink />

            <button
              type="button"
              onClick={() => setMiniCartOpen(true)}
              className="relative grid size-10 place-items-center rounded-full text-ink hover:bg-stone transition-colors"
              aria-label={getCartAriaLabel(cartCount)}
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              <CountBadge count={cartCount} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <Dialog
        open={mobileNav}
        onClose={() => setMobileNav(false)}
        title="Navigation"
        side="left"
      >
        <nav aria-label="Mobile Navigation" className="space-y-6">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)] block mb-3">
              Browse Silhouettes
            </span>
            <ul className="grid grid-cols-5 gap-2 pb-4 border-b border-[var(--color-line)]">
              {SHAPES.slice(0, 5).map((shapeItem) => (
                <li key={shapeItem.value}>
                  <Link
                    href={`/shop?shape=${shapeItem.slug}`}
                    onClick={() => setMobileNav(false)}
                    className="flex flex-col items-center gap-1 text-[0.6875rem] text-[var(--color-slate)] p-1.5 hover:bg-[var(--color-stone)]"
                  >
                    <ShapeIcon shape={shapeItem.value} className="size-7 text-[var(--color-ink)]" />
                    <span className="truncate">{shapeItem.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)] block mb-2">
              Collections
            </span>
            <ul className="divide-y divide-[var(--color-line)] text-sm font-medium">
              <li>
                <Link
                  href="/shop/natural-diamonds"
                  onClick={() => setMobileNav(false)}
                  className="block py-2.5 hover:text-[var(--color-loupe)]"
                >
                  Natural Certified Diamonds
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/lab-grown-diamonds"
                  onClick={() => setMobileNav(false)}
                  className="block py-2.5 hover:text-[var(--color-loupe)]"
                >
                  Lab-Grown Certified Diamonds
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  onClick={() => setMobileNav(false)}
                  className="block py-2.5 hover:text-[var(--color-loupe)]"
                >
                  All Loose Diamonds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)] block mb-2">
              Education &amp; Trust
            </span>
            <ul className="divide-y divide-[var(--color-line)] text-sm text-[var(--color-slate)]">
              <li>
                <Link
                  href="/education"
                  onClick={() => setMobileNav(false)}
                  className="block py-2.5 hover:text-[var(--color-ink)]"
                >
                  The 4Cs Masterclass
                </Link>
              </li>
              <li>
                <Link
                  href="/education/reading-a-certificate"
                  onClick={() => setMobileNav(false)}
                  className="block py-2.5 hover:text-[var(--color-ink)]"
                >
                  Reading a Grading Certificate
                </Link>
              </li>
              <li>
                <Link
                  href="/education/natural-vs-lab"
                  onClick={() => setMobileNav(false)}
                  className="block py-2.5 hover:text-[var(--color-ink)]"
                >
                  Natural vs. Lab-Grown Diamonds
                </Link>
              </li>
            </ul>
          </div>

          {/* Digital Concierge Contact (No physical showroom) */}
          <div className="pt-4 border-t border-[var(--color-line)] space-y-2 text-xs">
            <Link
              href="/contact"
              onClick={() => setMobileNav(false)}
              className="block font-medium text-[var(--color-loupe)] uppercase tracking-[0.06em]"
            >
              Contact Digital Concierge
            </Link>
            <a
              href={site.phoneHref}
              className="block text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            >
              {site.phone}
            </a>
          </div>
        </nav>
      </Dialog>

      {/* Mobile Search Overlay */}
      <Dialog
        open={mobileSearch}
        onClose={() => setMobileSearch(false)}
        title="Search Catalog"
        side="bottom"
        className="min-h-[70dvh]"
      >
        <SearchBox autoFocus onNavigate={() => setMobileSearch(false)} />
      </Dialog>

      {/* Slide-out Cart Drawer */}
      <MiniCartDrawer />
    </>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }

  let displayText = String(count);
  if (count > 9) {
    displayText = "9+";
  }

  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-ink px-1 text-[0.625rem] font-semibold text-white tabular-nums shadow-xs">
      {displayText}
    </span>
  );
}
