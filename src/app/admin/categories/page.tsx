import { AdminHeader } from "@/components/admin/AdminBits";

export default function CategoriesPage() {
  return (
    <div className="space-y-5">
      <AdminHeader title="Categories" description="Product categories are currently read-only." />
      <section className="border border-line bg-white p-6">
        <p className="font-medium">Category management is not connected.</p>
        <p className="mt-2 text-sm text-slate">The backend exposes storefront category reads but no admin create/update API. Add-category is disabled until an admin contract is available.</p>
        <button type="button" disabled className="btn btn-secondary mt-4 cursor-not-allowed opacity-50">Add category unavailable</button>
      </section>
    </div>
  );
}
