"use client";

import { useEffect, useState } from "react";

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
  searchParams: Promise<{ id?: string }>;
}) {
  const [id, setId] = useState("toucan");
  const [data, setData] = useState<ScorePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void searchParams.then((sp) => {
      if (sp.id) setId(sp.id);
    });
  }, [searchParams]);

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

  if (loading) {
    return (
      <div className="min-h-[120px] animate-pulse rounded-xl bg-emerald-950/40 p-4 font-sans text-sm text-emerald-200/60">
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
    <div className="rounded-xl border border-emerald-500/30 bg-[#0a0f0d] p-4 font-sans text-white shadow-lg">
      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-500/80">
        AUROS Green Score
      </p>
      <p className="mt-1 text-sm font-medium text-white/90">{s.name}</p>
      <div className="mt-3 flex flex-wrap gap-4">
        <div>
          <p className="text-[10px] uppercase text-white/40">Composite</p>
          <p className="font-mono text-2xl text-emerald-400">{s.composite_score}</p>
        </div>
        {s.carbon_quality ? (
          <div>
            <p className="text-[10px] uppercase text-white/40">CQS</p>
            <p className="font-mono text-2xl text-emerald-400">{s.carbon_quality.score}</p>
          </div>
        ) : null}
        {s.watt ? (
          <div>
            <p className="text-[10px] uppercase text-white/40">Watt</p>
            <p className="font-mono text-2xl text-emerald-400">{s.watt.rating}</p>
          </div>
        ) : null}
        {s.nature_score ? (
          <div>
            <p className="text-[10px] uppercase text-white/40">Nature</p>
            <p className="font-mono text-2xl text-emerald-400">{s.nature_score.score}</p>
          </div>
        ) : null}
      </div>
      {s.benchmark ? (
        <p className="mt-2 text-[10px] text-white/45">{s.benchmark.label}</p>
      ) : null}
      <a
        href={`https://getauros.com/green/api?utm_source=embed&id=${s.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-[10px] text-emerald-500/70 hover:text-emerald-400"
      >
        Powered by AUROS →
      </a>
    </div>
  );
}
