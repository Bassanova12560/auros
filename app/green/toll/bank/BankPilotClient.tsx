"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";

type Pilot = {
  id: string;
  slug: string;
  bankName: string;
  status: string;
  jurisdiction?: string;
};

type DecideResult = {
  ok?: boolean;
  kind?: string;
  result?: {
    decision?: string;
    ruleIds?: string[];
    reasons?: string[];
    trustOverall?: number;
  };
  logId?: string;
  error?: string;
  disclaimer?: string;
};

export default function TollBankPilotPage() {
  const params = useSearchParams();
  const [bankName, setBankName] = useState("");
  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState(params.get("slug") ?? "");
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"policy" | "eligibility">("policy");
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DecideResult | null>(null);
  const [upstash, setUpstash] = useState<string | null>(null);

  const field =
    "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

  useEffect(() => {
    void fetch("/api/v1/toll/infra-status")
      .then((r) => r.json())
      .then((j: { upstash?: { message?: string } }) => {
        setUpstash(j.upstash?.message ?? null);
      })
      .catch(() => setUpstash(null));
  }, []);

  useEffect(() => {
    const s = params.get("slug");
    if (!s) return;
    setSlug(s);
    void fetch(`/api/v1/toll/bank-pilot?slug=${encodeURIComponent(s)}`)
      .then((r) => r.json())
      .then((j: { ok?: boolean; pilot?: Pilot }) => {
        if (j.ok && j.pilot) setPilot(j.pilot);
      })
      .catch(() => undefined);
  }, [params]);

  async function onEnroll(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setEnrollMsg(null);
    try {
      const res = await fetch("/api/v1/toll/bank-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enroll",
          bankName,
          contactEmail: email,
          slug: slug || undefined,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        pilot?: Pilot;
        desk?: string;
        error?: string;
      };
      if (!res.ok || !json.pilot) {
        setStatus("err");
        setEnrollMsg(json.error ?? "échec");
        return;
      }
      setPilot(json.pilot);
      setSlug(json.pilot.slug);
      setEnrollMsg(json.desk ?? "ok");
      setStatus("idle");
    } catch {
      setStatus("err");
    }
  }

  async function onDecide(e: FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/v1/toll/bank-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "decide",
          slug,
          kind,
          q,
          operation: "buy",
        }),
      });
      const json = (await res.json()) as DecideResult;
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

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Enterprise · banque"
        title="Bank Policy / Eligibility Pilot"
        intro="Un tenant banque : règles figées, décisions loggées, HITL. Sticky SI — pas d’auto-blocage marché."
        compact
      />

      {upstash ? (
        <p className="mt-4 font-mono text-[11px] text-white/45">{upstash}</p>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <GreenPanel>
          <form onSubmit={onEnroll} className="space-y-3 p-5">
            <h2 className="font-display text-lg text-white">Enrôler un pilote</h2>
            <label className="block text-sm">
              <span className="text-white/50">Banque</span>
              <input
                className={field}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                placeholder="Banque Exemple"
              />
            </label>
            <label className="block text-sm">
              <span className="text-white/50">Contact compliance</span>
              <input
                className={field}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-white/50">Slug (optionnel)</span>
              <input
                className={field}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="banque-exemple"
              />
            </label>
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100 disabled:opacity-50"
            >
              Créer le pilote
            </button>
            {enrollMsg ? (
              <p className="text-xs text-white/55">{enrollMsg}</p>
            ) : null}
          </form>
        </GreenPanel>

        <GreenPanel>
          <form onSubmit={onDecide} className="space-y-3 p-5">
            <h2 className="font-display text-lg text-white">Décision tenant</h2>
            {pilot ? (
              <p className="text-sm text-white/55">
                {pilot.bankName} · <code>{pilot.slug}</code> · {pilot.status}
              </p>
            ) : (
              <p className="text-sm text-white/40">
                Enrôle un pilote ou ouvre{" "}
                <code className="text-white/60">?slug=…</code>
              </p>
            )}
            <label className="block text-sm">
              <span className="text-white/50">Slug</span>
              <input
                className={field}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-white/50">Actif (DNA id / nom)</span>
              <input
                className={field}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-white/50">Moteur</span>
              <select
                className={field}
                value={kind}
                onChange={(e) =>
                  setKind(e.target.value as "policy" | "eligibility")
                }
              >
                <option value="policy">Policy</option>
                <option value="eligibility">Eligibility</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={status === "loading" || !slug}
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/85 disabled:opacity-50"
            >
              Évaluer + logger
            </button>
          </form>
        </GreenPanel>
      </div>

      {result ? (
        <GreenPanel className="mt-6">
          <pre className="overflow-x-auto p-5 text-xs text-white/70">
            {JSON.stringify(result, null, 2)}
          </pre>
        </GreenPanel>
      ) : null}

      <p className="mt-6 text-sm text-white/45">
        Aussi :{" "}
        <Link href="/green/toll/policy" className="underline underline-offset-4">
          Policy desk
        </Link>{" "}
        ·{" "}
        <Link
          href="/green/toll/eligibility"
          className="underline underline-offset-4"
        >
          Eligibility
        </Link>{" "}
        ·{" "}
        <Link href="/green/toll/tower" className="underline underline-offset-4">
          Tower
        </Link>
      </p>

      <GreenDisclaimer>
        Pilote banque indicatif — HITL. AUROS n’auto-bloque aucun marché.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
