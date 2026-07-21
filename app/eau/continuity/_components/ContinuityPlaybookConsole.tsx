"use client";

import { useMemo, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import type { WelhrResult } from "@/lib/eau/water-legal-risk";
import {
  buildContinuityPlaybook,
  continuityPlaybookMarkdown,
  CONTINUITY_WELCOME_ROUTE,
  type ContinuityCoolingProfile,
  type ContinuityPlaybook,
} from "@/lib/wets/continuity-playbook";

export function ContinuityPlaybookConsole() {
  const [projectLabel, setProjectLabel] = useState("Meridian North DC");
  const [region, setRegion] = useState("Michigan");
  const [mw, setMw] = useState(100);
  const [cooling, setCooling] = useState<ContinuityCoolingProfile>("tower");
  const [text, setText] = useState(
    "AI data center hyperscale, cooling towers, county water contract under review, community hearings."
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [welhr, setWelhr] = useState<WelhrResult | null>(null);
  const [playbook, setPlaybook] = useState<ContinuityPlaybook | null>(null);

  const md = useMemo(
    () => (playbook ? continuityPlaybookMarkdown(playbook) : ""),
    [playbook]
  );

  async function generate() {
    setBusy(true);
    setError(null);
    setPlaybook(null);
    try {
      const res = await fetch("/api/green/eau/legal-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          region: region.trim() || undefined,
          asset_hint: "data_center",
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
      setWelhr(json.welhr);
      const pb = buildContinuityPlaybook({
        project_label: projectLabel.trim() || "Projet",
        region: region.trim() || "—",
        mw_it: mw,
        cooling,
        welhr: json.welhr,
      });
      setPlaybook(pb);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  function downloadMd() {
    if (!md) return;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "auros-continuity-playbook.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Nom projet
          </span>
          <input
            value={projectLabel}
            onChange={(e) => setProjectLabel(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            MW IT
          </span>
          <input
            type="number"
            min={1}
            max={500}
            value={mw}
            onChange={(e) => setMw(Number(e.target.value) || 1)}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Région
        </span>
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Refroidissement actuel
        </span>
        <select
          value={cooling}
          onChange={(e) => setCooling(e.target.value as ContinuityCoolingProfile)}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        >
          <option value="tower">Tour wet</option>
          <option value="hybrid">Hybride</option>
          <option value="closed_loop">Boucle fermée (cible)</option>
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Contexte WELHR
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>

      <PrimaryButton type="button" onClick={() => void generate()} disabled={busy}>
        {busy ? "Génération…" : "Générer le playbook"}
      </PrimaryButton>

      {error ? <p className="text-sm text-red-300/90">{error}</p> : null}

      {welhr ? (
        <p className="font-mono text-[11px] text-white/45">
          WELHR {welhr.grade} · stress {welhr.stress_band} · tier {welhr.risk_tier}
        </p>
      ) : null}

      {playbook ? (
        <section className="space-y-6 border-t border-white/10 pt-8">
          <p className="text-sm leading-relaxed text-white/60">{playbook.executive_summary}</p>
          <ul className="space-y-6">
            {playbook.scenarios.map((s) => (
              <li key={s.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-display text-lg text-white">{s.title}</h3>
                <p className="mt-2 text-xs text-white/45">{s.trigger}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/55">
                  {s.actions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[11px] text-cyan-300/70">
                  CAPEX {s.capex_eur_m[0]}–{s.capex_eur_m[1]} M€ · Δ OPEX{" "}
                  {s.opex_delta_eur_m_year[0]}–{s.opex_delta_eur_m_year[1]} M€/an
                  {s.water_savings_m3_year != null
                    ? ` · ~${s.water_savings_m3_year.toLocaleString("fr-FR")} m³/an eau`
                    : ""}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton type="button" onClick={downloadMd}>
              Télécharger Markdown
            </PrimaryButton>
            <PrimaryButton href={CONTINUITY_WELCOME_ROUTE} variant="ghost">
              Accueil continuité
            </PrimaryButton>
          </div>
          <p className="text-xs text-white/35">{playbook.disclaimer}</p>
        </section>
      ) : null}
    </div>
  );
}
