"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

const SAMPLE = `{
  "window": {
    "external_window_id": "win_demo_001",
    "started_at": "2026-07-19T18:00:00Z",
    "ended_at": "2026-07-19T20:00:00Z",
    "capacity_kw": 250,
    "direction": "down",
    "location": { "country": "FR", "site_id": "depot_01" },
    "operator_id": "fleet_demo",
    "source_format": "json_custom"
  },
  "attributes": {
    "program_hint": "afrr"
  }
}`;

type DemoResult = {
  id?: string;
  verify_url?: string;
  content_hash?: string;
  public?: {
    watt_rating?: number | null;
    capacity_kw?: number;
    program_hint?: string | null;
  };
  error?: string;
};

export function ChargeflowFPitchView() {
  const [json, setJson] = useState(SAMPLE);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [pending, startTransition] = useTransition();

  function runDemo() {
    startTransition(async () => {
      setResult(null);
      try {
        const body = JSON.parse(json) as unknown;
        const res = await fetch("/api/v1/chargeflow/f/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as {
          id?: string;
          verify_url?: string;
          content_hash?: string;
          public?: DemoResult["public"];
          error?: { message?: string } | string;
          message?: string;
        };
        if (!res.ok) {
          const err = data.error;
          setResult({
            error:
              typeof err === "object" && err?.message
                ? err.message
                : typeof err === "string"
                  ? err
                  : data.message ?? `HTTP ${res.status}`,
          });
          return;
        }
        setResult({
          id: data.id,
          verify_url: data.verify_url,
          content_hash: data.content_hash,
          public: data.public,
        });
      } catch (err) {
        setResult({
          error: err instanceof Error ? err.message : "Invalid JSON",
        });
      }
    });
  }

  return (
    <div className="space-y-14">
      <header className="space-y-4 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          ChargeFlow · CFU-F
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
          Fenêtre de flexibilité → unité vérifiable
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
          CFU-F enregistre une capacité kW sur une fenêtre temporelle (aFRR /
          demand response) — hash + HMAC, même unicité et retirement que CFU-E /
          CFU-W.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-white">Demo JSON</h2>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={14}
          spellCheck={false}
          className="w-full resize-y border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/80 outline-none focus:border-emerald-500/40"
          aria-label="JSON fenêtre CFU-F"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runDemo}
            disabled={pending}
            className="border border-emerald-500/50 bg-emerald-500/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-emerald-300 disabled:opacity-50"
          >
            {pending ? "…" : "Enregistrer CFU-F (demo)"}
          </button>
          <PrimaryButton href="/developers/docs/endpoint-chargeflow-f">
            Docs API
          </PrimaryButton>
        </div>
        {result?.error ? (
          <p className="text-sm text-red-300/90">{result.error}</p>
        ) : null}
        {result?.id ? (
          <div className="space-y-2 border border-white/10 p-4 text-sm text-white/70">
            <Link
              href={result.verify_url ?? `/chargeflow/${result.id}`}
              className="font-mono text-emerald-400 hover:underline"
            >
              {result.id}
            </Link>
            {result.public?.capacity_kw != null ? (
              <p>
                {result.public.capacity_kw} kW · Watt{" "}
                {result.public.watt_rating ?? "—"}
                {result.public.program_hint
                  ? ` · ${result.public.program_hint}`
                  : ""}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
