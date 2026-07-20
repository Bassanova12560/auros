import { enrichPage } from "../enrich";

export const shieldPage = enrichPage({
  id: "developers-shield",
  path: "/developers/shield",
  title: "AUROS Shield | Sous-couche crypto on-prem",
  description:
    "Runtime on-prem pour sceller CFU/attest avec clés locales, CBOM et enveloppes PQC-ready. Indicatif — pas une certification HSM.",
  summary:
    "AUROS Shield est la racine de confiance installée chez le client (comme une appliance quantum-safe) : seal/verify local, CBOM crypto, agilité vers hybrid PQC — Protocol reste le cloud.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS Shield",
    "on-prem attestation",
    "CBOM crypto RWA",
    "post-quantum ready RWA",
    "clés locales banque",
  ],
  intents: [
    "Comment garder les clés CFU on-prem ?",
    "CBOM crypto pour audit banque",
    "Préparer la migration PQC des preuves RWA",
  ],
  audience: ["banques", "CISO", "risk", "énergie", "développeurs"],
  facts: [
    { key: "Package", value: "@adrien1212balitrand/auros-shield" },
    { key: "CBOM sample", value: "/api/v1/shield/cbom" },
    { key: "Docs", value: "docs/AUROS-SHIELD.md" },
  ],
  faq: [
    {
      question: "Shield remplace-t-il Protocol cloud ?",
      answer:
        "Non. Protocol score/compare/monitor reste cloud. Shield scelle et vérifie localement avec la clé client.",
    },
    {
      question: "Est-ce déjà post-quantique certifié ?",
      answer:
        "Non. v0.1 livre HMAC + profils hybrid_pqc_ready. ML-DSA/ML-KEM sont en roadmap derrière la même enveloppe.",
    },
  ],
  breadcrumbs: [{ name: "Developers", path: "/developers" }],
  relatedPaths: [
    "/developers/institutions",
    "/developers",
    "/api/v1/shield/cbom",
    "/auros-openapi.yaml",
  ],
});
