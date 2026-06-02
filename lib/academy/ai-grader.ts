import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

import { AI_CONFIG } from "@/lib/ai-config";

import { countWords } from "./anti-cheat";
import { RENEWAL_BRIEF } from "./renewal-content";
import type { AcademyScenario, AiGradeResult } from "./types";

const PASS_SCORE = 70;

function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function templateGrade(
  scenario: AcademyScenario,
  response: string
): AiGradeResult {
  const words = countWords(response);
  const norm = normalizeText(response);
  const flags: string[] = [];

  if (words < scenario.minWords) flags.push("too_short");
  if (words > scenario.maxWords) flags.push("too_long");

  const conceptHits = scenario.requiredConcepts.filter((c) =>
    norm.includes(normalizeText(c))
  ).length;
  const conceptRatio = conceptHits / scenario.requiredConcepts.length;

  const banned = ["garanti", "100%", "sans risque", "licence obtenue", "cssf approuve"];
  for (const b of banned) {
    if (norm.includes(b)) flags.push(`overclaim:${b}`);
  }

  const specificity = Math.min(100, Math.round(conceptRatio * 100 + (words > 80 ? 15 : 0)));
  const accuracy = Math.min(100, Math.round(50 + conceptRatio * 40));
  const compliance = flags.some((f) => f.startsWith("overclaim")) ? 30 : 85;
  const antiGeneric = words >= scenario.minWords && conceptHits >= 3 ? 75 : 40;

  const score = Math.round(
    (specificity + accuracy + compliance + antiGeneric) / 4
  );

  return {
    pass: score >= PASS_SCORE && flags.length === 0 && words >= scenario.minWords,
    score,
    dimensions: { accuracy, specificity, compliance, antiGeneric },
    feedback:
      score >= PASS_SCORE
        ? "Réponse validée (mode template — configurez GEMINI_API_KEY pour évaluation IA complète)."
        : "Réponse insuffisamment spécifique ou trop générique. Développez le cas concret et les risques compliance.",
    provider: "template",
    flags,
  };
}

function buildGradePrompt(scenario: AcademyScenario, response: string): string {
  return `You are a strict RWA tokenization examiner for AUROS Academy. Grade this French candidate response.

CASE:
${scenario.caseText}

TASK:
${scenario.taskText}

RUBRIC (all must be reasonably satisfied to pass):
${scenario.rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}

CANDIDATE RESPONSE:
${response}

Output ONLY valid JSON (no markdown):
{
  "accuracy": 0-100,
  "specificity": 0-100,
  "compliance": 0-100,
  "antiGeneric": 0-100,
  "pass": boolean,
  "feedback": "2-3 sentences in French",
  "flags": ["optional issue codes"]
}

Rules:
- pass=true ONLY if weighted average >= ${PASS_SCORE} AND no false regulatory claims
- Flag overclaims (guaranteed license, guaranteed returns, replaces lawyer)
- Reject generic crypto buzzword essays with no case-specific analysis
- compliance low if missing disclaimer that attestation ≠ legal advice`;
}

function parseGradeJson(raw: string): AiGradeResult | null {
  const trimmed = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  try {
    const o = JSON.parse(trimmed) as Record<string, unknown>;
    const accuracy = Number(o.accuracy);
    const specificity = Number(o.specificity);
    const compliance = Number(o.compliance);
    const antiGeneric = Number(o.antiGeneric);
    if (![accuracy, specificity, compliance, antiGeneric].every((n) => Number.isFinite(n))) {
      return null;
    }
    const score = Math.round((accuracy + specificity + compliance + antiGeneric) / 4);
    const pass = Boolean(o.pass) && score >= PASS_SCORE;
    return {
      pass,
      score,
      dimensions: { accuracy, specificity, compliance, antiGeneric },
      feedback: String(o.feedback ?? "").slice(0, 500),
      provider: "gemini",
      flags: Array.isArray(o.flags) ? o.flags.map(String) : [],
    };
  } catch {
    return null;
  }
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("no_gemini");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: AI_CONFIG.geminiModel,
    generationConfig: { maxOutputTokens: 600, temperature: 0.2 },
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function callGroq(prompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error("no_groq");
  const client = new Groq({ apiKey: key });
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_tokens: 600,
    messages: [
      { role: "system", content: "Return only valid JSON." },
      { role: "user", content: prompt },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

export async function gradeAcademyResponse(
  scenario: AcademyScenario,
  response: string
): Promise<AiGradeResult> {
  const prompt = buildGradePrompt(scenario, response);

  for (const call of [
    () => callGemini(prompt),
    () => callGroq(prompt),
  ]) {
    try {
      const raw = await call();
      const parsed = parseGradeJson(raw);
      if (parsed) {
        parsed.provider = raw.includes("gemini") ? "gemini" : "groq";
        return parsed;
      }
    } catch {
      // try next
    }
  }

  return templateGrade(scenario, response);
}

export function renewalAsScenario(): AcademyScenario {
  return {
    id: "renewal-micro",
    title: RENEWAL_BRIEF.title,
    caseText: RENEWAL_BRIEF.summary,
    taskText: RENEWAL_BRIEF.summary,
    minWords: RENEWAL_BRIEF.minWords,
    maxWords: RENEWAL_BRIEF.maxWords,
    requiredConcepts: RENEWAL_BRIEF.requiredConcepts,
    rubric: [
      "Explique la nécessité de veille réglementaire périodique",
      "Mentionne un risque concret sans veille",
      "Ne prétend pas remplacer counsel ou régulateur",
    ],
  };
}
