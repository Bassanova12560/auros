import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { metadataFromPath } from "@/lib/seo/metadata";
import { DEMO_API_KEY } from "@/lib/protocol/constants";
import { PROTOCOL_DOCS_ROUTE } from "@/lib/protocol/docs";

import { DeveloperBrandMark } from "./_components/DeveloperBrandMark";
import { DeveloperPlayground } from "./_components/DeveloperPlayground";

export const DEVELOPERS_ROUTE = "/developers";

export const metadata = metadataFromPath(DEVELOPERS_ROUTE);

const BASE = "https://getauros.com";

const CURL_EXAMPLES = [
  {
    method: "POST",
    path: "/api/v1/score",
    curl: `curl -X POST ${BASE}/api/v1/score \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"description":"Entrepôt retail Luxembourg €2.5M SPV investisseurs professionnels"}'`,
  },
  {
    method: "GET",
    path: "/api/v1/products",
    curl: `curl "${BASE}/api/v1/products?category=bonds&yield_min=4&limit=10" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
  },
  {
    method: "GET",
    path: "/api/v1/jurisdictions",
    curl: `curl "${BASE}/api/v1/jurisdictions?asset_type=real_estate&investor_type=professional" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
  },
  {
    method: "POST",
    path: "/api/v1/checklist",
    curl: `curl -X POST ${BASE}/api/v1/checklist \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"asset_type":"real_estate","jurisdiction":"luxembourg","structure":"spv"}'`,
  },
  {
    method: "POST",
    path: "/api/v1/keys",
    curl: `curl -X POST ${BASE}/api/v1/keys \\
  -H "Content-Type: application/json" \\
  -d '{"email":"vous@entreprise.com"}'`,
  },
] as const;

const PREMIUM_ENDPOINTS = [
  {
    method: "POST",
    path: "/api/v1/monitor",
    desc: "Surveiller un actif — alertes MiCA, webhooks ESMA (premium).",
  },
  {
    method: "POST",
    path: "/api/v1/dossier",
    desc: "Rapport institutionnel PDF/JSON — score + checklist (premium).",
  },
  {
    method: "POST",
    path: "/api/v1/webhooks",
    desc: "Enregistrer webhooks signés HMAC (premium).",
  },
] as const;

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/v1/score",
    desc: "Score MiCA 0–100, grade A+–F, breakdown 5 dimensions.",
  },
  {
    method: "GET",
    path: "/api/v1/products",
    desc: "Catalogue RWA — filtres category, chain, yield, jurisdiction.",
  },
  {
    method: "GET",
    path: "/api/v1/jurisdictions",
    desc: "Classement réglementaire selon actif, budget et délai.",
  },
  {
    method: "POST",
    path: "/api/v1/checklist",
    desc: "Checklist 20+ items par type d'actif et juridiction.",
  },
  {
    method: "POST",
    path: "/api/v1/keys",
    desc: "Créer une clé gratuite (100 req/mois) — sans auth.",
  },
] as const;

