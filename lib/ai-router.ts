/**
 * Multi-provider AI router — quality-first
 * (Gemini Flash → Groq → Mistral → OpenRouter free).
 * Template fallback only when every provider fails or output fails quality checks.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mistral } from "@mistralai/mistralai";
import Groq from "groq-sdk";

import {
  AI_CONFIG,
  resolveGeminiApiKeys,
  resolveProviderChain,
  type BillableAiProvider,
} from "@/lib/ai-config";
import { isDossierQualityAcceptable } from "@/lib/ai-quality";
import { generateTemplateDossier } from "@/lib/ai-template-fallback";
import type { Locale } from "@/lib/i18n";
import { normalizeDocumentIds } from "@/lib/rwa-document-phases";
import { buildTokenizationStudioPlan } from "@/lib/studio";
import {
  GOAL_LABELS,
  type AiProvider,
  type DossierContent,
  type WizardData,
} from "@/lib/wizard-types";

export type { AiProvider };

const OUTPUT_LANGUAGE: Record<Locale, string> = {
  fr: "French",
  en: "English",
  es: "Spanish",
};

const DOSSIER_KEYS = [
  "legalDescription",
  "valuation",
  "dueDiligence",
  "kycPreFilled",
  "micaCompliance",
  "smartContract",
] as const;

export type GenerateDossierResult = DossierContent & { provider: AiProvider };

export type GenerateDossierOptions = {
  /** When daily cap is hit, still call Gemini (free) instead of skipping AI. */
  providersOnly?: BillableAiProvider[];
};

function buildPrompt(data: WizardData, locale: Locale = "fr"): string {
  const language = OUTPUT_LANGUAGE[locale] ?? OUTPUT_LANGUAGE.fr;
  const objectives =
    data.goals.map((g) => GOAL_LABELS[g] ?? g).join(", ") || "—";
  const documents = data.documents.length
    ? data.documents.join(", ")
    : "None provided";
  const description = (data.description ?? "").slice(
    0,
    AI_CONFIG.maxDescriptionChars
  );
  const notes = (data.additionalNotes ?? "").slice(0, 400);
  const legalStatus = data.legalStatus?.length
    ? data.legalStatus.join(", ")
    : "—";
  const docCount = normalizeDocumentIds(data.documents ?? []).length;
  const studio = buildTokenizationStudioPlan(data);

  return `You are a senior real-world asset (RWA) tokenization advisor writing for institutional readers.
Output ONLY valid JSON (no markdown) with exactly these keys:
legalDescription, valuation, dueDiligence, kycPreFilled, micaCompliance, smartContract

Rules:
- Language: ${language}
- Each section: 2 substantive paragraphs, ${AI_CONFIG.wordsPerSection} words total per section
- Reference THIS asset by type, location, value, documents, goals, platform — no generic boilerplate
- Mention concrete next steps, risks, and compliance angles (MiCA, KYC, permissioned tokens)
- Do not invent documents or figures not implied below

Asset profile:
- Type: ${data.assetType}
- Description: ${description}
- Value: ${data.estimatedValue} ${data.currency}
- Location: ${data.country}, ${data.city}
- Documents: ${documents}
- Goals: ${objectives}
- Timeline: ${data.timeline}
- Target platform: ${data.platform || "TBD"}
- Legal structure: ${data.legalStructure || "—"}
- Legal status flags: ${legalStatus}
- Investor profile: ${data.investorProfile || "—"}
- Income: ${data.incomeType || "—"} (${data.incomeAmountYear || 0}/year)
- Additional notes: ${notes || "—"}
- Data room progress: ${docCount}/15 standard due diligence documents declared
- Regulatory path (indicative): ${studio.regulatory.regime}
- Suggested instrument: ${studio.instrument}
- Token standard target: ${studio.tokenStandard.standard} on ${studio.tokenStandard.chain}`;
}

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
  if (start === -1 || end === -1) {
    throw new Error("No JSON object in model response");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
}

function parseDossierContent(raw: string): DossierContent {
  const parsed = extractJson(raw);
  const out = {} as DossierContent;
  for (const key of DOSSIER_KEYS) {
    const v = parsed[key];
    out[key] = typeof v === "string" ? v.trim() : "";
  }
  const hasContent = DOSSIER_KEYS.some((k) => out[k].length > 0);
  if (!hasContent) throw new Error("Empty dossier sections");
  return out;
}

async function callGroq(prompt: string): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: AI_CONFIG.groqDossierModel,
    temperature: 0.4,
    max_tokens: AI_CONFIG.maxOutputTokens,
    messages: [
      {
        role: "system",
        content:
          "You output only valid JSON. No markdown fences. Professional RWA tokenization tone.",
      },
      { role: "user", content: prompt },
    ],
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function callGemini(prompt: string): Promise<string> {
  const keys = resolveGeminiApiKeys();
  if (!keys.length) throw new Error("GEMINI_API_KEY missing");
  let lastErr: unknown;
  for (const key of keys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: AI_CONFIG.geminiModel,
        generationConfig: {
          maxOutputTokens: AI_CONFIG.maxOutputTokens,
          temperature: 0.4,
        },
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!/429|quota|Too Many Requests/i.test(msg)) throw err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Gemini failed");
}

