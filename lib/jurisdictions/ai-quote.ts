import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

import { AI_CONFIG, resolveProviderChain } from "@/lib/ai-config";
import { checkAiDailyBudget, consumeAiDailyBudget } from "@/lib/ai-budget";
import type { Locale } from "@/lib/i18n";
import { JURISDICTIONS } from "./data";
import type { JurisdictionMessages } from "./i18n";
import { jurisdictionLabel } from "./i18n";
import { jurisdictionProduct } from "./pricing";

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

function jurisdictionContext(
  id: string,
  messages: JurisdictionMessages
): string {
  if (id === "unsure") return messages.forms.jurisdictionUnsure;
  const row = JURISDICTIONS.find((j) => j.id === id);
  if (!row) return id;
  return `${jurisdictionLabel(messages, id)} — fees ${messages.fees[id]}, delay ${messages.delays[id]}`;
}

function buildPrompt(
  input: {
    name: string;
    projectType: string;
    projectValue: string;
    jurisdictionId: string;
    message?: string;
  },
  messages: JurisdictionMessages,
  locale: Locale
): string {
  const language = OUTPUT_LANGUAGE[locale] ?? OUTPUT_LANGUAGE.fr;
  const starter = jurisdictionProduct("starter");

  return `You are an RWA tokenization sales advisor for AUROS. Write a personalized quote proposal in ${language}.
Plain text only, 3 short paragraphs:
1) Greet ${input.name}, acknowledge ${input.projectType} project (${input.projectValue} range) in ${jurisdictionContext(input.jurisdictionId, messages)}.
2) Recommend AUROS Starter Kit (€5,000): legal structure + tech provider intro. Mention typical setup fees for the jurisdiction. Be specific but indicative.
3) Next step: pay Starter Kit online or reply to this email. Mention Launch support for larger projects (custom quote).

${input.message ? `Client note: ${input.message}` : ""}

Max 180 words. Professional, confident tone. Not legal advice.`;
}

function templateQuote(
  input: {
    name: string;
    projectType: string;
    projectValue: string;
    jurisdictionId: string;
  },
  messages: JurisdictionMessages,
  locale: Locale
): string {
  const jurisdiction = jurisdictionContext(input.jurisdictionId, messages);
  const valueLabel = messages.forms.projectValues[input.projectValue] ?? input.projectValue;
  const typeLabel = messages.forms.projectTypes[input.projectType] ?? input.projectType;

  if (locale === "en") {
    return `Hello ${input.name},

Thank you for your ${typeLabel} tokenization request (${valueLabel}) targeting ${jurisdiction}.

We recommend the AUROS Starter Kit (€5,000): legal structure design, jurisdiction fit check, and introduction to a vetted RWA tech provider. Typical setup costs depend on the jurisdiction — our comparator gives indicative ranges.

Next step: secure your Starter Kit online (instant confirmation) or reply to this email. For full Launch support through token issuance, we will send a custom proposal within 48 hours.

Indicative information only — not legal advice.`;
  }

  if (locale === "es") {
    return `Hola ${input.name},

Gracias por su solicitud de tokenización (${typeLabel}, ${valueLabel}) en ${jurisdiction}.

Recomendamos el Starter Kit AUROS (5 000 €): estructura jurídica, encaje regulatorio y proveedor tech RWA. Los costes de setup varían según la jurisdicción.

Siguiente paso: pagar el Starter Kit en línea o responder a este email. Para acompañamiento Launch completo, propuesta personalizada en 48 h.

Información indicativa — no es asesoramiento legal.`;
  }

  return `Bonjour ${input.name},

Merci pour votre demande de tokenisation (${typeLabel}, ${valueLabel}) — juridiction : ${jurisdiction}.

Nous recommandons le Starter Kit AUROS (5 000 €) : structure juridique, analyse d'encadrement réglementaire et mise en relation avec un prestataire tech RWA. Les frais de setup varient selon la juridiction (voir comparateur).

Prochaine étape : régler le Starter Kit en ligne (confirmation immédiate) ou répondre à cet email. Pour un accompagnement Launch complet jusqu'à l'émission, devis sur mesure sous 48 h.

Informations indicatives — pas un conseil juridique.`;
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: AI_CONFIG.geminiModel,
    generationConfig: { maxOutputTokens: 700, temperature: 0.35 },
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function callGroq(prompt: string): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.35,
    max_tokens: 700,
    messages: [
      {
        role: "system",
        content: "RWA sales advisor. Plain text, concise, conversion-focused.",
      },
      { role: "user", content: prompt },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

export async function generateJurisdictionQuote(
  input: {
    name: string;
    projectType: string;
    projectValue: string;
    jurisdictionId: string;
    message?: string;
  },
  messages: JurisdictionMessages,
  locale: Locale
): Promise<{ quote: string; provider: string }> {
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
        const quote = await withTimeout(callers[id](prompt), 15_000);
        if (quote.length > 80) {
          return { quote, provider: id };
        }
      } catch (err) {
        console.warn("[jurisdiction-quote-ai]", id, err);
      }
    }
  }

  return {
    quote: templateQuote(input, messages, locale),
    provider: "template",
  };
}
