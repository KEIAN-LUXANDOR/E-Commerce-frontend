"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Eye,
  TrendingUp,
  Calendar,
  Layers,
  ArrowRight,
  GripVertical,
  CheckCircle2,
  Clock,
  Archive,
  Edit,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface BannerRecord {
  id: string;
  seq: number;
  title: string;
  subtext: string;
  placement: "HOME_HERO" | "VITRINE_FEATURE" | "ANNOUNCEMENT_TICKER" | "EDUCATION_BANNER";
  shape: string;
  imageUrl?: string;
  ctaLabel: string;
  ctaHref: string;
  startsAt: string;
  endsAt: string;
  status: "LIVE" | "SCHEDULED" | "DRAFT" | "ARCHIVED";
  impressions: string;
  ctr: string;
}

const INITIAL_BANNERS: BannerRecord[] = [
  {
    id: "ban-001",
    seq: 1,
    title: "Handpicked Loose Diamonds, Certified & Inscribed",
    subtext: "Every diamond includes an authentic GIA or IGI grading dossier with matching laser inscription on the girdle.",
    placement: "HOME_HERO",
    shape: "ROUND",
    imageUrl: "/editorial/atelier-dossier.jpg",
    ctaLabel: "Explore All Diamonds",
    ctaHref: "/shop",
    startsAt: "01 Oct 2026",
    endsAt: "31 Dec 2026",
    status: "LIVE",
    impressions: "68.4k",
    ctr: "15.8%",
  },
  {
    id: "ban-002",
    seq: 2,
    title: "Lab-Grown Brilliance, Identical Fire",
    subtext: "Chemically, physically, and optically identical to mined diamonds. Certified by IGI and accessible directly.",
    placement: "HOME_HERO",
    shape: "OVAL",
    imageUrl: "/editorial/diamond-macro.jpg",
    ctaLabel: "Browse Lab-Grown",
    ctaHref: "/shop?q=lab",
    startsAt: "10 Oct 2026",
    endsAt: "15 Nov 2026",
    status: "LIVE",
    impressions: "52.1k",
    ctr: "13.4%",
  },
  {
    id: "ban-003",
    seq: 3,
    title: "Architectural Step Cuts & Radiant Fire",
    subtext: "Emerald and Asscher cuts showcase mesmerizing hall-of-mirrors clarity. Guaranteed eye-clean.",
    placement: "HOME_HERO",
    shape: "EMERALD",
    ctaLabel: "Discover Emerald Cuts",
    ctaHref: "/shop?q=emerald",
    startsAt: "15 Oct 2026",
    endsAt: "30 Nov 2026",
    status: "LIVE",
    impressions: "41.0k",
    ctr: "12.6%",
  },
  {
    id: "ban-004",
    seq: 4,
    title: "The Solitaire Monograph · Autumn Release",
    subtext: "Curated collection of 10 museum-grade loose diamonds directly from Surat cutting vaults.",
    placement: "VITRINE_FEATURE",
    shape: "ROUND",
    imageUrl: "/editorial/atelier-dossier.jpg",
    ctaLabel: "View Monograph",
    ctaHref: "/about",
    startsAt: "20 Oct 2026",
    endsAt: "20 Nov 2026",
    status: "LIVE",
    impressions: "23.0k",
    ctr: "18.2%",
  },
  {
    id: "ban-005",
    seq: 5,
    title: "Q4 Festive High-Jewelry Solitaires",
    subtext: "Heirloom-grade D-Flawless natural diamond parcels prepared for Diwali acquisition.",
    placement: "HOME_HERO",
    shape: "ROUND",
    ctaLabel: "Preview Parcel",
    ctaHref: "/shop?q=natural",
    startsAt: "28 Oct 2026",
    endsAt: "15 Nov 2026",
    status: "SCHEDULED",
    impressions: "0",
    ctr: "0.0%",
  },
  {
    id: "ban-006",
    seq: 6,
    title: "Akshaya Tritiya Early Reservation",
    subtext: "Secure your solitaire allocation with complimentary insured doorstep armored transit.",
    placement: "VITRINE_FEATURE",
    shape: "PEAR",
    ctaLabel: "Reserve Solitaire",
    ctaHref: "/contact",
    startsAt: "01 Nov 2026",
    endsAt: "10 Nov 2026",
    status: "SCHEDULED",
    impressions: "0",
    ctr: "0.0%",
  },
];

