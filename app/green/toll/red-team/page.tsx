"use client";

import { useState, type FormEvent } from "react";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";

type Finding = {
  id?: string;
  severity?: string;
  category?: string;
  title?: string;
  detail?: string;
};

type PilotResult = {
  ok?: boolean;
  findings?: Finding[];
  score?: number;
  summary?: string;
  disclaimer?: string;
  resolved?: boolean;
  assetDnaId?: string;
  error?: string;
};

export default function TollRedTeamPilotPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [result, setResult] = useState<PilotResult | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/green/toll/red-team-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
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
        eyebrow="Red-Team · pilote plateforme"
        title="Red-Team Asset Layer — revue adversariale"
        intro="Gaps documentaires, conflits de droits, dépendances ops, mapping faible — findings indicatifs pour HITL. Pas un pen-test, pas Verified."
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

          <button
            type="submit"
            disabled={status === "loading"}
            className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
          >
            Lancer red-team
          </button>
        </form>
      </GreenPanel>

      {result ? (
        <GreenPanel className="mt-6">
          <div className="p-5 md:p-6 space-y-3 text-sm text-white/75">
            <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
              Score: {result.score ?? "—"}/100 · Resolved:{" "}
              {String(result.resolved)}
            </p>
            <p>{result.summary ?? result.error ?? "—"}</p>
            {result.assetDnaId ? (
              <p className="font-mono text-[11px] text-white/45">
                {result.assetDnaId}
              </p>
            ) : null}
            {result.findings?.length ? (
              <ul className="space-y-3 pt-2">
                {result.findings.map((f) => (
                  <li
                    key={f.id ?? f.title}
                    className="border-t border-white/10 pt-3"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-wider text-amber-200/70">
                      {f.severity} · {f.category}
                    </p>
                    <p className="text-white/90">{f.title}</p>
                    <p className="text-white/55 text-[13px] mt-0.5">
                      {f.detail}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="text-white/40 text-[12px] pt-2">
              {result.disclaimer ??
                "Indicative only — not a pen-test; HITL required."}
            </p>
          </div>
        </GreenPanel>
      ) : null}

      <GreenDisclaimer>
        Findings indicatifs — pas un test d’intrusion, pas une certification
        sécurité, pas Verified. Revue humaine (HITL) obligatoire.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
