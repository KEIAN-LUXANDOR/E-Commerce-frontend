"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/stores";
import { sessionStore } from "@/lib/session";

export function ContactForm() {
  const session = sessionStore.useSession();
  const user = session?.user;

  const initialName = user ? ((user as any).name || (user as any).fullName || (user as any).firstName || "") : "";
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
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to send message.");
        if (err.errors) {
          const fe: Record<string, string> = {};
          err.errors.forEach((e: any) => { fe[e.field] = e.message; });
          setFieldErrors(fe);
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
      {error && <div className="p-3 bg-out/10 text-out text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase mb-1">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 border px-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs uppercase mb-1">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 border px-3 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase mb-1">Subject</label>
        <input required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-10 border px-3 text-sm" />
      </div>
      <div>
        <label className="block text-xs uppercase mb-1">Message</label>
        <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-32 border p-3 text-sm resize-none" />
      </div>
      <button type="submit" disabled={loading} className="h-11 bg-ink text-white px-8 text-xs uppercase tracking-widest">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Send Message"}
      </button>
    </form>
  );
}

export default ContactForm;