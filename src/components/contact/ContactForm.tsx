"use client";

import { useState } from "react";
import { FormAlert, TextField } from "@/components/auth/FormParts";
import { NotAvailableYet } from "@/components/common/NotAvailableYet";
import { isEnabled } from "@/config/features";
import { ApiError } from "@/lib/api/client";
import { sendEnquiry, type EnquiryRequest, type EnquiryType } from "@/lib/api/support";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const TYPES: { value: EnquiryType; label: string }[] = [
  { value: "CONTACT", label: "A question" },
  { value: "VIEWING", label: "Book a viewing" },
  { value: "DIAMOND_QUESTION", label: "About a diamond" },
];

const TIMES = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
  { value: "EVENING", label: "Evening" },
] as const;

/** Contact form and "Book a viewing" (POST /enquiries, planned). */
export function ContactForm({ initialType, productSlug }: { initialType: EnquiryType; productSlug?: string }) {
  const session = useSession();
  const user = session.status === "user" ? session.user : null;
  const [type, setType] = useState<EnquiryType>(initialType);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<EnquiryRequest["preferredTime"]>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>();
  const [done, setDone] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (!isEnabled("enquiries")) {
    let text = "Hello Keian Luxandor, I have a question.";
    if (initialType === "VIEWING") text = "Hello Keian Luxandor, I'd like to book a viewing at your showroom.";
    if (productSlug) text = `Hello Keian Luxandor, I have a question about this diamond: ${productSlug}`;
    return (
      <NotAvailableYet className="mt-6" title="Our online form is coming soon" whatsappText={text}>
        For now, the quickest way to reach us — or to book a viewing — is WhatsApp or a call. We’ll reply the same day.
      </NotAvailableYet>
    );
  }

  if (done) {
    return (
      <div role="status" className="mt-6 border border-ok/30 bg-ok-bg p-6 text-ok">
        <p className="font-serif text-2xl">Thank you</p>
        <p className="mt-1">{done}</p>
      </div>
    );
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter an email like name@example.com.";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a 10-digit mobile number.";
    if (type === "VIEWING" && !date) e.preferredDate = "Choose a day.";
    if (type !== "VIEWING" && !message.trim()) e.message = "Write a short message.";
    return e;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    setError(undefined);
    let text = message.trim();
    if (!text && type === "VIEWING") text = "I'd like to book a viewing.";
    try {
      const res = await sendEnquiry({
        type,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.replace(/\D/g, "").slice(-10),
        message: text,
        ...(productSlug ? { productSlug } : {}),
        ...(type === "VIEWING" ? { preferredDate: date, preferredTime: time } : {}),
      });
      setDone(res.message);
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fieldErrors);
      setError(err instanceof Error ? err.message : "Couldn’t send your message.");
    } finally {
      setBusy(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  let submitLabel = "Send message";
  if (type === "VIEWING") submitLabel = "Request a viewing";
  if (busy) submitLabel = "Sending…";

  return (
    <form onSubmit={submit} noValidate className="mt-6 space-y-5">
      {error && <FormAlert>{error}</FormAlert>}
      <fieldset>
        <legend className="text-sm font-medium">What can we help with?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t.value} type="button" className="chip" aria-pressed={type === t.value} onClick={() => setType(t.value)}>
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>
      {productSlug && <p className="border border-line bg-stone px-3 py-2 text-sm">About diamond: {productSlug}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Your name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
        <TextField label="Mobile number" type="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
      </div>
      <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      {type === "VIEWING" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Preferred day" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} error={errors.preferredDate} />
          <fieldset>
            <legend className="block text-sm font-medium">Preferred time</legend>
            <div className="mt-1.5 flex gap-2">
              {TIMES.map((t) => (
                <button key={t.value} type="button" className={cn("chip flex-1")} aria-pressed={time === t.value} onClick={() => setTime(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
      <label className="block text-sm font-medium">
        Message {type === "VIEWING" && <span className="font-normal text-slate">(optional — e.g. the shapes or sizes you’d like to see)</span>}
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={2000} className={cn("field mt-1.5", errors.message ? "border-out" : "")} aria-invalid={Boolean(errors.message)} />
        {errors.message && <span className="mt-1.5 block text-sm font-normal text-out">{errors.message}</span>}
      </label>
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {submitLabel}
      </button>
      <p className="text-xs text-slate">We only use these details to reply to you.</p>
    </form>
  );
}
