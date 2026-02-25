"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const FEATURES = [
  "Smart Website Change Detection",
  "AI-Powered Price Monitoring",
  "Real-Time API Doc Tracking",
  "Competitor Analysis Alerts",
  "Visual Point & Click Setup",
];

const CYCLE_INTERVAL_MS = 3000;

export function AnimatedBadge() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FEATURES.length);
        setIsVisible(true);
      }, 300);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative mb-6 inline-flex rounded-full p-px">
      {/* Animated rotating gradient border */}
      <span className="absolute -inset-px overflow-hidden rounded-full">
        <span className="absolute left-1/2 top-1/2 w-[200%] -translate-x-1/2 -translate-y-1/2 aspect-square animate-[border-spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,var(--color-primary)_10%,var(--color-primary)_14%,transparent_24%)]" />
      </span>

      {/* Glow effect */}
      <span className="absolute inset-0 rounded-full bg-primary/20 blur-md transition-all group-hover:bg-primary/30 group-hover:blur-lg" />

      {/* Badge content */}
      <span className="relative inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-foreground">
        <Zap className="h-3.5 w-3.5 shrink-0" />
        <span
          className={`inline-block min-w-[14rem] text-left transition-all duration-300 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          {FEATURES[index]}
        </span>
      </span>
    </div>
  );
}
