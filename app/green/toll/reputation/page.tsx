"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";

type ApiResult = {
  ok?: boolean;
  assetDnaId?: string;
  reputation?: {
    overall?: number;
    band?: string;
    dimensions?: Record<string, number>;
    drivers?: string[];
    disclaimer?: string;
  };
  signals?: Record<string, unknown>;
  error?: string;
  message?: string;
  disclaimer?: string;
  meter?: { remaining?: number; cost?: number };
};

export default function TollReputationPage() {
  const [apiKey, setApiKey] = useState("");
  const [assetDnaId, setAssetDnaId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [result, setResult] = useState<ApiResult | null>(null);

  const field =
    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

  async function callApi(method: "GET" | "POST", e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${apiKey.trim()}`,
      };
      let url = `/api/v1/toll/reputation?assetDnaId=${encodeURIComponent(assetDnaId.trim())}`;
      let body: string | undefined;
      if (method === "POST") {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({ assetDnaId: assetDnaId.trim() });
        url = "/api/v1/toll/reputation";
      }
      const res = await fetch(url, { method, headers, body });
      const json = (await res.json()) as ApiResult;
      if (!res.ok) {
        setStatus("err");
        setResult(json);
        return;
      }
      setResult(json);
      setStatus("idle");
    } catch {
      setStatus("err");
      setResult({ error: "network_error" });
    }
  }

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Reputation · operational v0"
        title="Reality Reputation"
        intro="Fiabilité data, preuves, incidents, hygiene docs, stabilité des corrections — score indicatif. Pas un credit rating. Les issuers paient pour améliorer leur signal AUROS."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-2 text-sm text-white/65">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            API
          </p>
          <p>
            <code className="text-emerald-200/80">
              GET /api/v1/toll/reputation?assetDnaId=
            </code>{" "}
            — policy credits
          </p>
          <p>
            <code className="text-emerald-200/80">
              POST /api/v1/toll/reputation
            </code>{" "}
            — research credits · Bearer requis
          </p>
          <p className="text-white/45">
            Doc : <code className="text-white/60">docs/TOLL-REPUTATION.md</code>{" "}
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
        <form className="p-5 md:p-6 space-y-4">
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
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              onClick={(e) => void callApi("GET", e)}
              className="border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-white/80 disabled:opacity-50"
            >
              GET reputation
            </button>
            <button
              type="button"
              disabled={status === "loading"}
              onClick={(e) => void callApi("POST", e)}
              className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
            >
              POST (research)
            </button>
          </div>
        </form>
      </GreenPanel>

      {result?.reputation && (
        <GreenPanel className="mt-6">
          <div className="p-5 md:p-6 space-y-3 text-sm text-white/70">
            <p className="font-display text-2xl text-white">
              {result.reputation.overall}
              <span className="ml-2 font-mono text-sm uppercase tracking-wider text-white/45">
                {result.reputation.band}
              </span>
            </p>
            {result.reputation.dimensions && (
              <ul className="grid gap-1 sm:grid-cols-2 font-mono text-[11px] text-white/55">
                {Object.entries(result.reputation.dimensions).map(([k, v]) => (
                  <li key={k}>
                    {k}: {v}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </GreenPanel>
      )}

      {result && (
        <GreenPanel className="mt-6">
          <pre className="overflow-x-auto p-5 text-xs text-white/70">
            {JSON.stringify(result, null, 2)}
          </pre>
        </GreenPanel>
      )}

      <GreenDisclaimer>
        Score indicatif opérationnel — HITL. Ne constitue pas une notation de
        crédit ni une certification AUROS.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
