"use client";

import * as React from "react";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { formatINR } from "@/lib/format";
import { addToCart } from "@/lib/stores";
import type { DiamondSummary } from "@/lib/types/catalog";
import { Check, ShoppingBag, ArrowUpRight } from "lucide-react";

interface DiamondTableProps {
  diamonds: DiamondSummary[];
  className?: string;
}

export function DiamondTable({ diamonds, className }: DiamondTableProps) {
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleQuickAdd = (diamond: DiamondSummary, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      diamondId: diamond.id,
      title: `${diamond.carat.toFixed(2)} ct ${diamond.shape} Diamond`,
      slug: diamond.slug,
      pricePaise: diamond.pricePaise,
      shape: diamond.shape,
      specLabel: `${diamond.color} • ${diamond.clarity}`,
      certificateNumber: diamond.certificateNumber,
      imageUrl: diamond.media[0]?.url,
    });

    setAddedId(diamond.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (diamonds.length === 0) {
    return (
      <div className="py-16 text-center border border-[var(--color-line)] bg-white p-8">
        <p className="font-serif text-lg text-[var(--color-ink)]">No diamonds match your specifications.</p>
        <p className="mt-1 text-xs text-[var(--color-slate)]">Adjust your carat or grade sliders to widen your search.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Shape</TableHead>
            <TableHead>Carat</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Clarity</TableHead>
            <TableHead>Cut</TableHead>
            <TableHead>Lab</TableHead>
            <TableHead>Report #</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="w-32 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diamonds.map((diamond) => {
            const isAdded = addedId === diamond.id;

            let cutLabel = "Good";
            if (diamond.cut === "EXCELLENT") {
              cutLabel = "Ideal";
            } else if (diamond.cut === "VERY_GOOD") {
              cutLabel = "Very Good";
            }

            return (
              <TableRow key={diamond.id} className="group hover:bg-[var(--color-stone)]">
                <TableCell>
                  <ShapeIcon shape={diamond.shape} className="size-6 text-[var(--color-ink)]" />
                </TableCell>

                <TableCell className="font-medium text-xs">
                  <Link
                    href={`/product/${diamond.slug}`}
                    className="hover:text-[var(--color-loupe)] flex items-center gap-1"
                  >
                    <span>{diamond.shape}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </TableCell>

                <TableCell className="font-mono font-medium">
                  {`${diamond.carat.toFixed(2)} ct`}
                </TableCell>

                <TableCell className="font-mono">
                  {diamond.color}
                </TableCell>

                <TableCell className="font-mono">
                  {diamond.clarity}
                </TableCell>

                <TableCell className="text-xs text-[var(--color-slate)]">
                  {cutLabel}
                </TableCell>

                <TableCell>
                  <Badge variant="cert" className="text-[10px]">
                    {diamond.lab}
                  </Badge>
                </TableCell>

                <TableCell className="font-mono text-xs text-[var(--color-muted)]">
                  {diamond.certificateNumber || "—"}
                </TableCell>

                <TableCell className="font-mono font-semibold text-right">
                  {formatINR(diamond.pricePaise)}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant={isAdded ? "accent" : "outline"}
                    size="sm"
                    onClick={(e) => handleQuickAdd(diamond, e)}
                    className="text-[0.625rem]"
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3 w-3" />
                        <span>Reserve</span>
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
