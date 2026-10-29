"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/stores";
import { sessionStore } from "@/lib/session";

export function ContactForm() {
  const session = sessionStore.useSession();
  const user = session?.user;

  const initialName = user?.fullName ?? "";
  const initialEmail = user?.email || "";

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, subject, message }),
      });

      showToast("Message sent successfully", { tone: "success" });
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to send message.");

        if (err.errors) {
          const nextFieldErrors: Record<string, string> = {};

          err.errors.forEach((item) => {
            nextFieldErrors[item.field] = item.message;
          });

          setFieldErrors(nextFieldErrors);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div role="alert" className="p-3 bg-out/10 text-out text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs uppercase mb-1">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={
              fieldErrors.name ? "contact-name-error" : undefined
            }
            className="w-full h-10 border px-3 text-sm"
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className="mt-1 text-sm text-out">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs uppercase mb-1">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? "contact-email-error" : undefined
            }
            className="w-full h-10 border px-3 text-sm"
          />
          {fieldErrors.email && (
            <p id="contact-email-error" className="mt-1 text-sm text-out">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-xs uppercase mb-1"
        >
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={
            fieldErrors.subject ? "contact-subject-error" : undefined
          }
          className="w-full h-10 border px-3 text-sm"
        />
        {fieldErrors.subject && (
          <p id="contact-subject-error" className="mt-1 text-sm text-out">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs uppercase mb-1"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message ? "contact-message-error" : undefined
          }
          className="w-full h-32 border p-3 text-sm resize-none"
        />
        {fieldErrors.message && (
          <p id="contact-message-error" className="mt-1 text-sm text-out">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-11 bg-ink text-white px-8 text-xs uppercase tracking-widest"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}

export default ContactForm;