export default function DevelopersPage() {
  return (
    <FocusPageShell path={DEVELOPERS_ROUTE} width="3xl">
      <DeveloperBrandMark />
      <ContentPageLayout
        eyebrow="AUROS Protocol · v1.0"
        title="AUROS Protocol — The RWA Intelligence Layer"
        intro="API publique pour scorer la maturité MiCA, explorer le catalogue RWA et comparer les juridictions — règles statiques, réponse < 200 ms, sans LLM. Indicatif uniquement ; validez avec un conseil avant toute émission."
        cta={{ href: "#playground", label: "Tester dans le playground" }}
      >
        <section className="card-flat px-5 py-5">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">
            SDK — installation
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] text-emerald-400/80">npm</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] text-white/65">
                npm install @adrien1212balitrand/auros-protocol
              </pre>
            </div>
            <div>
              <p className="font-mono text-[10px] text-emerald-400/80">pip</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] text-white/65">
                pip install auros-protocol
              </pre>
            </div>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
            {`import { AurosProtocol } from "@adrien1212balitrand/auros-protocol";

const client = new AurosProtocol({ apiKey: "${DEMO_API_KEY}" });
const result = await client.score({
  description: "Entrepôt retail Luxembourg €2.5M SPV professionnels",
});
console.log(result.score, result.grade);`}
          </pre>
        </section>

        <section className="mt-10 border border-amber-500/20 bg-amber-500/[0.04] px-5 py-5">
          <h2 className="font-mono text-[11px] tracking-wide text-amber-400/80">
            Premium — Monitor · Dossier · Webhooks
          </h2>
          <p className="mt-3 text-sm font-light text-white/55">
            Clé <code className="text-white/70">auros_pk_live_*</code> requise. Tarifs indicatifs :
            49€/mo (5 actifs monitorés), 199€/mo (25 actifs). Rapports PDF institutionnels et
            webhooks HMAC pour veille MiCA automatisée.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {PREMIUM_ENDPOINTS.map((ep) => (
              <div key={ep.path} className="rounded-lg border border-white/[0.06] px-4 py-3">
                <p className="font-mono text-[10px] text-amber-400/70">{ep.method}</p>
                <p className="mt-1 font-mono text-xs text-white">{ep.path}</p>
                <p className="mt-2 text-xs font-light text-white/40">{ep.desc}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2 text-sm text-white/50">
            <li>
              <Link href="/developers/docs/endpoint-monitor" className="hover:text-white">
                Docs Monitor →
              </Link>
            </li>
            <li>
              <Link href="/developers/docs/guide-monitor-mica" className="hover:text-white">
                Guide veille MiCA →
              </Link>
            </li>
            <li>
              <Link href="/developers/docs/guide-institutional-reports" className="hover:text-white">
                Guide rapports institutionnels →
              </Link>
            </li>
            <li>
              <Link href="/developers/dashboard" className="hover:text-white">
                Dashboard usage API →
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENDPOINTS.map((ep) => (
            <div key={ep.path} className="card-flat px-5 py-4">
              <p className="font-mono text-[10px] text-emerald-400/80">{ep.method}</p>
              <p className="mt-1 font-mono text-sm text-white">{ep.path}</p>
              <p className="mt-2 text-sm font-light text-white/45">{ep.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">
            Exemples cURL
          </h2>
          <div className="mt-4 space-y-4">
            {CURL_EXAMPLES.map((ex) => (
              <div key={ex.path} className="card-flat px-5 py-4">
                <p className="font-mono text-[10px] text-emerald-400/80">
                  {ex.method} {ex.path}
                </p>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[10px] leading-relaxed text-white/60">
                  {ex.curl}
                </pre>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-light text-white/40">
            Clé démo : <code>{DEMO_API_KEY}</code> · Headers réponse :{" "}
            <code>X-AUROS-Protocol-Version: 1.0</code>,{" "}
            <code>X-AUROS-Logo: {BASE}/auros-logo.svg</code>,{" "}
            <code>X-Response-Time</code>
          </p>
        </section>

        <section id="playground" className="mt-14 border-t border-white/[0.06] pt-10">
          <h2 className="font-display text-lg font-medium text-white">Playground</h2>
          <p className="mt-2 text-sm font-light text-white/45">
            Testez le endpoint score avec la clé démo — aucune carte requise.
          </p>
          <div className="mt-6">
            <DeveloperPlayground />
          </div>
        </section>

        <section className="mt-14 border-t border-white/[0.06] pt-10">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">
            Documentation & ressources
          </h2>
          <ul className="mt-5 space-y-3">
            <li>
              <Link
                href={PROTOCOL_DOCS_ROUTE}
                className="text-sm text-white/70 hover:text-white"
              >
                Documentation API (quickstart, auth, guides) →
              </Link>
            </li>
            <li>
              <Link href="/status" className="text-sm text-white/70 hover:text-white">
                Statut API & uptime →
              </Link>
            </li>
            <li>
              <Link
                href="/auros-openapi.yaml"
                className="text-sm text-white/70 hover:text-white"
              >
                OpenAPI 3.1 spec (8 endpoints) →
              </Link>
            </li>
            <li>
              <Link href="/tools/mica-checker" className="text-sm text-white/70 hover:text-white">
                Test MiCA interactif →
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-sm text-white/70 hover:text-white">
                Comparateur RWA (120+ produits) →
              </Link>
            </li>
          </ul>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
