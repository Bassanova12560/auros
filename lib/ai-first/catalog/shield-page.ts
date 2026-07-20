import { enrichPage } from "../enrich";

export const shieldPage = enrichPage({
  id: "developers-shield",
  path: "/developers/shield",
  title: "AUROS Shield | Proof Tap RWA freemium",
  description:
    "Proof Tap non invasif : hash only, verify contrepartie gratuit, ancrage cloud freemium. Sous-couche indispensable RWA — clés on-prem + co-sceau AUROS.",
  summary:
    "AUROS Shield est la couche de preuve RWA freemium : tap sidecar (payload jamais stocké), verify public illimité, Premium pour taps illimités et hybrid PQC-ready.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS Shield",
    "proof tap RWA",
    "vérification contrepartie",
    "CBOM crypto",
    "freemium attestation",
  ],
  intents: [
    "Comment sceller un export RWA sans exposer les données ?",
    "Verify contrepartie gratuit AUROS Shield",
    "Freemium vs Premium Shield",
  ],
  audience: ["banques", "CISO", "risk", "énergie", "développeurs"],
  facts: [
    { key: "Free", value: "100 taps/mo + verify public + CBOM" },
    { key: "Tap API", value: "POST /api/v1/shield/tap" },
    { key: "Verify", value: "POST /api/v1/shield/verify" },
    { key: "Package", value: "@adrien1212balitrand/auros-shield@0.2.0" },
  ],
  faq: [
    {
      question: "Le payload est-il stocké ?",
      answer:
        "Non. Shield hashe puis jette. Seuls content_hash + signatures sont retenus (payload_retained: false).",
    },
    {
      question: "Quoi de gratuit vs Premium ?",
      answer:
        "Gratuit : 100 ancrages/mois, verify public illimité, CBOM, runtime on-prem. Premium : taps illimités, hybrid_pqc_ready, export registre.",
    },
  ],
  breadcrumbs: [{ name: "Developers", path: "/developers" }],
  relatedPaths: [
    "/developers/institutions",
    "/developers",
    "/api/v1/shield/cbom",
    "/api/v1/shield/tap",
    "/auros-openapi.yaml",
  ],
});
