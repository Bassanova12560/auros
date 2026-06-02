import { countWords, detectPasteBomb } from "./anti-cheat";
import {
  CHALLENGE_MIN_FIELD_WORDS,
  RENEWAL_MIN_FIELD_WORDS,
} from "./constants";
import type { AcademyLocale } from "./i18n";
import type { AiGradeResult } from "./types";

export type StructuredField = {
  id: string;
  label: string;
  prompt: string;
  hint: string;
  minWords: number;
  maxWords: number;
  requiredConcepts: string[];
  minConceptHits: number;
};

export type StructuredChallenge = {
  id: string;
  title: string;
  intro: string;
  fields: StructuredField[];
};

export const FUNDAMENTALS_STRUCTURED_CHALLENGE: StructuredChallenge = {
  id: "fundamentals-structured",
  title: "Validation pratique — 3 points clés",
  intro:
    "Répondez en 2–4 phrases par point. Pas de mémo : critères objectifs affichés, validation automatique (pas de jury subjectif).",
  fields: [
    {
      id: "phase0",
      label: "Phase 0 et juridiction",
      prompt: "Pourquoi choisir la juridiction et la structuration AVANT le choix blockchain / tech ?",
      hint: "Mentionnez : juridiction ou SPV, conformité/réglementation, ou phase 0.",
      minWords: 0,
      maxWords: 120,
      requiredConcepts: [
        "juridiction",
        "phase",
        "structur",
        "spv",
        "conform",
        "reglement",
        "réglement",
        "legal",
        "tech",
        "blockchain",
      ],
      minConceptHits: 2,
    },
    {
      id: "dataroom",
      label: "Data room et due diligence",
      prompt: "Citez deux éléments ou risques si la data room est incomplète avant émission.",
      hint: "Mentionnez : data room, due diligence, documents, investisseur, ou risque compliance.",
      minWords: 0,
      maxWords: 120,
      requiredConcepts: [
        "data room",
        "due diligence",
        "document",
        "investisseur",
        "risque",
        "compliance",
        "conform",
        "titres",
        "prospectus",
      ],
      minConceptHits: 2,
    },
    {
      id: "disclaimer",
      label: "Limite de l'attestation AUROS",
      prompt: "Que garantit — et que ne garantit PAS — une attestation AUROS Academy ?",
      hint: "Précisez : attestation indicative, ne remplace pas counsel / agrément AMF-CSSF.",
      minWords: 0,
      maxWords: 100,
      requiredConcepts: [
        "attestation",
        "counsel",
        "agrement",
        "agrément",
        "amf",
        "cssf",
        "conseil",
        "indicatif",
        "remplace pas",
        "ne remplace",
        "licence",
      ],
      minConceptHits: 2,
    },
  ],
};

export const FUNDAMENTALS_STRUCTURED_CHALLENGE_EN: StructuredChallenge = {
  id: "fundamentals-structured",
  title: "Practical validation — 3 key points",
  intro:
    "Answer in 2–4 sentences per point. Objective criteria shown — automatic validation (no subjective jury).",
  fields: [
    {
      id: "phase0",
      label: "Phase 0 and jurisdiction",
      prompt: "Why choose jurisdiction and structuring BEFORE blockchain / tech choices?",
      hint: "Mention: jurisdiction or SPV, compliance/regulation, or phase 0.",
      minWords: 0,
      maxWords: 120,
      requiredConcepts: [
        "jurisdiction",
        "phase",
        "structur",
        "spv",
        "compliance",
        "regulation",
        "legal",
        "tech",
        "blockchain",
      ],
      minConceptHits: 2,
    },
    {
      id: "dataroom",
      label: "Data room and due diligence",
      prompt: "Name two elements or risks if the data room is incomplete before issuance.",
      hint: "Mention: data room, due diligence, documents, investor, or compliance risk.",
      minWords: 0,
      maxWords: 120,
      requiredConcepts: [
        "data room",
        "due diligence",
        "document",
        "investor",
        "risk",
        "compliance",
        "prospectus",
      ],
      minConceptHits: 2,
    },
    {
      id: "disclaimer",
      label: "Limits of AUROS certificate",
      prompt: "What does — and what does NOT — an AUROS Academy certificate guarantee?",
      hint: "State: indicative certificate, does not replace counsel / AMF-CSSF approval.",
      minWords: 0,
      maxWords: 100,
      requiredConcepts: [
        "certificate",
        "counsel",
        "approval",
        "amf",
        "cssf",
        "indicative",
        "does not replace",
        "not replace",
        "license",
      ],
      minConceptHits: 2,
    },
  ],
};

