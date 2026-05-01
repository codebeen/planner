"use client";
import { useState, useEffect, useCallback } from "react";
import { Quote, RefreshCw } from "lucide-react";

const QUOTES = [
  "She believed she could, so she did.",
  "A little progress each day adds up to big results.",
  "You are enough, always.",
  "Bloom where you are planted.",
  "Be your own kind of beautiful.",
  "Small steps every day.",
  "Today is a fresh start.",
  "You've got this, babe.",
  "Be the energy you want to attract.",
  "Difficult roads often lead to beautiful destinations.",
];

export default function QuoteBar() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  const next = useCallback((manual = false) => {
    setVisible(false);
    setTimeout(() => {
      setIdx(i => (i + (manual ? 1 : 1)) % QUOTES.length);
      setVisible(true);
    }, 400);
  }, []);

  useEffect(() => {
    setMounted(true);
    setIdx(Math.floor(Math.random() * QUOTES.length));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => next(), 30000);
    return () => clearInterval(timer);
  }, [next, mounted]);

  return (
    <div className="relative w-full overflow-hidden border-b border-pink-300 px-4 py-2.5 flex items-center justify-between gap-3">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          background: "linear-gradient(270deg, #fbcfe8, #f9a8d4, #fce7f3, #f472b6, #fbcfe8)",
          backgroundSize: "300% 300%",
          animation: "gradientShift 8s ease infinite",
        }}
      />

      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <Quote size={14} className="relative text-pink-600 flex-shrink-0 drop-shadow-sm" />

      <p
        className="relative text-pink-900 text-sm italic flex-1 text-center font-medium drop-shadow-sm transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        {mounted ? QUOTES[idx] : ""}
      </p>

      <button
        onClick={() => next(true)}
        className="relative text-pink-700 hover:text-pink-900 flex items-center gap-1 text-xs font-semibold whitespace-nowrap transition-colors"
      >
        <RefreshCw size={12} /> Next
      </button>
    </div>
  );
}
