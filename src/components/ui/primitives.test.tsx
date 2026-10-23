import { describe, expect, it } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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

  describe("Input Primitive", () => {
    it("renders accessible label and input element", () => {
      const html = renderToString(
        <Input id="carat-input" label="Carat Weight" placeholder="e.g. 2.05" />
      );
      expect(html).toContain("Carat Weight");
      expect(html).toContain("id=\"carat-input\"");
      expect(html).toContain("h-12");
    });

    it("renders error state with role=alert and aria-invalid", () => {
      const html = renderToString(
        <Input id="email-field" error="Invalid diamond inquiry email" />
      );
      expect(html).toContain("aria-invalid=\"true\"");
      expect(html).toContain("role=\"alert\"");
      expect(html).toContain("Invalid diamond inquiry email");
    });

    it("renders helper text when no error exists", () => {
      const html = renderToString(
        <Input helperText="Enter GIA or IGI certificate number" />
      );
      expect(html).toContain("Enter GIA or IGI certificate number");
      expect(html).toContain("aria-invalid=\"false\"");
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

  describe("Table Primitive", () => {
    it("renders semantic luxury table elements", () => {
      const html = renderToString(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shape</TableHead>
              <TableHead>Carat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Round</TableCell>
              <TableCell>2.01 ct</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(html).toContain("<table");
      expect(html).toContain("<thead");
      expect(html).toContain("<tbody");
      expect(html).toContain("Round");
      expect(html).toContain("2.01 ct");
    });
  });

  describe("cn Utility", () => {
    it("merges tailwind classes without duplicate conflicts", () => {
      const result = cn("p-4 bg-white", "p-6", { "text-black": true, "opacity-50": false });
      expect(result).toBe("bg-white p-6 text-black");
    });
  });
});
