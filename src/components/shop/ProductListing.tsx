"use client";

import { FilterPanel } from "./FilterPanel";
import { ListingProvider, useListingContext } from "./ListingProvider";
import { Pagination } from "./Pagination";
import { DiamondTable } from "./DiamondTable";

function ProductListingContent({ products, totalPages }: { products: any[]; totalPages: number }) {
  const { params, updateParams, clearAll } = useListingContext();

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto px-4 py-8">
      <aside className="w-full lg:w-1/4 shrink-0">
        <FilterPanel query={params} update={updateParams} clearAll={clearAll} />
      </aside>
      <main className="w-full lg:w-3/4 flex-1">
        <DiamondTable products={products} />
        <Pagination currentPage={params.page || 1} totalPages={totalPages} onPageChange={handlePageChange} />
      </main>
    </div>
  );
}

export function ProductListing({ products = [], totalPages = 1 }: { products?: any[]; totalPages?: number }) {
  return (
    <ListingProvider>
      <ProductListingContent products={products} totalPages={totalPages} />
    </ListingProvider>
  );
}

export default ProductListing;