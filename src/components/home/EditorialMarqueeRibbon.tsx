import { Award, ShieldCheck, Truck, Sparkles, CheckCircle2 } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

export function EditorialMarqueeRibbon() {
  const credentials = [
    { icon: Award, label: "GIA Graded & Laser-Inscribed" },
    { icon: Award, label: "IGI Antwerp Laboratory Certified" },
    { icon: ShieldCheck, label: "100% Conflict-Free Kimberley Compliant" },
    { icon: Sparkles, label: "40x Macro Video Inspection" },
    { icon: Truck, label: "Sequel & Malca-Amit Armoured Transit" },
    { icon: CheckCircle2, label: "14-Day Insured Doorstep Returns" },
    { icon: ShieldCheck, label: "Surat Vault Direct Atelier Pricing" },
  ];

  return (
    <div className="border-y border-line bg-stone/40 py-3.5 overflow-hidden">
      <Marquee speed={40} className="[--gap:3rem]">
        {credentials.map((cred, idx) => {
          const Icon = cred.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs font-medium tracking-wider uppercase text-slate select-none"
            >
              <div className="size-6 rounded-full bg-surface border border-line grid place-items-center text-loupe">
                <Icon className="size-3.5" />
              </div>
              <span className="font-mono text-[11px] text-ink">{cred.label}</span>
              <span className="text-line-dark font-serif px-2">·</span>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
