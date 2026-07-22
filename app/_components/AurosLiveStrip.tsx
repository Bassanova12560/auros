"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LiveSnapshot = {
  volumeUsd: number;
  spreadBps: number;
  resourceUnitsMinted: number;
  updatedAt: number;
};

function seedSnapshot(): LiveSnapshot {
  // Deterministic-ish lab figures so SSR/CSR don't flash wildly; drift client-side.
  return {
    volumeUsd: 1_284_500,
    spreadBps: 12,
    resourceUnitsMinted: 48_320,
    updatedAt: Date.now(),
  };
}

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

/**
 * Minimal cockpit strip — lab / illustrative metrics, never claimed as audited volume.
 */
export function AurosLiveStrip() {
  const [snap, setSnap] = useState<LiveSnapshot>(seedSnapshot);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSnap((prev) => {
        const jitter = (base: number, pct: number) =>
          Math.max(0, base * (1 + (Math.random() - 0.5) * pct));
        return {
          volumeUsd: jitter(prev.volumeUsd, 0.004),
          spreadBps: Math.max(6, Math.round(jitter(prev.spreadBps, 0.08))),
          resourceUnitsMinted: prev.resourceUnitsMinted + Math.floor(Math.random() * 3),
          updatedAt: Date.now(),
        };
      });
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const cells = [
    { label: "24h vol (lab)", value: formatUsd(snap.volumeUsd) },
    { label: "Median spread", value: `${snap.spreadBps} bps` },
    { label: "Resource units minted", value: snap.resourceUnitsMinted.toLocaleString("en-US") },
  ] as const;

  return (
    <section
      className="border-y border-white/[0.06] bg-black/20 px-4 py-6 md:px-6"
      aria-label="Auros Live lab metrics"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Auros Live · lab
            </p>
            <p className="mt-1 font-display text-sm text-white/70">
              Illustrative cockpit — not third-party audited volume.
            </p>
          </div>
          <Link
            href="/builders"
            className="font-mono text-[10px] uppercase tracking-wider text-white/45 underline-offset-4 hover:text-white hover:underline"
          >
            Builders / protocol →
          </Link>
        </div>
        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {cells.map((c) => (
            <div key={c.label} className="border-t border-white/[0.08] pt-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                {c.label}
              </dt>
              <dd className="mt-1 font-display text-2xl tabular-nums tracking-tight text-white">
                {c.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
