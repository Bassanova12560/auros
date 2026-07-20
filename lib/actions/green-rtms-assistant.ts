"use server";

import { analyzeRtmsWithAi, hasRtmsAiProvider } from "@/lib/green/rtms-ai";
import {
  MIN_SUMMARY_WORDS,
  computePreliminaryRtmsFromSummary,
  countSummaryWords,
} from "@/lib/green/rtms-assistant";
import {
  extractRtmsPdfText,
  validateRtmsPdfFile,
} from "@/lib/green/rtms-pdf";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";
import type { Locale } from "@/lib/i18n";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type RtmsAnalysisProvider =
  | "gemini"
  | "groq"
  | "mistral"
  | "openrouter"
  | "rules";

export type AnalyzeRtmsPreliminaryResult =
  | {
      ok: true;
      score: GreenRtmsScore;
      wordCount: number;
      provider: RtmsAnalysisProvider;
      documentChars?: number;
      insight?: string;
    }
  | { ok: false; error: "invalid" | "rate_limit" | "file_type" | "file_size" };

function parseLocale(raw: FormDataEntryValue | null): Locale {
  const v = String(raw ?? "").trim();
  if (v === "en" || v === "es" || v === "fr") return v;
  return "fr";
}

export async function analyzeRtmsPreliminaryAction(
  formData: FormData
): Promise<AnalyzeRtmsPreliminaryResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-rtms-assistant:${ip}`, 8, 3_600_000);
  if (!allowed) return { ok: false, error: "rate_limit" };

  const summary = String(formData.get("projectSummary") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim() || undefined;
  const locale = parseLocale(formData.get("locale"));
  const file = formData.get("document");

  const wordCount = countSummaryWords(summary);
  if (wordCount < MIN_SUMMARY_WORDS) {
    return { ok: false, error: "invalid" };
  }

  let documentText: string | undefined;
  let hasDocument = false;

  if (file instanceof File && file.size > 0) {
    const fileCheck = validateRtmsPdfFile(file);
    if (fileCheck === "file_size") return { ok: false, error: "file_size" };
    if (fileCheck === "file_type") return { ok: false, error: "file_type" };

    hasDocument = true;
    const buffer = Buffer.from(await file.arrayBuffer());
    const extracted = await extractRtmsPdfText(buffer);
    if (extracted) documentText = extracted;
  }

  const ruleScore = computePreliminaryRtmsFromSummary({
    projectSummary: summary,
    country,
    hasDocument,
    documentText,
  });

  let score = ruleScore;
  let provider: RtmsAnalysisProvider = "rules";
  let insight: string | undefined;

  if (hasRtmsAiProvider()) {
    const ai = await analyzeRtmsWithAi(
      { projectSummary: summary, country, documentText, locale },
      ruleScore
    );
    score = ai.score;
    provider = ai.provider;
    insight = ai.insight;
  }

  return {
    ok: true,
    score,
    wordCount,
    provider,
    documentChars: documentText?.length,
    insight,
  };
}
