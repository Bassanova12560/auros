"use client";

import Link from "next/link";
import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useProtocolPremiumKey } from "@/app/developers/shield/_components/useProtocolPremiumKey";
import { wizardAssetToProtocolType } from "@/lib/dossier-seal";

/**
 * Dossier → continuous Regulatory Twin monitor (Premium).
 */
export function DossierMonitorCta({
  assetType,
  country,
  score,
  email,
}: {
  assetType?: string | null;
  country?: string | null;
  score?: number | null;
  email?: string | null;
}) {
  const { apiKey, setApiKey } = useProtocolPremiumKey();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monitorId, setMonitorId] = useState<string | null>(null);

  async function createMonitor() {
    const key = apiKey.trim();
    if (!key) {
      setError("Clé Premium requise pour activer le monitor.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const jurisdiction =
        (country && country.trim().length >= 2
          ? country.trim()
          : "EU"
        ).slice(0, 64);
      const res = await fetch("/api/v1/monitor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_type: wizardAssetToProtocolType(assetType),
          jurisdiction,
          structure: "spv",
          alert_on: ["score_change", "regulation_update"],
          baseline_score:
            typeof score === "number" && score >= 0 && score <= 100
              ? Math.round(score)
              : undefined,
          email:
            email && email.includes("@") ? email.trim().toLowerCase() : undefined,
        }),
      });
      const json = (await res.json()) as {
        id?: string;
        error?: { message?: string };
      };
      if (!res.ok || !json.id) {
        setError(
          json.error?.message ??
            (res.status === 403
              ? "Monitor réservé Protocol Premium."
              : `HTTP ${res.status}`)
        );
        return;
      }
      setMonitorId(json.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-sky-500/25 bg-sky-500/[0.05] px-5 py-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-sky-400/80">
        Continuous proof · Monitor
      </p>
      <h2 className="mt-2 font-display text-lg text-white">
        Suivre le risque réglementaire après le dossier
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
        Crée un Twin lite (baseline feed) — alertes score / régulation. La
        banque voit le delta sans rouvrir la data room.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <PrimaryButton type="button" onClick={() => setOpen((v) => !v)}>
          {open ? "Masquer" : "Activer un monitor"}
        </PrimaryButton>
        <Link
          href="/developers/dashboard"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-4 font-mono text-xs uppercase tracking-wider text-white/70 hover:border-white/35"
        >
          Dashboard monitors
        </Link>
      </div>

      {open ? (
        <div className="mt-5 space-y-3">
          <label className="block max-w-md space-y-1.5">
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
          <PrimaryButton
            type="button"
            onClick={() => void createMonitor()}
            disabled={busy}
          >
            {busy ? "Création…" : "Créer le monitor"}
          </PrimaryButton>
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {monitorId ? (
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3">
              <p className="text-sm text-emerald-200/90">
                Monitor actif —{" "}
                <code className="font-mono text-[12px]">{monitorId}</code>
              </p>
              <Link
                href={`/developers/institutions#monitor-delta`}
                className="mt-2 inline-block font-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white/70"
              >
                Voir le delta →
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
