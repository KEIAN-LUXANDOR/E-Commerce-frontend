"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { AccountLink } from "@/components/layout/AccountLink";
import { useCartCount } from "@/lib/shop/cart";
import { setMiniCartOpen } from "@/lib/stores";

export function Header() {
  const cartCount = useCartCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Minimalist scroll effect: add a subtle bottom border when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMobileMenu = () => setMobileMenuOpen(false);
    window.addEventListener("popstate", closeMobileMenu);
    return () => window.removeEventListener("popstate", closeMobileMenu);
  }, []);

  return (
    <header
  className={`sticky top-0 z-40 w-full transition-all duration-300 ${
    isScrolled
      ? "bg-white border-b border-line shadow-sm"
      : "bg-[#F5F0E8] border-b border-transparent"
  }`}
>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex flex-1 items-center gap-8" aria-label="Main navigation">
          <Link href="/diamonds" className="text-sm font-medium uppercase tracking-widest text-ink hover:text-loupe transition-colors">
            Diamonds
          </Link>
          <Link href="/education" className="text-sm font-medium uppercase tracking-widest text-ink hover:text-loupe transition-colors">
            Education
          </Link>
          <Link href="/about" className="text-sm font-medium uppercase tracking-widest text-ink hover:text-loupe transition-colors">
            Our Story
          </Link>
        </nav>

        {/* Left: Mobile Menu Toggle (Mobile) */}
        <div className="flex flex-1 items-center lg:hidden">
          <button 
            type="button" 
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 -ml-2 text-ink hover:bg-stone rounded-lg focus:outline-none touch-manipulation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex justify-center flex-shrink-0">
          <Link href="/" aria-label="KEIAN Luxandor - Home" className="flex shrink-0 flex-col items-center justify-center">
            <Image
              src="/Keian_Luxandor_logo2.png"
              alt="KEIAN Luxandor"
              width={200}
              height={100}
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Right: Utility Icons */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-5">
          <Link href="/search" aria-label="Search" className="p-1.5 text-ink hover:text-loupe transition-colors touch-manipulation">
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          
          <div className="hidden sm:block">
            <AccountLink />
          </div>
          
          <Link href="/wishlist" aria-label="Wishlist" className="p-1.5 text-ink hover:text-loupe transition-colors hidden sm:block touch-manipulation">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          
          <button 
            type="button" 
            aria-label="Cart" 
            className="group relative p-1.5 text-ink hover:text-loupe transition-colors focus:outline-none touch-manipulation"
            onClick={() => setMiniCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 bg-ink text-[9px] font-bold text-white group-hover:bg-loupe transition-colors">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-[85vw] max-w-xs h-full max-h-[100dvh] overflow-y-auto flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between px-4 py-5 border-b border-line">
              <span className="text-lg font-serif tracking-widest text-ink">LUXANDOR</span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-ink hover:bg-stone rounded-lg touch-manipulation"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col gap-5 px-5 py-6">
              <Link href="/diamonds" onClick={() => setMobileMenuOpen(false)} className="py-1 text-sm font-medium uppercase tracking-widest text-ink">Diamonds</Link>
              <Link href="/diamonds/natural" onClick={() => setMobileMenuOpen(false)} className="py-1 pl-3 text-xs font-medium uppercase tracking-widest text-slate hover:text-ink">Natural Diamonds</Link>
              <Link href="/diamonds/lab-grown" onClick={() => setMobileMenuOpen(false)} className="py-1 pl-3 text-xs font-medium uppercase tracking-widest text-slate hover:text-ink">Lab-Grown Diamonds</Link>
              <Link href="/education" onClick={() => setMobileMenuOpen(false)} className="py-1 text-sm font-medium uppercase tracking-widest text-ink">Education</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-1 text-sm font-medium uppercase tracking-widest text-ink">Our Story</Link>
              <div className="h-px w-full bg-line my-1" />
              <div onClick={() => setMobileMenuOpen(false)} className="py-1">
                <AccountLink mobile />
              </div>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-1 text-sm font-medium uppercase tracking-widest text-ink">Wishlist</Link>
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="py-1 text-sm font-medium uppercase tracking-widest text-ink">Cart ({cartCount})</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;