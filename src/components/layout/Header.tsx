"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCartCount } from "@/lib/shop/cart";
import { setMiniCartOpen } from "@/lib/stores";

export function Header() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Minimalist scroll effect: add a subtle bottom border when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-surface transition-all duration-300 ${
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
          <Link href="/" className="text-2xl font-serif tracking-widest text-ink">
            LUXANDOR
          </Link>
        </div>

        {/* Right: Utility Icons */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <Link href="/search" aria-label="Search" className="text-ink hover:text-loupe transition-colors">
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          
          <Link href="/account" aria-label="Account" className="text-ink hover:text-loupe transition-colors hidden sm:block">
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          
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
              <Link href="/diamonds" className="text-sm font-medium uppercase tracking-widest text-ink">Diamonds</Link>
              <Link href="/education" className="text-sm font-medium uppercase tracking-widest text-ink">Education</Link>
              <Link href="/about" className="text-sm font-medium uppercase tracking-widest text-ink">Our Story</Link>
              <div className="h-px w-full bg-line my-2" />
              <Link href="/account" className="text-sm font-medium uppercase tracking-widest text-ink">My Account</Link>
              <Link href="/wishlist" className="text-sm font-medium uppercase tracking-widest text-ink">Wishlist</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;