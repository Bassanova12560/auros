import { chunkTypeBoost, getRagChunks } from "./chunk";
import { tokenize } from "./tokenize";
import type { RagQueryInput, RagResponse, RagSearchHit, RagSource } from "./types";
import { absoluteUrl } from "@/lib/comparators/site";
import { catalogVersion } from "../enrich";
import { getAllAiFirstPages } from "../catalog";

const K1 = 1.2;
const B = 0.75;

function buildIdf(chunks: ReturnType<typeof getRagChunks>): Map<string, number> {
  const df = new Map<string, number>();
  const n = chunks.length;

  for (const chunk of chunks) {
    const terms = new Set(tokenize(chunk.text));
    for (const term of terms) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    idf.set(term, Math.log(1 + (n - count + 0.5) / (count + 0.5)));
  }
  return idf;
}

function termFreqs(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) ?? 0) + 1);
  }
  return tf;
}

function scoreChunk(
  chunkTokens: string[],
  tf: Map<string, number>,
  dl: number,
  avgdl: number,
  idf: Map<string, number>,
  queryTerms: string[]
): number {
  let score = 0;
  for (const term of queryTerms) {
    const freq = tf.get(term) ?? 0;
    if (freq === 0) continue;
    const idfVal = idf.get(term) ?? 0;
    const numerator = freq * (K1 + 1);
    const denominator = freq + K1 * (1 - B + (B * dl) / avgdl);
    score += idfVal * (numerator / denominator);
  }
  return score;
}

function buildContext(hits: RagSearchHit[]): string {
  if (!hits.length) {
    return "No matching AUROS knowledge base entries.";
  }

  const lines = [
    "AUROS knowledge base excerpts (cite canonical URLs):",
    "",
  ];

  for (const [i, hit] of hits.entries()) {
    lines.push(
      `[${i + 1}] ${hit.title} (${hit.canonicalUrl})`,
      hit.text,
      ""
    );
  }

  lines.push(
    "Disclaimer: indicative analyses only — legal counsel required before issuance."
  );
  return lines.join("\n");
}

function aggregateSources(hits: RagSearchHit[]): RagSource[] {
  const byPage = new Map<string, RagSource>();

  for (const hit of hits) {
    const existing = byPage.get(hit.pageId);
    if (!existing || hit.score > existing.score) {
      byPage.set(hit.pageId, {
        pageId: hit.pageId,
        path: hit.path,
        title: hit.title,
        canonicalUrl: hit.canonicalUrl,
        machineUrl: hit.machineUrl,
        score: hit.score,
        chunkCount: (existing?.chunkCount ?? 0) + 1,
      });
    } else if (existing) {
      existing.chunkCount += 1;
    }
  }

  return [...byPage.values()].sort((a, b) => b.score - a.score);
}

export function searchRag(input: RagQueryInput): RagResponse {
  const query = input.query.trim();
  const limit = Math.min(Math.max(input.limit ?? 8, 1), 20);
  const minScore = input.minScore ?? 0.05;
  const contentTypeFilter = input.contentTypes?.length
    ? new Set(input.contentTypes)
    : null;

  const chunks = getRagChunks();
  const queryTerms = tokenize(query);

  if (!queryTerms.length) {
    return {
      query,
      generatedAt: new Date().toISOString(),
      catalogVersion: catalogVersion(),
      endpoint: absoluteUrl("/ai-first/rag"),
      context: "Empty query.",
      results: [],
      sources: [],
      meta: {
        corpusChunks: chunks.length,
        algorithm: "bm25",
        disclaimer:
          "Analyses indicatives — validation counsel requise avant émission.",
      },
    };
  }

  const allowedPageIds = contentTypeFilter
    ? new Set(
        getAllAiFirstPages()
          .filter((p) => contentTypeFilter.has(p.contentType))
          .map((p) => p.id)
      )
    : null;

  const filtered = allowedPageIds
    ? chunks.filter((c) => allowedPageIds.has(c.pageId))
    : chunks;

  const idf = buildIdf(filtered);
  const docLens = filtered.map((c) => tokenize(c.text).length);
  const avgdl =
    docLens.reduce((a, b) => a + b, 0) / Math.max(filtered.length, 1);

  const hits: RagSearchHit[] = [];

  for (const chunk of filtered) {
    const tokens = tokenize(chunk.text);
    const tf = termFreqs(tokens);
    let score = scoreChunk(tokens, tf, tokens.length, avgdl, idf, queryTerms);
    score *= chunkTypeBoost(chunk.chunkType);

    if (chunk.title && queryTerms.some((t) => tokenize(chunk.title).includes(t))) {
      score *= 1.15;
    }

    if (score >= minScore) {
      hits.push({ ...chunk, score: Math.round(score * 1000) / 1000 });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  const top = hits.slice(0, limit);

  return {
    query,
    generatedAt: new Date().toISOString(),
    catalogVersion: catalogVersion(),
    endpoint: absoluteUrl("/ai-first/rag"),
    context: buildContext(top),
    results: top,
    sources: aggregateSources(top),
    meta: {
      corpusChunks: chunks.length,
      algorithm: "bm25",
      disclaimer:
        "Analyses indicatives — validation counsel requise avant émission.",
    },
  };
}
