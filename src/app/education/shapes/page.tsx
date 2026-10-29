import { Metadata } from "next";
import Link from "next/link";
import { ShapeIcon } from "@/components/art/ShapeIcon";

import { ArrowRight,    } from "lucide-react";
import type { Shape } from "@/lib/types/catalog";

export const metadata: Metadata = {
  title: "Diamond Shapes Architecture & Anatomy | Keian Luxandor Education",
  description:
    "Explore the geometry, facet arrangements, optical performance, and ideal length-to-width ratios for all diamond silhouettes.",
};

interface ShapeGuide {
  shape: Shape;
  title: string;
  facets: number;
  style: "Brilliant" | "Step Cut" | "Mixed Cut";
  ratio: string;
  scintillation: string;
  description: string;
  opticalTip: string;
}

const SHAPE_GUIDES: ShapeGuide[] = [
  {
    shape: "ROUND",
    title: "Round Brilliant",
    facets: 57,
    style: "Brilliant",
    ratio: "1.00 – 1.02",
    scintillation: "Maximum White Light & Fire",
    description:
      "Engineered by Marcel Tolkowsky in 1919, the round brilliant diamond is mathematically cut with 57 or 58 facets to achieve total internal reflection. It returns the highest degree of brilliance and spectral fire.",
    opticalTip:
      "Look for an 'Excellent' or 'Ideal' cut grade with a 54%–57% table and 61%–62.5% depth for optimal light return.",
  },
  {
    shape: "OVAL",
    title: "Oval Brilliant",
    facets: 58,
    style: "Brilliant",
    ratio: "1.35 – 1.50",
    scintillation: "High Scintillation with Elongated Spread",
    description:
      "A modern modification of the brilliant cut that creates a flattering lengthening effect on the hand. Its larger surface area per carat makes it appear visibly larger than a round diamond of equal weight.",
    opticalTip:
      "Inspect the stone under 10x magnification for a minimal bow-tie shadow across the center facet junction.",
  },
  {
    shape: "EMERALD",
    title: "Emerald Cut",
    facets: 57,
    style: "Step Cut",
    ratio: "1.30 – 1.55",
    scintillation: "Hall of Mirrors Flash",
    description:
      "A rectangular step cut with cropped corners and long, parallel facets. Rather than high-frequency scintillation, the emerald cut produces dramatic, clean flashes of white light.",
    opticalTip:
      "Due to the open table and step facets, inclusions are more visible; prioritize VS1 clarity or higher.",
  },
  {
    shape: "CUSHION",
    title: "Cushion Cut",
    facets: 58,
    style: "Brilliant",
    ratio: "1.00 – 1.25",
    scintillation: "Soft Pillowed Fire",
    description:
      "Also known as the pillow cut, featuring rounded corners and curved sides. Combines antique Old Mine cut proportions with contemporary facet precision.",
    opticalTip:
      "Available in both 'Cushion Brilliant' (chunky light flashes) and 'Cushion Modified' (needle-like crushed ice fire).",
  },
  {
    shape: "RADIANT",
    title: "Radiant Cut",
    facets: 70,
    style: "Mixed Cut",
    ratio: "1.15 – 1.35",
    scintillation: "High-Frequency Scintillation",
    description:
      "Invented in 1977, radiant cuts blend the refined octagonal outline of an emerald cut with 70 brilliant facets on the pavilion and crown for fiery dispersion.",
    opticalTip:
      "Excellent choice for fancy color diamonds as the facet design deepens body color saturation.",
  },
  {
    shape: "PEAR",
    title: "Pear Shape",
    facets: 58,
    style: "Brilliant",
    ratio: "1.45 – 1.70",
    scintillation: "Tapered Dynamic Fire",
    description:
      "A harmonious fusion of the round brilliant and marquise cuts, culminating in a rounded base and a tapered point. Exhibits high surface spread per carat.",
    opticalTip:
      "Ensure the tip has a protective prong or bezel setting to shield the acute point from mechanical chipping.",
  },
  {
    shape: "PRINCESS",
    title: "Princess Cut",
    facets: 76,
    style: "Brilliant",
    ratio: "1.00 – 1.05",
    scintillation: "Crisp Geometric Sparkle",
    description:
      "The most popular square brilliant cut, featuring four sharp 90-degree corners and an inverted pyramid pavilion with inverted chevron facets.",
    opticalTip:
      "Corners concentrate internal stress; select V-prongs to secure the acute corners during ring setting.",
  },
  {
    shape: "MARQUISE",
    title: "Marquise Cut",
    facets: 58,
    style: "Brilliant",
    ratio: "1.75 – 2.15",
    scintillation: "Elongated High Spread",
    description:
      "Commissioned by King Louis XV of France to resemble the smile of the Marquise de Pompadour. Features the largest crown surface area per carat of any shape.",
    opticalTip:
      "Look for symmetrical point-to-point alignment so both tapered apexes align along the central axis.",
  },
  {
    shape: "ASSCHER",
    title: "Asscher Cut",
    facets: 58,
    style: "Step Cut",
    ratio: "1.00 – 1.05",
    scintillation: "Concentric Geometric Reflection",
    description:
      "Created by the Royal Asscher Diamond Company in 1902. A square step cut characterized by deeply clipped corners, a high crown, and a windmill-pattern pavilion.",
    opticalTip:
      "A higher crown angle enhances prismatic color dispersion compared to a standard rectangular emerald cut.",
  },
  {
    shape: "HEART",
    title: "Heart Shape",
    facets: 59,
    style: "Brilliant",
    ratio: "0.90 – 1.10",
    scintillation: "Romantic Distinctive Brilliance",
    description:
      "An intricate modified brilliant cut requiring exact symmetry between the two lobes, an evenly defined cleft, and a sharp lower point.",
    opticalTip:
      "Stones above 0.70 ct exhibit the cleanest heart silhouette; smaller carats may blur the cleft.",
  },
];

