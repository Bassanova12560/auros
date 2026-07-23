"use client";

import { useEffect, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getMintTradeDemoMessages } from "@/lib/i18n/pages/mint-trade-demo";

/**
 * Motion proof of the mint → order loop — no fake video asset required.
 */
export function MintTradeDemo() {
  const { locale } = useLocale();
  const m = getMintTradeDemoMessages(locale);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % m.steps.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [m.steps.length]);

  return (
    <div
      className="overflow-hidden border border-white/[0.08] bg-black/40"
      aria-label={m.ariaLabel}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {m.header}
        </p>
        <p className="font-mono text-[10px] tabular-nums text-white/30">
          {String(step + 1).padStart(2, "0")} / {String(m.steps.length).padStart(2, "0")}
        </p>
      </div>
      <div className="grid gap-0 sm:grid-cols-4">
        {m.steps.map((s, i) => {
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
        {m.footer}
      </p>
    </div>
  );
}
