"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { AccountLink } from "@/components/layout/AccountLink";
import { useCartCount } from "@/lib/shop/cart";
import { setMiniCartOpen } from "@/lib/stores";
import Image from "next/image";

export function Header() {
  const cartCount = useCartCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Minimalist scroll effect: add a subtle bottom border when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMobileMenu = () => setMobileMenuOpen(false);
    window.addEventListener("popstate", closeMobileMenu);
    return () => window.removeEventListener("popstate", closeMobileMenu);
  }, []);

  return (
    <header
  className={`sticky top-0 z-40 w-full bg-[#F5F0E8] transition-all duration-300 ${
    isScrolled ? "border-b border-line shadow-sm" : ""
  }`}
>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex flex-1 items-center gap-8">
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
            className="text-ink focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex justify-center flex-shrink-0">
         <Link
  href="/"
  aria-label="KEIAN Luxandor - Home"
  className="flex shrink-0 flex-col items-center justify-center"
>
  <Image
    src="/Keian.png"
    alt="KEIAN Luxandor"
    width={220}
    height={90}
    priority
    className="h-auto p-3 w-[150px] object-contain sm:w-100px] lg:w-[100px]"
  />
</Link>
        </div>

        {/* Right: Utility Icons */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <Link href="/search" aria-label="Search" className="text-ink hover:text-loupe transition-colors">
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          
          <div className="hidden sm:block">
            <AccountLink />
          </div>
          
          <Link href="/wishlist" aria-label="Wishlist" className="text-ink hover:text-loupe transition-colors hidden sm:block">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          
          <button 
            type="button" 
            aria-label="Cart" 
            className="group relative text-ink hover:text-loupe transition-colors focus:outline-none"
            onClick={() => setMiniCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-white group-hover:bg-loupe transition-colors">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-ink/40 transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between px-4 py-5 border-b border-line">
              <span className="text-lg font-serif tracking-widest text-ink">LUXANDOR</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="text-ink">
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col gap-6 px-4 py-8">
              <Link href="/diamonds" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium uppercase tracking-widest text-ink">Diamonds</Link>
              <Link href="/education" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium uppercase tracking-widest text-ink">Education</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium uppercase tracking-widest text-ink">Our Story</Link>
              <div className="h-px w-full bg-line my-2" />
              <div onClick={() => setMobileMenuOpen(false)}>
                <AccountLink mobile />
              </div>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium uppercase tracking-widest text-ink">Wishlist</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;