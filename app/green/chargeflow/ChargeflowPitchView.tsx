"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { PROTOCOL_DOCS_ROUTE } from "@/lib/protocol/docs/paths";

const SAMPLE = `{
  "session": {
    "external_session_id": "sess_demo_001",
    "started_at": "2026-07-19T10:00:00Z",
    "ended_at": "2026-07-19T10:42:00Z",
    "energy_kwh": 48.2,
    "location": { "country": "FR", "site_id": "site_lyon_01" },
    "vehicle_ref": "veh_opaque_9f2a",
    "operator_id": "cpo_demo",
    "source_format": "json_custom"
  },
  "attributes": {
    "renewable_claim": "go"
  }
}`;

type DemoResult = {
  id?: string;
  verify_url?: string;
  content_hash?: string;
  public?: {
    watt_rating?: number | null;
    watt_tier?: string | null;
    energy_kwh?: number;
  };
  error?: string;
};

type DemoApiBody = {
  id?: string;
  verify_url?: string;
  content_hash?: string;
  public?: DemoResult["public"];
  error?: { code?: string; message?: string } | string;
  message?: string;
};

export function ChargeflowPitchView() {
  const [json, setJson] = useState(SAMPLE);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [pending, startTransition] = useTransition();

  function runDemo() {
    startTransition(async () => {
      setResult(null);
      try {
        const body = JSON.parse(json) as unknown;
        const res = await fetch("/api/v1/chargeflow/demo", {
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
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          ChargeFlow · CFU-E
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
          Session de charge → unité de flux vérifiable
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
          AUROS ChargeFlow enregistre un JSON de session (CPO / flotte / export
          type OCPI) en CFU-E : métadonnées, hash SHA-256, HMAC et score Watt
          compagnon — prêt pour dossier RWA et ESG granulaire, sans smart
          contract.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <PrimaryButton href="/green/chargeflow/console">
            Ouvrir la console
          </PrimaryButton>
          <PrimaryButton href="/developers/shield/banks" variant="ghost">
            Evidence Pack
          </PrimaryButton>
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-3">
        {[
          {
            t: "Problème",
            d: "Les logs de charge restent des PDF ou tables silo — finance et ESG exigent une unité hashée, non répudiable.",
          },
          {
            t: "CFU-E",
            d: "Une ChargeFlow Unit Energy par session kWh : identité stable, anti double-counting GO/REC documenté, verify URL publique.",
          },
          {
            t: "Proof-of-Flow",
            d: "Brick 0 du moteur. Roadmap : ZK selective disclosure, twin anomalies, connecteurs OPC UA / MQTT.",
          },
        ].map((item) => (
          <div key={item.t} className="space-y-2">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {item.t}
            </h2>
            <p className="text-sm leading-relaxed text-white/65">{item.d}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-white">Demo — coller un JSON session</h2>
        <p className="text-sm text-white/45">
          Sandbox rate-limitée. Production :{" "}
          <code className="text-white/60">POST /api/v1/chargeflow</code> (Protocol
          Premium).
        </p>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={16}
          spellCheck={false}
          className="w-full resize-y border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-white/80 outline-none focus:border-emerald-500/40"
          aria-label="JSON session ChargeFlow"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runDemo}
            disabled={pending}
            className="border border-emerald-500/50 bg-emerald-500/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
          >
            {pending ? "Enregistrement…" : "Enregistrer CFU-E (demo)"}
          </button>
          <PrimaryButton href="/developers/docs/endpoint-chargeflow">
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
                className="font-mono text-emerald-400 underline-offset-2 hover:underline"
              >
                {result.id}
              </Link>
            </p>
            {result.public?.watt_rating != null ? (
              <p>
                Watt companion : {result.public.watt_rating}
                {result.public.watt_tier
                  ? ` · ${result.public.watt_tier}`
                  : ""}{" "}
                · {result.public.energy_kwh} kWh
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

      <section className="space-y-3 border-t border-white/[0.06] pt-10">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Proof-of-Flow Roadmap
        </h2>
        <ul className="space-y-2 text-sm text-white/55">
          <li>ZK selective disclosure — prouver seuils kWh / CO₂ sans dump brut</li>
          <li>Digital twin + anomalies — filtrer sessions impossibles avant mint</li>
          <li>Connecteurs industriels — OPC UA / MQTT / OCPI</li>
        </ul>
        <p className="text-xs text-white/35">
          Compatible Supercharger-class / CPO / flottes. Aucune claim de partnership
          Tesla.{" "}
          <Link
            href="/green/chargeflow/fleets"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            Tunnel flottes
          </Link>
          {" · "}
          <Link
            href="/green/chargeflow/console"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            Console
          </Link>
          {" · "}
          <Link
            href="/green/chargeflow/flex"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            CFU-F
          </Link>
          {" · "}
          <Link
            href="/copilot?context=chargeflow"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            Copilot
          </Link>
          {" · "}
          <Link
            href="/green/watts"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            Watts
          </Link>
          {" · "}
          <Link
            href="/green/chargeflow/reserve"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            réserver
          </Link>
          {" · "}
          <Link
            href="/green/chargeflow/inventory"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            inventaire
          </Link>
          {" · "}
          <Link
            href="/green/chargeflow/secondary"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            secondaire
          </Link>
          . Voir{" "}
          <Link
            href="/developers/docs/endpoint-chargeflow"
            className="text-white/55 underline-offset-2 hover:underline"
          >
            le standard API
          </Link>{" "}
          et{" "}
          <Link
            href={PROTOCOL_DOCS_ROUTE}
            className="text-white/55 underline-offset-2 hover:underline"
          >
            docs Protocol
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
