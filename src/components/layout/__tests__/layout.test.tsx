import { describe, expect, it } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { site } from "@/lib/site";

describe("Layout Components - Spec v3", () => {
  describe("AnnouncementBar", () => {
    it("renders complimentary insured delivery notice", () => {
      const html = renderToString(<AnnouncementBar />);
      expect(html).toContain("Complimentary Insured Delivery Across India");
      expect(html).toContain("GIA &amp; IGI Certified Loose Diamonds");
    });

    it("does not mention any physical showroom", () => {
      const html = renderToString(<AnnouncementBar />);
      expect(html.toLowerCase()).not.toContain("showroom");
      expect(html.toLowerCase()).not.toContain("salon");
      expect(html).toContain("Digital Concierge");
    });
  });

  describe("MegaMenu", () => {
    it("returns null when isOpen is false", () => {
      const html = renderToString(<MegaMenu isOpen={false} onClose={() => {}} />);
      expect(html).toBe("");
    });

    it("renders diamond shapes and education links when open", () => {
      const html = renderToString(<MegaMenu isOpen={true} onClose={() => {}} />);
      expect(html).toContain("Browse By Silhouette");
      expect(html).toContain("Round");
      expect(html).toContain("Oval");
      expect(html).toContain("Emerald");
      expect(html).toContain("The 4Cs Masterclass");
      expect(html).toContain("Reading a Certificate");
      expect(html).toContain("Natural vs. Lab-Grown");
    });
  });

  describe("WhatsAppButton", () => {
    it("renders the configured gemologist concierge link", () => {
      const previousNumber = site.whatsapp;
      site.whatsapp = "919876543210";
      try {
        const html = renderToString(<WhatsAppButton />);
        expect(html).toContain("Gemologist Concierge");
        expect(html).toContain("https://wa.me/919876543210");
      } finally {
        site.whatsapp = previousNumber;
      }
    });
  });
});
