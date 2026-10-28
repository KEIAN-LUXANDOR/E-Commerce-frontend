import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/common/ContentPage";
import { CLARITIES, COLORS } from "@/lib/catalog/labels";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "The 4 Cs of diamonds, simply explained",
  description: "Carat, colour, clarity and cut in plain words — and where to spend your budget for the best-looking diamond.",
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Learn", href: "/education" },
];

export default function FourCsPage() {
  return (
    <ContentPage eyebrow="Guide" title="The 4 Cs, simply explained" crumbs={crumbs} intro="Every diamond is graded on four things. Here’s what they mean, and which ones you’ll actually notice.">
      <h2>1. Carat — the weight</h2>
      <p>
        Carat is weight, not size: one carat is 0.2 grams. Bigger carats cost much more per carat, because large diamonds are rarer. Two diamonds of the same carat can look
        different sizes depending on their shape and cut — an oval or pear looks larger than a round of the same weight.
      </p>
      <p>
        <strong>Tip:</strong> prices jump at “magic” weights like 1.00 ct and 1.50 ct. A 0.90–0.99 ct stone looks almost the same and can cost noticeably less.
      </p>

      <h2>2. Colour — how white it is</h2>
      <p>Graded from D (completely colourless) to Z (light yellow). We sell D to M.</p>
      <ul>
        <li>
          <strong>D–F:</strong> colourless. The whitest and rarest.
        </li>
        <li>
          <strong>G–J:</strong> near colourless. Look white to almost everyone, especially once set — often the best value.
        </li>
        <li>
          <strong>K–M:</strong> a faint warm tint you may notice. Lovely in yellow or rose gold.
        </li>
      </ul>
      <p className="text-sm">Grades on our site: {COLORS.map((c) => c.value).join(" · ")}</p>

      <h2>3. Clarity — how clean it is inside</h2>
      <p>Almost every diamond has tiny natural marks. Clarity grades how many there are and how visible.</p>
      <ul>
        {CLARITIES.filter((c) => ["FL", "IF", "VVS1", "VS1", "SI1", "I1"].includes(c.value)).map((c) => (
          <li key={c.value}>
            <strong>{c.value}</strong> — {c.meaning}
          </li>
        ))}
      </ul>
      <p>
        <strong>Tip:</strong> VS1 and VS2 diamonds look completely clean without a magnifier. Paying more for VVS or FL buys rarity, not visible beauty.
      </p>

      <h2>4. Cut — how well it sparkles</h2>
      <p>
        Cut is about how well the diamond’s angles and proportions return light to your eye. A well-cut diamond looks brighter and livelier, and can even look bigger. Labs
        give a cut grade for round diamonds (Ideal or Excellent is best). For other shapes they don’t, so we show “Not graded” and you can judge by polish, symmetry, photos
        and our advice.
      </p>

      <h2>Where to spend your budget</h2>
      <ol>
        <li>Cut first — it’s what makes a diamond beautiful.</li>
        <li>Then the size you want.</li>
        <li>Then colour: G–H looks white for most people.</li>
        <li>Clarity last: “eye clean” (often VS2 or SI1) is all you need.</li>
      </ol>

      <div className="mt-10 border border-line bg-surface p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-xl font-medium text-ink flex items-center gap-2">
          <Sparkles className="size-4 text-loupe" />
          Explore the Catalogue by 4Cs Criteria
        </h3>
        <p className="text-xs text-slate">
          Jump directly into pre-filtered certified diamond collections matching optimal gemological value:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/diamonds?color=D,E,F"
            className="border border-line bg-stone p-4 hover:border-ink transition-colors block text-xs"
          >
            <span className="font-semibold text-ink block">Colourless Collection</span>
            <span className="text-slate text-[11px] mt-0.5 block">D, E, F Master Colour Grades</span>
          </Link>
          <Link
            href="/diamonds?clarity=VS1,VS2"
            className="border border-line bg-stone p-4 hover:border-ink transition-colors block text-xs"
          >
            <span className="font-semibold text-ink block">Eye-Clean Value</span>
            <span className="text-slate text-[11px] mt-0.5 block">VS1 &amp; VS2 Verified Clean</span>
          </Link>
          <Link
            href="/diamonds?minCarat=1"
            className="border border-line bg-stone p-4 hover:border-ink transition-colors block text-xs"
          >
            <span className="font-semibold text-ink block">1.00+ Carat Solitaires</span>
            <span className="text-slate text-[11px] mt-0.5 block">Full Carat Investment Stones</span>
          </Link>
        </div>
      </div>
    </ContentPage>
  );
}
