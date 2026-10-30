import { describe, expect, it } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

describe("UI Primitives - Spec v3", () => {
  describe("Button Primitive", () => {
    it("generates correct classes for primary square luxury button", () => {
      const classes = buttonVariants({ variant: "primary", size: "md" });
      expect(classes).toContain("bg-[var(--color-ink)]");
      expect(classes).toContain("tracking-[0.08em]");
      expect(classes).toContain("uppercase");
    });

    it("generates correct classes for secondary button", () => {
      const classes = buttonVariants({ variant: "secondary" });
      expect(classes).toContain("bg-white");
      expect(classes).toContain("border-[var(--color-line-dark)]");
    });

    it("renders button element with text content in SSR", () => {
      const html = renderToString(<Button variant="primary">Acquire Diamond</Button>);
      expect(html).toContain("Acquire Diamond");
      expect(html).toContain("<button");
    });

    it("renders loading spinner and disabled state when isLoading is true", () => {
      const html = renderToString(<Button isLoading>Processing</Button>);
      expect(html).toContain("disabled=\"\"");
      expect(html).toContain("animate-spin");
    });
  });


  describe("Badge Primitive", () => {
    it("renders gemological grade badge variants", () => {
      const okClasses = badgeVariants({ variant: "ok" });
      expect(okClasses).toContain("text-[var(--color-ok)]");

      const certClasses = badgeVariants({ variant: "cert" });
      expect(certClasses).toContain("text-[var(--color-loupe)]");
    });

    it("renders bullet dot when withDot is true", () => {
      const html = renderToString(<Badge variant="ok" withDot>In Vault</Badge>);
      expect(html).toContain("In Vault");
      expect(html).toContain("rounded-full");
    });
  });


  describe("cn Utility", () => {
    it("merges tailwind classes without duplicate conflicts", () => {
      const result = cn("p-4 bg-white", "p-6", { "text-black": true, "opacity-50": false });
      expect(result).toBe("bg-white p-6 text-black");
    });
  });
});
