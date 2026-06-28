import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GreenApiPremiumCheckout } from "@/app/green/api/_components/GreenApiPremiumCheckout";
import { absoluteUrl } from "@/lib/comparators/site";
import {
  GREEN_ANON_DAILY_LIMIT,
  GREEN_API_DOCS_ROUTE,
  GREEN_API_OPENAPI_PATH,
  GREEN_FREE_BATCH_MAX_ITEMS,
  listGreenScoreCatalogIds,
} from "@/lib/green/api";
import { FREE_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(GREEN_API_DOCS_ROUTE);

const BASE = absoluteUrl("");

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/green/score/{id}",
    desc: "Score unifié — CQS + Watt + composite + rang index",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/scores?ids=…",
    desc: "Bulk jusqu'à 5 ids (anon) ou 20 avec clé",
    free: true,
  },
  {
    method: "POST",
    path: "/api/green/score/analyze",
    desc: "CQS depuis texte libre (due diligence rapide)",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/nature-score/{id}",
    desc: "Nature Score TNFD — actifs nature-based (Moss, Regen…)",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/registry?serial=…",
    desc: "Registry Connect — Verra/GS serial → CQS + Nature",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/dpp/{id}",
    desc: "DPP Bridge v0 — JSON-LD passeport produit EU",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/score/{id}/history",
    desc: "Historique mensuel (Premium)",
    free: false,
  },
  {
    method: "GET",
    path: "/api/green/nature-index",
    desc: "Nature Score Index — classement biodiversité",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/changelog",
    desc: "Mouvements mensuels Green Index",
    free: true,
  },
  {
    method: "POST",
    path: "/api/v1/green/carbon-quality/batch",
    desc: `Batch CQS — clé API requise (max ${GREEN_FREE_BATCH_MAX_ITEMS} free)`,
    free: false,
  },
];

export default function GreenApiPage() {
  const catalog = listGreenScoreCatalogIds();

  return (
    <FocusPageShell path={GREEN_API_DOCS_ROUTE} width="3xl">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            AUROS Green API
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Le standard ouvert pour scorer le Green RWA
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            CQS, Watt Score, Green Index — gratuit en lecture pour devenir la référence.
            Clé API free : {FREE_TIER_MONTHLY_LIMIT} req/mois. Sans clé : {GREEN_ANON_DAILY_LIMIT}{" "}
            req/jour/IP.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="card-flat p-5 text-center">
            <p className="font-mono text-3xl text-emerald-400">{GREEN_ANON_DAILY_LIMIT}</p>
            <p className="mt-1 text-xs text-white/45">req/jour sans clé</p>
          </div>
          <div className="card-flat p-5 text-center">
            <p className="font-mono text-3xl text-emerald-400">{FREE_TIER_MONTHLY_LIMIT}</p>
            <p className="mt-1 text-xs text-white/45">req/mois clé free</p>
          </div>
          <div className="card-flat p-5 text-center">
            <p className="font-mono text-3xl text-emerald-400">{GREEN_FREE_BATCH_MAX_ITEMS}</p>
            <p className="mt-1 text-xs text-white/45">crédits / batch free</p>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Endpoints
          </h2>
          <ul className="mt-4 space-y-3">
            {ENDPOINTS.map((ep) => (
              <li
                key={ep.path}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-white/[0.06] px-4 py-3"
              >
                <span className="font-mono text-xs text-emerald-400">{ep.method}</span>
                <code className="text-sm text-white/80">{ep.path}</code>
                {ep.free ? (
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    FREE
                  </span>
                ) : null}
                <span className="w-full text-xs text-white/45 sm:w-auto">{ep.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
          <h2 className="text-sm font-medium text-white">Démarrer en 30 secondes</h2>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-black/60 p-4 font-mono text-xs text-emerald-100/90">
{`# 1. Score un crédit (gratuit)
curl ${BASE}/api/green/score/toucan

# 2. Clé API free (1000/mois)
curl -X POST ${BASE}/api/v1/keys \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@company.com"}'

# 3. Batch portfolio
curl -X POST ${BASE}/api/v1/green/carbon-quality/batch \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"items":[{"id":"toucan"},{"id":"moss"}]}'`}
          </pre>
        </section>

        <section>
          <GreenApiPremiumCheckout />
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Widget JS (1 ligne)
          </h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-white/70">
{`<script src="${BASE}/green-score.js" defer></script>
<div data-auros-green-score data-id="toucan"></div>`}
          </pre>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Embed (iframe)
          </h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-white/70">
{`<iframe src="${BASE}/embed/green-score?id=toucan" width="320" height="160" frameborder="0"></iframe>`}
          </pre>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            SDK npm
          </h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-white/70">
{`npm install @adrien1212balitrand/auros-green

import { AurosGreen } from "@adrien1212balitrand/auros-green";
const green = new AurosGreen({ apiKey: "auros_pk_live_…" });
const { score } = await green.getScore("toucan");`}
          </pre>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Webhooks &amp; RSS (Premium)
          </h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-white/70">
{`# Webhook Green Index movers (premium)
curl -X POST ${BASE}/api/v1/webhooks \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '{"url":"https://your.app/hooks/green","events":["green.index.changelog"]}'

# RSS presse
${BASE}/api/green/changelog/rss`}
          </pre>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Catalog ids ({catalog.length})
          </h2>
          <p className="mt-2 font-mono text-xs text-white/50">{catalog.join(" · ")}</p>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={GREEN_API_OPENAPI_PATH}>OpenAPI JSON</PrimaryButton>
          <Link
            href="/developers/docs/endpoint-green-carbon-quality"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Docs développeurs →
          </Link>
          <Link
            href="/green/registry-connect"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Registry Connect →
          </Link>
          <Link
            href="/data/nature-score"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Nature Score Index →
          </Link>
          <Link
            href="/data/green-index"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Green Index →
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Licence premium →
          </Link>
        </div>
      </div>
    </FocusPageShell>
  );
}
