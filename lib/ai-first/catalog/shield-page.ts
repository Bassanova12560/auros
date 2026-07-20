import { enrichPage } from "../enrich";

export const shieldPage = enrichPage({
  id: "developers-shield",
  path: "/developers/shield",
  title: "AUROS Shield | Ingest 1 ligne + Evidence Pack Premium",
  description:
    "Quand le RWA est partout : ingest brut sans schéma, instrumentFetch, Evidence Pack Premium pour banques. Payload jamais stocké.",
  summary:
    "Shield v0.3 — intégration quasi invisible (curl / instrumentFetch) et Premium lourd (Evidence Pack CFU+taps pour crédit/ESG/auditeurs).",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS Shield",
    "evidence pack RWA",
    "instrumentFetch",
    "proof tap",
    "banque audit CFU",
  ],
  intents: [
    "Comment intégrer Shield en une ligne ?",
    "Evidence Pack Premium AUROS",
    "Preuve RWA sans data room",
  ],
  audience: ["banques", "CISO", "risk", "énergie", "développeurs"],
  facts: [
    { key: "Easy", value: "POST /api/v1/shield/ingest · instrumentFetch" },
    { key: "Free", value: "100 taps/mo + verify public + CBOM" },
    { key: "Premium", value: "POST /api/v1/shield/pack Evidence Pack" },
    { key: "Package", value: "@adrien1212balitrand/auros-shield@0.3.0" },
  ],
  faq: [
    {
      question: "Est-ce facile à intégrer ?",
      answer:
        "Oui : curl d'un fichier vers /api/v1/shield/ingest, ou instrumentFetch({ apiKey }) en une ligne — sans rewrite métier.",
    },
    {
      question: "Que paie-t-on en Premium ?",
      answer:
        "L'Evidence Pack : CFU + taps scellés, bank_actions, horizon 7–30 ans, reseal PQC — le livrable crédit/ESG, pas seulement du quota.",
    },
  ],
  breadcrumbs: [{ name: "Developers", path: "/developers" }],
  relatedPaths: [
    "/developers/institutions",
    "/developers",
    "/api/v1/shield/cbom",
    "/api/v1/shield/ingest",
    "/auros-openapi.yaml",
  ],
});
