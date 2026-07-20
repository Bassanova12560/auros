import "server-only";

import Groq from "groq-sdk";
import { z } from "zod";

import {
  WETS_CRITERIA,
  WETS_PQC_QUESTIONS,
  weightsForCategory,
  type WetsCategory,
  type WetsCriterionScore,
} from "./constants";
import { heuristicWetsCriteria } from "./heuristic";

const criterionSchema = z.object({
  score: z.number().min(0).max(10),
  justification: z.string().min(1).max(2000),
  sources: z.array(z.string()).default([]),
});

const assistSchema = z.object({
  legal_legitimacy: criterionSchema,
  hydrological_risk: criterionSchema,
  social_litigation_risk: criterionSchema,
  grid_interconnection_realism: criterionSchema,
  operational_transparency: criterionSchema,
  token_economics: criterionSchema,
  post_quantum_legal_recourse: criterionSchema,
});

const SYSTEM = `Tu es un analyste de risque spécialisé RWA eau/énergie/data centers. Évalue le projet sur 7 critères, chacun noté de 0 à 10, avec une justification courte (2-3 phrases) et les sources utilisées. Sois rigoureux et sceptique.

Critères clés :
- grid_interconnection_realism : position dans la file d'interconnexion, permis OBTENUS vs demandés, COD crédible ; score HAUT si microgrid/SMR/solaire+batterie behind-the-meter documenté ; score BAS si capacité « annoncée » sans queue.
- post_quantum_legal_recourse : sans registre off-chain d'autorité + mécanisme de gel/re-émission, note ≤ 3. Pose mentalement : (1) registre off-chain ? (2) remedy si clé compromise ? (3) token=claim vs token=title ? (4) chemin reseal/PQC ?

Réponds UNIQUEMENT en JSON :
{
"legal_legitimacy": { "score": 0, "justification": "", "sources": [] },
"hydrological_risk": { "score": 0, "justification": "", "sources": [] },
"social_litigation_risk": { "score": 0, "justification": "", "sources": [] },
"grid_interconnection_realism": { "score": 0, "justification": "", "sources": [] },
"operational_transparency": { "score": 0, "justification": "", "sources": [] },
"token_economics": { "score": 0, "justification": "", "sources": [] },
"post_quantum_legal_recourse": { "score": 0, "justification": "", "sources": [] }
}`;

export type WetsAssistInput = {
  name: string;
  ticker?: string | null;
  category: WetsCategory;
  website_url?: string | null;
  description?: string | null;
  legal_structure?: string | null;
  jurisdiction?: string | null;
  risk_events_context?: string;
};

function toCriteria(
  parsed: z.infer<typeof assistSchema>,
  category: WetsCategory
): WetsCriterionScore[] {
  const weights = weightsForCategory(category);
  return WETS_CRITERIA.map((key) => {
    const row = parsed[key];
    return {
      category: key,
      score: Math.round(row.score * 10) / 10,
      weight: weights[key],
      justification: row.justification,
      sources: row.sources.slice(0, 8),
    };
  });
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1]!.trim() : trimmed;
  return JSON.parse(raw) as unknown;
}

async function scoreWithAnthropic(
  userPrompt: string,
  category: WetsCategory
): Promise<WetsCriterionScore[] | null> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;

  const model =
    process.env.ANTHROPIC_WETS_MODEL?.trim() || "claude-sonnet-4-6";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2800,
        system: SYSTEM,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!res.ok) {
      console.error("[wets/assist] anthropic", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = (json.content ?? [])
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text)
      .join("\n");
    if (!text) return null;
    const parsed = assistSchema.safeParse(extractJson(text));
    if (!parsed.success) return null;
    return toCriteria(parsed.data, category);
  } catch (e) {
    console.error("[wets/assist] anthropic error", e);
    return null;
  }
}

async function scoreWithGroq(
  userPrompt: string,
  category: WetsCategory
): Promise<WetsCriterionScore[] | null> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return null;
  try {
    const client = new Groq({ apiKey: key });
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_WETS_MODEL?.trim() || "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 2800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) return null;
    const parsed = assistSchema.safeParse(JSON.parse(text));
    if (!parsed.success) return null;
    return toCriteria(parsed.data, category);
  } catch (e) {
    console.error("[wets/assist] groq error", e);
    return null;
  }
}

export async function assistWetsScore(input: WetsAssistInput): Promise<{
  criteria: WetsCriterionScore[];
  provider: "anthropic" | "groq" | "heuristic";
}> {
  const pqcBlock = WETS_PQC_QUESTIONS.map((q, i) => `${i + 1}. ${q.q}`).join(
    "\n"
  );
  const userPrompt = [
    `Projet: ${input.name}`,
    input.ticker ? `Ticker: ${input.ticker}` : null,
    `Catégorie: ${input.category}`,
    input.jurisdiction ? `Juridiction: ${input.jurisdiction}` : null,
    input.legal_structure ? `Structure: ${input.legal_structure}` : null,
    input.website_url ? `Site: ${input.website_url}` : null,
    `Description: ${input.description ?? "(vide)"}`,
    input.risk_events_context
      ? `Risk events connus AUROS:\n${input.risk_events_context}`
      : null,
    `Questions PQC à couvrir dans post_quantum_legal_recourse:\n${pqcBlock}`,
    `Si les infos publiques sont insuffisantes, note bas et dis-le clairement.`,
  ]
    .filter(Boolean)
    .join("\n");

  const anthropic = await scoreWithAnthropic(userPrompt, input.category);
  if (anthropic) return { criteria: anthropic, provider: "anthropic" };

  const groq = await scoreWithGroq(userPrompt, input.category);
  if (groq) return { criteria: groq, provider: "groq" };

  return {
    criteria: heuristicWetsCriteria(input),
    provider: "heuristic",
  };
}

export function emptyCriteriaDraft(
  category: WetsCategory
): WetsCriterionScore[] {
  const weights = weightsForCategory(category);
  return WETS_CRITERIA.map((key) => ({
    category: key,
    score: 0,
    weight: weights[key],
    justification: "",
    sources: [],
  }));
}
