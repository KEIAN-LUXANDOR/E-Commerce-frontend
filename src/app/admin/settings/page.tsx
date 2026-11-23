import { AdminHeader, AdminTable } from "@/components/admin/AdminBits";
import { features } from "@/config/features";
import { site } from "@/lib/site";

function display(value: unknown): string {
  if (typeof value === "string" && !value.trim()) return "Not configured";
  if (value === undefined || value === null) return "Not configured";
  if (typeof value === "object") return Object.entries(value).map(([key, item]) => `${key}: ${display(item)}`).join(" · ");
  return String(value);
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Settings" description="Read-only configuration. Update values in the source files shown below." />
      <section className="space-y-3">
        <h2 className="text-xl">Store details <code className="text-sm text-slate">src/lib/site.ts</code></h2>
        <AdminTable>
          <thead><tr><th>Setting</th><th>Configured value</th></tr></thead>
          <tbody>{Object.entries(site).map(([key, value]) => <tr key={key}><td>{key}</td><td>{display(value)}</td></tr>)}</tbody>
        </AdminTable>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl">Feature switches <code className="text-sm text-slate">src/config/features.ts</code></h2>
        <AdminTable minWidth="32rem">
          <thead><tr><th>Feature</th><th>State</th></tr></thead>
          <tbody>{Object.entries(features).map(([key, enabled]) => <tr key={key}><td>{key}</td><td>{enabled ? "Enabled" : "Off"}</td></tr>)}</tbody>
        </AdminTable>
      </section>
    </div>
  );
}
