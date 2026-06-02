import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

import { AI_CONFIG, resolveProviderChain } from "@/lib/ai-config";
import { checkAiDailyBudget, consumeAiDailyBudget } from "@/lib/ai-budget";
import { isLocale, type Locale } from "@/lib/i18n";
import { isSimulationMode } from "@/lib/simulation/mode";

import { JURISDICTIONS } from "./data";
import { getJurisdictionMessages, jurisdictionLabel } from "./i18n";
import { matchTechProviders } from "./tech-providers";
import type {
  StarterKitContent,
  StarterKitLeadContext,
} from "./starter-kit-types";

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

function jurisdictionFacts(
  ids: string[],
  messages: ReturnType<typeof getJurisdictionMessages>
): string {
  return ids
    .filter((id) => id !== "unsure")
    .map((id) => {
      const row = JURISDICTIONS.find((j) => j.id === id);
      if (!row) return id;
      return `${jurisdictionLabel(messages, id)}: fees ${messages.fees[id]}, delay ${messages.delays[id]}, tax ${messages.tax[row.taxKey]}`;
    })
    .join("\n");
}

function buildPrompt(
  ctx: StarterKitLeadContext,
  messages: ReturnType<typeof getJurisdictionMessages>,
  locale: Locale
): string {
  const language = OUTPUT_LANGUAGE[locale];
  const names = ctx.jurisdictions
    .filter((j) => j !== "unsure")
    .map((j) => jurisdictionLabel(messages, j))
    .join(", ");
  const tech = matchTechProviders({
    projectType: ctx.projectType,
    jurisdictionIds: ctx.jurisdictions,
    locale,
  })
    .map((t) => `${t.name}: ${t.fit}`)
    .join("; ");

  return `You are an RWA tokenization architect for AUROS. Output ONLY valid JSON (no markdown) in ${language} for a paid Starter Kit deliverable.

Client: ${ctx.firstName}, project ${ctx.projectType}${ctx.projectValue ? ` (${ctx.projectValue})` : ""}, jurisdictions: ${names || "TBD"}.
${ctx.projectType === "real_estate" ? "\nAsset class: real estate (one of many supported types). This is phase 0 JURISDICTION memo — where to structure the SPV — not the free asset admission dossier.\n" : "\nThis is phase 0 JURISDICTION memo for any RWA asset class — where to structure the SPV — not the free asset admission dossier.\n"}

Facts:
${jurisdictionFacts(ctx.jurisdictions, messages)}

${ctx.aiBrief ? `Prior brief:\n${ctx.aiBrief.slice(0, 600)}` : ""}
${ctx.aiQuote ? `Prior quote:\n${ctx.aiQuote.slice(0, 400)}` : ""}

Tech shortlist (include in techProviders): ${tech}

JSON schema:
{
  "executiveSummary": "2-3 sentences",
  "recommendedStructure": "SPV/holding recommendation paragraph",
  "jurisdictionRationale": "why primary jurisdiction fits",
  "regulatoryChecklist": ["7-9 bullet strings citing applicable regulator/framework per jurisdiction"],
  "timeline": [{"phase":"...","duration":"...","actions":"..."}],
  "techProviders": [{"name":"...","fit":"...","note":"intro via AUROS"}],
  "nextSteps": ["4 actionable legal steps — optional last step: free AUROS asset dossier (/wizard) as separate phase 1"],
  "disclaimer": "not legal advice sentence"
}

Rules: institutional tone, cite specific regulators (CSSF, VARA, MAS, FINMA, AMF, CBI, GFSC) where relevant, include KYC/AML and offering document items in checklist, indicative only, max 1100 words total across fields.`;
}