export const FUNDAMENTALS_STRUCTURED_CHALLENGE_ES: StructuredChallenge = {
  id: "fundamentals-structured",
  title: "Validación práctica — 3 puntos clave",
  intro:
    "Responda en 2–4 frases por punto. Criterios objetivos visibles — validación automática (sin jurado subjetivo).",
  fields: [
    {
      id: "phase0",
      label: "Fase 0 y jurisdicción",
      prompt: "¿Por qué elegir jurisdicción y estructuración ANTES de blockchain / tech?",
      hint: "Mencione: jurisdicción o SPV, compliance/regulación, o fase 0.",
      minWords: 0,
      maxWords: 120,
      requiredConcepts: [
        "jurisdiccion",
        "jurisdicción",
        "fase",
        "phase",
        "structur",
        "spv",
        "compliance",
        "regulacion",
        "regulación",
        "legal",
        "blockchain",
      ],
      minConceptHits: 2,
    },
    {
      id: "dataroom",
      label: "Data room y due diligence",
      prompt: "Cite dos elementos o riesgos si la data room está incompleta antes de emitir.",
      hint: "Mencione: data room, due diligence, documentos, inversor, riesgo compliance.",
      minWords: 0,
      maxWords: 120,
      requiredConcepts: [
        "data room",
        "due diligence",
        "document",
        "inversor",
        "riesgo",
        "compliance",
        "prospecto",
      ],
      minConceptHits: 2,
    },
    {
      id: "disclaimer",
      label: "Límite del certificado AUROS",
      prompt: "¿Qué garantiza — y qué NO garantiza — un certificado AUROS Academy?",
      hint: "Precise: certificado indicativo, no sustituye counsel / aprobación AMF-CSSF.",
      minWords: 0,
      maxWords: 100,
      requiredConcepts: [
        "certificado",
        "attestation",
        "counsel",
        "amf",
        "cssf",
        "indicativ",
        "no sustitu",
        "no reemplaz",
        "licencia",
      ],
      minConceptHits: 2,
    },
  ],
};

export function getFundamentalsStructuredChallenge(locale: AcademyLocale = "fr"): StructuredChallenge {
  const base =
    locale === "en"
      ? FUNDAMENTALS_STRUCTURED_CHALLENGE_EN
      : locale === "es"
        ? FUNDAMENTALS_STRUCTURED_CHALLENGE_ES
        : FUNDAMENTALS_STRUCTURED_CHALLENGE;
  return withFieldStandards(base, {
    minWords: CHALLENGE_MIN_FIELD_WORDS,
    minConceptHits: 3,
  });
}

export const RENEWAL_STRUCTURED_CHALLENGE: StructuredChallenge = {
  id: "renewal-structured",
  title: "Micro-màj — veille RWA",
  intro: "Une seule réponse courte (2–4 phrases) sur le renouvellement d'attestation.",
  fields: [
    {
      id: "veille",
      label: "Veille et renouvellement",
      prompt:
        "Pourquoi renouveler sa veille réglementaire tous les 90 jours ? Citez un risque concret sans veille.",
      hint: "Mentionnez : veille, mise à jour, réglement/MiCA, risque compliance ou juridiction.",
      minWords: 0,
      maxWords: 150,
      requiredConcepts: [
        "veille",
        "renouvel",
        "mise a jour",
        "mise à jour",
        "reglement",
        "réglement",
        "mica",
        "risque",
        "compliance",
        "conform",
        "juridiction",
      ],
      minConceptHits: 2,
    },
  ],
};

export const RENEWAL_STRUCTURED_CHALLENGE_EN: StructuredChallenge = {
  id: "renewal-structured",
  title: "Micro-update — RWA watch",
  intro: "One short answer (2–4 sentences) on certificate renewal.",
  fields: [
    {
      id: "veille",
      label: "Watch and renewal",
      prompt:
        "Why renew regulatory watch every 90 days? Cite one concrete risk without watch.",
      hint: "Mention: watch, update, regulation/MiCA, compliance or jurisdiction risk.",
      minWords: 0,
      maxWords: 150,
      requiredConcepts: [
        "watch",
        "renew",
        "update",
        "regulation",
        "mica",
        "risk",
        "compliance",
        "jurisdiction",
        "veille",
      ],
      minConceptHits: 2,
    },
  ],
};

export const RENEWAL_STRUCTURED_CHALLENGE_ES: StructuredChallenge = {
  id: "renewal-structured",
  title: "Micro-actualización — veille RWA",
  intro: "Una respuesta corta (2–4 frases) sobre renovación del certificado.",
  fields: [
    {
      id: "veille",
      label: "Veille y renovación",
      prompt:
        "¿Por qué renovar la veille regulatoria cada 90 días? Cite un riesgo concreto sin veille.",
      hint: "Mencione: veille, actualización, regulación/MiCA, riesgo compliance o jurisdicción.",
      minWords: 0,
      maxWords: 150,
      requiredConcepts: [
        "veille",
        "renouvel",
        "renov",
        "actualiz",
        "regulacion",
        "regulación",
        "mica",
        "riesgo",
        "compliance",
        "jurisdiccion",
        "jurisdicción",
      ],
      minConceptHits: 2,
    },
  ],
};

