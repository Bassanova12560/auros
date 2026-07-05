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
    lastUpdated: "2026-07-05",
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
      ...copy.pillars.map((p, i) => ({ key: `Pilier ${i + 1}`, value: p })),
    ],
    relatedPaths: [
      "/comment-tokeniser/eau",
      "/green/registry",
      "/green/label",
      "/green/impact-report",
      "/developers/docs/endpoint-green-h2o",
      "/eau/embed/docs",
      "/glossary/tokenisation-eau",
    ],
  });
}
