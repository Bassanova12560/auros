"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useProtocolPremiumKey } from "@/app/developers/shield/_components/useProtocolPremiumKey";
import type { RegulatoryDeltaItem } from "@/lib/protocol/monitor/delta";

type DeltaPayload = {
  monitor_id?: string;
  item_count: number;
  impact_sum: number;
  rules_version?: string;
  rules_version_changed?: boolean;
  items: RegulatoryDeltaItem[];
  error?: { message?: string };
};

/**
 * Live Regulatory Twin delta — full feed items, not just counts.
 */
export function MonitorDeltaPanel({
  className = "",
  initialMonitorId = "",
}: {
  className?: string;
  initialMonitorId?: string;
}) {
  const { apiKey, setApiKey } = useProtocolPremiumKey();
  const [monitorId, setMonitorId] = useState(initialMonitorId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delta, setDelta] = useState<DeltaPayload | null>(null);

  async function loadDelta() {
    const key = apiKey.trim();
    const id = monitorId.trim();
    if (!key) {
      setError("Clé Premium requise.");
      return;
    }
    if (!id) {
      setError("Collez un monitor_id (mon_…).");
      return;
    }
    setBusy(true);
    setError(null);
    setDelta(null);
    try {
      const res = await fetch(`/api/v1/monitor/${encodeURIComponent(id)}/delta`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      const json = (await res.json()) as DeltaPayload;
      if (!res.ok) {
        setError(json.error?.message ?? `HTTP ${res.status}`);
        return;
      }
      setDelta({
        monitor_id: json.monitor_id ?? id,
        item_count: json.item_count ?? 0,
        impact_sum: json.impact_sum ?? 0,
        rules_version: json.rules_version,
        rules_version_changed: json.rules_version_changed,
        items: Array.isArray(json.items) ? json.items : [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className={`rounded-xl border border-white/10 bg-white/[0.02] px-5 py-5 ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        Continuous proof · Monitor delta
      </p>
      <h2 className="mt-2 font-display text-lg text-white">
        Delta réglementaire (Twin lite)
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
        Items hors baseline de création — impact score indicatif. Premium.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Clé Premium
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
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            monitor_id
          </span>
          <input
            type="text"
            value={monitorId}
            onChange={(e) => setMonitorId(e.target.value)}
            placeholder="mon_…"
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25"
          />
        </label>
      </div>

      <div className="mt-4">
        <PrimaryButton type="button" onClick={() => void loadDelta()} disabled={busy}>
          {busy ? "Chargement…" : "Charger le delta"}
        </PrimaryButton>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {delta ? <MonitorDeltaList delta={delta} /> : null}
    </section>
  );
}

export function MonitorDeltaList({
  delta,
  compact = false,
}: {
  delta: {
    item_count: number;
    impact_sum: number;
    rules_version?: string;
    rules_version_changed?: boolean;
    items: RegulatoryDeltaItem[];
  };
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-3" : "mt-5 space-y-3"}>
      {!compact ? (
        <p className="font-mono text-[11px] text-amber-400/90">
          {delta.item_count} item{delta.item_count === 1 ? "" : "s"} · impact{" "}
          {delta.impact_sum >= 0 ? "+" : ""}
          {delta.impact_sum}
          {delta.rules_version_changed ? " · ruleset changed" : ""}
          {delta.rules_version ? ` · rules ${delta.rules_version}` : ""}
        </p>
      ) : null}
      {delta.items.length === 0 ? (
        <p className="text-sm text-white/45">
          Aucun nouvel item hors baseline — twin à jour.
        </p>
      ) : (
        <ul className="space-y-3">
          {delta.items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-white/8 px-3 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={
                    item.severity === "high"
                      ? "font-mono text-[10px] uppercase text-red-400/90"
                      : item.severity === "medium"
                        ? "font-mono text-[10px] uppercase text-amber-400/90"
                        : "font-mono text-[10px] uppercase text-white/40"
                  }
                >
                  {item.severity} · {item.event_type}
                </span>
                <span className="font-mono text-[10px] text-white/35">
                  impact {item.impact_on_score >= 0 ? "+" : ""}
                  {item.impact_on_score}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/80">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                {item.summary}
              </p>
              <p className="mt-2 font-mono text-[10px] text-white/30">
                {item.source} · {item.published_at.slice(0, 10)}
                {item.url ? (
                  <>
                    {" · "}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 underline-offset-2 hover:underline"
                    >
                      source
                    </a>
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
