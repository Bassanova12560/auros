"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import type {
  ContinuityPlanRecord,
  ContinuityReadiness,
  ContinuityScenarioKind,
} from "@/lib/toll/continuity";

const SCENARIOS: Array<{ id: ContinuityScenarioKind; label: string }> = [
  { id: "source_outage", label: "Source outage" },
  { id: "operator_loss", label: "Operator loss" },
  { id: "wallet_compromise", label: "Wallet compromise" },
  { id: "servicer_change", label: "Servicer change" },
  { id: "vendor_death", label: "Vendor death" },
];

const field =
  "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

export default function TollContinuityDeskPage() {
  const [plans, setPlans] = useState<ContinuityPlanRecord[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<ContinuityReadiness | null>(null);

  const [apiKey, setApiKey] = useState("");
  const [assetDnaId, setAssetDnaId] = useState("");
  const [scenario, setScenario] =
    useState<ContinuityScenarioKind>("source_outage");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");

  const refresh = useCallback(async (filterAsset = "") => {
    try {
      const id = filterAsset.trim();
      const q = id
        ? `?assetDnaId=${encodeURIComponent(id)}&limit=40`
        : "?limit=40";
      const res = await fetch(`/api/v1/toll/continuity${q}`);
      const json = (await res.json()) as {
        ok?: boolean;
        plans?: ContinuityPlanRecord[];
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setLoadErr(json.error ?? "load_failed");
        return;
      }
      setPlans(json.plans ?? []);
      setLoadErr(null);
    } catch {
      setLoadErr("network");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onEnroll(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    setReadiness(null);
    try {
      const res = await fetch("/api/v1/toll/continuity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          action: "enroll",
          assetDnaId: assetDnaId.trim(),
          scenario,
          contactEmail: contactEmail.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setStatus("err");
        setMsg(json.error ?? "enroll_failed");
        return;
      }
      setStatus("idle");
      setMsg(json.message ?? "Enrolled");
      await refresh(assetDnaId);
    } catch {
      setStatus("err");
      setMsg("network");
    }
  }

  async function onAssess() {
    setStatus("loading");
    setMsg(null);
    setReadiness(null);
    try {
      const res = await fetch("/api/v1/toll/continuity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          action: "assess",
          assetDnaId: assetDnaId.trim(),
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        readiness?: ContinuityReadiness;
        error?: string;
      };
      if (!res.ok || !json.ok || !json.readiness) {
        setStatus("err");
        setMsg(json.error ?? "assess_failed");
        return;
      }
      setReadiness(json.readiness);
      setStatus("idle");
      setMsg(`Readiness ${json.readiness.readinessScore}/100 (indicatif)`);
    } catch {
      setStatus("err");
      setMsg("network");
    }
  }

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Continuity · recovery v0"
        title="Recovery & Continuity"
        intro="Institutions pay to sleep — playbooks HITL si source meurt, opérateur disparaît, wallet compromis, servicer change, vendor exit. Pas d’exécution custody."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-2 text-sm text-white/65">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            API
          </p>
          <p>
            <code className="text-emerald-200/80">
              GET /api/v1/toll/continuity
            </code>{" "}
            — list + templates
          </p>
          <p>
            <code className="text-emerald-200/80">
              POST /api/v1/toll/continuity
            </code>{" "}
            — enroll ou{" "}
            <code className="text-white/70">{`{ action: "assess" }`}</code>{" "}
            (Bearer + policy credits)
          </p>
          <p className="text-white/45">
            Doc : <code className="text-white/60">docs/TOLL-CONTINUITY.md</code>{" "}
            ·{" "}
            <Link
              href="/green/toll/tower"
              className="underline underline-offset-4"
            >
              Control Tower
            </Link>
          </p>
        </div>
      </GreenPanel>

      <GreenPanel className="mt-6">
        <form className="p-5 md:p-6 space-y-4" onSubmit={onEnroll}>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              API key (Bearer)
            </span>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              className={field}
              placeholder="auros_pk_…"
              autoComplete="off"
            />
          </label>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Asset DNA id
            </span>
            <input
              value={assetDnaId}
              onChange={(e) => setAssetDnaId(e.target.value)}
              required
              className={field}
              placeholder="auros:dna:v1:…"
            />
          </label>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Scenario
            </span>
            <select
              value={scenario}
              onChange={(e) =>
                setScenario(e.target.value as ContinuityScenarioKind)
              }
              className={field}
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Contact (optionnel)
            </span>
            <input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={field}
              placeholder="ops@institution.test"
            />
          </label>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Notes HITL
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={field}
              placeholder="Références runbook / counsel…"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-50"
            >
              Enroll playbook
            </button>
            <button
              type="button"
              onClick={() => void onAssess()}
              disabled={status === "loading" || !apiKey.trim() || !assetDnaId.trim()}
              className="border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/40 disabled:opacity-50"
            >
              Assess readiness
            </button>
          </div>
          {msg ? (
            <p
              className={`text-sm ${status === "err" ? "text-rose-300" : "text-emerald-200/80"}`}
            >
              {msg}
            </p>
          ) : null}
        </form>
      </GreenPanel>

      {readiness ? (
        <GreenPanel className="mt-6">
          <div className="p-5 md:p-6 space-y-3 text-sm text-white/70">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Readiness (indicatif)
            </p>
            <p className="font-display text-2xl text-white">
              {readiness.readinessScore}
              <span className="text-base text-white/45"> / 100</span>
            </p>
            <p>
              Covered:{" "}
              {readiness.covered.length
                ? readiness.covered.join(", ")
                : "none"}
            </p>
            {readiness.gaps.length ? (
              <ul className="list-disc space-y-1 pl-5 text-white/55">
                {readiness.gaps.map((g) => (
                  <li key={g.scenario}>
                    {g.scenario} — {g.reason} (
                    {g.missingChecklist.length} checklist gaps)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/55">No gaps for assessed scenarios.</p>
            )}
            <p className="text-xs text-white/40">{readiness.disclaimer}</p>
          </div>
        </GreenPanel>
      ) : null}

      <GreenPanel className="mt-6">
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Enrollments
            </p>
            <button
              type="button"
              onClick={() => void refresh(assetDnaId)}
              className="font-mono text-[11px] text-emerald-200/70 underline-offset-4 hover:underline"
            >
              Refresh
            </button>
          </div>
          {loadErr ? (
            <p className="mt-3 text-sm text-rose-300">{loadErr}</p>
          ) : plans.length === 0 ? (
            <p className="mt-3 text-sm text-white/45">Aucune inscription.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {plans.map((p) => (
                <li
                  key={p.id}
                  className="border border-white/10 px-3 py-2 text-sm text-white/70"
                >
                  <span className="font-mono text-[11px] text-emerald-200/70">
                    {p.scenario}
                  </span>{" "}
                  · {p.assetDnaId} · checklist {p.checklistDone.length} ·{" "}
                  {p.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </GreenPanel>

      <GreenDisclaimer>
        Playbooks = templates + checklists HITL — pas de recovery custody
        exécuté par AUROS.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
