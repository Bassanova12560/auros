import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import { getJurisdictionMessages, jurisdictionLabel } from "@/lib/jurisdictions/i18n";

import { getAllAiFirstPages } from "../catalog";
import type { AiFirstPage } from "../types";
import type { RagChunk, RagChunkType } from "./types";

const CHUNK_BOOST: Record<RagChunkType, number> = {
  intent: 1.5,
  faq: 1.4,
  summary: 1.25,
  jurisdiction: 1.2,
  fact: 1.1,
  keyword: 1.0,
};

let cachedChunks: RagChunk[] | null = null;

function pushChunk(
  chunks: RagChunk[],
  page: AiFirstPage,
  chunkType: RagChunkType,
  text: string,
  suffix: string
): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  chunks.push({
    id: `${page.id}:${chunkType}:${suffix}`,
    pageId: page.id,
    path: page.path,
    title: page.title,
    chunkType,
    text: trimmed,
    canonicalUrl: page.canonicalUrl,
    machineUrl: page.machineUrl,
  });
}

function chunksFromPage(page: AiFirstPage): RagChunk[] {
  const out: RagChunk[] = [];
  pushChunk(out, page, "summary", page.summary, "0");
  pushChunk(out, page, "summary", `${page.title}. ${page.description}`, "1");

  for (const [i, intent] of page.intents.entries()) {
    pushChunk(out, page, "intent", intent, String(i));
  }

  for (const [i, fact] of page.facts.entries()) {
    pushChunk(out, page, "fact", `${fact.key}: ${fact.value}`, String(i));
  }

  for (const [i, item] of (page.faq ?? []).entries()) {
    pushChunk(
      out,
      page,
      "faq",
      `Q: ${item.question}\nA: ${item.answer}`,
      String(i)
    );
  }

  if (page.keywords.length) {
    pushChunk(
      out,
      page,
      "keyword",
      `Keywords: ${page.keywords.join(", ")}`,
      "0"
    );
  }

  for (const [i, offer] of (page.offers ?? []).entries()) {
    pushChunk(
      out,
      page,
      "fact",
      `${offer.name} — ${offer.price} ${offer.priceCurrency}: ${offer.description}`,
      `offer-${i}`
    );
  }

  return out;
}

function jurisdictionChunks(): RagChunk[] {
  const messages = getJurisdictionMessages("fr");
  const page = getAllAiFirstPages().find((p) => p.id === "jurisdictions");
  if (!page) return [];

  return JURISDICTIONS.map((j) => {
    const name = jurisdictionLabel(messages, j.id);
    const aliases =
      j.id === "dubai-difc"
        ? "DIFC Dubai VARA"
        : j.id === "luxembourg"
          ? "Luxembourg CSSF"
          : "";
    const text = [
      `Juridiction ${name} (${j.id})${aliases ? ` — ${aliases}` : ""}`,
      `Frais indicatifs: ${j.feeMinEur.toLocaleString("fr-FR")}–${j.feeMaxEur.toLocaleString("fr-FR")} EUR (médiane ~${j.totalCostMid.toLocaleString("fr-FR")} EUR)`,
      `Délai licence: ${j.delayMinMonths}–${j.delayMaxMonths} mois (max licence ~${j.licenseMaxMonths} mois)`,
      `Licence: ${messages.licenses[j.licenseKey]}`,
      `Fiscalité investisseur: ${messages.tax[j.taxKey]}`,
      `KYC: ${j.kycLevel}`,
      `Actifs: ${messages.assets[j.assetsKey]}`,
      `Score AUROS: ${j.score}/5`,
      j.recommended ? "Recommandée AUROS" : null,
    ]
      .filter(Boolean)
      .join(". ");

    return {
      id: `jurisdiction:${j.id}`,
      pageId: page.id,
      path: page.path,
      title: page.title,
      chunkType: "jurisdiction" as const,
      text,
      canonicalUrl: page.canonicalUrl,
      machineUrl: page.machineUrl,
    };
  });
}

export function getRagChunks(): RagChunk[] {
  if (cachedChunks) return cachedChunks;

  const pages = getAllAiFirstPages().filter((p) => p.indexable);
  cachedChunks = [
    ...pages.flatMap(chunksFromPage),
    ...jurisdictionChunks(),
  ];
  return cachedChunks;
}

export function chunkTypeBoost(type: RagChunkType): number {
  return CHUNK_BOOST[type] ?? 1;
}
