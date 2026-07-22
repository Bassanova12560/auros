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
  mode?: string;
  records?: unknown[];
  chain?: unknown[];
  record?: unknown;
  error?: string;
  message?: string;
  disclaimer?: string;
  meter?: { remaining?: number; cost?: number };
};

export default function TollProvenancePage() {
  const [apiKey, setApiKey] = useState("");
  const [assetDnaId, setAssetDnaId] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [valueSummary, setValueSummary] = useState("");
  const [originSystem, setOriginSystem] = useState("erp");
  const [actor, setActor] = useState("");
  const [transformedFrom, setTransformedFrom] = useState("");
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
      let url = `/api/v1/toll/provenance?assetDnaId=${encodeURIComponent(assetDnaId.trim())}`;
      if (method === "GET" && fieldKey.trim()) {
        url += `&fieldKey=${encodeURIComponent(fieldKey.trim())}`;
      }
      let body: string | undefined;
      if (method === "POST") {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({
          assetDnaId: assetDnaId.trim(),
          fieldKey: fieldKey.trim() || "field",
          valueSummary: valueSummary.trim(),
          originSystem: originSystem.trim(),
          actor: actor.trim() || undefined,
          transformedFrom: transformedFrom.trim() || undefined,
        });
      }
      const res = await fetch(method === "GET" ? url : "/api/v1/toll/provenance", {
        method,
        headers,
        body,
      });
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
        eyebrow="Provenance · ledger v0"
        title="Data Provenance Ledger"
        intro="Où vient ce datapoint, qui l’a changé, brut vs dérivé — citation indicative pour auditors / IA. Pas un oracle."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-2 text-sm text-white/65">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            API
          </p>
          <p>
            <code className="text-emerald-200/80">
              GET /api/v1/toll/provenance?assetDnaId=&amp;fieldKey=
            </code>{" "}
            — list ou chaîne (policy credits)
          </p>
          <p>
            <code className="text-emerald-200/80">
              POST /api/v1/toll/provenance
            </code>{" "}
            — append (research credits) · Bearer requis
          </p>
          <p className="text-white/45">
            Doc repo : <code className="text-white/60">docs/TOLL-PROVENANCE.md</code>{" "}
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
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              fieldKey
            </span>
            <input
              value={fieldKey}
              onChange={(e) => setFieldKey(e.target.value)}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              valueSummary (POST)
            </span>
            <input
              value={valueSummary}
              onChange={(e) => setValueSummary(e.target.value)}
              className={field}
              placeholder="12.4 MWh (normalized)"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                originSystem
              </span>
              <input
                value={originSystem}
                onChange={(e) => setOriginSystem(e.target.value)}
                className={field}
              />
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                actor
              </span>
              <input
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                className={field}
                placeholder="ops@issuer.test"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              transformedFrom (parent id → derived)
            </span>
            <input
              value={transformedFrom}
              onChange={(e) => setTransformedFrom(e.target.value)}
              className={field}
              placeholder="prov_…"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              onClick={(e) => void callApi("GET", e)}
              className="border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-white/80 disabled:opacity-50"
            >
              Lister / chaîne
            </button>
            <button
              type="button"
              disabled={status === "loading"}
              onClick={(e) => void callApi("POST", e)}
              className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
            >
              Append
            </button>
          </div>
        </form>
      </GreenPanel>

      {result && (
        <GreenPanel className="mt-6">
          <pre className="overflow-x-auto p-5 text-xs text-white/70">
            {JSON.stringify(result, null, 2)}
          </pre>
        </GreenPanel>
      )}

      <GreenDisclaimer>
        Ledger indicatif — HITL. Ne remplace pas une attestation notariée / oracle
        certifié.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
