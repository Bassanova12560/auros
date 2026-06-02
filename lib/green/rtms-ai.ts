/**
 * Optional LLM RTMS pre-analysis — indicative only, not certification.
 * Falls back to caller's rule-based score when no provider or parse failure.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mistral } from "@mistralai/mistralai";
import Groq from "groq-sdk";

import { AI_CONFIG, resolveProviderChain, type BillableAiProvider } from "@/lib/ai-config";
import type { Locale } from "@/lib/i18n";

import { GREEN_RTMS_PILLARS, type GreenRtmsPillar } from "./constants";
import type { GreenRtmsScore, GreenRtmsTier, RtmsCheck } from "./rtms-scoring";

export type RtmsAiProvider = BillableAiProvider | "rules";

export type RtmsAiAnalysisResult = {
  score: GreenRtmsScore;
  provider: RtmsAiProvider;
  insight?: string;
};

const CHECK_IDS: Record<GreenRtmsPillar, readonly string[]> = {
  real: ["production_signal", "summary_depth", "supporting_doc"],
  transparent: ["traceability", "stakeholders", "disclosure"],
  measurable: ["impact_metrics", "methodology", "document_upload"],
  sound: ["jurisdiction", "legal_mentions", "risk_ack"],
};

const OUTPUT_LANGUAGE: Record<Locale, string> = {
  fr: "French",
  en: "English",
  es: "Spanish",
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

function extractJson(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model response");
  return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
}

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number.parseInt(String(n ?? ""), 10);
  if (!Number.isFinite(v)) return 0;
  return Math.min(100, Math.max(0, Math.round(v)));
}

function parseTier(raw: unknown, overall: number): GreenRtmsTier {
  if (raw === "ready" || raw === "progress" || raw === "early") return raw;
  if (overall >= 75) return "ready";
  if (overall >= 50) return "progress";
  return "early";
}

function parseAiRtmsScore(raw: string): GreenRtmsScore {
  const parsed = extractJson(raw);
  const pillarsRaw = parsed.pillars;
  if (!pillarsRaw || typeof pillarsRaw !== "object") {
    throw new Error("Missing pillars");
  }

  const pillars = {} as GreenRtmsScore["pillars"];
  for (const pillar of GREEN_RTMS_PILLARS) {
    const block = (pillarsRaw as Record<string, unknown>)[pillar];
    if (!block || typeof block !== "object") throw new Error(`Missing pillar ${pillar}`);
    const obj = block as Record<string, unknown>;
    const checksRaw = Array.isArray(obj.checks) ? obj.checks : [];
    const expected = CHECK_IDS[pillar];
    const checks: RtmsCheck[] = expected.map((id, i) => {
      const item = checksRaw[i];
      if (item && typeof item === "object" && "pass" in item) {
        return { id, pass: Boolean((item as { pass?: unknown }).pass) };
      }
      return { id, pass: false };
    });
    const computed = checks.length
      ? Math.round((checks.filter((c) => c.pass).length / checks.length) * 100)
      : 0;
    pillars[pillar] = {
      pillar,
      score: clampScore(obj.score ?? computed) || computed,
      checks,
    };
  }

  const overall =
    clampScore(parsed.overall) ||
    Math.round(
      GREEN_RTMS_PILLARS.reduce((sum, p) => sum + pillars[p].score, 0) /
        GREEN_RTMS_PILLARS.length
    );

  return {
    overall,
    tier: parseTier(parsed.tier, overall),
    pillars,
  };
}

function buildRtmsAiPrompt(input: {
  projectSummary: string;
  country?: string;
  documentText?: string;
  locale: Locale;
}): string {
  const language = OUTPUT_LANGUAGE[input.locale] ?? OUTPUT_LANGUAGE.fr;
  const doc = (input.documentText ?? "").slice(0, AI_CONFIG.maxDescriptionChars);
  const summary = input.projectSummary.slice(0, AI_CONFIG.maxDescriptionChars);

  return `You are an AUROS Green RTMS advisor. Grade this renewable / green asset dossier PRELIMINARILY using the RTMS pillars:
Real (production evidence), Transparent (traceability & stakeholders), Measurable (impact metrics & methodology), Sound (jurisdiction & legal).

Rules:
- Language for any insight string: ${language}
- Output ONLY valid JSON (no markdown)
- Indicative educational scoring — NOT certification
- Score each pillar 0-100 from check pass rate
- Be conservative: missing evidence = fail

Required JSON shape:
{
  "overall": 0-100,
  "tier": "early"|"progress"|"ready",
  "insight": "one sentence summary of top gap",
  "pillars": {
    "real": { "score": 0-100, "checks": [{"id":"production_signal","pass":bool},{"id":"summary_depth","pass":bool},{"id":"supporting_doc","pass":bool}] },
    "transparent": { "score": 0-100, "checks": [{"id":"traceability","pass":bool},{"id":"stakeholders","pass":bool},{"id":"disclosure","pass":bool}] },
    "measurable": { "score": 0-100, "checks": [{"id":"impact_metrics","pass":bool},{"id":"methodology","pass":bool},{"id":"document_upload","pass":bool}] },
    "sound": { "score": 0-100, "checks": [{"id":"jurisdiction","pass":bool},{"id":"legal_mentions","pass":bool},{"id":"risk_ack","pass":bool}] }
  }
}

Project summary:
${summary}

Country / jurisdiction: ${input.country?.trim() || "—"}

PDF excerpt (may be empty):
${doc || "—"}`;
}

async function callGroq(prompt: string): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: AI_CONFIG.groqDossierModel,
    temperature: 0.2,
    max_tokens: 1200,
    messages: [
      {
        role: "system",
        content: "You output only valid JSON. No markdown fences. Conservative RTMS grading.",
      },
      { role: "user", content: prompt },
    ],
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: AI_CONFIG.geminiModel,
    generationConfig: { maxOutputTokens: 1200, temperature: 0.2 },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callMistral(prompt: string): Promise<string> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("MISTRAL_API_KEY missing");
  const client = new Mistral({ apiKey: key });
  const response = await client.chat.complete({
    model: AI_CONFIG.mistralModel,
    maxTokens: 1200,
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === "string" ? c : (c as { text?: string }).text ?? ""))
      .join("");
  }
  return "";
}

const CALLERS: Record<BillableAiProvider, (prompt: string) => Promise<string>> = {
  groq: callGroq,
  gemini: callGemini,
  mistral: callMistral,
};

export function hasRtmsAiProvider(): boolean {
  return resolveProviderChain().length > 0;
}

export async function analyzeRtmsWithAi(
  input: {
    projectSummary: string;
    country?: string;
    documentText?: string;
    locale?: Locale;
  },
  fallbackScore: GreenRtmsScore
): Promise<RtmsAiAnalysisResult> {
  const chain = resolveProviderChain();
  if (!chain.length) {
    return { score: fallbackScore, provider: "rules" };
  }

  const prompt = buildRtmsAiPrompt({
    ...input,
    locale: input.locale ?? "fr",
  });
  const timeout = Math.min(AI_CONFIG.providerTimeoutMs, 18_000);
  const errors: string[] = [];

  for (const id of chain) {
    try {
      const raw = await withTimeout(CALLERS[id](prompt), timeout);
      const parsed = extractJson(raw);
      const score = parseAiRtmsScore(raw);
      const insight =
        typeof parsed.insight === "string" ? parsed.insight.trim().slice(0, 280) : undefined;
      return { score, provider: id, insight };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${id}: ${msg}`);
      console.warn("[rtms-ai] Provider failed:", id, msg);
    }
  }

  console.warn("[rtms-ai] Using rule-based fallback", errors.join("; "));
  return { score: fallbackScore, provider: "rules" };
}
