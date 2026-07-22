"use client";

import { useState, type FormEvent } from "react";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import type {
  TollEligibilityOperation,
  TollEligibilityRuleId,
} from "@/lib/toll/eligibility";

const OPS: Array<{ id: TollEligibilityOperation; label: string }> = [
  { id: "mint", label: "Mint" },
  { id: "buy", label: "Buy" },
  { id: "transfer", label: "Transfer" },
  { id: "redeem", label: "Redeem" },
  { id: "list", label: "List" },
];

const RULES: Array<{ id: TollEligibilityRuleId; label: string }> = [
  { id: "deny_unknown", label: "Deny unknown / unresolved" },
  { id: "deny_doc_stale_90d", label: "Deny stale docs / trail > 90d" },
  { id: "deny_unmapped_entity", label: "Deny unmapped entity" },
  { id: "require_jurisdiction", label: "Require jurisdiction" },
  { id: "review_demo_tier", label: "Review demo tier" },
  { id: "review_low_trust", label: "Review low trust" },
  { id: "deny_us_restricted", label: "Deny US on restricted / demo" },
  { id: "require_wallet_attribution", label: "Require wallet (transfer)" },
  { id: "review_pep", label: "Escalate PEP" },
  { id: "restrict_unaccredited", label: "Restrict unaccredited" },
];

type PilotResult = {
  ok?: boolean;
  decision?: string;
  ruleIds?: string[];
  reasons?: string[];
  restrictions?: string[];
  trustOverall?: number;
  disclaimer?: string;
  resolved?: boolean;
  operation?: string;
  error?: string;
};

export default function TollEligibilityPilotPage() {
  const [q, setQ] = useState("");
  const [operation, setOperation] = useState<TollEligibilityOperation>("buy");
  const [jurisdiction, setJurisdiction] = useState("");
  const [wallet, setWallet] = useState("");
  const [pep, setPep] = useState(false);
  const [accredited, setAccredited] = useState<"" | "yes" | "no">("");
  const [selected, setSelected] = useState<TollEligibilityRuleId[]>(
    RULES.map((r) => r.id)
  );
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [result, setResult] = useState<PilotResult | null>(null);

  function toggle(id: TollEligibilityRuleId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/green/toll/eligibility-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q,
          operation,
          rules: selected,
          investor: {
            jurisdiction: jurisdiction || undefined,
            wallet: wallet || undefined,
            pep: pep || undefined,
            accredited:
              accredited === "yes"
                ? true
                : accredited === "no"
                  ? false
                  : undefined,
          },
        }),
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
        eyebrow="Eligibility · pilote plateforme"
        title="Eligibility Router — décision indicative"
        intro="Gate avant mint / buy / transfer / redeem / list. HITL : allow · deny · review · allow_with_restrictions. AUROS n’auto-bloque aucun marché."
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

          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Opération
            </span>
            <select
              value={operation}
              onChange={(e) =>
                setOperation(e.target.value as TollEligibilityOperation)
              }
              className={field}
            >
              {OPS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Investisseur · juridiction
              </span>
              <input
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className={field}
                placeholder="FR · US · …"
              />
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Wallet (transfer)
              </span>
              <input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className={field}
                placeholder="0x… / adresse"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={pep}
                onChange={(e) => setPep(e.target.checked)}
              />
              PEP
            </label>
            <label className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Accrédité
              </span>
              <select
                value={accredited}
                onChange={(e) =>
                  setAccredited(e.target.value as "" | "yes" | "no")
                }
                className="border border-white/15 bg-black/50 px-2 py-1 text-sm text-white"
              >
                <option value="">—</option>
                <option value="yes">oui</option>
                <option value="no">non</option>
              </select>
            </label>
          </div>

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
            Router
          </button>
        </form>
      </GreenPanel>

      {result ? (
        <GreenPanel className="mt-6">
          <div className="p-5 md:p-6 space-y-2 text-sm text-white/75">
            <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
              Decision: {result.decision ?? result.error ?? "—"}
            </p>
            <p>
              Op: {result.operation ?? "—"} · Trust:{" "}
              {result.trustOverall ?? "—"}/100 · Resolved:{" "}
              {String(result.resolved)}
            </p>
            {result.restrictions?.length ? (
              <p className="text-amber-200/70">
                Restrictions: {result.restrictions.join(" · ")}
              </p>
            ) : null}
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
                "Indicative only — HITL / integrator enforces; no market auto-block."}
            </p>
          </div>
        </GreenPanel>
      ) : null}

      <GreenDisclaimer>
        Pilote plateforme / banque — pas une certification, pas un brokerage,
        pas un blocage transactionnel AUROS. Revue humaine (HITL) requise.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
