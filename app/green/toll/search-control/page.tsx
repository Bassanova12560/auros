"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import {
  SEARCH_AUDIENCES,
  SEARCH_VISIBILITIES,
  type SearchAudience,
  type SearchVisibility,
} from "@/lib/toll/search-control";

type Hit = {
  kind?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  score?: number;
  visibility?: string;
  permissionRequired?: string;
  href?: string;
};

type ApiResult = {
  ok?: boolean;
  query?: string;
  audience?: string;
  visibility?: string;
  permissionLevel?: string;
  total?: number;
  totalRaw?: number;
  hits?: Hit[];
  auditId?: string;
  error?: string;
  message?: string;
  disclaimer?: string;
  meter?: { remaining?: number; cost?: number };
};

export default function TollSearchControlPage() {
  const [apiKey, setApiKey] = useState("");
  const [q, setQ] = useState("");
  const [audience, setAudience] = useState<SearchAudience>("bank");
  const [visibility, setVisibility] = useState<SearchVisibility | "">("");
  const [actorId, setActorId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [result, setResult] = useState<ApiResult | null>(null);

  const field =
    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/v1/toll/search-control", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: q.trim(),
          audience,
          visibility: visibility || undefined,
          actorId: actorId.trim() || undefined,
          limit: 20,
        }),
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
        eyebrow="Search · control plane v0"
        title="Search Control Plane"
        intro="Recherche audience-aware (bank / AI / audit / trading / regulator) — ranking + ACL indicatif + journal d’audit. Pas un IAM entreprise."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-2 text-sm text-white/65">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            API
          </p>
          <p>
            <code className="text-emerald-200/80">
              POST /api/v1/toll/search-control
            </code>{" "}
            — Bearer + crédits search · audit écrit dans le journal local
          </p>
          <p className="text-white/45">
            Chaque requête sensible est journalisée (qui / quoi / audience) —
            HITL, pas une preuve légale. Doc :{" "}
            <code className="text-white/60">docs/TOLL-SEARCH-CONTROL.md</code> ·{" "}
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
        <form onSubmit={(e) => void onSearch(e)} className="p-5 md:p-6 space-y-4">
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
              Query
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              required
              className={field}
              placeholder="hydro · issuer · offer…"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Audience
              </span>
              <select
                value={audience}
                onChange={(e) =>
                  setAudience(e.target.value as SearchAudience)
                }
                className={field}
              >
                {SEARCH_AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Visibility (optional)
              </span>
              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(
                    (e.target.value || "") as SearchVisibility | ""
                  )
                }
                className={field}
              >
                <option value="">default for audience</option>
                {SEARCH_VISIBILITIES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              actorId (audit label, optional)
            </span>
            <input
              value={actorId}
              onChange={(e) => setActorId(e.target.value)}
              className={field}
              placeholder="desk:risk@bank.test"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
          >
            Search (metered)
          </button>
        </form>
      </GreenPanel>

      {result?.hits && result.hits.length > 0 && (
        <GreenPanel className="mt-6">
          <div className="p-5 md:p-6 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Results · {result.total} / raw {result.totalRaw} · audit{" "}
              {result.auditId}
            </p>
            <ul className="space-y-2 text-sm text-white/75">
              {result.hits.map((h) => (
                <li key={`${h.kind}-${h.id}`} className="border-b border-white/10 pb-2">
                  <span className="text-white">{h.title}</span>
                  <span className="ml-2 font-mono text-[10px] text-white/40">
                    {h.kind} · {h.visibility} · score {h.score}
                  </span>
                  {h.subtitle ? (
                    <p className="text-white/45 text-xs mt-0.5">{h.subtitle}</p>
                  ) : null}
                </li>
              ))}
            </ul>
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
        ACL indicatif — HITL. Le journal d’audit est opérationnel, pas une
        preuve légale. Ne remplace pas un IAM / DLP entreprise.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
