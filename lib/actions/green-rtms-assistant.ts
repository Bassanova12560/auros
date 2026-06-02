"use server";

import {
  MIN_SUMMARY_WORDS,
  computePreliminaryRtmsFromSummary,
  countSummaryWords,
} from "@/lib/green/rtms-assistant";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type AnalyzeRtmsPreliminaryInput = {
  projectSummary: string;
  country?: string;
  hasDocument: boolean;
};

export type AnalyzeRtmsPreliminaryResult =
  | { ok: true; score: GreenRtmsScore; wordCount: number }
  | { ok: false; error: "invalid" | "rate_limit" };

export async function analyzeRtmsPreliminaryAction(
  input: AnalyzeRtmsPreliminaryInput
): Promise<AnalyzeRtmsPreliminaryResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-rtms-assistant:${ip}`, 8, 3_600_000);
  if (!allowed) return { ok: false, error: "rate_limit" };

  const summary = input.projectSummary?.trim() ?? "";
  const wordCount = countSummaryWords(summary);
  if (wordCount < MIN_SUMMARY_WORDS) {
    return { ok: false, error: "invalid" };
  }

  const score = computePreliminaryRtmsFromSummary({
    projectSummary: summary,
    country: input.country?.trim(),
    hasDocument: Boolean(input.hasDocument),
  });

  return { ok: true, score, wordCount };
}
