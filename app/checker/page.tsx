"use client";

import { useState, useEffect } from "react";

export default function CheckerPage() {
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
       <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Nuuvi</h1>
        <p className="text-gray-400">{displayedText}</p>

        <div className="flex items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name..."
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
          />
          <button
            onClick={analyze}
            className="px-4 py-2 bg-white text-black rounded"
          >
            Analyze
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-6 space-y-4 w-full max-w-xl px-4">
        {loading && <p>Analyzing...</p>}

        {result && (
          <div className="bg-gray-900 p-4 rounded w-full">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
       </div> 
     
    );
}