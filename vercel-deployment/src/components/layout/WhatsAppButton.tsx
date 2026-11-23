"use client";

import { MessageCircle } from "lucide-react";
import * as siteMod from "@/lib/site";

export function WhatsAppButton() {
  // Safely extract the link generator or use a reliable fallback
  const getWaLink = typeof siteMod.whatsappLink === "function" 
    ? siteMod.whatsappLink 
    : (msg?: string) => {
        const phone = siteMod.site?.whatsapp?.replace(/\D/g, "") || "919876543210";
        return `https://wa.me/${phone}?text=${encodeURIComponent(msg || "")}`;
      };

  const link = getWaLink("Hello! I would like to speak to a diamond expert.");

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ask an expert on WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

export default WhatsAppButton;