export function getRenewalStructuredChallenge(locale: AcademyLocale = "fr"): StructuredChallenge {
  const base =
    locale === "en"
      ? RENEWAL_STRUCTURED_CHALLENGE_EN
      : locale === "es"
        ? RENEWAL_STRUCTURED_CHALLENGE_ES
        : RENEWAL_STRUCTURED_CHALLENGE;
  return withFieldStandards(base, { minWords: RENEWAL_MIN_FIELD_WORDS });
}

function withFieldStandards(
  challenge: StructuredChallenge,
  opts: { minWords: number; minConceptHits?: number }
): StructuredChallenge {
  return {
    ...challenge,
    fields: challenge.fields.map((field) => ({
      ...field,
      minWords: Math.max(field.minWords, opts.minWords),
      minConceptHits: opts.minConceptHits ?? field.minConceptHits,
    })),
  };
}

export function toPublicStructuredChallenge(challenge: StructuredChallenge) {
  return {
    id: challenge.id,
    title: challenge.title,
    intro: challenge.intro,
    fields: challenge.fields.map((f) => ({
      id: f.id,
      label: f.label,
      prompt: f.prompt,
      hint: f.hint,
      minWords: f.minWords,
      maxWords: f.maxWords,
    })),
  };
}

export function getStructuredChallengeById(
  id: string,
  locale: AcademyLocale = "fr"
): StructuredChallenge | undefined {
  if (id === FUNDAMENTALS_STRUCTURED_CHALLENGE.id) {
    return getFundamentalsStructuredChallenge(locale);
  }
  if (id === RENEWAL_STRUCTURED_CHALLENGE.id) {
    return getRenewalStructuredChallenge(locale);
  }
  return undefined;
}

export type GradeFeedbackCopy = {
  pass: string;
  fail: (labels: string) => string;
  incomplete: string;
  pasteBomb: string;
  duplicateFields: string;
};

function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function fieldTextsTooSimilar(a: string, b: string): boolean {
  const tokenize = (text: string) =>
    new Set(
      normalizeText(text)
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
  const wordsA = tokenize(a);
  const wordsB = tokenize(b);
  if (wordsA.size < 4 || wordsB.size < 4) return false;
  let intersection = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) intersection += 1;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union > 0.55;
}

function hasDuplicateFieldAnswers(fields: Record<string, string>, ids: string[]): boolean {
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const a = fields[ids[i]!]?.trim() ?? "";
      const b = fields[ids[j]!]?.trim() ?? "";
      if (a && b && fieldTextsTooSimilar(a, b)) return true;
    }
  }
  return false;
}

function countConceptHits(text: string, concepts: string[]): number {
  const norm = normalizeText(text);
  return concepts.filter((c) => norm.includes(normalizeText(c))).length;
}

const BANNED_PHRASES = [
  "100%",
  "sans risque",
  "risk free",
  "risk-free",
  "sin riesgo",
  "licence obtenue",
  "license obtained",
  "licencia obtenida",
  "cssf approuve",
  "cssf approved",
  "cssf aprueba",
  "agrement obtenu",
  "agrément obtenu",
  "approval obtained",
  "aprobacion obtenida",
  "garantie absolue",
  "totally guaranteed",
  "totalmente garantizado",
  "totalement garanti",
  "garanti a 100",
  "garanti à 100",
  "guaranteed 100",
];

function hasOverclaim(text: string): string | null {
  const norm = normalizeText(text);
  for (const phrase of BANNED_PHRASES) {
    if (norm.includes(normalizeText(phrase))) return phrase;
  }
  return null;
}

export type FieldGrade = {
  id: string;
  pass: boolean;
  words: number;
  conceptHits: number;
  issues: string[];
};

