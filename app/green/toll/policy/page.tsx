"use client";

import { useState, type FormEvent } from "react";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import type { TollPolicyRuleId } from "@/lib/toll/policy";

const RULES: Array<{ id: TollPolicyRuleId; label: string }> = [
  { id: "deny_unknown", label: "Deny unknown / unresolved" },
  { id: "deny_doc_stale_90d", label: "Deny stale docs / trail > 90d" },
  { id: "deny_unmapped_entity", label: "Deny unmapped entity" },
  { id: "require_jurisdiction", label: "Require jurisdiction" },
  { id: "review_demo_tier", label: "Review demo tier" },
  { id: "review_low_trust", label: "Review low trust" },
];

type PilotResult = {
  ok?: boolean;
  decision?: string;
  ruleIds?: string[];
  reasons?: string[];
  trustOverall?: number;
  disclaimer?: string;
  resolved?: boolean;
  error?: string;
};

export default function TollPolicyPilotPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<TollPolicyRuleId[]>(
    RULES.map((r) => r.id)
  );
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [result, setResult] = useState<PilotResult | null>(null);

  function toggle(id: TollPolicyRuleId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/green/toll/policy-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, rules: selected }),
      });
      const json = (await res.json()) as PilotResult;
      if (!res.ok) {
        setStatus("err");
        setResult(json);
        return;
      }
      setResult(json);
      setStatus("idle");
    } catch {
      setStatus("err");
    }
  }

  const field =
    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Policy · pilote banque"
        title="Policy Engine — décision indicative"
        intro="HITL desk : allow / deny / review. AUROS n’auto-bloque aucun marché — l’intégrateur enforce."
        compact
      />

      <GreenPanel className="mt-8">
        <form onSubmit={onSubmit} className="p-5 md:p-6 space-y-4">
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Asset DNA / nom / alias
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              required
              className={field}
              placeholder="auros:dna:v1:ge:…"
            />
          </label>
          <fieldset className="space-y-2">
            <legend className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Règles actives
            </legend>
            {RULES.map((r) => (
              <label
                key={r.id}
                className="flex items-center gap-2 text-sm text-white/70"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={() => toggle(r.id)}
                />
                {r.label}
              </label>
            ))}
          </fieldset>
          <button
            type="submit"
            disabled={status === "loading"}
            className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
          >
            Évaluer
          </button>
        </form>
      </GreenPanel>

      {result ? (
        <GreenPanel className="mt-6">
          <div className="p-5 md:p-6 space-y-2 text-sm text-white/75">
            <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
              Decision: {result.decision ?? result.error ?? "—"}
            </p>
            <p>Trust: {result.trustOverall ?? "—"}/100</p>
            <p>Resolved: {String(result.resolved)}</p>
            {result.reasons?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {result.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : null}
            {result.ruleIds?.length ? (
              <p className="text-white/45 font-mono text-[11px]">
                {result.ruleIds.join(" · ")}
              </p>
            ) : null}
            <p className="text-white/40 text-[12px] pt-2">
              {result.disclaimer ??
                "Indicative only — integrator enforces; no market auto-block."}
            </p>
          </div>
        </GreenPanel>
      ) : null}

      <GreenDisclaimer>
        Pilote banque — pas un conseil réglementé, pas un blocage transactionnel
        AUROS.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
