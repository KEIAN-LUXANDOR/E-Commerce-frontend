"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { Shape, DiamondColor, Clarity, CutGrade, Origin } from "@/lib/types/catalog";

export interface DiamondFilterState {
  shapes: Shape[];
  origins: Origin[];
  colors: DiamondColor[];
  clarities: Clarity[];
  cuts: CutGrade[];
  caratMin?: number;
  caratMax?: number;
  minPrice?: number;
  maxPrice?: number;
  sort: string;
  view: "grid" | "table";
  page: number;
}

/**
 * Custom hook providing clean, bi-directional URL query binding for diamond catalog facets.
 * Fully type-safe, human-readable control flow with zero nested ternaries.
 */
export function useDiamondFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse state from active URL query parameters
  const filters: DiamondFilterState = useMemo(() => {
    const rawShape = searchParams.get("shape");
    const shapes: Shape[] = rawShape
      ? (rawShape.toUpperCase().split(",") as Shape[])
      : [];

    const rawOrigin = searchParams.get("origin");
    const origins: Origin[] = rawOrigin
      ? (rawOrigin.toUpperCase().split(",") as Origin[])
      : [];

    const rawColor = searchParams.get("color");
    const colors: DiamondColor[] = rawColor
      ? (rawColor.toUpperCase().split(",") as DiamondColor[])
      : [];

    const rawClarity = searchParams.get("clarity");
    const clarities: Clarity[] = rawClarity
      ? (rawClarity.toUpperCase().split(",") as Clarity[])
      : [];

    const rawCut = searchParams.get("cut");
    const cuts: CutGrade[] = rawCut
      ? (rawCut.toUpperCase().split(",") as CutGrade[])
      : [];

    const rawCaratMin = searchParams.get("caratMin");
    let caratMin: number | undefined = undefined;
    if (rawCaratMin) {
      const parsed = parseFloat(rawCaratMin);
      if (!isNaN(parsed)) {
        caratMin = parsed;
      }
    }

    const rawCaratMax = searchParams.get("caratMax");
    let caratMax: number | undefined = undefined;
    if (rawCaratMax) {
      const parsed = parseFloat(rawCaratMax);
      if (!isNaN(parsed)) {
        caratMax = parsed;
      }
    }

    const rawMinPrice = searchParams.get("minPrice");
    let minPrice: number | undefined = undefined;
    if (rawMinPrice) {
      const parsed = parseInt(rawMinPrice, 10);
      if (!isNaN(parsed)) {
        minPrice = parsed;
      }
    }

    const rawMaxPrice = searchParams.get("maxPrice");
    let maxPrice: number | undefined = undefined;
    if (rawMaxPrice) {
      const parsed = parseInt(rawMaxPrice, 10);
      if (!isNaN(parsed)) {
        maxPrice = parsed;
      }
    }

    const sort = searchParams.get("sort") || "featured";

    let view: "grid" | "table" = "grid";
    if (searchParams.get("view") === "table") {
      view = "table";
    }

    const rawPage = searchParams.get("page");
    let page = 0;
    if (rawPage) {
      const parsed = parseInt(rawPage, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        page = parsed;
      }
    }

    return {
      shapes,
      origins,
      colors,
      clarities,
      cuts,
      caratMin,
      caratMax,
      minPrice,
      maxPrice,
      sort,
      view,
      page,
    };
  }, [searchParams]);

  // Update URL queries with fresh patch
  const updateFilters = useCallback(
    (patch: Partial<DiamondFilterState>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      if (patch.shapes !== undefined) {
        if (patch.shapes.length > 0) {
          params.set("shape", patch.shapes.join(",").toLowerCase());
        } else {
          params.delete("shape");
        }
      }

      if (patch.origins !== undefined) {
        if (patch.origins.length > 0) {
          params.set("origin", patch.origins.join(",").toLowerCase());
        } else {
          params.delete("origin");
        }
      }

      if (patch.colors !== undefined) {
        if (patch.colors.length > 0) {
          params.set("color", patch.colors.join(",").toLowerCase());
        } else {
          params.delete("color");
        }
      }

      if (patch.clarities !== undefined) {
        if (patch.clarities.length > 0) {
          params.set("clarity", patch.clarities.join(",").toLowerCase());
        } else {
          params.delete("clarity");
        }
      }

      if (patch.cuts !== undefined) {
        if (patch.cuts.length > 0) {
          params.set("cut", patch.cuts.join(",").toLowerCase());
        } else {
          params.delete("cut");
        }
      }

      if (patch.caratMin !== undefined) {
        if (patch.caratMin !== undefined) {
          params.set("caratMin", patch.caratMin.toString());
        } else {
          params.delete("caratMin");
        }
      }

      if (patch.caratMax !== undefined) {
        if (patch.caratMax !== undefined) {
          params.set("caratMax", patch.caratMax.toString());
        } else {
          params.delete("caratMax");
        }
      }

      if (patch.minPrice !== undefined) {
        if (patch.minPrice !== undefined) {
          params.set("minPrice", patch.minPrice.toString());
        } else {
          params.delete("minPrice");
        }
      }

      if (patch.maxPrice !== undefined) {
        if (patch.maxPrice !== undefined) {
          params.set("maxPrice", patch.maxPrice.toString());
        } else {
          params.delete("maxPrice");
        }
      }

      if (patch.sort !== undefined) {
        params.set("sort", patch.sort);
      }

      if (patch.view !== undefined) {
        params.set("view", patch.view);
      }

      if (resetPage) {
        params.delete("page");
      } else if (patch.page !== undefined) {
        if (patch.page > 0) {
          params.set("page", patch.page.toString());
        } else {
          params.delete("page");
        }
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    updateFilters,
    clearAllFilters,
  };
}
