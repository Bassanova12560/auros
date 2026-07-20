import { enrichPage } from "../enrich";

export const institutionsPage = enrichPage({
  id: "developers-institutions",
  path: "/developers/institutions",
  title: "AUROS Protocol pour institutions | Banques & risque",
  description:
    "OpenAPI, export CFU, Monitor, Watts Reserve — pack API pour banques et équipes risque. Indicatif, pas un agrément bancaire.",
  summary:
    "Surface institutionnelle AUROS Protocol : export portfolio CFU, Watts, ChargeFlow, Monitor/webhooks et licence data — sans claim CASP ou conseil d'investissement.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS API banque",
    "export CFU audit",
    "RWA API institutionnel",
    "ChargeFlow portfolio",
    "OpenAPI tokenisation",
  ],
  intents: [
    "Comment une banque intègre AUROS ?",
    "Exporter un portefeuille CFU",
    "API Watts pour credit book",
  ],
  audience: ["banques", "risk", "ESG", "fintech", "développeurs"],
  facts: [
    { key: "Export", value: "GET /api/v1/chargeflow/export" },
    { key: "OpenAPI", value: "/auros-openapi.yaml" },
    { key: "Power", value: "/power — low-carbon / nucléaire" },
  ],
  faq: [
    {
      question: "AUROS est-il agréé comme banque ou CASP ?",
      answer:
        "Non. Protocol fournit des API et preuves off-chain indicatives. Pas d'agrément bancaire, pas de conseil d'investissement.",
    },
    {
      question: "Quel endpoint pour un pack audit CFU ?",
      answer:
        "GET /api/v1/chargeflow/export?format=json|csv (Premium) — portfolio des unités de la clé API.",
    },
  ],
  breadcrumbs: [{ name: "Developers", path: "/developers" }],
  relatedPaths: [
    "/developers",
    "/auros-openapi.yaml",
    "/power",
    "/green/watts",
    "/data/licence",
  ],
});

export const powerHubPage = enrichPage({
  id: "power-hub",
  path: "/power",
  title: "AUROS Power | Low-carbon & nucléaire",
  description:
    "Verticale low-carbon power — nucléaire et bas-carbone via Watts + ChargeFlow, hors Green Verified. Indicatif, pas un GO/REC.",
  summary:
    "AUROS Power sépare le low-carbon / nucléaire du label Green Verified. Booking Watts, CFU, API institutions.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS Power",
    "low-carbon power",
    "nucléaire RWA",
    "énergie bas carbone tokenisation",
  ],
  intents: [
    "Tokeniser de l'énergie nucléaire",
    "Différence Power vs Green Verified",
    "generation_source nuclear",
  ],
  audience: ["banques", "producteurs", "émetteurs", "ESG"],
  facts: [
    { key: "Hub", value: "/power" },
    { key: "Guide", value: "/guides/low-carbon-power" },
    { key: "Wizard path", value: "/comment-tokeniser/nucleaire" },
  ],
  faq: [
    {
      question: "Power remplace-t-il Green ?",
      answer:
        "Non. Green = renouvelable / RTMS / Verified. Power = low-carbon adjacent (nucléaire inclus) sans badge Verified.",
    },
  ],
  breadcrumbs: [],
  relatedPaths: [
    "/guides/low-carbon-power",
    "/green/watts",
    "/developers/institutions",
    "/comment-tokeniser/nucleaire",
    "/green",
  ],
});

export const institutionalPages = [institutionsPage, powerHubPage];