export default function EditorialBannersAdminPage() {
  const [banners, setBanners] = useState<BannerRecord[]>(INITIAL_BANNERS);
  const [filterTab, setFilterTab] = useState<"ALL" | "LIVE" | "SCHEDULED" | "DRAFT">("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtext, setNewSubtext] = useState("");
  const [newPlacement, setNewPlacement] = useState<BannerRecord["placement"]>("HOME_HERO");
  const [newShape, setNewShape] = useState("ROUND");
  const [newCtaLabel, setNewCtaLabel] = useState("");
  const [newCtaHref, setNewCtaHref] = useState("");

  const filteredBanners = banners.filter((b) => {
    if (filterTab === "ALL") return true;
    return b.status === filterTab;
  });

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BannerRecord = {
      id: `ban-${Date.now().toString().slice(-4)}`,
      seq: banners.length + 1,
      title: newTitle || "New Atelier Editorial Banner",
      subtext: newSubtext || "Handcrafted loose solitaire collection.",
      placement: newPlacement,
      shape: newShape,
      ctaLabel: newCtaLabel || "Explore Collection",
      ctaHref: newCtaHref || "/shop",
      startsAt: "Today",
      endsAt: "31 Dec 2026",
      status: "LIVE",
      impressions: "0",
      ctr: "0.0%",
    };
    setBanners([created, ...banners]);
    setCreateDialogOpen(false);
    setNewTitle("");
    setNewSubtext("");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-line">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate">
            <span>Atelier Management</span>
            <span>/</span>
            <span>Content &amp; Editorial</span>
            <span>/</span>
            <span className="text-ink font-semibold">Promotional Banners</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
            Editorial Banners &amp; <span className="italic font-normal text-slate">Vitrine Placements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate max-w-2xl leading-relaxed">
            Digital storefront marquee campaigns, announcement ticker strips, and bespoke vitrine features calibrated for high-jewelry appraisal.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => setCreateDialogOpen(true)}
            className="rounded-md"
          >
            <Plus className="size-4 mr-1.5" />
            Create New Banner
          </Button>
        </div>
      </div>

      {/* Metrics Row (4 Cards matching Stitch spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl p-6 bg-surface shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate">
            <span>Active Banners</span>
            <span className="size-2 rounded-full bg-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-ink">4</span>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Live Now</span>
            </div>
            <p className="mt-1 text-xs text-slate">3 Home Marquee · 1 Vitrine Feature</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] text-slate font-mono">
            <span>Storefront Saturation</span>
            <span className="font-semibold text-ink">94%</span>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 bg-surface shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate">
            <span>Scheduled Releases</span>
            <span className="size-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-ink">2</span>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Slated</span>
            </div>
            <p className="mt-1 text-xs text-slate truncate">Q4 Festive Solitaires · Akshaya Preview</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] text-slate font-mono">
            <span>Earliest Launch</span>
            <span className="font-semibold text-ink">28 Oct 2026</span>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 bg-surface shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate">
            <span>CTR &amp; Engagement</span>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-ink">14.2%</span>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">+3.1% Lift</span>
            </div>
            <p className="mt-1 text-xs text-slate">Direct ingress to certified solitaire detail ledger</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] text-slate font-mono">
            <span>Top Performer</span>
            <span className="font-semibold text-ink">Solitaire Monograph</span>
          </div>
        </Card>

        <Card className="rounded-2xl p-6 bg-surface shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate">
            <span>Total Impressions</span>
            <Eye className="size-4 text-slate" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-ink">184.5k</span>
              <span className="text-xs font-mono text-slate">30 Days</span>
            </div>
            <p className="mt-1 text-xs text-slate">Across desktop flagship &amp; mobile salon portals</p>
          </div>
          <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] text-slate font-mono">
            <span>Mobile Viewports</span>
            <span className="font-semibold text-ink">61.4% Share</span>
          </div>
        </Card>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(["ALL", "LIVE", "SCHEDULED"] as const).map((tab) => {
            const isActive = filterTab === tab;
            let label = "All Placements (6)";
            if (tab === "LIVE") label = "Live Active (4)";
            if (tab === "SCHEDULED") label = "Scheduled (2)";

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-ink text-white"
                    : "text-slate hover:text-ink hover:bg-stone"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-loupe hover:underline px-3"
        >
          <span>Preview Live Storefront</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </div>

      {/* Ledger Table */}
      <Card className="rounded-2xl border-line overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone border-b border-line font-mono uppercase tracking-wider text-slate">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Seq</th>
                <th className="py-3 px-4">Placement &amp; Specification</th>
                <th className="py-3 px-4">Cadence</th>
                <th className="py-3 px-4">Status &amp; CTA</th>
                <th className="py-3 px-4">Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredBanners.map((banner) => {
                let statusBadge = (
                  <Badge variant="ok" className="text-[10px]">
                    <CheckCircle2 className="size-3 mr-1" />
                    Live Active
                  </Badge>
                );

                if (banner.status === "SCHEDULED") {
                  statusBadge = (
                    <Badge variant="warn" className="text-[10px]">
                      <Clock className="size-3 mr-1" />
                      Scheduled
                    </Badge>
                  );
                }

                return (
                  <tr key={banner.id} className="hover:bg-stone/20 transition-colors">
                    <td className="py-4 px-4 text-center font-mono text-slate">
                      <div className="flex items-center justify-center gap-1">
                        <GripVertical className="size-3.5 text-slate/50 cursor-grab" />
                        <span>0{banner.seq}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        {banner.imageUrl ? (
                          <div className="relative size-12 rounded-lg border border-line overflow-hidden shrink-0 bg-stone">
                            <Image
                              src={banner.imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-12 rounded-lg border border-line bg-stone grid place-items-center shrink-0 font-serif text-xs font-semibold text-slate">
                            {banner.shape}
                          </div>
                        )}
                        <div>
                          <p className="font-serif text-sm font-semibold text-ink line-clamp-1">
                            {banner.title}
                          </p>
                          <p className="text-[11px] text-slate line-clamp-1 mt-0.5">
                            {banner.subtext}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-mono uppercase tracking-wider text-loupe">
                            {banner.placement} · {banner.shape} Silhouette
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate whitespace-nowrap">
                      <span>{banner.startsAt}</span>
                      <span className="block text-[10px] text-slate/70">to {banner.endsAt}</span>
                    </td>
                    <td className="py-4 px-4">
                      {statusBadge}
                      <span className="block mt-1 font-mono text-[11px] text-slate">
                        &rarr; {banner.ctaLabel} ({banner.ctaHref})
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className="font-medium text-ink">{banner.impressions} Views</span>
                      <span className="block text-[10px] text-emerald-600">{banner.ctr} CTR</span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <Edit className="size-3.5 mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create New Banner Modal */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Create Editorial Banner Placement"
      >
        <form onSubmit={handleCreateBanner} className="space-y-4 text-xs pt-2">
          <div>
            <label className="block font-mono uppercase tracking-wider text-slate mb-1">
              Banner Title / Headline
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Master Monograph · Rare Step Cuts"
              className="w-full h-10 px-3 rounded-lg border border-line bg-surface text-ink text-sm focus:border-loupe focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-slate mb-1">
              Editorial Subcopy
            </label>
            <textarea
              rows={2}
              value={newSubtext}
              onChange={(e) => setNewSubtext(e.target.value)}
              placeholder="Detailed description of the diamond collection..."
              className="w-full p-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-loupe focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase tracking-wider text-slate mb-1">
                Placement Area
              </label>
              <select
                value={newPlacement}
                onChange={(e) => setNewPlacement(e.target.value as BannerRecord["placement"])}
                className="w-full h-10 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-loupe focus:outline-none"
              >
                <option value="HOME_HERO">Home Hero Marquee</option>
                <option value="VITRINE_FEATURE">Vitrine Editorial Feature</option>
                <option value="ANNOUNCEMENT_TICKER">Announcement Ticker</option>
              </select>
            </div>
            <div>
              <label className="block font-mono uppercase tracking-wider text-slate mb-1">
                Focal Silhouette
              </label>
              <select
                value={newShape}
                onChange={(e) => setNewShape(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-loupe focus:outline-none"
              >
                <option value="ROUND">Round Brilliant</option>
                <option value="OVAL">Oval Cut</option>
                <option value="EMERALD">Emerald Cut</option>
                <option value="PEAR">Pear Cut</option>
                <option value="RADIANT">Radiant Cut</option>
                <option value="CUSHION">Cushion Cut</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase tracking-wider text-slate mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={newCtaLabel}
                onChange={(e) => setNewCtaLabel(e.target.value)}
                placeholder="e.g. Explore Collection"
                className="w-full h-10 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-loupe focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono uppercase tracking-wider text-slate mb-1">
                Target URL
              </label>
              <input
                type="text"
                value={newCtaHref}
                onChange={(e) => setNewCtaHref(e.target.value)}
                placeholder="e.g. /shop?q=emerald"
                className="w-full h-10 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-loupe focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Banner Placement
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