export default function ShapesGuidePage() {
  return (
    <div className="w-full bg-white text-[var(--color-ink)]">
      {/* Top Header */}
      <section className="border-b border-[var(--color-line)] bg-white py-12">
        <div className="page">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/education" className="hover:text-[var(--color-ink)] transition-colors">
              Education
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">Shapes Guide</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-slate)]">
              Gemological Silhouette Compendium
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-5xl">
              The architecture of <span className="italic">diamond shapes</span>
            </h1>
            <p className="mt-4 text-base text-[var(--color-slate)] leading-relaxed font-light">
              Each diamond silhouette possesses unique facet geometry, optical light dynamics, and proportion tolerances. Understanding these metrological differences enables you to select the ideal stone for your aesthetic preferences and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Shapes Cards Grid */}
      <section className="bg-[var(--color-stone)] py-16">
        <div className="page">
          <div className="grid gap-8 md:grid-cols-2">
            {SHAPE_GUIDES.map((item) => (
              <div
                key={item.shape}
                className="flex flex-col justify-between border border-[var(--color-line)] bg-white p-8 transition-all hover:border-[var(--color-line-dark)]"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-[var(--color-line)]">
                    <div className="flex items-center gap-4">
                      <div className="size-12 border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-ink)]">
                        <ShapeIcon shape={item.shape} className="size-7" />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                          {item.title}
                        </h2>
                        <span className="text-xs text-[var(--color-slate)] font-mono">
                          {item.style} · {item.facets} Facets
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/diamonds?shape=${encodeURIComponent(item.shape)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-loupe)] hover:underline"
                    >
                      Browse
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <p className="mt-6 text-sm text-[var(--color-slate)] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[var(--color-line)] py-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
                        Ideal L/W Ratio
                      </span>
                      <span className="font-semibold text-[var(--color-ink)] mt-0.5 block">
                        {item.ratio}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
                        Scintillation Character
                      </span>
                      <span className="text-[var(--color-ink)] mt-0.5 block font-sans">
                        {item.scintillation}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[3px] bg-[var(--color-stone)] p-4 text-xs text-[var(--color-slate)]">
                    <span className="font-medium text-[var(--color-ink)] uppercase tracking-wider text-[10px] block mb-1">
                      Gemologist Observation Tip:
                    </span>
                    {item.opticalTip}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--color-line)] flex items-center justify-between">
                  <Link
                    href={`/diamonds/natural?shape=${encodeURIComponent(item.shape)}`}
                    className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)] hover:text-[var(--color-loupe)] transition-colors"
                  >
                    View Natural {item.title}
                  </Link>
                  <span className="text-[var(--color-line)]">|</span>
                  <Link
                    href={`/diamonds/lab-grown?shape=${encodeURIComponent(item.shape)}`}
                    className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)] hover:text-[var(--color-loupe)] transition-colors"
                  >
                    View Lab {item.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparative Summary Table */}
      <section className="bg-white py-16 border-t border-[var(--color-line)]">
        <div className="page">
          <div className="max-w-2xl mb-8">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Silhouette Metrology Matrix
            </h2>
            <p className="mt-2 text-sm text-[var(--color-slate)]">
              Reference guide comparing facet structures and visual spreads across standard diamond shapes.
            </p>
          </div>

          <div className="overflow-x-auto border border-[var(--color-line)]">
            <table className="w-full text-left text-xs text-[var(--color-ink)]">
              <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] font-medium uppercase tracking-[0.08em] text-[var(--color-slate)] text-[11px]">
                <tr>
                  <th className="py-3 px-4">Shape</th>
                  <th className="py-3 px-4">Facet Style</th>
                  <th className="py-3 px-4">Facets</th>
                  <th className="py-3 px-4">Recommended Ratio</th>
                  <th className="py-3 px-4">Apparent Surface Area</th>
                  <th className="py-3 px-4">Primary Metric Focus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)] font-mono">
                {SHAPE_GUIDES.map((item) => (
                  <tr key={`table-${item.shape}`} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                    <td className="py-3 px-4 font-serif font-medium text-sm text-[var(--color-ink)]">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 font-sans text-xs">{item.style}</td>
                    <td className="py-3 px-4">{item.facets}</td>
                    <td className="py-3 px-4">{item.ratio}</td>
                    <td className="py-3 px-4 font-sans text-xs">
                      {item.shape === "MARQUISE" || item.shape === "OVAL" || item.shape === "PEAR"
                        ? "High (Looks Larger)"
                        : item.shape === "ROUND" || item.shape === "PRINCESS"
                        ? "Standard (Proportional)"
                        : "Deep (Compact Spread)"}
                    </td>
                    <td className="py-3 px-4 font-sans text-xs">
                      {item.style === "Step Cut" ? "Clarity (VS1+)" : "Cut Grade (Excellent)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
