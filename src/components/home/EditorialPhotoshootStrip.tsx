import Image from "next/image";
import { GoldDivider } from "@/components/ui/gold-divider";

export function EditorialPhotoshootStrip() {
  return (
    <section aria-label="Inside the diamond atelier" className="relative w-full overflow-hidden border-y border-line">
      <div className="relative aspect-[21/9] min-h-48 sm:aspect-[21/6] sm:min-h-56">
        <Image
          src="/editorial/diamond-macro.jpg"
          alt="A certified diamond being inspected with precision tools at the atelier"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/75 via-[#0A192F]/25 to-transparent" />
        <div className="page relative flex h-full items-center">
          <div className="max-w-md text-white">
            <span className="editorial-eyebrow text-[var(--brand-accent-muted)]">Inside the atelier</span>
            <h2 className="mt-3 font-editorial text-3xl leading-tight sm:text-4xl">
              A closer look at every stone.
            </h2>
            <GoldDivider className="mt-5 max-w-36" />
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Selected, inspected, and prepared for its next home.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
