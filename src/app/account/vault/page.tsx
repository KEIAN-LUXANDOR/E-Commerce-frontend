import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificates | Your account | Keian Luxandor",
  description: "Find your diamond certificates and documents.",
};

export default function AccountVaultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-normal text-ink">
          Certificates and documents
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
          A place for the grading reports and documents for your diamonds.
        </p>
      </div>

      <section
        aria-labelledby="certificates-heading"
        className="border-y border-line py-10 sm:py-14"
      >
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-stone text-ink">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <h3
            id="certificates-heading"
            className="mt-5 font-serif text-2xl font-normal text-ink"
          >
            Your documents will appear here
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            Certificates aren’t connected to your account yet. If you need a
            report for a diamond you purchased, contact us and we’ll help find it.
          </p>
          <Link href="/contact" className="btn btn-primary mt-6">
            Ask us for a certificate
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
