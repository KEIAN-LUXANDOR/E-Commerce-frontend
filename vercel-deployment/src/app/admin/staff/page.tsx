import { AdminHeader } from "@/components/admin/AdminBits";

export default function AdminStaffPage() {
  return (
    <div className="space-y-5">
      <AdminHeader title="Staff access" description="Role changes are managed by the backend, not this storefront." />
      <section className="border border-line bg-white p-6">
        <p className="font-medium">Staff management is not connected.</p>
        <p className="mt-2 text-sm text-slate">There is no staff-management API in the documented contract. Role changes cannot be safely simulated in the browser.</p>
      </section>
    </div>
  );
}
