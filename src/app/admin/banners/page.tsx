"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Image as ImageIcon, ExternalLink, Calendar } from "lucide-react";
import { getActiveBanners } from "@/lib/api/catalog";
import {
  AdminHeader,
  AdminTable,
  ErrorNote,
  Loading,
  NotConnected,
  Panel,
  useAdminQuery,
} from "@/components/admin/AdminBits";
import { formatDate } from "@/lib/format";
import type { Banner } from "@/lib/types/catalog";

export default function AdminBannersPage() {
  const q = useAdminQuery("adminCatalog", getActiveBanners, []);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Promotional Banners &amp; Vitrine"
        description="Configure hero banners, collection announcements, and seasonal vitrines."
        back={{ href: "/admin", label: "Operations Dashboard" }}
        action={
          <button
            type="button"
            disabled={q.off}
            className="btn btn-primary text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="size-4" />
            Create Banner
          </button>
        }
      />

      {q.off && (
        <NotConnected feature="adminCatalog" endpoints={["GET /api/v1/banners/active", "POST /api/v1/admin/banners"]}>
          <p className="text-xs text-slate mt-2">
            The banner management engine will allow staff to schedule homepage vitrines and marketing promotions with date-range filters.
          </p>
        </NotConnected>
      )}

      {q.loading && <Loading />}
      {q.error && <ErrorNote message={q.error} />}

      <Panel title="Active Storefront Banners">
        {q.data && q.data.length > 0 ? (
          <AdminTable minWidth="50rem">
            <thead>
              <tr>
                <th>Title &amp; Copy</th>
                <th>Call to Action</th>
                <th>Schedule</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {q.data.map((banner) => (
                <tr key={banner.id}>
                  <td>
                    <p className="font-medium text-ink">{banner.title}</p>
                    <p className="text-xs text-slate line-clamp-1">{banner.text}</p>
                  </td>
                  <td>
                    <Link
                      href={banner.ctaHref}
                      className="inline-flex items-center gap-1 text-xs text-ink hover:underline font-mono"
                    >
                      {banner.ctaLabel} ({banner.ctaHref})
                      <ExternalLink className="size-3" />
                    </Link>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs text-slate font-mono">
                      <Calendar className="size-3.5" />
                      <span>{formatDate(banner.startsAt)} — {formatDate(banner.endsAt)}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="text-xs text-slate">Managed via API</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <div className="py-8 text-center text-xs text-slate">
            <ImageIcon className="size-8 mx-auto text-slate mb-2" />
            <p className="font-medium text-ink">No active scheduled banners found</p>
            <p className="mt-1">Default editorial monograph displays on the storefront.</p>
          </div>
        )}
      </Panel>
    </div>
  );
}
