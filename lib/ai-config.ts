import type { AiProvider } from "@/lib/wizard-types";

const economyMode = process.env.AI_ECONOMY_MODE === "true";

/** Central AI controls — quality by default; set AI_ECONOMY_MODE=true to cut cost. */
export const AI_CONFIG = {
  economyMode,
  /** Try free/cheap providers first. Comma-separated: gemini,groq,mistral */
  providerOrder: parseProviderOrder(
    process.env.AI_PROVIDER_ORDER ?? "gemini,groq,mistral"
  ),
  /** If true, only Gemini (free tier) + template fallback — no Groq/Mistral spend */
  freeOnly: process.env.AI_FREE_ONLY === "true",
  maxOutputTokens: clampInt(
    process.env.AI_MAX_OUTPUT_TOKENS,
    1200,
    4096,
    economyMode ? 1600 : 2800
  ),
  maxDescriptionChars: clampInt(
    process.env.AI_MAX_DESCRIPTION_CHARS,
    200,
    2000,
    economyMode ? 600 : 1200
  ),
  minSectionChars: economyMode ? 180 : 380,
  wordsPerSection: economyMode ? "80-120" : "140-200",
  providerTimeoutMs: clampInt(
    process.env.AI_PROVIDER_TIMEOUT_MS,
    5000,
    45000,
    economyMode ? 12000 : 20000
  ),
  /** Global dossier generations per UTC day (all users). 0 = unlimited */
  dailyGenerationCap: clampInt(process.env.AI_DAILY_GENERATION_CAP, 0, 100_000, 200),
  groqDossierModel:
    process.env.GROQ_DOSSIER_MODEL?.trim() ||
    (economyMode ? "llama-3.1-8b-instant" : "llama-3.3-70b-versatile"),
  geminiModel:
    process.env.GEMINI_MODEL?.trim() ||
    (economyMode ? "gemini-2.0-flash" : "gemini-2.0-flash"),
  mistralModel:
    process.env.MISTRAL_MODEL?.trim() ||
    (economyMode ? "open-mistral-nemo" : "mistral-small-latest"),
  cacheTtlMs: clampInt(process.env.AI_CACHE_TTL_MS, 60_000, 86_400_000, 86_400_000),
} as const;

function parseProviderOrder(raw: string): AiProvider[] {
  const allowed = new Set<AiProvider>(["gemini", "groq", "mistral"]);
  const order = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is AiProvider => allowed.has(s as AiProvider));
  return order.length ? order : ["gemini", "groq", "mistral"];
}

function clampInt(
  raw: string | undefined,
  min: number,
  max: number,
  fallback: number
): number {
  const n = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export type BillableAiProvider = Exclude<AiProvider, "template">;

export function resolveProviderChain(
  only?: BillableAiProvider[]
): BillableAiProvider[] {
  const order = (
    AI_CONFIG.freeOnly
      ? AI_CONFIG.providerOrder.filter((p) => p === "gemini")
      : AI_CONFIG.providerOrder
  ) as BillableAiProvider[];

  const filtered = order.filter((id) => {
    if (id === "gemini") return Boolean(process.env.GEMINI_API_KEY?.trim());
    if (id === "groq") return Boolean(process.env.GROQ_API_KEY?.trim());
    if (id === "mistral") return Boolean(process.env.MISTRAL_API_KEY?.trim());
    return false;
  });

  if (!only?.length) return filtered;
  const allowed = new Set(only);
  return filtered.filter((id) => allowed.has(id));
}
