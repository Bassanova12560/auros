"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { id: "meter", label: "Meter signs", detail: "IoT ECDSA · 250 Wh" },
  { id: "mint", label: "Oracle mints", detail: "akWh → producer" },
  { id: "book", label: "Agent orders", detail: "Forward 2.4 MWh" },
  { id: "fill", label: "Market fills", detail: "HITL · demo settle" },
] as const;

/**
 * Motion proof of the mint → order loop — no fake video asset required.
 */
export function MintTradeDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="overflow-hidden border border-white/[0.08] bg-black/40"
      aria-label="Animated lab demo: meter to trade"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Animation · lab · not a live fill
        </p>
        <p className="font-mono text-[10px] tabular-nums text-white/30">
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </p>
      </div>
      <div className="grid gap-0 sm:grid-cols-4">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div
              key={s.id}
              className={`relative border-t border-white/[0.06] px-4 py-5 sm:border-t-0 sm:border-l sm:first:border-l-0 ${
                active ? "bg-white/[0.06]" : "bg-transparent"
              }`}
            >
              <div
                className={`mb-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]`}
                aria-hidden
              >
                <div
                  className={`h-full bg-white/70 transition-all duration-700 ${
                    active ? "w-full" : done ? "w-full opacity-40" : "w-0"
                  }`}
                />
              </div>
              <p
                className={`font-display text-sm ${
                  active ? "text-white" : "text-white/45"
                }`}
              >
                {s.label}
              </p>
              <p className="mt-1 font-mono text-[10px] text-white/35">{s.detail}</p>
            </div>
          );
        })}
      </div>
      <p className="border-t border-white/[0.06] px-4 py-3 font-mono text-[10px] leading-relaxed text-white/35">
        Sequence repeats: attested production → mint → order → labeled demo fill. Run the real
        loop on /lab → /producer → /trade.
      </p>
    </div>
  );
}
