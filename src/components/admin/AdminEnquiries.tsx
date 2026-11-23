"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AdminHeader,
  ErrorNote,
  Loading,
  NotConnected,
  useAdminQuery,
} from "@/components/admin/AdminBits";
import {
  CONTACT_MESSAGES_UPDATED_EVENT,
  getContactMessage,
  getContactMessageStats,
  listContactMessages,
  listEnquiries,
  markContactMessageHandled,
  setEnquiryStatus,
} from "@/lib/api/admin";
import type { AdminContactMessage, ContactMessageStats, EnquiryStatus } from "@/lib/types/admin";

const STATUSES: EnquiryStatus[] = ["NEW", "IN_PROGRESS", "DONE"];

type EnquiryTab = "messages" | "enquiries";

export function AdminEnquiries() {
  const [tab, setTab] = useState<EnquiryTab>("messages");
  const stats = useAdminQuery("adminEnquiries", getContactMessageStats, []);

  return (
    <div className="space-y-5">
      <AdminHeader title="Enquiries" description="Customer contact messages, diamond questions, and viewing requests." />
      {stats.error && <ErrorNote message={stats.error} />}
      <div role="tablist" aria-label="Enquiry type" className="flex flex-wrap gap-2 border-b border-line">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "messages"}
          onClick={() => setTab("messages")}
          className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === "messages" ? "border-ink text-ink" : "border-transparent text-slate"}`}
        >
          Contact messages
          {stats.data && (
            <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-out px-1.5 py-0.5 text-xs font-semibold text-white">
              {stats.data.newMessages}
            </span>
          )}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "enquiries"}
          onClick={() => setTab("enquiries")}
          className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === "enquiries" ? "border-ink text-ink" : "border-transparent text-slate"}`}
        >
          Consultations &amp; viewings
        </button>
      </div>
      {tab === "messages"
        ? <ContactMessages stats={stats.data} reloadStats={stats.reload} />
        : <ConsultationEnquiries />}
    </div>
  );
}

