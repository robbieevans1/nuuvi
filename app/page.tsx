"use client"

import { useState, useEffect } from "react";

export default function Home() {
  const text = "AI Domain Name Analyzer";
  const [displayedText, setDisplayedText] = useState("");

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
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Nuuvi</h1>
        <p className="text-gray-400">{displayedText}</p>
      </div>
    </main>
  );
}
