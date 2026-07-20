"use client";

import { use, useEffect, useState } from "react";

type ScorePayload = {
  ok: boolean;
  score?: {
    id: string;
    name: string;
    composite_score: number;
    benchmark?: { percentile: number; label: string };
    carbon_quality: { score: number; tier: string } | null;
    watt: { rating: number; lifetime_gwh: number | null } | null;
    nature_score?: { score: number; tier: string } | null;
    icvcm_readiness?: { status: string; headline: string } | null;
  };
  error?: { message: string };
};

export default function EmbedGreenScorePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; theme?: string }>;
}) {
  const sp = use(searchParams);
  const id = (sp.id?.trim() || "toucan").toLowerCase();
  const theme = sp.theme === "light" ? "light" : "dark";
  const [data, setData] = useState<ScorePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/green/score/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((json: ScorePayload) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const dark = theme === "dark";
  const shell = dark
    ? "rounded-xl border border-emerald-500/30 bg-[#0a0f0d] p-4 font-sans text-white shadow-lg"
    : "rounded-xl border border-emerald-600/30 bg-[#f8faf9] p-4 font-sans text-slate-900 shadow-md";
  const muted = dark ? "text-white/40" : "text-slate-500";
  const accent = dark ? "text-emerald-400" : "text-emerald-600";
  const eyebrow = dark ? "text-emerald-500/80" : "text-emerald-700";

  if (loading) {
    return (
      <div
        className={`min-h-[120px] animate-pulse ${shell} text-sm ${dark ? "text-emerald-200/60" : "text-emerald-800/50"}`}
      >
        AUROS Green…
      </div>
    );
  }

  if (!data?.ok || !data.score) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-black p-4 font-sans text-sm text-red-300">
        {data?.error?.message ?? "Score unavailable"}
      </div>
    );
  }

  const s = data.score;

  return (
    <div className={shell}>
      <p
        className={`font-mono text-[10px] uppercase tracking-widest ${eyebrow}`}
      >
        AUROS Green Score
      </p>
      <p className={`mt-1 text-sm font-medium ${dark ? "text-white/90" : "text-slate-900"}`}>
        {s.name}
      </p>
      <div className="mt-3 flex flex-wrap gap-4">
        <div>
          <p className={`text-[10px] uppercase ${muted}`}>Composite</p>
          <p className={`font-mono text-2xl ${accent}`}>{s.composite_score}</p>
        </div>
        {s.carbon_quality ? (
          <div>
            <p className={`text-[10px] uppercase ${muted}`}>CQS</p>
            <p className={`font-mono text-2xl ${accent}`}>
              {s.carbon_quality.score}
            </p>
          </div>
        ) : null}
        {s.watt ? (
          <div>
            <p className={`text-[10px] uppercase ${muted}`}>Watt</p>
            <p className={`font-mono text-2xl ${accent}`}>{s.watt.rating}</p>
          </div>
        ) : null}
        {s.nature_score ? (
          <div>
            <p className={`text-[10px] uppercase ${muted}`}>Nature</p>
            <p className={`font-mono text-2xl ${accent}`}>
              {s.nature_score.score}
            </p>
          </div>
        ) : null}
      </div>
      {s.benchmark ? (
        <p className={`mt-2 text-[10px] ${muted}`}>{s.benchmark.label}</p>
      ) : null}
      <a
        href={`/green/compare?rwa=${encodeURIComponent(s.id)}&utm_source=embed`}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-3 inline-block font-mono text-[10px] ${accent} underline-offset-2 hover:underline`}
      >
        Compare →
      </a>
    </div>
  );
}
