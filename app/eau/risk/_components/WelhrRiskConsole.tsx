"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import type { WelhrResult } from "@/lib/eau/water-legal-risk";

const PRIORITY_LABELS: Record<string, string> = {
  map_water_rights: "Cartographier les droits d’eau / titre",
  check_local_moratorium: "Vérifier moratorium / rezoning local",
  litigation_screen: "Screen litiges (Clean Water Act, etc.)",
  community_engagement: "Engagement communauté / social license",
  cooling_water_contract: "Contrats d’eau de refroidissement",
  stress_zone_disclosure: "Disclosure stress hydrique de zone",
};

export function WelhrRiskConsole() {
  const [text, setText] = useState(
    "Data center AI hyperscale, Michigan, cooling towers, county water contract under review, community hearings 2026."
  );
  const [region, setRegion] = useState("Michigan");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WelhrResult | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/green/eau/legal-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          region: region.trim() || undefined,
          asset_hint: /data\s*center|datacenter|cooling|ai/i.test(text)
            ? "data_center"
            : "other",
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        welhr?: WelhrResult;
        error?: { message?: string };
      };
      if (!res.ok || !json.welhr) {
        setError(json.error?.message ?? `HTTP ${res.status}`);
        return;
      }
      setResult(json.welhr);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Région / juridiction
        </span>
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Michigan, Arizona, Andalousie…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/25"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Actif · contexte
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/25"
        />
      </label>
      <PrimaryButton type="button" disabled={busy} onClick={() => void run()}>
        {busy ? "Analyse…" : "Scorer le risque hydrique & legal"}
      </PrimaryButton>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-4 rounded-xl border border-sky-500/25 bg-sky-500/[0.05] px-5 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-sky-400/80">
                WELHR · {result.risk_tier}
              </p>
              <p className="mt-1 font-display text-3xl text-white">
                {result.score}{" "}
                <span className="text-lg text-white/50">{result.grade}</span>
              </p>
            </div>
            <p className="font-mono text-[11px] text-white/45">
              stress {result.stress_band}
              {result.region_matched ? ` · ${result.region_matched}` : ""}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["Hydric stress", result.breakdown.hydric_stress],
                ["Legal / litige", result.breakdown.legal_litigation],
                ["Social license", result.breakdown.social_license],
                ["Droits d’eau", result.breakdown.water_rights_clarity],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="border-t border-white/10 pt-2">
                <dt className="font-mono text-[10px] uppercase text-white/35">
                  {label}
                </dt>
                <dd className="mt-1 font-mono text-lg text-white/80">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Priorités (max 3)
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-white/65">
              {result.priorities.map((p) => (
                <li key={p}>· {PRIORITY_LABELS[p] ?? p}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-white/35">{result.disclaimer}</p>
        </div>
      ) : null}
    </div>
  );
}
