"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { PROTOCOL_DOCS_ROUTE } from "@/lib/protocol/docs/paths";

const SAMPLE = `{
  "flow": {
    "external_flow_id": "flow_demo_001",
    "started_at": "2026-07-01T00:00:00Z",
    "ended_at": "2026-07-31T23:59:59Z",
    "volume_m3": 125000,
    "location": { "country": "FR", "basin_id": "seine" },
    "operator_id": "utility_demo",
    "source_format": "json_custom"
  },
  "attributes": {
    "asset_class_hint": "concession"
  }
}`;

type DemoResult = {
  id?: string;
  verify_url?: string;
  content_hash?: string;
  status?: string;
  public?: {
    h2o_rating?: number | null;
    h2o_tier?: string | null;
    volume_m3?: number;
  };
  error?: string;
};

type DemoApiBody = {
  id?: string;
  verify_url?: string;
  content_hash?: string;
  status?: string;
  public?: DemoResult["public"];
  error?: { code?: string; message?: string } | string;
  message?: string;
};

export function ChargeflowWPitchView() {
  const [json, setJson] = useState(SAMPLE);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [pending, startTransition] = useTransition();

  function runDemo() {
    startTransition(async () => {
      setResult(null);
      try {
        const body = JSON.parse(json) as unknown;
        const res = await fetch("/api/v1/chargeflow/w/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as DemoApiBody;
        if (!res.ok) {
          const errObj = data.error;
          const msg =
            typeof errObj === "object" && errObj?.message
              ? errObj.message
              : typeof errObj === "string"
                ? errObj
                : data.message ?? `HTTP ${res.status}`;
          setResult({ error: msg });
          return;
        }
        setResult({
          id: data.id,
          verify_url: data.verify_url,
          content_hash: data.content_hash,
          status: data.status,
          public: data.public,
        });
      } catch (err) {
        setResult({
          error: err instanceof Error ? err.message : "Invalid JSON",
        });
      }
    });
  }

  return (
    <div className="space-y-14 md:space-y-16">
      <header className="space-y-4 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400/80">
          ChargeFlow · CFU-W
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
          Flux hydrique → unité de flux vérifiable
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
          AUROS ChargeFlow CFU-W enregistre un volume m³ (concession / droits /
          desal) en unité hashée + HMAC avec score H₂O compagnon — même cycle
          de vie que CFU-E (unicité active, retirement).
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-white">Demo — coller un JSON flow</h2>
        <p className="text-sm text-white/45">
          Sandbox rate-limitée. Production :{" "}
          <code className="text-white/60">POST /api/v1/chargeflow/w</code>{" "}
          (Protocol Premium).
        </p>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={16}
          spellCheck={false}
          className="w-full resize-y border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-white/80 outline-none focus:border-cyan-500/40"
          aria-label="JSON flow ChargeFlow CFU-W"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runDemo}
            disabled={pending}
            className="border border-cyan-500/50 bg-cyan-500/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {pending ? "Enregistrement…" : "Enregistrer CFU-W (demo)"}
          </button>
          <PrimaryButton href="/developers/docs/endpoint-chargeflow-w">
            Docs API
          </PrimaryButton>
          <PrimaryButton href="/green/api#premium" variant="ghost">
            Protocol Premium
          </PrimaryButton>
        </div>
        {result?.error ? (
          <p className="text-sm text-red-300/90">{result.error}</p>
        ) : null}
        {result?.id ? (
          <div className="space-y-2 border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
            <p>
              <span className="font-mono text-white/40">ID</span>{" "}
              <Link
                href={result.verify_url ?? `/chargeflow/${result.id}`}
                className="font-mono text-cyan-400 underline-offset-2 hover:underline"
              >
                {result.id}
              </Link>
              {result.status ? (
                <span className="ml-2 font-mono text-[10px] uppercase text-white/40">
                  {result.status}
                </span>
              ) : null}
            </p>
            {result.public?.h2o_rating != null ? (
              <p>
                H₂O companion : {result.public.h2o_rating}
                {result.public.h2o_tier
                  ? ` · ${result.public.h2o_tier}`
                  : ""}{" "}
                · {result.public.volume_m3} m³
              </p>
            ) : null}
            {result.content_hash ? (
              <p className="break-all font-mono text-[11px] text-white/45">
                {result.content_hash}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <p className="text-center text-xs text-white/35">
        Voir aussi{" "}
        <Link
          href="/green/chargeflow"
          className="text-white/55 underline-offset-2 hover:underline"
        >
          CFU-E (charge)
        </Link>{" "}
        ·{" "}
        <Link
          href={PROTOCOL_DOCS_ROUTE}
          className="text-white/55 underline-offset-2 hover:underline"
        >
          docs Protocol
        </Link>
        .
      </p>
    </div>
  );
}
