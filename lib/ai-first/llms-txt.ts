import { absoluteUrl } from "@/lib/comparators/site";

import type { AiFirstPage } from "./types";

export function buildLlmsTxt(pages: AiFirstPage[], full = false): string {
  const indexable = pages.filter((p) => p.indexable);
  const lines: string[] = [
    "# AUROS",
    "> Plateforme B2B tokenisation RWA — comparateur juridictions, dossier actif gratuit, Starter Kit juridiction 5 000 €.",
    "",
    "## Discovery (machine-readable)",
    `- Catalog JSON: ${absoluteUrl("/ai-first/index.json")}`,
    `- Per-page JSON: ${absoluteUrl("/ai-first/page.json")}?path={path}`,
    `- RAG search: ${absoluteUrl("/ai-first/rag")}?q={question}`,
    `- About: ${absoluteUrl("/about")}`,
    `- Humans: ${absoluteUrl("/humans.txt")}`,
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    "## Primary products",
    "- **AUROS Academy** — /academy : certification RWA gratuite + parcours praticien/entreprise",
    "- **Gratuit** — Wizard + dossier actif (/wizard) : « Mon actif est-il tokenisable ? »",
    "- **Gratuit** — Comparateur 8 juridictions (/jurisdictions) : « Où structurer mon émission RWA ? »",
    "- **5 000 €** — Starter Kit phase 0 (/jurisdictions/starter-kit) : memo juridiction SPV + régulateur",
    "- **Tarifs** — /pricing : grille Gratuit · Starter Kit 5 000 € · Launch sur devis",
    "- **Comparateurs rendements** — /compare, /stablecoins, /real-estate, /bonds, /commodities, /private-credit",
    "",
    "## AUROS Green (tokenisation énergie)",
    "- **Hub** — /green : marketplace mondiale, standard RTMS, label Verified",
    "- **CSRD Checker** — /green/csrd-check : scope CSRD + score préparation (~2 min, gratuit)",
    "- **Impact Report** — /green/impact-report : PDF EU Taxonomy + RTMS (49 € / 199 €)",
    "- **Comparateur green RWA** — /green/compare : références sourcées, statuts honnêtes",
    "- **Assistant RTMS** — /green/rtms-assistant : pré-diagnostic documentaire indicatif",
    "",
    "## AUROS Protocol API (développeurs)",
    "- **Hub API** — /developers : playground, quickstart, clé gratuite 100 req/mois",
    "- **Base URL** — api.getauros.com/v1/* (alias getauros.com/api/v1/*)",
    "- **Documentation** — /developers/docs : auth Bearer, score, products, compare, checklist",
    "- **Changelog** — /developers/changelog : releases v1 + feed JSON /api/v1/changelog",
    "- **OpenAPI** — /auros-openapi.yaml · Postman /auros-postman.json",
    "",
    "## Key pages",
  ];

  for (const p of indexable) {
    if (p.contentType === "landing" && !full) continue;
    lines.push(`- [${p.title}](${p.canonicalUrl}): ${p.summary.slice(0, 160)}…`);
    lines.push(`  - Machine: ${p.machineUrl}`);
  }

  if (full) {
    lines.push("", "## SEO landings (jurisdiction × asset)");
    for (const p of indexable.filter((x) => x.contentType === "landing")) {
      lines.push(`### ${p.path}`);
      lines.push(p.summary);
      for (const f of p.facts) {
        lines.push(`- ${f.key}: ${f.value}`);
      }
      lines.push("");
    }

    lines.push("## FAQ juridictions (extrait)");
    const j = pages.find((x) => x.id === "jurisdictions");
    for (const item of j?.faq?.slice(0, 6) ?? []) {
      lines.push(`Q: ${item.question}`);
      lines.push(`A: ${item.answer}`);
      lines.push("");
    }
  }

  lines.push(
    "",
    "## Optional",
    "- Contact leads: adrien.balitrand@gmail.com",
    "- Langues UI: fr, en, es",
    "- Disclaimer: analyses indicatives — validation counsel requise avant émission.",
    ""
  );

  return lines.join("\n");
}
