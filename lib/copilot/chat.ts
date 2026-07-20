import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { Mistral } from "@mistralai/mistralai";

import { AI_CONFIG, resolveGeminiApiKeys, resolveProviderChain } from "@/lib/ai-config";
import { checkAiDailyBudget, consumeAiDailyBudget } from "@/lib/ai-budget";

import { COPILOT_DISCLAIMER } from "./types";
import type {
  CopilotChatMessage,
  CopilotCitation,
  CopilotPageContext,
} from "./types";
import {
  collectSuggestedIds,
  runCopilotTools,
  type CopilotToolResult,
} from "./tools";

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

function buildSystemPrompt(locale: "fr" | "en" | "es" | "ar" | "zh"): string {
  const lang =
    locale === "en"
      ? "English"
      : locale === "es"
        ? "Spanish"
        : locale === "ar"
          ? "Arabic"
          : locale === "zh"
            ? "Chinese (Simplified)"
            : "French";
  return `You are AUROS Copilot, an assistant for the AUROS RWA prep platform (comparator, jurisdictions, Protocol API, ChargeFlow, Green).
Language: ${lang}.
Rules:
- Be concise, professional, institutional tone.
- Use ONLY the tool context provided — do not invent APYs, licenses, or partnerships.
- Always cite 1–3 concrete AUROS URLs from the tool citations when relevant.
- Never claim to change scores, attestations, or mint/retire ChargeFlow units.
- Never claim official Tesla or TotalEnergies partnership — format-compatible only.
- If tool suggest_compare_products lists IDs, mention them clearly so the user can add them to /compare.
- Never claim to auto-write the catalog or change scores.
- End without repeating the full legal disclaimer (it is attached separately).
${COPILOT_DISCLAIMER}`;
}

function formatPageContext(context?: CopilotPageContext): string {
  if (!context) return "";
  if (
    context.surface === "generic" &&
    !context.product_ids?.length &&
    !context.jurisdiction_id &&
    !context.rtms_brief
  ) {
    return "";
  }
  const parts = [`surface=${context.surface}`];
  if (context.product_ids?.length) {
    parts.push(`product_ids=${context.product_ids.join(",")}`);
  }
  if (context.jurisdiction_id) {
    parts.push(`jurisdiction_id=${context.jurisdiction_id}`);
  }
  let block = `PAGE CONTEXT: ${parts.join(" · ")}\nUse this page context when answering; prefer tool data for these IDs.\n`;
  if (context.rtms_brief?.trim()) {
    block += `RTMS_BRIEF:\n${context.rtms_brief.trim().slice(0, 1200)}\n`;
  }
  return `${block}\n`;
}

function buildUserPrompt(
  message: string,
  tools: CopilotToolResult[],
  history: CopilotChatMessage[],
  context?: CopilotPageContext
): string {
  const hist = history
    .slice(-6)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
  const toolBlock = tools
    .map(
      (t) =>
        `### Tool ${t.name}\n${t.summary}\nCitations: ${t.citations.map((c) => `${c.title} (${c.url})`).join("; ")}`
    )
    .join("\n\n");
  return `${formatPageContext(context)}${hist ? `Conversation:\n${hist}\n\n` : ""}Tool context:\n${toolBlock}\n\nUser question:\n${message}`;
}

function templateReply(
  message: string,
  tools: CopilotToolResult[],
  locale: "fr" | "en" | "es" | "ar" | "zh"
): string {
  const cites = tools
    .flatMap((t) => t.citations)
    .slice(0, 4)
    .map((c) => `- ${c.title}: ${c.url}`)
    .join("\n");
  const snippet = tools[0]?.summary.slice(0, 600) ?? "";
  if (locale === "en") {
    return `Based on AUROS knowledge (template mode — configure GEMINI_API_KEY for full AI):\n\n${snippet}\n\nUseful links:\n${cites || "- https://getauros.com/compare"}`;
  }
  if (locale === "es") {
    return `Según el conocimiento AUROS (modo plantilla):\n\n${snippet}\n\nEnlaces:\n${cites || "- https://getauros.com/compare"}`;
  }
  return `D’après la base AUROS (mode template — configurez GEMINI_API_KEY pour l’IA complète) :\n\n${snippet}\n\nLiens utiles :\n${cites || "- https://getauros.com/compare"}\n\nQuestion : ${message.slice(0, 120)}`;
}

/** Soft guardrail: neutralize official partnership claims for Tesla / Total. */
export function sanitizePartnershipClaims(reply: string): string {
  const neutral =
    "format-compatible adapters (not an official manufacturer partnership)";
  return reply
    .replace(
      /\b(official|officielle?)\s+(tesla|totalenergies?|total\s+energies?)\s+(partner(?:ship)?|partenariat|partenaire)/gi,
      neutral
    )
    .replace(
      /\b(tesla|totalenergies?|total\s+energies?)\s+(official|officielle?)\s+(partner(?:ship)?|partenariat|partenaire)/gi,
      neutral
    )
    .replace(
      /\bpartenaire\s+officiel\s+(de\s+)?(tesla|totalenergies?|total)/gi,
      neutral
    )
    .replace(
      /\b(partenariat|partnership)\s+officiel\s+(avec\s+)?(tesla|totalenergies?|total)/gi,
      neutral
    );
}

