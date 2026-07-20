import { enrichPage } from "../enrich";

export const shieldPage = enrichPage({
  id: "developers-shield",
  path: "/developers/shield",
  title: "AUROS Shield | Collez → preuve + Evidence Pack",
  description:
    "Middleware Next/Express, ingest 1 ligne, webhook shield.tap.created, Evidence Pack banques. Payload jamais stocké.",
  summary:
    "Shield v0.4 — withShieldTap / expressShieldTap / instrumentFetch, auto-tap CFU ?shield=1, pack banques avec generation_source, audit + reseal Premium.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS Shield",
    "evidence pack RWA",
    "instrumentFetch",
    "withShieldTap",
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
    {
      key: "Easy",
      value: "ingest · instrumentFetch · withShieldTap · expressShieldTap",
    },
    { key: "Free", value: "100 taps/mo + verify public + CBOM + demo" },
    {
      key: "Premium",
      value: "pack · audit · reseal · export?shield=1",
    },
    { key: "Package", value: "@adrien1212balitrand/auros-shield@0.4.0" },
  ],
  faq: [
    {
      question: "Est-ce facile à intégrer ?",
      answer:
        "Oui : UI demo, curl, instrumentFetch, withShieldTap (Next) ou expressShieldTap — sans rewrite métier.",
    },
    {
      question: "Que paie-t-on en Premium ?",
      answer:
        "Evidence Pack (CFU + taps + generation_source), audit log, reseal PQC, auto-tap export — livrable crédit/ESG.",
    },
  ],
  breadcrumbs: [{ name: "Developers", path: "/developers" }],
  relatedPaths: [
    "/developers/shield/banks",
    "/developers/shield/case-study",
    "/developers/institutions",
    "/api/v1/shield/ingest",
    "/auros-openapi.yaml",
  ],
});

export const shieldBanksPage = enrichPage({
  id: "developers-shield-banks",
  path: "/developers/shield/banks",
  title: "Evidence Pack banque | AUROS Shield",
  description:
    "Joindre un Evidence Pack hash-only au dossier crédit / ESG — sans data room.",
  summary:
    "Pack scellé CFU + taps + bank_actions + SLA indicatif pour risk/credit.",
  contentType: "guide",
  language: "fr",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: ["Evidence Pack", "banque", "RWA", "AUROS Shield"],
  intents: ["Comment joindre une preuve RWA au dossier crédit ?"],
  audience: ["banques", "risk", "ESG"],
  facts: [
    { key: "API", value: "POST /api/v1/shield/pack" },
    {
      key: "Exemple",
      value: "/examples/shield-evidence-pack.example.json",
    },
  ],
  faq: [
    {
      question: "Faut-il ouvrir la data room ?",
      answer:
        "Non — le pack est hash-only ; re-verify public via /api/v1/shield/verify.",
    },
  ],
  breadcrumbs: [
    { name: "Developers", path: "/developers" },
    { name: "Shield", path: "/developers/shield" },
  ],
  relatedPaths: [
    "/developers/shield",
    "/developers/shield/case-study",
    "/power",
  ],
});

export const shieldCaseStudyPage = enrichPage({
  id: "developers-shield-case-study",
  path: "/developers/shield/case-study",
  title: "Case study — Flotte EV → CFU → Shield → banque",
  description:
    "Parcours concret sessions de charge, CFU, Proof Tap, Evidence Pack crédit.",
  summary: "Opérateur mint CFU → export?shield=1 → banque pack Premium.",
  contentType: "guide",
  language: "fr",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: ["ChargeFlow", "Shield", "flotte EV", "Evidence Pack"],
  intents: ["Comment prouver la charge EV à une banque ?"],
  audience: ["flotte", "banques", "énergie"],
  facts: [
    { key: "Export", value: "GET /api/v1/chargeflow/export?shield=1" },
  ],
  faq: [],
  breadcrumbs: [
    { name: "Developers", path: "/developers" },
    { name: "Shield", path: "/developers/shield" },
  ],
  relatedPaths: [
    "/developers/shield/banks",
    "/green/chargeflow/console",
    "/power",
  ],
});

export const shieldPages = [shieldPage, shieldBanksPage, shieldCaseStudyPage];
