"use client";

import { useState } from "react";
import { ShieldCheck, UserPlus, CheckCircle2, Ban } from "lucide-react";

interface AccountMember {
  id: string;
  name: string;
  email: string;
  accessLevel: "ADMIN" | "CUSTOMER";
  status: "ACTIVE" | "DISABLED";
  lastActive: string;
}

const INITIAL_ACCOUNTS: AccountMember[] = [
  {
    id: "usr-1",
    name: "Owner / Admin",
    email: "admin@example.com",
    accessLevel: "ADMIN",
    status: "ACTIVE",
    lastActive: "Today",
  },
  {
    id: "usr-2",
    name: "Riya Shah",
    email: "riya@example.com",
    accessLevel: "CUSTOMER",
    status: "ACTIVE",
    lastActive: "Yesterday",
  },
];

export default function AdminStaffPage() {
  const [members, setMembers] = useState<AccountMember[]>(INITIAL_ACCOUNTS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<"ADMIN" | "CUSTOMER">("ADMIN");

  function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        accessLevel,
        status: "ACTIVE",
        lastActive: "Just added",
      },
    ]);
    setName("");
    setEmail("");
  }

  function toggleAccessLevel(id: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, accessLevel: m.accessLevel === "ADMIN" ? "CUSTOMER" : "ADMIN" }
          : m
      )
    );
  }

  function toggleStatus(id: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "ACTIVE" ? "DISABLED" : "ACTIVE" }
          : m
      )
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Access Control</p>
        <h1 className="mt-1 text-2xl font-medium text-ink">
          Access Levels (Owner / Admin &amp; Customer)
        </h1>
        <p className="mt-1 text-sm text-slate">
          The platform uses two access levels: <strong>Owner / Admin</strong> (full access to all store management screens) and <strong>Customer</strong> (storefront, wishlist, cart, checkout, and account).
        </p>
      </div>

      {/* Add Account Form */}
      <form
        onSubmit={handleAddAccount}
        className="border border-line bg-surface p-5 space-y-4"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-loupe" />
          <span>Grant Access</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-ink">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="mt-1 h-10 w-full rounded-[3px] border border-line bg-surface px-3 text-xs text-ink focus:border-loupe focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@keianluxandor.com"
              className="mt-1 h-10 w-full rounded-[3px] border border-line bg-surface px-3 text-xs text-ink focus:border-loupe focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink">Access Level</label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as "ADMIN" | "CUSTOMER")}
              className="mt-1 h-10 w-full rounded-[3px] border border-line bg-surface px-3 text-xs text-ink focus:border-loupe focus:outline-none"
            >
              <option value="ADMIN">Owner / Admin (Full Admin Access)</option>
              <option value="CUSTOMER">Customer (Storefront &amp; Orders)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex h-10 items-center bg-ink px-5 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep"
        >
          Add User
        </button>
      </form>

      {/* Accounts Table */}
      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink bg-platinum/50 text-xs font-semibold uppercase tracking-wider text-ink">
              <th className="py-3 pl-4 pr-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Access Level</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Last Active</th>
              <th className="py-3 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-platinum/30">
                <td className="py-3 pl-4 pr-3 font-medium text-ink">{m.name}</td>
                <td className="px-3 py-3 text-xs text-slate">{m.email}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      m.accessLevel === "ADMIN"
                        ? "bg-ink text-white"
                        : "bg-platinum text-ink"
                    }`}
                  >
                    {m.accessLevel === "ADMIN" && <ShieldCheck className="h-3 w-3" />}
                    {m.accessLevel === "ADMIN" ? "Owner / Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      m.status === "ACTIVE" ? "text-ok" : "text-out"
                    }`}
                  >
                    {m.status === "ACTIVE" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Ban className="h-3.5 w-3.5" />
                    )}
                    {m.status === "ACTIVE" ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-slate">{m.lastActive}</td>
                <td className="py-3 pl-3 pr-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleAccessLevel(m.id)}
                    className="rounded-[3px] border border-line px-2.5 py-1 text-xs text-ink hover:bg-platinum"
                  >
                    Switch to {m.accessLevel === "ADMIN" ? "Customer" : "Admin"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStatus(m.id)}
                    className="rounded-[3px] border border-line px-2.5 py-1 text-xs text-slate hover:text-ink"
                  >
                    {m.status === "ACTIVE" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}