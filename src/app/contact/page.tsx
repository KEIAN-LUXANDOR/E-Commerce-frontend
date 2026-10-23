"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { showToast } from "@/lib/stores";
import { MessageCircle, Phone, Mail, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "sourcing",
    shape: "Round",
    budget: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      showToast("Please provide your name and email address.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast("Your inquiry has been logged with our gemological desk.", "info");
    }, 600);
  };

  return (
    <div className="w-full bg-white text-[var(--color-ink)]">
      {/* Header */}
      <section className="border-b border-[var(--color-line)] bg-white py-12">
        <div className="page">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">Contact Concierge</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-slate)]">
              Private Advisory Desk
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Direct gemological <span className="italic">consultation</span>
            </h1>
            <p className="mt-3 text-base text-[var(--color-slate)] leading-relaxed font-light">
              Connect directly with our GIA and IGI credentialed gemologists for optical appraisal, custom diamond sourcing, or certificate validation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="bg-[var(--color-stone)] py-16">
        <div className="page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          {/* Left Column: Direct Desk Channels */}
          <div className="space-y-6">
            <div className="border border-[var(--color-line)] bg-white p-8">
              <h2 className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                Direct Desk Channels
              </h2>
              <p className="mt-2 text-xs text-[var(--color-slate)] leading-relaxed">
                Our gemologists are stationed at our central metrology lab in Surat and Mumbai to assist with real-time stone verification.
              </p>

              <div className="mt-8 space-y-6">
                {/* WhatsApp */}
                <a
                  href={whatsappLink("Hello Keian Luxandor, I would like to consult with a gemologist regarding certified loose diamonds.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 border border-[var(--color-line)] bg-[var(--color-stone)] hover:border-[var(--color-ink)] transition-colors group"
                >
                  <div className="size-10 bg-[#1f7a4d] text-white grid place-items-center shrink-0">
                    <MessageCircle className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] block">
                      WhatsApp Private Desk
                    </span>
                    <span className="font-mono text-sm text-[var(--color-slate)] mt-0.5 block">
                      +91 98985 52297
                    </span>
                    <span className="text-[11px] text-[#1f7a4d] font-medium mt-1 inline-block">
                      Instant response · Active now &rarr;
                    </span>
                  </div>
                </a>

                {/* Telephone */}
                <div className="flex items-start gap-4 p-4 border border-[var(--color-line)] bg-white">
                  <div className="size-10 bg-[var(--color-stone)] border border-[var(--color-line)] text-[var(--color-ink)] grid place-items-center shrink-0">
                    <Phone className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] block">
                      Direct Telephone
                    </span>
                    <a
                      href={site.phoneHref}
                      className="font-mono text-sm text-[var(--color-ink)] hover:text-[var(--color-loupe)] mt-0.5 block font-medium"
                    >
                      {site.phone}
                    </a>
                    <span className="text-[11px] text-[var(--color-muted)] mt-1 block">
                      Mon – Sat: 10:00 AM – 8:00 PM IST
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 border border-[var(--color-line)] bg-white">
                  <div className="size-10 bg-[var(--color-stone)] border border-[var(--color-line)] text-[var(--color-ink)] grid place-items-center shrink-0">
                    <Mail className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] block">
                      Official Advisory Email
                    </span>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-sm text-[var(--color-ink)] hover:text-[var(--color-loupe)] mt-0.5 block font-medium"
                    >
                      {site.email}
                    </a>
                    <span className="text-[11px] text-[var(--color-muted)] mt-1 block">
                      Dossiers and invoice requests
                    </span>
                  </div>
                </div>
              </div>

              {/* Service SLA */}
              <div className="mt-8 border-t border-[var(--color-line)] pt-6 flex items-center gap-3 text-xs text-[var(--color-slate)]">
                <Clock className="size-4 text-[var(--color-loupe)] shrink-0" aria-hidden="true" />
                <span>Guaranteed written response within 2 hours during trading hours.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="border border-[var(--color-line)] bg-white p-8 sm:p-10">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto size-16 bg-[#e7f0eb] text-[#2f6b4f] rounded-full grid place-items-center mb-6">
                  <CheckCircle2 className="size-8" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                  Consultation Request Dispatched
                </h3>
                <p className="mt-3 text-sm text-[var(--color-slate)] max-w-md mx-auto leading-relaxed">
                  Thank you, {form.name}. A senior gemologist has been assigned to your inquiry and will reach out via {form.phone ? "WhatsApp/Phone" : "email"} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 border border-[var(--color-line)] bg-[var(--color-stone)] px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink)] hover:bg-[var(--color-stone-deep)] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                    Schedule a Diamond Appraisal
                  </h2>
                  <p className="mt-1 text-xs text-[var(--color-slate)]">
                    Provide your requirements below and our gemology team will prepare a curated technical dossier.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Vikram Mehta"
                      className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-loupe)] focus:outline-none rounded-[3px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. v.mehta@domain.com"
                      className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-loupe)] focus:outline-none rounded-[3px]"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                      WhatsApp / Mobile Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +91 98985 00000"
                      className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-loupe)] focus:outline-none rounded-[3px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                      Inquiry Category
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none rounded-[3px]"
                    >
                      <option value="sourcing">Custom Diamond Sourcing</option>
                      <option value="certification">Certificate &amp; Laser Verification</option>
                      <option value="armoured">Armoured Logistics &amp; Insurance</option>
                      <option value="general">General Appraisal Guidance</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                      Preferred Diamond Silhouette
                    </label>
                    <select
                      value={form.shape}
                      onChange={(e) => setForm({ ...form, shape: e.target.value })}
                      className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none rounded-[3px]"
                    >
                      <option value="Round">Round Brilliant</option>
                      <option value="Oval">Oval</option>
                      <option value="Emerald">Emerald</option>
                      <option value="Cushion">Cushion</option>
                      <option value="Radiant">Radiant</option>
                      <option value="Pear">Pear</option>
                      <option value="Princess">Princess</option>
                      <option value="Marquise">Marquise</option>
                      <option value="Asscher">Asscher</option>
                      <option value="Heart">Heart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                      Target Budget (INR)
                    </label>
                    <input
                      type="text"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="e.g. ₹3,50,000 – ₹6,000,000"
                      className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-loupe)] focus:outline-none rounded-[3px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-2">
                    Specific Technical Questions or Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide certificate numbers, preferred color/clarity thresholds, or proportion requirements..."
                    className="w-full border border-[var(--color-line)] bg-white p-3.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-loupe)] focus:outline-none rounded-[3px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-none bg-[var(--color-ink)] text-white text-xs font-medium uppercase tracking-[0.14em] hover:bg-[var(--color-loupe)] transition-colors disabled:opacity-50"
                >
                  {loading ? "Transmitting..." : "Transmit Consultation Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
