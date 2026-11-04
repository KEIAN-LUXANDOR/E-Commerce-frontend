import { AdminHeader } from "@/components/admin/AdminBits";

export default function AuditLogPage() {
  return (
    <div className="space-y-5">
      <AdminHeader title="Audit log" description="Administrative change history." />
      <section className="border border-line bg-white p-6">
        <p className="font-medium">Audit logging is not connected.</p>
        <p className="mt-2 text-sm text-slate">No audit-log API is documented, so there is no event data to display or export.</p>
      </section>
    </div>
  );
}