function templateStarterKit(
  ctx: StarterKitLeadContext,
  messages: ReturnType<typeof getJurisdictionMessages>,
  locale: Locale
): StarterKitContent {
  const primary =
    ctx.jurisdictions.find((j) => j !== "unsure") ?? "luxembourg";
  const name = jurisdictionLabel(messages, primary);
  const tech = matchTechProviders({
    projectType: ctx.projectType,
    jurisdictionIds: ctx.jurisdictions,
    locale,
  });

  const typeLabel =
    messages.forms.projectTypes[ctx.projectType] ?? ctx.projectType;

  if (locale === "en") {
    return {
      executiveSummary: `${ctx.firstName}, your ${typeLabel} project is best anchored on a dedicated SPV in ${name}. Jurisdiction is decided here (phase 0); the free AUROS asset dossier is a separate phase 1.`,
      recommendedStructure: `HoldCo (optional) → SPV in ${name} → token representing economic rights. Use a regulated custodian for asset backing and cap-table. Align offering memorandum with qualified/ professional investor rules in the target jurisdiction.`,
      jurisdictionRationale: `${name} balances setup cost, licensing timeline and investor tax treatment for your profile. ${jurisdictionFacts(ctx.jurisdictions, messages)}`,
      regulatoryChecklist: [
        "Confirm asset class licensing path (security token / fund / real estate vehicle)",
        "Draft offering memorandum and risk disclosures",
        "Investor KYC/AML policy and qualified investor tests",
        "Tax memo for issuer and cross-border investors",
        "Technology audit: wallet, transfer restrictions, cap-table",
        "Bank/custody account for SPV and subscription flows",
      ],
      timeline: [
        {
          phase: "Structure & legal memo",
          duration: "2–3 weeks",
          actions: "Validate SPV design with local counsel; freeze investor terms.",
        },
        {
          phase: "Regulatory filing / notification",
          duration: "4–12 weeks",
          actions: "Submit licence or exemption filing depending on jurisdiction.",
        },
        {
          phase: "Tech build & audit",
          duration: "4–8 weeks",
          actions: "Configure token, portal, KYC; external smart-contract review if applicable.",
        },
        {
          phase: "Soft launch",
          duration: "2–4 weeks",
          actions: "Pilot subscriptions with qualified investors; monitor reporting.",
        },
      ],
      techProviders: tech,
      nextSteps: [
        "Validate this jurisdiction memo with your RWA counsel",
        "Confirm SPV design and investor regime (qualified vs retail)",
        "Request AUROS tech intro to your preferred provider below",
        "Optional — open the free AUROS asset dossier (/wizard) for data room and admission score",
      ],
      disclaimer:
        "Indicative AUROS analysis — not legal, tax or investment advice. Engage qualified counsel before any offering.",
    };
  }

  if (locale === "es") {
    return {
      executiveSummary: `${ctx.firstName}, su proyecto ${typeLabel} encaja con una SPV en ${name}, separando activo y vehículo de emisión.`,
      recommendedStructure: `HoldCo (opcional) → SPV en ${name} → token de derechos económicos. Custodio regulado y cap table auditable.`,
      jurisdictionRationale: `${name} equilibra costes, plazos y fiscalidad. ${jurisdictionFacts(ctx.jurisdictions, messages)}`,
      regulatoryChecklist: [
        "Ruta de licencia según clase de activo",
        "Memorando de oferta y riesgos",
        "KYC/AML e inversores cualificados",
        "Nota fiscal emisor e inversores",
        "Auditoría tech: token, restricciones, cap table",
        "Cuenta bancaria/custodia SPV",
      ],
      timeline: [
        {
          phase: "Estructura y memo legal",
          duration: "2–3 semanas",
          actions: "Validar SPV con abogado local.",
        },
        {
          phase: "Regulatorio",
          duration: "4–12 semanas",
          actions: "Licencia o exención según jurisdicción.",
        },
        {
          phase: "Tech y auditoría",
          duration: "4–8 semanas",
          actions: "Portal, KYC, token configurado.",
        },
        {
          phase: "Lanzamiento piloto",
          duration: "2–4 semanas",
          actions: "Suscripciones inversores cualificados.",
        },
      ],
      techProviders: tech,
      nextSteps: [
        "Complete su dossier AUROS (/wizard)",
        "Comparta este Starter Kit con su abogado RWA",
        "Solicite intro tech AUROS al proveedor elegido",
        "Planifique calendario de suscripción con CFO y legal",
      ],
      disclaimer:
        "Análisis indicativo AUROS — no es asesoramiento legal, fiscal ni de inversión.",
    };
  }

  return {
    executiveSummary: `${ctx.firstName}, votre projet ${typeLabel} s'ancre sur une SPV en ${name}. La juridiction est tranchée ici (phase 0) ; le dossier actif AUROS reste gratuit en phase 1.`,
    recommendedStructure: `HoldCo (optionnel) → SPV ${name} → token représentant les droits économiques. Custode régulé et cap table traçable.`,
    jurisdictionRationale: `${name} offre un compromis coût/délai/fiscalité adapté. ${jurisdictionFacts(ctx.jurisdictions, messages)}`,
    regulatoryChecklist: [
      "Identifier le régime applicable (MiCA, titre financier, véhicule d'investissement collectif)",
      "Valider la voie licence ou notification auprès du régulateur local",
      "Rédiger note d'information / prospectus et annexes risques",
      "Politique KYC/AML, LCB-FT et profil investisseurs (retail vs qualifiés)",
      "Gouvernance SPV : administrateur, reporting, conflits d'intérêts",
      "Mémo fiscal émetteur et investisseurs transfrontaliers",
      "Audit tech : token, restrictions de transfert, cap table",
      "Compte bancaire / custody régulé pour la SPV",
    ],
    timeline: [
      {
        phase: "Structure & memo juridique",
        duration: "2–3 semaines",
        actions: "Valider la SPV avec avocat local.",
      },
      {
        phase: "Dossier réglementaire",
        duration: "4–12 semaines",
        actions: "Licence ou notification selon juridiction.",
      },
      {
        phase: "Build tech & audit",
        duration: "4–8 semaines",
        actions: "Portal, KYC, token configuré.",
      },
      {
        phase: "Lancement pilote",
        duration: "2–4 semaines",
        actions: "Souscriptions investisseurs qualifiés.",
      },
    ],
    techProviders: tech,
    nextSteps: [
      "Valider ce memo juridiction avec votre avocat RWA",
      "Confirmer la SPV et le régime investisseur (qualifiés vs retail)",
      "Demander l'intro tech AUROS au prestataire retenu",
      "Optionnel — ouvrir le dossier actif AUROS gratuit (/wizard) pour data room et score admission",
    ],
    disclaimer:
      "Analyse indicative AUROS — pas un conseil juridique, fiscal ou en investissement.",
  };
}

