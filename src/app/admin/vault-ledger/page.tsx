import { AdminHeader } from "@/components/admin/AdminBits";

export default function VaultLedgerPage() {
  return (
    <div className="space-y-5">
      <AdminHeader title="Inventory ledger" description="Inventory history and stock adjustments." />
      <section className="border border-line bg-white p-6">
        <p className="font-medium">Inventory history is not connected.</p>
        <p className="mt-2 text-sm text-slate">No ledger API is documented, so this page cannot display or export transaction records.</p>
      </section>
    </div>
  );
}
