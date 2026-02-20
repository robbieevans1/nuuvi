"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const text = "AI Domain Name Analyzer";
  const [displayedText, setDisplayedText] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!name) return;
    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index === text.length) {
        clearInterval(interval);
      }
    }, 75); // typing speed (ms)

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-6xl font-bold">Nuuvi</h1>

      <p className="text-neutral-300 text-lg">
        Check domain availability and get AI name suggestions.
      </p>

      <Link
        href="/checker"
        className="inline-block rounded bg-white px-6 py-3 text-black"
      >
        Open Domain Checker
      </Link>
    </div>
    </main>
  );
}
