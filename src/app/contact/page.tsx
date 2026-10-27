"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { showToast } from "@/lib/stores";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      showToast("Message cannot be empty", { tone: "error" });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("");
      showToast("Message sent successfully.", { tone: "success" });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif tracking-widest text-ink uppercase">Contact Us</h1>
        <p className="mt-4 text-sm text-slate">We are here to assist you with any inquiries.</p>
      </div>
      <div className="bg-surface border border-line p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">Message</label>
            <textarea 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 border border-line bg-surface p-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors resize-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 flex items-center justify-center bg-ink text-white text-xs font-medium uppercase tracking-widest hover:bg-loupe-deep transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}