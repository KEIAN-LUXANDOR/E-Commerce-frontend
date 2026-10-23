import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DiamondCatalogView } from "@/components/store/DiamondCatalogView";
import { mockListDiamonds } from "@/mocks/catalog-service";
import type { Origin } from "@/lib/types/catalog";

interface Props {
  params: Promise<{ type: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return [{ type: "natural" }, { type: "lab-grown" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;

  if (type === "natural") {
    return {
      title: "Natural Certified Diamonds | Keian Luxandor",
      description:
        "Explore ethically mined natural loose diamonds certified by GIA. Insured door-to-door delivery across India.",
    };
  }

  if (type === "lab-grown") {
    return {
      title: "Lab-Grown Certified Diamonds | Keian Luxandor",
      description:
        "Precision CVD and HPHT laboratory diamonds certified by IGI and GIA. Pure carbon lattice solitaires.",
    };
  }

  return {
    title: "Loose Diamonds | Keian Luxandor",
  };
}

export default function DiamondCatalogPage(props: Props) {
  return (
    <Suspense fallback={<CatalogLoadingFallback />}>
      <DiamondCatalogContent {...props} />
    </Suspense>
  );
}

async function DiamondCatalogContent({ params }: Props) {
  const { type } = await params;

  let originLock: Origin | undefined = undefined;
  let pageTitle = "Certified Loose Diamonds";
  let pageDescription = "Explore our curated inventory of certified loose solitaires with insured courier transit.";

  if (type === "natural") {
    originLock = "NATURAL";
    pageTitle = "Natural Certified Diamonds";
    pageDescription =
      "Each stone formed billions of years ago within the Earth's mantle. Laser-inscribed with official GIA dossier verification and inspected under 10x magnification.";
  } else if (type === "lab-grown") {
    originLock = "LAB_GROWN";
    pageTitle = "Lab-Grown Certified Diamonds";
    pageDescription =
      "Type IIa pure carbon crystals synthesized via state-of-the-art CVD and HPHT metrology. Chemically and optically identical to earth-mined solitaires, certified by IGI and GIA.";
  } else {
    notFound();
  }

  // Load diamond inventory matching origin
  const result = mockListDiamonds({
    origin: originLock ? [originLock] : undefined,
  });

  return (
    <DiamondCatalogView
      initialDiamonds={result.items}
      title={pageTitle}
      description={pageDescription}
      originLock={originLock}
      totalCount={result.total}
    />
  );
}

function CatalogLoadingFallback() {
  return (
    <div className="page py-16 space-y-6">
      <div className="h-10 w-64 bg-[var(--color-stone)] animate-pulse" />
      <div className="h-4 w-96 bg-[var(--color-stone)] animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-[var(--color-stone)] border border-[var(--color-line)] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
