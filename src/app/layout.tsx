import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/jost";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { Footer } from "@/components/layout/Footer";
import { Header, HeaderWithPath } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Toaster } from "@/components/ui/Toaster";
import { ShopSync } from "@/components/layout/ShopSync";
import { getStoreCategories } from "@/lib/api/store";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Certified diamonds`,
    template: `%s | ${site.name}`,
  },
  description: "Certified natural and lab-grown diamonds. Insured delivery across India.",
  openGraph: { siteName: site.name, locale: "en_IN", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getStoreCategories();
  return (
    <html lang="en-IN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<Header categories={categories} pathname="" />}>
          <HeaderWithPath categories={categories} />
        </Suspense>
        <main id="main" className="flex-1 pb-24">
          {children}
        </main>
        <ShopSync />
        <Footer />
        <WhatsAppButton />
        <CookieNotice />
        <Toaster />
      </body>
    </html>
  );
}
