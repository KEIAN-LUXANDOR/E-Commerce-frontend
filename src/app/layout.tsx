import type { Metadata } from "next";
import "@fontsource-variable/jost";
import "./globals.css";
import { site } from "@/lib/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MiniCartDrawer } from "@/components/layout/MiniCartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { ShopSync } from "@/components/layout/ShopSync";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-paper text-ink font-sans antialiased selection:bg-loupe/15 selection:text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest"
        >
          Skip to content
        </a>
        <ShopSync />
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MiniCartDrawer />
        <WhatsAppButton />
        <CookieNotice />
        <Toaster />
      </body>
    </html>
  );
}