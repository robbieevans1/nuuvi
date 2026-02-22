"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ type: "error", text: data?.error ?? "Something went wrong." });
        return;
      }

      setStatus({ type: "success", text: "Message sent." });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus({ type: "error", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-white">Contact</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Send a message and we will be in touch soon.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-neutral-300">Name</label>
          <input
            className="mt-2 w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-300">Email</label>
          <input
            className="mt-2 w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-300">Message</label>
          <textarea
            className="mt-2 min-h-[140px] w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-600"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can I help?"
            required
          />
        </div>

        {status && (
          <p
            className={
              status.type === "success"
                ? "text-sm text-green-400"
                : "text-sm text-red-400"
            }
          >
            {status.text}
          </p>
        )}

        <button
          disabled={loading}
          className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}