import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GreenApiPremiumCheckout } from "@/app/green/api/_components/GreenApiPremiumCheckout";
import { absoluteUrl } from "@/lib/comparators/site";
import { DATA_LICENCE_ROUTE, DATA_TERMINAL_ROUTE } from "@/lib/data-terminal/constants";
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
    path: "/api/green/carbon-quality/{id}",
    desc: "Carbon Quality Score (legacy)",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/watt/{id}",
    desc: "Watt Score — actifs énergétiques",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/h2o/{id}",
    desc: "H₂O Score — actifs hydriques",
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
    desc: `Batch CQS — clé API (max ${GREEN_FREE_BATCH_MAX_ITEMS} free · 50 premium)`,
    free: false,
  },
  {
    method: "POST",
    path: "/api/v1/green/watt/batch",
    desc: "Batch Watt — tier premium requis (pas une clé free auros_pk_live_*)",
    free: false,
  },
  {
    method: "POST",
    path: "/api/green/eau/legal-risk",
    desc: "WELHR — risque hydrique & legal local (data center / eau / énergie)",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/eau/resilience",
    desc: "Catalogue machine — chaîne détecter → décider → prouver",
    free: true,
  },
  {
    method: "POST",
    path: "/api/green/eau/continuity-playbook",
    desc: "Playbook continuité — 3 scénarios CAPEX/OPEX (indicatif)",
    free: true,
  },
  {
    method: "POST",
    path: "/api/green/eau/roi",
    desc: "Simulateur ROI eau / OPEX data center",
    free: true,
  },
  {
    method: "POST",
    path: "/api/green/eau/resilience-brief",
    desc: "Score résilience + max 3 priorités (Compass)",
    free: true,
  },
  {
    method: "POST",
    path: "/api/green/eau/supplier-screen",
    desc: "Audit claims fournisseurs ESG (anti-washing)",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/eau/resource-signals",
    desc: "Signaux spot / lithium / cobalt (snapshot indicatif)",
    free: true,
  },
  {
    method: "GET",
    path: "/api/green/eau/connectors",
    desc: "Contrats export BIM/ERP",
    free: true,
  },
  {
    method: "POST",
    path: "/api/v1/green/h2o/batch",
    desc: "Batch H₂O — tier premium requis (pas une clé free auros_pk_live_*)",
    free: false,
  },
];

export default async function GreenApiPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { cancelled } = await searchParams;
  const catalog = listGreenScoreCatalogIds();
  const showCancelled = cancelled === "premium";

  return (
    <FocusPageShell path={GREEN_API_DOCS_ROUTE} width="3xl">
      <div className="space-y-12">
        {showCancelled ? (
          <div
            role="status"
            className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-center text-sm text-amber-200/90"
          >
            Paiement annulé — votre clé free reste active. Réessayez Premium quand vous voulez.
          </div>
        ) : null}
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            AUROS Green API
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Preuves & scores pour plateformes — pas un marketplace
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            CQS, Watt, H₂O, WELHR — signaux machine pour due diligence. Score ≠
            GO/REC ; CFU = preuve de flux. Gratuit en lecture pour devenir la
            référence. Clé free : {FREE_TIER_MONTHLY_LIMIT} req/mois. Sans clé :{" "}
            {GREEN_ANON_DAILY_LIMIT} req/jour/IP.
          </p>
        </header>

        <section id="pricing" className="scroll-mt-28">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Plans
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] p-5">
              <p className="font-display text-lg text-white">Free</p>
              <p className="mt-1 font-mono text-2xl text-emerald-400">0 €</p>
              <ul className="mt-3 space-y-1.5 text-xs text-white/50">
                <li>— {FREE_TIER_MONTHLY_LIMIT} req/mois (clé)</li>
                <li>— {GREEN_ANON_DAILY_LIMIT} req/jour sans clé</li>
                <li>— Scores lecture + batch limité</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-5">
              <p className="font-display text-lg text-white">Premium</p>
              <p className="mt-1 font-mono text-2xl text-emerald-400">299 €/mo</p>
              <ul className="mt-3 space-y-1.5 text-xs text-white/55">
                <li>— 25k req/mois · batch 50</li>
                <li>— Historique scores · webhooks</li>
                <li>— SLA email · Terminal desks</li>
              </ul>
              <a
                href="#premium"
                className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
              >
                S&apos;abonner →
              </a>
            </div>
            <div className="rounded-xl border border-white/[0.08] p-5">
              <p className="font-display text-lg text-white">Enterprise</p>
              <p className="mt-1 font-mono text-2xl text-white/80">Sur devis</p>
              <ul className="mt-3 space-y-1.5 text-xs text-white/50">
                <li>— Quotas élevés / SLA dédié</li>
                <li>— Data room / white-label</li>
                <li>— Support siège</li>
              </ul>
              <a
                href="mailto:hello@getauros.com?subject=AUROS%20Green%20API%20Enterprise"
                className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-white/55 hover:text-white/80"
              >
                Contacter →
              </a>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/40">
            Data Terminal pour desks :{" "}
            <Link href={DATA_TERMINAL_ROUTE} className="text-emerald-400/80 hover:underline">
              /data/terminal
            </Link>
            . Premium débloque le volume API derrière le terminal.
          </p>
        </section>

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

        <section id="premium" className="scroll-mt-28">
          <GreenApiPremiumCheckout />
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Widget JS (1 ligne)
          </h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-white/70">
{`<script src="${BASE}/green-score.js" defer></script>
<div data-auros-green-score data-id="toucan" data-theme="dark"></div>
<!-- data-theme="light" for light backgrounds -->`}
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
            href={DATA_TERMINAL_ROUTE}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Data Terminal →
          </Link>
          <Link
            href={DATA_LICENCE_ROUTE}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Licence data →
          </Link>
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
            href="/green/press"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Kit presse →
          </Link>
          <Link
            href="/green/blog/green-api-standard-ouvert-2026"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Communiqué presse →
          </Link>
          <Link
            href={`${GREEN_API_DOCS_ROUTE}#premium`}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            API Premium →
          </Link>
        </div>
      </div>
    </FocusPageShell>
  );
}
