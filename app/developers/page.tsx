import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { metadataFromPath } from "@/lib/seo/metadata";
import { DEMO_API_KEY } from "@/lib/protocol/constants";
import { PROTOCOL_CHANGELOG_ROUTE } from "@/lib/protocol/changelog";
import { PROTOCOL_DOCS_ROUTE } from "@/lib/protocol/docs";

import { DeveloperBrandMark } from "./_components/DeveloperBrandMark";
import { DeveloperPlayground } from "./_components/DeveloperPlayground";
import { MonitorCheckoutForm } from "./_components/MonitorCheckoutForm";

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
    method: "POST",
    path: "/api/v1/score/batch",
    curl: `curl -X POST ${BASE}/api/v1/score/batch \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"items":[{"description":"Entrepôt retail Luxembourg SPV investisseurs professionnels"},{"asset_type":"bonds","issuer_type":"company_spv"}]}'`,
  },
  {
    method: "GET",
    path: "/api/v1/score/{id}/history",
    curl: `curl "${BASE}/api/v1/score/scr_VOTRE_SESSION_ID/history" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
  },
  {
    method: "GET",
    path: "/api/v1/products",
    curl: `curl "${BASE}/api/v1/products?category=bonds&yield_min=4&limit=10" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
  },
  {
    method: "GET",
    path: "/api/v1/benchmarks",
    curl: `curl "${BASE}/api/v1/benchmarks?category=bonds" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
  },
  {
    method: "POST",
    path: "/api/v1/compare",
    curl: `curl -X POST ${BASE}/api/v1/compare \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"product_ids":["maple-usdc","realt-portfolio","backed-bib01"]}'`,
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
    method: "GET",
    path: "/api/v1/regulatory/feed",
    desc: "Feed réglementaire ESMA/AMF/BaFin curaté — filtres jurisdiction/tag (premium).",
  },
  {
    method: "POST",
    path: "/api/v1/regulatory/subscribe",
    desc: "Abonnement alertes feed réglementaire par juridiction (premium).",
  },
  {
    method: "POST",
    path: "/api/v1/monitor",
    desc: "Surveiller un actif — alertes MiCA, snapshot Twin rules_version (premium).",
  },
  {
    method: "GET",
    path: "/api/v1/monitor/{id}/delta",
    desc: "Regulatory Twin lite — delta feed hors baseline + impact_on_score.",
  },
  {
    method: "POST",
    path: "/api/v1/dossier",
    desc: "Rapport institutionnel PDF/JSON — score + checklist + delta Twin (premium).",
  },
  {
    method: "POST",
    path: "/api/v1/attest",
    desc: "Attestation readiness — hash SHA-256 + HMAC, vérif publique /attest/{id}.",
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
    desc: "Score MiCA 0–100, grade A+–F, breakdown 5 dimensions — retourne score_id + historique.",
  },
  {
    method: "POST",
    path: "/api/v1/score/batch",
    desc: "Score batch jusqu'à 20 actifs — succès partiel, 1 unité quota par appel.",
  },
  {
    method: "GET",
    path: "/api/v1/score/{id}/history",
    desc: "Historique des scores pour une session scr_… ou monitor mon_…",
  },
  {
    method: "GET",
    path: "/api/v1/products",
    desc: "Catalogue RWA — filtres category, chain, yield, jurisdiction.",
  },
  {
    method: "GET",
    path: "/api/v1/benchmarks",
    desc: "Benchmarks sectoriels — médiane APY, quartiles P25/P75, product count.",
  },
  {
    method: "POST",
    path: "/api/v1/compare",
    desc: "Comparaison 2–4 produits RWA — IDs explicites ou filtres (comme /compare).",
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
    desc: "Créer une clé gratuite (1000 req/mois) — sans auth.",
  },
] as const;

export default function DevelopersPage() {
  return (
    <FocusPageShell path={DEVELOPERS_ROUTE} width="3xl">
      <DeveloperBrandMark />
      <ContentPageLayout
        eyebrow="AUROS Protocol · v1.0"
        title="AUROS Protocol — The RWA Intelligence Layer"
        intro="API publique pour scorer la maturité MiCA, explorer le catalogue RWA, comparer des produits side-by-side et classer les juridictions — règles statiques, réponse < 200 ms, sans LLM. Disponible sur getauros.com/api/v1/* et api.getauros.com/v1/*. Indicatif uniquement ; validez avec un conseil avant toute émission."
        cta={{ href: "#playground", label: "Tester dans le playground" }}
      >
        <section className="card-flat px-5 py-5">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">
            SDK — installation
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
            <div>
              <p className="font-mono text-[10px] text-emerald-400/80">MCP</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] text-white/65">
                npx @adrien1212balitrand/auros-mcp
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

        <section
          id="monitor"
          className="mt-10 scroll-mt-28 border border-amber-500/20 bg-amber-500/[0.04] px-5 py-5"
        >
          <h2 className="font-mono text-[11px] tracking-wide text-amber-400/80">
            Premium — Monitor · Regulatory Twin · Dossier · Attest
          </h2>
          <p className="mt-3 text-sm font-light text-white/55">
            Self-serve : Monitor Starter 49 €/mo (5 actifs) ou Pro 199 €/mo (25 actifs).
            Regulatory Twin lite = snapshot <code className="text-white/70">rules_version</code>{" "}
            + <code className="text-white/70">GET /api/v1/monitor/:id/delta</code>. Enterprise
            (100+ actifs) sur devis.
          </p>
          <div className="mt-5">
            <MonitorCheckoutForm />
          </div>
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
              <Link href="/developers/docs/endpoint-attest" className="hover:text-white">
                Docs Attestation →
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
            <code>X-Response-Time</code>,{" "}
            <code>X-RateLimit-Limit</code>,{" "}
            <code>X-RateLimit-Remaining</code>,{" "}
            <code>X-RateLimit-Reset</code>,{" "}
            <code>X-RateLimit-Limit</code>,{" "}
            <code>X-RateLimit-Remaining</code>,{" "}
            <code>X-RateLimit-Reset</code>
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
              <Link
                href={PROTOCOL_CHANGELOG_ROUTE}
                className="text-sm text-white/70 hover:text-white"
              >
                Changelog API (releases & roadmap) →
              </Link>
            </li>
            <li>
              <a
                href="https://pypi.org/project/auros-protocol/"
                className="text-sm text-white/70 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Python SDK on PyPI (auros-protocol) →
              </a>
            </li>
            <li>
              <Link
                href="/developers/docs/mcp-server"
                className="text-sm text-white/70 hover:text-white"
              >
                MCP server (Cursor & Claude Desktop) →
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
                OpenAPI 3.1 spec →
              </Link>
            </li>
            <li>
              <Link
                href="/auros-postman.json"
                className="text-sm text-white/70 hover:text-white"
              >
                Postman collection v2.1 (tous les endpoints v1) →
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
            <li>
              <Link href="/green/csrd-check" className="text-sm text-white/70 hover:text-white">
                CSRD Checker — scope & préparation ESG →
              </Link>
            </li>
            <li>
              <Link href="/green/impact-report" className="text-sm text-white/70 hover:text-white">
                Rapport d&apos;impact Green (PDF EU Taxonomy) →
              </Link>
            </li>
          </ul>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