/** If tools provided URLs and the reply has none, append 1–2 sources. */
export function ensureCitationsInReply(
  reply: string,
  citations: CopilotCitation[]
): string {
  if (citations.length === 0) return reply;
  if (/https?:\/\//i.test(reply)) return reply;
  const links = citations
    .slice(0, 2)
    .map((c) => `- ${c.title}: ${c.url}`)
    .join("\n");
  return `${reply.trim()}\n\nSources:\n${links}`;
}

function polishReply(
  reply: string,
  citations: CopilotCitation[]
): string {
  return ensureCitationsInReply(sanitizePartnershipClaims(reply), citations);
}

async function callGemini(system: string, user: string): Promise<string> {
  const keys = resolveGeminiApiKeys();
  if (!keys.length) throw new Error("GEMINI_API_KEY missing");
  let lastErr: unknown;
  for (const key of keys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: AI_CONFIG.geminiModel,
        generationConfig: {
          maxOutputTokens: Math.min(AI_CONFIG.maxOutputTokens, 1200),
          temperature: 0.3,
        },
      });
      const result = await model.generateContent(`${system}\n\n${user}`);
      return result.response.text().trim();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!/429|quota|Too Many Requests/i.test(msg)) throw err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Gemini failed");
}

async function callGroq(system: string, user: string): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: AI_CONFIG.groqDossierModel.includes("8b")
      ? "llama-3.1-8b-instant"
      : "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: 1000,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

async function callMistral(system: string, user: string): Promise<string> {
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  const completion = await client.chat.complete({
    model: AI_CONFIG.mistralModel,
    temperature: 0.3,
    maxTokens: 1000,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const content = completion.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((p) => ("text" in p ? p.text : ""))
      .join("")
      .trim();
  }
  return "";
}

async function callOpenRouter(system: string, user: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) throw new Error("OPENROUTER_API_KEY missing");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://getauros.com",
      "X-Title": "AUROS Copilot",
    },
    body: JSON.stringify({
      model: AI_CONFIG.openrouterModel,
      temperature: 0.3,
      max_tokens: 1000,
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
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

function mergeCitations(tools: CopilotToolResult[]): CopilotCitation[] {
  const seen = new Set<string>();
  const out: CopilotCitation[] = [];
  for (const t of tools) {
    for (const c of t.citations) {
      if (seen.has(c.url)) continue;
      seen.add(c.url);
      out.push(c);
      if (out.length >= 6) return out;
    }
  }
  return out;
}

export async function runCopilotChat(input: {
  message: string;
  locale?: "fr" | "en" | "es" | "ar" | "zh";
  history?: CopilotChatMessage[];
  context?: CopilotPageContext;
}): Promise<{
  reply: string;
  provider: string;
  citations: CopilotCitation[];
  disclaimer: string;
  tools_used: string[];
  suggested_product_ids: string[];
}> {
  const locale = input.locale ?? "fr";
  const message = input.message.trim().slice(0, 2000);
  const history = (input.history ?? []).slice(-6);
  const context = input.context;
  const tools = await runCopilotTools(message, context);
  const system = buildSystemPrompt(locale);
  const user = buildUserPrompt(message, tools, history, context);
  const citations = mergeCitations(tools);
  const tools_used = tools.map((t) => t.name);
  const suggested_product_ids = collectSuggestedIds(tools);

  const budget = checkAiDailyBudget();
  const chain = resolveProviderChain();

  if (budget.allowed && chain.length > 0) {
    consumeAiDailyBudget();
    const callers: Record<
      string,
      (s: string, u: string) => Promise<string>
    > = {
      gemini: callGemini,
      groq: callGroq,
      mistral: callMistral,
      openrouter: callOpenRouter,
    };
    for (const id of chain) {
      try {
        const reply = await withTimeout(
          callers[id]!(system, user),
          AI_CONFIG.providerTimeoutMs
        );
        if (reply.length > 40) {
          return {
            reply: polishReply(reply, citations),
            provider: id,
            citations,
            disclaimer: COPILOT_DISCLAIMER,
            tools_used,
            suggested_product_ids,
          };
        }
      } catch (err) {
        console.warn("[copilot]", id, err);
      }
    }
  }

  return {
    reply: polishReply(templateReply(message, tools, locale), citations),
    provider: "template",
    citations,
    disclaimer: COPILOT_DISCLAIMER,
    tools_used,
    suggested_product_ids,
  };
}