export function gradeStructuredFields(
  challenge: StructuredChallenge,
  fields: Record<string, string>,
  feedbackCopy?: GradeFeedbackCopy
): { pass: boolean; fieldGrades: FieldGrade[]; result: AiGradeResult } {
  const fieldGrades: FieldGrade[] = [];
  const allText = Object.values(fields).join(" ");
  const fb = feedbackCopy ?? {
    pass: "Validation réussie — les 3 points clés sont couverts. Attestation délivrée.",
    fail: (labels: string) =>
      `Point(s) à compléter : ${labels}. Relisez les indices sous chaque question.`,
    incomplete: "Réponses incomplètes — développez chaque point avec les mots-clés suggérés.",
    pasteBomb: "Réponse rejetée (format suspect). Rédigez vos propres phrases courtes.",
    duplicateFields:
      "Les réponses semblent identiques — rédigez un contenu distinct pour chaque point.",
  };

  if (detectPasteBomb(allText)) {
    return {
      pass: false,
      fieldGrades: [],
      result: {
        pass: false,
        score: 0,
        dimensions: { accuracy: 0, specificity: 0, compliance: 0, antiGeneric: 0 },
        feedback: fb.pasteBomb,
        provider: "template",
        flags: ["paste_bomb"],
      },
    };
  }

  const fieldIds = challenge.fields.map((field) => field.id);
  if (fieldIds.length > 1 && hasDuplicateFieldAnswers(fields, fieldIds)) {
    return {
      pass: false,
      fieldGrades: [],
      result: {
        pass: false,
        score: 0,
        dimensions: { accuracy: 0, specificity: 0, compliance: 0, antiGeneric: 0 },
        feedback: fb.duplicateFields,
        provider: "template",
        flags: ["duplicate_fields"],
      },
    };
  }

  for (const field of challenge.fields) {
    const text = (fields[field.id] ?? "").trim();
    const words = countWords(text);
    const issues: string[] = [];

    if (field.minWords > 0 && words < field.minWords) issues.push("too_short");
    if (words > field.maxWords) issues.push("too_long");
    const overclaim = hasOverclaim(text);
    if (overclaim) issues.push(`overclaim:${overclaim}`);

    const conceptHits = countConceptHits(text, field.requiredConcepts);
    if (conceptHits < field.minConceptHits) issues.push("missing_concepts");

    fieldGrades.push({
      id: field.id,
      pass: issues.length === 0,
      words,
      conceptHits,
      issues,
    });
  }

  const passed = fieldGrades.filter((g) => g.pass).length;
  const total = challenge.fields.length;
  const score = Math.round((passed / total) * 100);

  const failedLabels = fieldGrades
    .filter((g) => !g.pass)
    .map((g) => challenge.fields.find((f) => f.id === g.id)?.label ?? g.id);

  const feedback =
    passed === total
      ? fb.pass
      : failedLabels.length > 0
        ? fb.fail(failedLabels.join(", "))
        : fb.incomplete;

  const result: AiGradeResult = {
    pass: passed === total,
    score,
    dimensions: {
      accuracy: score,
      specificity: score,
      compliance: fieldGrades.some((g) => g.issues.some((i) => i.startsWith("overclaim"))) ? 30 : 90,
      antiGeneric: score,
    },
    feedback,
    provider: "template",
    flags: fieldGrades.flatMap((g) => g.issues),
  };

  return { pass: result.pass, fieldGrades, result };
}

/** Parse API payload — supports legacy single string or structured fields. */
export function parseChallengeFields(input: {
  response?: string;
  fields?: Record<string, string>;
}): Record<string, string> | null {
  if (input.fields && typeof input.fields === "object") {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(input.fields)) {
      if (typeof v === "string") out[k] = v;
    }
    return out;
  }
  if (typeof input.response === "string" && input.response.trim().startsWith("{")) {
    try {
      const o = JSON.parse(input.response) as { fields?: Record<string, string> };
      if (o.fields) return parseChallengeFields({ fields: o.fields });
    } catch {
      return null;
    }
  }
  return null;
}

/** Test / simulation helper — builds responses that pass rule-based grading. */
export function buildPassFields(challenge: StructuredChallenge): Record<string, string> {
  const templates: Record<string, string> = {
    phase0:
      "Phase 0 : juridiction et structuration SPV avant choix blockchain et tech. Conformité réglementaire fixe le cadre legal et la structuration.",
    dataroom:
      "Data room incomplète : due diligence investisseur sans documents clés, risque compliance et titres avant émission prospectus.",
    disclaimer:
      "Attestation AUROS indicative de compréhension — ne remplace pas counsel juridique ni agrément AMF-CSSF.",
    veille:
      "Veille réglementaire et renouvellement tous les 90 jours : sans mise à jour MiCA, risque compliance et juridiction.",
  };
  const out: Record<string, string> = {};
  for (const field of challenge.fields) {
    const concepts = field.requiredConcepts.slice(0, Math.max(field.minConceptHits, 2));
    out[field.id] =
      templates[field.id] ??
      `${field.label}. ${concepts.join(", ")}. Juridiction phase 0, data room, attestation indicative ne remplace pas counsel AMF-CSSF.`;
  }
  return out;
}