function ContactMessages({
  stats,
  reloadStats,
}: {
  stats?: ContactMessageStats;
  reloadStats: () => void;
}) {
  const [newOnly, setNewOnly] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | number>();
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessage>();
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string>();
  const messages = useAdminQuery(
    "adminEnquiries",
    () => listContactMessages({ status: newOnly ? "NEW" : undefined, page, size: 20 }),
    [newOnly, page],
  );

  async function openMessage(id: string | number) {
    setSelectedId(id);
    setSelectedMessage(undefined);
    setDetailError(undefined);
    setDetailLoading(true);
    try {
      setSelectedMessage(await getContactMessage(id));
    } catch (cause) {
      setDetailError(cause instanceof Error ? cause.message : "Could not load contact message.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function markHandled() {
    if (!selectedId) return;
    setBusy(true);
    setActionError(undefined);
    try {
      await markContactMessageHandled(selectedId);
      setSelectedMessage((current) => current ? { ...current, status: "HANDLED" } : current);
      messages.reload();
      reloadStats();
      window.dispatchEvent(new Event(CONTACT_MESSAGES_UPDATED_EVENT));
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Could not mark message as handled.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate">
          Newest messages first · {stats?.totalMessages ?? messages.data?.totalItems ?? 0} total
          {stats && ` · ${stats.newMessages} new`}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={newOnly} onChange={(event) => { setNewOnly(event.target.checked); setPage(0); }} />
          Show new messages only
        </label>
      </div>
      {messages.off && <NotConnected feature="adminEnquiries" endpoints={["GET /api/v1/admin/contact-messages/stats", "GET /api/v1/admin/contact-messages?status=NEW&page=0&size=20", "GET /api/v1/admin/contact-messages/{id}", "PUT /api/v1/admin/contact-messages/{id}/handled"]} />}
      {messages.error && <ErrorNote message={messages.error} />}
      {messages.loading && <Loading />}
      {messages.data && messages.data.items.length === 0 && (
        <p className="border border-line bg-white p-6 text-sm text-slate">No contact messages found.</p>
      )}
      <div className="grid gap-4">
        {messages.data?.items.map((item) => (
          <article key={item.id} className="space-y-3 border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{item.name} · {item.subject}</h2>
                <p className="text-sm text-slate">{item.email}{item.phone ? ` · ${item.phone}` : ""}</p>
                <p className="mt-1 text-xs text-slate">{formatMessageDate(item.createdAt)} · {item.status}</p>
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => void openMessage(item.id)}>View message</button>
            </div>
            <p className="whitespace-pre-wrap text-sm">{item.message}</p>
          </article>
        ))}
      </div>
      {messages.data && messages.data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button type="button" className="btn btn-secondary" disabled={page === 0 || messages.loading} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <span className="text-sm text-slate">Page {messages.data.page + 1} of {messages.data.totalPages}</span>
          <button type="button" className="btn btn-secondary" disabled={page + 1 >= messages.data.totalPages || messages.loading} onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>
      )}

      {selectedId && (
        <section aria-labelledby="contact-message-detail" className="space-y-4 border border-line bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="contact-message-detail" className="text-xl font-medium">Message details</h2>
              {selectedMessage && <p className="mt-1 text-sm text-slate">{selectedMessage.name} · {selectedMessage.status}</p>}
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => { setSelectedId(undefined); setSelectedMessage(undefined); }}>Close</button>
          </div>
          {detailLoading && <Loading />}
          {detailError && <ErrorNote message={detailError} />}
          {actionError && <ErrorNote message={actionError} />}
          {selectedMessage && (
            <>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-slate">Email</dt><dd><a className="btn-link" href={`mailto:${encodeURIComponent(selectedMessage.email)}`}>{selectedMessage.email}</a></dd></div>
                {selectedMessage.phone && <div><dt className="text-slate">Phone</dt><dd><a className="btn-link" href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a></dd></div>}
                {selectedMessage.orderNumber && <div><dt className="text-slate">Order number</dt><dd>{selectedMessage.orderNumber}</dd></div>}
                <div><dt className="text-slate">Received</dt><dd>{formatMessageDate(selectedMessage.createdAt)}</dd></div>
              </dl>
              <p className="whitespace-pre-wrap border-t border-line pt-4 text-sm">{selectedMessage.message}</p>
              {selectedMessage.status === "NEW" && (
                <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void markHandled()}>
                  {busy ? "Updating…" : "Mark as handled"}
                </button>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

function ConsultationEnquiries() {
  const [status, setStatus] = useState<EnquiryStatus | "">("");
  const [busyId, setBusyId] = useState<string>();
  const [error, setError] = useState<string>();
  const enquiries = useAdminQuery("adminEnquiries", () => listEnquiries({ status: status || undefined }), [status]);

  async function updateStatus(id: string, value: EnquiryStatus) {
    setBusyId(id);
    setError(undefined);
    try {
      await setEnquiryStatus(id, value);
      enquiries.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update enquiry status.");
    } finally {
      setBusyId(undefined);
    }
  }

  return (
    <div className="space-y-5">
      {enquiries.off && <NotConnected feature="adminEnquiries" endpoints={["GET /api/v1/admin/enquiries", "PUT /api/v1/admin/enquiries/{id}/status"]} />}
      {error && <ErrorNote message={error} />}
      {enquiries.error && <ErrorNote message={enquiries.error} />}
      <label className="block max-w-xs space-y-1 text-sm">Filter by status
        <select value={status} onChange={(e) => setStatus(e.target.value as EnquiryStatus | "")} className="field">
          <option value="">All statuses</option>{STATUSES.map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}
        </select>
      </label>
      {enquiries.loading && <Loading />}
      {enquiries.data && enquiries.data.items.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No enquiries found.</p>}
      <div className="grid gap-4">
        {enquiries.data?.items.map((item) => (
          <article key={item.id} className="space-y-3 border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="font-medium">{item.fullName} · {item.type.replaceAll("_", " ")}</h2><p className="text-sm text-slate">{item.email}{item.phone ? ` · ${item.phone}` : ""}</p></div>
              <select aria-label={`Status for ${item.fullName}`} value={item.status} disabled={busyId === item.id || enquiries.off} onChange={(e) => void updateStatus(item.id, e.target.value as EnquiryStatus)} className="field w-auto">
                {STATUSES.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}
              </select>
            </div>
            <p className="whitespace-pre-wrap text-sm">{item.message}</p>
            {item.productSlug && <Link href={`/diamond/${encodeURIComponent(item.productSlug)}`} className="btn-link">View diamond</Link>}
            {item.preferredDate && <p className="text-sm text-slate">Requested viewing: {item.preferredDate}{item.preferredTime ? ` · ${item.preferredTime.toLowerCase()}` : ""}</p>}
            <div className="flex gap-4 text-sm"><a className="btn-link" href={`mailto:${encodeURIComponent(item.email)}`}>Email</a>{item.phone && <a className="btn-link" href={`tel:${item.phone}`}>Call</a>}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatMessageDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
