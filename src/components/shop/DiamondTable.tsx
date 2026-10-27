"use client";

import { DiamondRow } from "./DiamondRow";

export function DiamondTable({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto border border-line bg-surface">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-widest text-slate bg-platinum">
            <th className="p-4 font-medium">Shape</th>
            <th className="p-4 font-medium">Carat</th>
            <th className="p-4 font-medium">Color</th>
            <th className="p-4 font-medium">Clarity</th>
            <th className="p-4 font-medium">Cut</th>
            <th className="p-4 font-medium">Price</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product) => (
            <DiamondRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DiamondTable;