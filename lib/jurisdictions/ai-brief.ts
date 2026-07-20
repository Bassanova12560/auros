import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

import { AI_CONFIG, resolveProviderChain } from "@/lib/ai-config";
import { checkAiDailyBudget, consumeAiDailyBudget } from "@/lib/ai-budget";
import type { Locale } from "@/lib/i18n";
import { JURISDICTIONS } from "./data";
import type { JurisdictionMessages } from "./i18n";
import { jurisdictionLabel } from "./i18n";

const OUTPUT_LANGUAGE: Record<Locale, string> = {
  fr: "French",
  en: "English",
  es: "Spanish",
  ar: "Arabic",
  zh: "Chinese",
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

function buildJurisdictionContext(
  ids: string[],
  messages: JurisdictionMessages
): string {
  return ids
    .map((id) => {
      const row = JURISDICTIONS.find((j) => j.id === id);
      if (!row) return `- ${id}`;
      return `- ${jurisdictionLabel(messages, id)}: fees ${messages.fees[id]}, delay ${messages.delays[id]}, licence ${messages.licenses[row.licenseKey]}, tax ${messages.tax[row.taxKey]}, score ${row.score}/5`;
    })
    .join("\n");
}

function buildPrompt(
  input: {
    firstName: string;
    projectType: string;
    jurisdictionIds: string[];
  },
  messages: JurisdictionMessages,
  locale: Locale
): string {
  const language = OUTPUT_LANGUAGE[locale] ?? OUTPUT_LANGUAGE.fr;
  const names = input.jurisdictionIds
    .map((id) => jurisdictionLabel(messages, id))
    .join(", ");

  return `You are an RWA tokenization advisor. Write a concise jurisdiction brief in ${language}.
Output plain text only (no JSON, no markdown headings). Exactly 3 short paragraphs:
1) Greeting using first name "${input.firstName}" and project type "${input.projectType}".
2) Compare the selected jurisdictions (${names}) on fees, timeline, and regulatory fit — use ONLY the facts below.
3) Next steps: consult a specialized lawyer, and mention AUROS dossier/wizard as preparation tool.

Facts:
${buildJurisdictionContext(input.jurisdictionIds, messages)}

Rules: max 220 words total. Indicative tone. End with disclaimer that this is not legal advice.`;
}

function templateBrief(
  input: {
    firstName: string;
    projectType: string;
    jurisdictionIds: string[];
  },
  messages: JurisdictionMessages,
  locale: Locale
): string {
  const names = input.jurisdictionIds
    .map((id) => jurisdictionLabel(messages, id))
    .join(", ");

  if (locale === "en") {
    return `Hello ${input.firstName},

For a ${input.projectType} tokenization project, ${names} are jurisdictions worth comparing on setup fees, licensing timeline and tax treatment.

${buildJurisdictionContext(input.jurisdictionIds, messages)}

Next step: validate structure and investor eligibility with a specialized RWA lawyer. You can prepare your dossier on AUROS (/wizard) before legal counsel.

Indicative information only — not legal advice.`;
  }

  if (locale === "es") {
    return `Hola ${input.firstName},

Para un proyecto de tokenización (${input.projectType}), compare ${names} en costes, plazos y encaje regulatorio.

${buildJurisdictionContext(input.jurisdictionIds, messages)}

Siguiente paso: validar con un abogado especializado RWA. Prepare su expediente en AUROS (/wizard).

Información indicativa — no es asesoramiento legal.`;
  }

  return `Bonjour ${input.firstName},

Pour un projet de tokenisation (${input.projectType}), les juridictions ${names} méritent une comparaison sur les frais, délais et fiscalité.

${buildJurisdictionContext(input.jurisdictionIds, messages)}

Prochaine étape : valider la structure avec un avocat RWA spécialisé. Préparez votre dossier sur AUROS (/wizard) avant le rendez-vous juridique.

Informations indicatives — pas un conseil juridique.`;
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: AI_CONFIG.geminiModel,
    generationConfig: { maxOutputTokens: 800, temperature: 0.35 },
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function callGroq(prompt: string): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.35,
    max_tokens: 800,
    messages: [
      {
        role: "system",
        content: "Professional RWA advisor. Plain text only, concise.",
      },
      { role: "user", content: prompt },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

export async function generateJurisdictionBrief(
  input: {
    firstName: string;
    projectType: string;
    jurisdictionIds: string[];
  },
  messages: JurisdictionMessages,
  locale: Locale
): Promise<{ brief: string; provider: string }> {
  const prompt = buildPrompt(input, messages, locale);
  const chain = resolveProviderChain(["gemini", "groq"]);
  const budget = checkAiDailyBudget();

  if (budget.allowed && chain.length > 0) {
    consumeAiDailyBudget();
    const callers: Record<string, (p: string) => Promise<string>> = {
      gemini: callGemini,
      groq: callGroq,
    };

    for (const id of chain) {
      try {
        const brief = await withTimeout(callers[id](prompt), 15_000);
        if (brief.length > 80) {
          return { brief, provider: id };
        }
      } catch (err) {
        console.warn("[jurisdiction-ai]", id, err);
      }
    }
  }

  return { brief: templateBrief(input, messages, locale), provider: "template" };
}
