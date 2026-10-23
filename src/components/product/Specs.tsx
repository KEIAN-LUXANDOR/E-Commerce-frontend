import { ExternalLink, FileText } from "lucide-react";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { CERTIFICATE_VERIFY_URL, CLARITIES, COLORS, cutLabel, fluorescenceLabel, originLabel, shapeLabel } from "@/lib/catalog-labels";
import { formatCarat } from "@/lib/format";
import type { DiamondDetail } from "@/lib/types/catalog";

/** Every grade and measurement from the report, laid out like the report itself. */
export function GradingReport({ d }: { d: DiamondDetail }) {
  const m = d.measurements;
  const groups: { title: string; rows: [string, string][] }[] = [
    {
      title: "Grading",
      rows: [
        ["Shape", shapeLabel(d.shape)],
        ["Carat weight", formatCarat(d.carat)],
        ["Colour", d.color],
        ["Clarity", d.clarity],
        ["Cut", cutLabel(d.cut)],
      ],
    },
    {
      title: "Finish",
      rows: [
        ["Polish", cutLabel(d.polish)],
        ["Symmetry", cutLabel(d.symmetry)],
        ["Fluorescence", fluorescenceLabel(d.fluorescence)],
        ["Origin", originLabel(d.origin)],
        ["Inscription", d.laserInscription ? `${d.lab} ${d.certificateNumber}` : "None"],
      ],
    },
    {
      title: "Measurements",
      rows: [
        ["Dimensions", `${m.lengthMm.toFixed(2)} × ${m.widthMm.toFixed(2)} × ${m.depthMm.toFixed(2)} mm`],
        ["Length to width", d.lwRatio.toFixed(2)],
        ["Table", `${d.tablePct}%`],
        ["Depth", `${d.depthPct}%`],
        ["Girdle", d.girdle],
        ["Culet", d.culet],
      ],
    },
  ];

  return (
    <section aria-labelledby="grading" className="grid gap-8 sm:grid-cols-[auto_1fr]">
      <ShapeIcon shape={d.shape} detailed className="hidden size-28 text-ink sm:block" />
      <div>
        <h2 id="grading" className="text-2xl">
          Grading report
        </h2>
        <div className="mt-4 grid gap-x-8 gap-y-6 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="border-b border-ink pb-1.5 font-sans text-sm font-semibold">{g.title}</h3>
              <dl className="text-sm">
                {g.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-line py-2">
                    <dt className="text-slate">{k}</dt>
                    <dd className="text-right font-medium tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Where this stone sits on the colour and clarity scales (best on the left). */
export function GradeScales({ d }: { d: DiamondDetail }) {
  const scales = [
    { title: "Colour", values: COLORS.map((c) => c.value as string), current: d.color as string, left: "Colourless", right: "Faint warmth" },
    { title: "Clarity", values: CLARITIES.map((c) => c.value as string), current: d.clarity as string, left: "Flawless", right: "Small inclusions" },
  ];
  return (
    <section aria-labelledby="scales">
      <h2 id="scales" className="text-2xl">
        Where it sits on the scale
      </h2>
      <div className="mt-5 space-y-6">
        {scales.map((s) => (
          <figure key={s.title}>
            <figcaption className="text-sm">
              <span className="text-slate">{s.title}: </span>
              <span className="font-medium">{s.current}</span>
            </figcaption>
            <ol className="mt-2 flex" aria-label={`${s.title} scale`}>
              {s.values.map((v) => {
                const on = v === s.current;
                return (
                  <li
                    key={v}
                    aria-current={on ? "true" : undefined}
                    className={`flex-1 border-y border-l border-line py-2 text-center text-xs tabular-nums last:border-r ${on ? "border-ink bg-ink font-semibold text-white" : "bg-surface text-slate"}`}
                  >
                    {v}
                  </li>
                );
              })}
            </ol>
            <p className="mt-1 flex justify-between text-xs text-slate">
              <span>{s.left}</span>
              <span>{s.right}</span>
            </p>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** Side profile with this stone's table and depth percentages marked, as on the report's proportions diagram. */
export function ProportionsDiagram({ d }: { d: DiamondDetail }) {
  const w = 300;
  const cx = 200;
  const cy = 120;
  const half = w / 2;
  const table = (w * d.tablePct) / 100;
  const total = (w * d.depthPct) / 100;
  const crown = total * 0.24;
  const top = cy - crown;
  const cul = top + total;
  const line = { stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };
  return (
    <section aria-labelledby="proportions">
      <h2 id="proportions" className="text-2xl">
        Proportions
      </h2>
      <svg viewBox="0 0 440 330" className="mt-4 w-full max-w-md text-ink" role="img" aria-label={`Table ${d.tablePct} percent, depth ${d.depthPct} percent`}>
        <polygon points={`${cx - table / 2},${top} ${cx + table / 2},${top} ${cx + half},${cy} ${cx},${cul} ${cx - half},${cy}`} {...line} fill="#fff" />
        <line x1={cx - half} y1={cy} x2={cx + half} y2={cy} {...line} />
        {[-0.5, -0.25, 0.25, 0.5].map((f) => (
          <line key={f} x1={cx + f * w} y1={cy} x2={cx} y2={cul} {...line} strokeWidth={0.6} />
        ))}
        {/* table width */}
        <g className="text-loupe">
          <line x1={cx - table / 2} y1={top - 18} x2={cx + table / 2} y2={top - 18} {...line} />
          <line x1={cx - table / 2} y1={top - 24} x2={cx - table / 2} y2={top - 12} {...line} />
          <line x1={cx + table / 2} y1={top - 24} x2={cx + table / 2} y2={top - 12} {...line} />
          <text x={cx} y={top - 26} textAnchor="middle" fontSize="13" fill="currentColor">
            Table {d.tablePct}%
          </text>
          {/* total depth */}
          <line x1={cx + half + 22} y1={top} x2={cx + half + 22} y2={cul} {...line} />
          <line x1={cx + half + 16} y1={top} x2={cx + half + 28} y2={top} {...line} />
          <line x1={cx + half + 16} y1={cul} x2={cx + half + 28} y2={cul} {...line} />
          <text x={cx + half + 22} y={cul + 20} textAnchor="middle" fontSize="13" fill="currentColor">
            Depth {d.depthPct}%
          </text>
        </g>
      </svg>
      <p className="mt-2 max-w-prose text-sm text-slate">
        Table and depth decide how light travels through the stone. Too deep or too shallow and light escapes through the sides instead of
        returning to your eye.
      </p>
    </section>
  );
}

/** Report number with a link to check it on the lab's website. */
export function CertificateBox({ d }: { d: DiamondDetail }) {
  return (
    <div className="flex flex-col gap-4 border border-ink/80 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-slate">{d.lab} report number</p>
        <p className="mt-0.5 font-display text-2xl tabular-nums tracking-wide">{d.certificateNumber}</p>
        <p className="mt-1 text-sm text-slate">The same number is laser-inscribed on the stone’s girdle.</p>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <a href={CERTIFICATE_VERIFY_URL[d.lab](d.certificateNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-sm">
          Check on {d.lab === "GIA" ? "gia.edu" : "igi.org"}
          <ExternalLink className="size-4" aria-hidden />
        </a>
        {d.certificateUrl && (
          <a href={d.certificateUrl} target="_blank" rel="noopener noreferrer" className="btn text-sm text-loupe underline">
            <FileText className="size-4" aria-hidden />
            View report PDF
          </a>
        )}
      </div>
    </div>
  );
}
