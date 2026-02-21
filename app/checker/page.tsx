"use client";

import { useState } from "react";

type CheckResult = {
  domain: string;
  tld: string;
  available: boolean | null;
  confidence: "high" | "medium" | "low";
  method: string;
  detail?: string;
  nsRecords?: string[];
};

function Badge({ available }: { available: boolean | null }) {
  const base = "px-2 py-1 rounded text-xs font-medium border";
  if (available === true) {
    return (
      <span className={`${base} border-emerald-700 text-emerald-300`}>
        Available
      </span>
    );
  }
  if (available === false) {
    return <span className={`${base} border-red-700 text-red-300`}>Taken</span>;
  }
  return (
    <span className={`${base} border-yellow-700 text-yellow-300`}>Unknown</span>
  );
}

export default function CheckerPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const check = async () => {
    setError(null);
    setResults([]);
    setRemaining(null);

    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/domain-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          tlds: ["com", "io", "ai", "dev"],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Request failed");
        return;
      }

      setRemaining(data?.rateLimit?.remaining ?? null);
      setResults(data?.results ?? []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-6xl font-bold">Nuuvi</h1>
      <p className="text-neutral-300 text-lg">Domain Availability (NS Check)</p>

      <div className="flex gap-3">
        <input
          className="w-80 rounded bg-neutral-900 border border-neutral-800 px-3 py-2"
          placeholder="Enter a name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
        />
        <button
          onClick={check}
          className="rounded bg-white px-6 py-2 text-black"
        >
          Check
        </button>
      </div>

      {loading && <p className="text-neutral-300">Checking…</p>}
      {error && <p className="text-red-400">{error}</p>}

      {remaining !== null && (
        <p className="text-xs text-neutral-500">
          Rate limit remaining: {remaining}
        </p>
      )}

      {results.length > 0 && (
        <div className="w-full max-w-xl space-y-2">
          {results.map((r) => (
            <div
              key={r.domain}
              className="rounded border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-sm">{r.domain}</div>
                <div className="flex items-center gap-2">
                  <Badge available={r.available} />
                  <span className="text-xs text-neutral-500">
                    {r.confidence}
                  </span>
                </div>
              </div>

              {r.available === false &&
                r.nsRecords &&
                r.nsRecords.length > 0 && (
                  <div className="mt-2 text-xs text-neutral-500">
                    NS: {r.nsRecords.join(", ")}
                  </div>
                )}

              {r.detail && (
                <div className="mt-1 text-xs text-neutral-600">
                  ({r.detail})
                </div>
              )}
            </div>
          ))}

          <p className="pt-2 text-xs text-neutral-500">
            Note: NS-based DNS check is not 100% authoritative in rare
            propagation/edge cases.
          </p>
        </div>
      )}
    </div>
  );
}