async function callMistral(prompt: string): Promise<string> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("MISTRAL_API_KEY missing");
  const client = new Mistral({ apiKey: key });
  const response = await client.chat.complete({
    model: AI_CONFIG.mistralModel,
    maxTokens: AI_CONFIG.maxOutputTokens,
    temperature: 0.4,
    messages: [{ role: "user", content: prompt }],
  });
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) =>
        typeof c === "string" ? c : (c as { text?: string }).text ?? ""
      )
      .join("");
  }
  return "";
}

async function callOpenRouter(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) throw new Error("OPENROUTER_API_KEY missing");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://getauros.com",
      "X-Title": "AUROS",
    },
    body: JSON.stringify({
      model: AI_CONFIG.openrouterModel,
      temperature: 0.4,
      max_tokens: AI_CONFIG.maxOutputTokens,
      messages: [
        {
          role: "system",
          content:
            "You output only valid JSON. No markdown fences. Professional RWA tokenization tone.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenRouter HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? "";
}

const CALLERS: Record<
  BillableAiProvider,
  (prompt: string) => Promise<string>
> = {
  groq: callGroq,
  gemini: callGemini,
  mistral: callMistral,
  openrouter: callOpenRouter,
};

/**
 * Free-form completion for Copilot agents / light prompts.
 * Returns null when no provider is configured or all fail.
 */
export async function completeAiText(options: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<{ text: string; provider: BillableAiProvider } | null> {
  const chain = resolveProviderChain();
  const timeout = AI_CONFIG.providerTimeoutMs;
  const maxTokens = options.maxTokens ?? 900;

  for (const id of chain) {
    try {
      let raw: string;
      if (id === "openrouter") {
        raw = await withTimeout(
          callOpenRouterChat(options.system, options.user, maxTokens),
          timeout
        );
      } else if (id === "gemini") {
        raw = await withTimeout(
          callGeminiChat(options.system, options.user, maxTokens),
          timeout
        );
      } else if (id === "groq") {
        raw = await withTimeout(
          callGroqChat(options.system, options.user, maxTokens),
          timeout
        );
      } else {
        raw = await withTimeout(
          callMistralChat(options.system, options.user, maxTokens),
          timeout
        );
      }
      const text = raw.trim();
      if (text.length > 20) return { text, provider: id };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[ai-complete] Provider failed:", id, msg);
    }
  }
  return null;
}

async function callGeminiChat(
  system: string,
  user: string,
  maxTokens: number
): Promise<string> {
  const keys = resolveGeminiApiKeys();
  if (!keys.length) throw new Error("GEMINI_API_KEY missing");
  let lastErr: unknown;
  for (const key of keys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: AI_CONFIG.geminiModel,
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.35 },
      });
      const result = await model.generateContent(`${system}\n\n${user}`);
      return result.response.text();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!/429|quota|Too Many Requests/i.test(msg)) throw err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Gemini failed");
}

async function callGroqChat(
  system: string,
  user: string,
  maxTokens: number
): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: AI_CONFIG.groqDossierModel,
    temperature: 0.35,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function callMistralChat(
  system: string,
  user: string,
  maxTokens: number
): Promise<string> {
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  const completion = await client.chat.complete({
    model: AI_CONFIG.mistralModel,
    temperature: 0.35,
    maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const content = completion.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) =>
        typeof c === "string" ? c : (c as { text?: string }).text ?? ""
      )
      .join("");
  }
  return "";
}

async function callOpenRouterChat(
  system: string,
  user: string,
  maxTokens: number
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) throw new Error("OPENROUTER_API_KEY missing");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://getauros.com",
      "X-Title": "AUROS",
    },
    body: JSON.stringify({
      model: AI_CONFIG.openrouterModel,
      temperature: 0.35,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status}`);
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? "";
}

export async function generateDossierContent(
  data: WizardData,
  locale: Locale = "fr",
  options?: GenerateDossierOptions
): Promise<GenerateDossierResult> {
  const prompt = buildPrompt(data, locale);
  const chain = resolveProviderChain(options?.providersOnly);
  const errors: string[] = [];
  const timeout = AI_CONFIG.providerTimeoutMs;

  for (const id of chain) {
    try {
      const raw = await withTimeout(CALLERS[id](prompt), timeout);
      const content = parseDossierContent(raw);
      if (!isDossierQualityAcceptable(content, data)) {
        throw new Error("quality check failed");
      }
      return { ...content, provider: id };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${id}: ${msg}`);
      console.warn("[ai-router] Provider failed:", id, msg);
    }
  }

  console.warn(
    "[ai-router] Using template fallback",
    errors.length ? errors.join("; ") : "no providers configured"
  );
  return {
    ...generateTemplateDossier(data, locale),
    provider: "template",
  };
}