function parseStarterKitJson(raw: string): StarterKitContent | null {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    const parsed = JSON.parse(raw.slice(start, end + 1)) as StarterKitContent;
    if (
      !parsed.executiveSummary ||
      !Array.isArray(parsed.regulatoryChecklist) ||
      !Array.isArray(parsed.nextSteps)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function flattenForPdf(content: StarterKitContent): string {
  const lines = [
    content.executiveSummary,
    "",
    content.recommendedStructure,
    "",
    content.jurisdictionRationale,
    "",
    "Checklist:",
    ...content.regulatoryChecklist.map((c) => `• ${c}`),
    "",
    "Timeline:",
    ...content.timeline.map(
      (t) => `• ${t.phase} (${t.duration}): ${t.actions}`
    ),
    "",
    "Tech:",
    ...content.techProviders.map((t) => `• ${t.name} — ${t.fit}`),
    "",
    "Next steps:",
    ...content.nextSteps.map((s) => `• ${s}`),
    "",
    content.disclaimer,
  ];
  return lines.join("\n");
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: AI_CONFIG.geminiModel,
    generationConfig: { maxOutputTokens: 2000, temperature: 0.3 },
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function callGroq(prompt: string): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      {
        role: "system",
        content: "Output valid JSON only. RWA tokenization architect.",
      },
      { role: "user", content: prompt },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

export async function generateStarterKit(
  ctx: StarterKitLeadContext
): Promise<{
  content: StarterKitContent;
  plain: string;
  provider: string;
}> {
  const locale: Locale = isLocale(ctx.locale) ? ctx.locale : "fr";
  const messages = getJurisdictionMessages(locale);

  if (isSimulationMode()) {
    const content = templateStarterKit(ctx, messages, locale);
    return {
      content,
      plain: flattenForPdf(content),
      provider: "simulation",
    };
  }

  const prompt = buildPrompt(ctx, messages, locale);
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
        const raw = await withTimeout(callers[id](prompt), 25_000);
        const parsed = parseStarterKitJson(raw);
        if (parsed) {
          return {
            content: parsed,
            plain: flattenForPdf(parsed),
            provider: id,
          };
        }
      } catch (err) {
        console.warn("[starter-kit-ai]", id, err);
      }
    }
  }

  const content = templateStarterKit(ctx, messages, locale);
  return {
    content,
    plain: flattenForPdf(content),
    provider: "template",
  };
}

export { flattenForPdf };
