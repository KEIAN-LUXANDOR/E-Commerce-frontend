"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { site, whatsappUrl, telUrl, mailtoUrl } from "@/lib/site";
import { sendContactMessage } from "@/lib/api/support";
import { showToast } from "@/lib/stores";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappLink = whatsappUrl(
    message
      ? `Hello Keian Luxandor, my name is ${fullName || "a client"}. Inquiry: ${message}`
      : "Hello Keian Luxandor, I would like to consult with a gemologist regarding certified loose diamonds."
  );
  const phoneLink = telUrl();
  const mailLink = mailtoUrl("Private Client Diamond Inquiry");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !fullName.trim() || !email.trim()) {
      showToast("Please provide your name, email, and message.", { tone: "error" });
      return;
    }

    setLoading(true);

    try {
      await sendContactMessage({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        orderNumber: orderNumber.trim(),
        message: message.trim(),
        website,
      });
      setSubmitted(true);
      showToast("Your inquiry has been received. Our gemologist will contact you shortly.", { tone: "success" });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to send inquiry. Please reach out via WhatsApp.", { tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page py-12 sm:py-16">
      {/* Editorial Header */}
      <div className="max-w-2xl">
        <p className="eyebrow">Client Services &amp; Advisory</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
          Private Consultation &amp; Atelier
        </h1>
        <p className="mt-3 text-sm text-slate leading-relaxed">
          Speak with our certified gemologists regarding diamond metrology, custom sourcing, or schedule a private inspection at our Baner, Pune showroom.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        {/* Left Column: Direct Contact & Atelier Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-line bg-surface p-6 sm:p-8 space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink border-b border-line pb-3">
              Pune Showroom &amp; Office
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-ink shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ink">{site.name} Showroom</p>
                  <p className="text-slate mt-0.5">{site.addressLine}</p>
                  <p className="text-slate">{site.city}, {site.state} — {site.pincode}</p>
                  <p className="text-[11px] text-muted mt-1 italic">Private viewings by prior appointment</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="size-4 text-ink shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ink">Viewing Hours</p>
                  <p className="text-slate mt-0.5">{site.hours}</p>
                </div>
              </div>

              {phoneLink && (
                <div className="flex items-start gap-3">
                  <Phone className="size-4 text-ink shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-ink">Direct Telephone</p>
                    <a href={phoneLink} className="text-slate hover:text-ink underline mt-0.5 inline-block font-mono">
                      {site.phone}
                    </a>
                  </div>
                </div>
              )}

              {mailLink && (
                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-ink shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-ink">Electronic Correspondence</p>
                    <a href={mailLink} className="text-slate hover:text-ink underline mt-0.5 inline-block">
                      {site.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Concierge CTA */}
            {whatsappLink && (
              <div className="pt-4 border-t border-line">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-none bg-[#1f7a4d] px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-[#18633e] transition-colors"
                >
                  <MessageCircle className="size-4" />
                  Chat with Gemologist on WhatsApp
                </a>
                <p className="text-[11px] text-muted text-center mt-2">
                  Instant response during atelier hours
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact & Private Appointment Form */}
        <div className="lg:col-span-7">
          <div className="border border-line bg-surface p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink border-b border-line pb-3 mb-6">
              Send an Inquiry or Schedule a Viewing
            </h2>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="size-12 text-ok mx-auto" />
                <h3 className="font-serif text-2xl font-medium text-ink">Inquiry Received</h3>
                <p className="text-xs text-slate max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-medium text-ink">{fullName}</span>. An appraisal specialist has been assigned to your request and will respond to <span className="font-medium text-ink">{email}</span> within 2 business hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="btn btn-secondary text-xs uppercase tracking-widest px-6 py-2.5"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="page-website">Website</label>
                  <input
                    id="page-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="page-subject" className="block text-xs font-medium uppercase tracking-wider text-slate mb-1.5">
                    Subject *
                  </label>
                  <select id="page-subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-11 border border-line bg-surface px-3 text-xs text-ink focus:border-ink focus:outline-none"
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="General gemological consultation">General Gemological Consultation</option>
                    <option value="Schedule Baner showroom appointment">Schedule Baner Showroom Appointment</option>
                    <option value="Question about a diamond">Question About a Diamond</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="page-f2" className="block text-xs font-medium uppercase tracking-wider text-slate mb-1.5">
                      Full Name *
                    </label>
                    <input id="page-f2"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-11 border border-line bg-surface px-3 text-xs text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="page-f3" className="block text-xs font-medium uppercase tracking-wider text-slate mb-1.5">
                      Email Address *
                    </label>
                    <input id="page-f3"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 border border-line bg-surface px-3 text-xs text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="page-f4" className="block text-xs font-medium uppercase tracking-wider text-slate mb-1.5">
                    Mobile Number (Optional)
                  </label>
                  <input id="page-f4"
                    name="phone"
                    type="tel"
                    placeholder="Include country code if outside India"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 border border-line bg-surface px-3 text-xs text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="page-order-number" className="block text-xs font-medium uppercase tracking-wider text-slate mb-1.5">
                    Order Number (Optional)
                  </label>
                  <input id="page-order-number"
                    name="orderNumber"
                    type="text"
                    placeholder="e.g. KL100019"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full h-11 border border-line bg-surface px-3 text-xs text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="page-f5" className="block text-xs font-medium uppercase tracking-wider text-slate mb-1.5">
                    Inquiry or Viewing Notes *
                  </label>
                  <textarea id="page-f5"
                    name="message"
                    required
                    rows={4}
                    placeholder="Please specify carat weight, cut preferences, or preferred viewing dates..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-line bg-surface p-3 text-xs text-ink focus:border-ink focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  isLoading={loading}
                  leftIcon={!loading ? <Send className="size-4" /> : undefined}
                  className="w-full shadow-md"
                >
                  {loading ? "Transmitting..." : "Submit Consultation Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}