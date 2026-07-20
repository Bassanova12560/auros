"use client";

import { useCallback, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { useProtocolPremiumKey } from "./useProtocolPremiumKey";

type AuditEvent = {
  id: string;
  action: string;
  pack_id?: string;
  content_hash?: string;
  created_at: string;
  meta?: { generation_sources?: string[]; cfu_total?: number };
};

/**
 * Continuous proof v0 — pack editions from Premium Shield audit.
 */
export function ShieldAuditTrailPanel({ className = "" }: { className?: string }) {
  const { apiKey, setApiKey } = useProtocolPremiumKey();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [sla, setSla] = useState<string | null>(null);

  const load = useCallback(async () => {
    const key = apiKey.trim();
    if (!key) {
      setError("Collez une clé Protocol Premium.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/shield/audit?limit=30", {
        headers: { Authorization: `Bearer ${key}` },
      });
      const json = (await res.json()) as {
        events?: AuditEvent[];
        sla?: {
          verify_availability_target?: string;
          verify_latency_p99_ms_target?: number;
          note?: string;
        };
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(
          json.error?.message ??
            (res.status === 403
              ? "Audit trail réservé Premium."
              : `HTTP ${res.status}`)
        );
        return;
      }
      const packs = (json.events ?? []).filter(
        (e) => e.action === "pack" || e.action === "reseal"
      );
      setEvents(packs);
      if (json.sla) {
        setSla(
          `${json.sla.verify_availability_target ?? "—"} · p99 ${json.sla.verify_latency_p99_ms_target ?? "—"} ms · ${json.sla.note ?? ""}`
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }, [apiKey]);

  const packRows = events.filter((e) => e.action === "pack");
  const prevHash = packRows[1]?.content_hash;
  const latestHash = packRows[0]?.content_hash;
  const hashChanged =
    Boolean(latestHash && prevHash) && latestHash !== prevHash;

  return (
    <div
      className={`space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6 ${className}`}
    >
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Continuous proof · éditions
        </p>
        <p className="text-sm leading-relaxed text-white/55">
          Historique hash-only des Evidence Packs / reseals. Diff{" "}
          <code className="text-white/70">pack_hash</code> entre éditions —
          monitoring continu pour risk/ESG.
        </p>
      </div>

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

      <PrimaryButton type="button" disabled={busy} onClick={() => void load()}>
        {busy ? "Chargement…" : "Charger le trail"}
      </PrimaryButton>

      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}

      {sla ? (
        <p className="text-[11px] leading-relaxed text-white/40">{sla}</p>
      ) : null}

      {packRows.length >= 2 ? (
        <p
          className={`text-sm ${
            hashChanged ? "text-amber-200/85" : "text-emerald-400/85"
          }`}
        >
          {hashChanged
            ? "pack_hash a changé vs édition précédente — revue risk recommandée."
            : "pack_hash inchangé vs édition précédente."}
        </p>
      ) : null}

      {events.length > 0 ? (
        <ul className="max-h-64 space-y-2 overflow-y-auto border-t border-white/[0.06] pt-3">
          {events.map((e) => (
            <li
              key={e.id}
              className="font-mono text-[10px] leading-relaxed text-white/50"
            >
              <span className="text-white/35">
                {e.created_at.slice(0, 19).replace("T", " ")}
              </span>{" "}
              · {e.action}
              {e.pack_id ? ` · ${e.pack_id}` : ""}
              {e.content_hash ? (
                <span className="block break-all text-white/30">
                  {e.content_hash}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
