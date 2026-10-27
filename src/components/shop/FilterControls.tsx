"use client";

export function FilterControls({ query, onChange }: { query: any; onChange: (updates: any) => void }) {
  const shapes = ["Round", "Princess", "Oval", "Emerald", "Pear", "Radiant"];
  const colors = ["D", "E", "F", "G", "H", "I", "J"];
  const clarities = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

  const toggleFilter = (key: string, value: string) => {
    const current = Array.isArray(query[key]) ? query[key] : (query[key] ? [query[key]] : []);
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onChange({ [key]: updated.length > 0 ? updated : undefined });
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-xs uppercase tracking-widest font-medium text-ink mb-3">Shape</h4>
        <div className="grid grid-cols-3 gap-2">
          {shapes.map((s) => {
            const active = query.shape?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleFilter("shape", s)}
                className={`p-2 border text-xs text-center transition-colors ${
                  active ? "border-ink bg-ink text-white" : "border-line bg-surface text-slate hover:border-ink hover:text-ink"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest font-medium text-ink mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const active = query.color?.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleFilter("color", c)}
                className={`h-8 w-8 flex items-center justify-center border text-xs transition-colors ${
                  active ? "border-ink bg-ink text-white" : "border-line bg-surface text-slate hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest font-medium text-ink mb-3">Clarity</h4>
        <div className="flex flex-wrap gap-2">
          {clarities.map((c) => {
            const active = query.clarity?.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleFilter("clarity", c)}
                className={`h-8 px-3 flex items-center justify-center border text-xs transition-colors ${
                  active ? "border-ink bg-ink text-white" : "border-line bg-surface text-slate hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FilterControls;