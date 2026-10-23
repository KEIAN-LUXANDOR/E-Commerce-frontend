import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

export function OrderHistory() {
  return (
    <section
      aria-labelledby="order-history-heading"
      className="border-y border-line py-10 sm:py-14"
    >
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-stone text-ink">
          <PackageSearch className="size-5" aria-hidden="true" />
        </div>
        <h3
          id="order-history-heading"
          className="mt-5 font-serif text-2xl font-normal text-ink"
        >
          Order history is on its way
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          We can’t show past orders here just yet. If you need an update on a
          purchase, get in touch and we’ll be happy to help.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Contact us
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link href="/shop" className="btn btn-secondary">
            Browse diamonds
          </Link>
        </div>
      </div>
    </section>
  );
}
