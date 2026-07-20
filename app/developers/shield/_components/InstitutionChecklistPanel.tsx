"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { useProtocolPremiumKey } from "./useProtocolPremiumKey";

type ChecklistItem = {
  id: string;
  category: string;
  title: string;
  required: boolean;
  estimated_time_days: number;
};

/**
 * Institutional MiCA-oriented checklist — POST /api/v1/checklist.
 */
export function InstitutionChecklistPanel({
  className = "",
}: {
  className?: string;
}) {
  const { apiKey, setApiKey } = useProtocolPremiumKey();
  const [assetType, setAssetType] = useState<
    "real_estate" | "private_fund" | "bonds" | "private_credit" | "low_carbon_power"
  >("real_estate");
  const [jurisdiction, setJurisdiction] = useState("LU");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  async function run() {
    const key = apiKey.trim();
    if (!key) {
      setError("Collez une clé Protocol (Bearer).");
      return;
    }
    setBusy(true);
    setError(null);
    setItems([]);
    setSummary(null);
    try {
      const res = await fetch("/api/v1/checklist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_type: assetType,
          jurisdiction: jurisdiction.trim(),
          structure: "spv",
        }),
      });
      const json = (await res.json()) as {
        items?: ChecklistItem[];
        total_items?: number;
        estimated_total_days?: number;
        estimated_total_cost_eur?: number;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `HTTP ${res.status}`);
        return;
      }
      const list = json.items ?? [];
      setItems(list.slice(0, 8));
      setSummary(
        `${json.total_items ?? list.length} items · ~${json.estimated_total_days ?? "—"} j · ~${json.estimated_total_cost_eur ?? "—"} € (indicatif)`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6 ${className}`}
    >
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Checklist institutionnelle
        </p>
        <p className="text-sm leading-relaxed text-white/55">
          Items MiCA / structure / custody — estimatif jours & coûts. Pas un
          conseil juridique.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Clé API
        </span>
        <input
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="auros_…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Actif
          </span>
          <select
            value={assetType}
            onChange={(e) =>
              setAssetType(e.target.value as typeof assetType)
            }
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
          >
            <option value="real_estate">real_estate</option>
            <option value="bonds">bonds</option>
            <option value="private_credit">private_credit</option>
            <option value="private_fund">private_fund</option>
            <option value="low_carbon_power">low_carbon_power</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Juridiction
          </span>
          <input
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
          />
        </label>
      </div>

      <PrimaryButton type="button" disabled={busy} onClick={() => void run()}>
        {busy ? "…" : "Générer la checklist"}
      </PrimaryButton>

      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      {summary ? (
        <p className="text-sm text-white/60">{summary}</p>
      ) : null}
      {items.length > 0 ? (
        <ul className="space-y-2 border-t border-white/[0.06] pt-3">
          {items.map((item) => (
            <li key={item.id} className="text-sm text-white/65">
              <span className="font-mono text-[10px] text-white/35">
                {item.required ? "REQ" : "OPT"}
              </span>{" "}
              {item.title}
              <span className="block text-[11px] text-white/35">
                {item.category} · ~{item.estimated_time_days} j
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
