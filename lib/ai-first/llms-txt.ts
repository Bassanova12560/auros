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
    "- **Comparateurs rendements** — /compare, /stablecoins, /real-estate, /bonds, /commodities, /private-credit",
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
