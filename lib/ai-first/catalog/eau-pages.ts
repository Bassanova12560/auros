import { EAU_ROUTE } from "@/lib/eau/constants";
import { getEauHubCopy } from "@/lib/eau/i18n";

import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";

export function buildEauHubPage(): AiFirstPage {
  const copy = getEauHubCopy("fr");

  return enrichPage({
    id: "eau-hub",
    path: EAU_ROUTE,
    title: copy.title,
    description: copy.description,
    summary: `${copy.intro} ${copy.pillars.join(" ")}`,
    contentType: "landing",
    language: "multi",
    indexable: true,
    lastUpdated: "2026-07-21",
    keywords: [
      "passeport hydrique",
      "tokenisation eau",
      "H2O score",
      "droits eau tokenisés",
      "blue bond hydrique",
      "concession eau potable RWA",
      "hydrological passport",
    ],
    intents: [
      "Comment obtenir un passeport hydrique vérifiable",
      "Scorer un actif hydrique avant tokenisation",
      "API due diligence eau concession",
    ],
    audience: ["utilities", "family office", "émetteurs RWA", "arrangeurs blue bond"],
    facts: [
      { key: "H₂O Score public", value: "/api/green/h2o/pilot-concession-france" },
      { key: "Batch API premium", value: "/api/v1/green/h2o/batch" },
      { key: "Check embed", value: "POST /api/eau/check" },
      { key: "WELHR", value: "POST /api/green/eau/legal-risk" },
      { key: "Resilience API", value: "GET /api/green/eau/resilience" },
      { key: "Playbook API", value: "POST /api/green/eau/continuity-playbook" },
      ...copy.pillars.map((p, i) => ({ key: `Pilier ${i + 1}`, value: p })),
    ],
    faq: [
      {
        question: "Qu'est-ce que le passeport hydrique AUROS Eau ?",
        answer:
          "Un parcours de due diligence hydrique : H₂O Score public, check embed, et prep tokenisation / blue bond. Hub : /eau. Analyses indicatives — counsel requis.",
      },
      {
        question: "Comment scorer un actif hydrique ?",
        answer:
          "API publique /api/green/h2o/{id} et batch Premium /api/v1/green/h2o/batch. L'embed /eau/embed permet un check rapide côté site partenaire.",
      },
      {
        question: "Lien avec ChargeFlow CFU-W ?",
        answer:
          "CFU-W (/eau/chargeflow) est l'unité ChargeFlow hydrique. Eau reste le hub score/passeport ; ChargeFlow fournit la preuve unitaire vérifiable.",
      },
    ],
    relatedPaths: [
      "/comment-tokeniser/eau",
      "/h2o-rwa",
      "/resilience",
      "/eau/risk",
      "/eau/continuity",
      "/eau/trust",
      "/eau/chargeflow",
      "/green/registry",
      "/green/label",
      "/green/impact-report",
      "/green/api",
      "/developers/docs/endpoint-green-h2o",
      "/eau/embed/docs",
      "/glossary/tokenisation-eau",
    ],
  });
}
