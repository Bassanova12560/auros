import {
  GREEN_RTMS_PILLARS,
  type GreenRtmsPillar,
} from "./constants";
import type { GreenRtmsPillarScore, GreenRtmsScore, RtmsCheck } from "./rtms-scoring";
import { computeGreenRtmsScore } from "./rtms-scoring";
import { initialWizardData } from "@/lib/wizard-constants";

export type RtmsAssistantInput = {
  projectSummary: string;
  country?: string;
  hasDocument: boolean;
};

const MIN_SUMMARY_WORDS = 12;

export function countSummaryWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function pillarScore(checks: RtmsCheck[]): number {
  if (!checks.length) return 0;
  const passed = checks.filter((c) => c.pass).length;
  return Math.round((passed / checks.length) * 100);
}

function rtmsTier(overall: number): GreenRtmsScore["tier"] {
  if (overall >= 75) return "ready";
  if (overall >= 50) return "progress";
  return "early";
}

/** Rule-based preliminary RTMS — indicative only, not certification. */
export function computePreliminaryRtmsFromSummary(
  input: RtmsAssistantInput
): GreenRtmsScore {
  const text = input.projectSummary.trim().toLowerCase();
  const wordCount = countSummaryWords(text);
  const hasDoc = input.hasDocument;

  const pillarChecks: Record<GreenRtmsPillar, RtmsCheck[]> = {
    real: [
      {
        id: "production_signal",
        pass: /mwh|kwh|solaire|solar|éolien|wind|hydro|production|surplus|rec|ppa|carbone|co2|renouvelable|renewable/.test(
          text
        ),
      },
      {
        id: "summary_depth",
        pass: wordCount >= MIN_SUMMARY_WORDS,
      },
      {
        id: "supporting_doc",
        pass: hasDoc,
      },
    ],
    transparent: [
      {
        id: "traceability",
        pass: /ppa|rec|registre|contrat|contract|trace|source|audit|attestation|on-chain|blockchain/.test(
          text
        ),
      },
      {
        id: "stakeholders",
        pass: /spv|promoteur|operator|producteur|offtaker|partenaire|partner/.test(text),
      },
      {
        id: "disclosure",
        pass: wordCount >= 20,
      },
    ],
    measurable: [
      {
        id: "impact_metrics",
        pass: /mwh|kwh|tco2|carbone|mesur|metric|période|period|kpi|baseline|annuel|annual/.test(
          text
        ),
      },
      {
        id: "methodology",
        pass: /method|methodology|standard|registry|registre|vintage|facteur|factor/.test(
          text
        ),
      },
      {
        id: "document_upload",
        pass: hasDoc,
      },
    ],
    sound: [
      {
        id: "jurisdiction",
        pass: Boolean(input.country?.trim()) || /france|luxembourg|dubai|singapore|suisse|spain|brésil|brazil/.test(text),
      },
      {
        id: "legal_mentions",
        pass: /juridique|legal|compliance|mica|regul|spv|structure|statut/.test(text),
      },
      {
        id: "risk_ack",
        pass: /risque|risk|limitation|disclaimer|incertitude|assumption/.test(text) || wordCount >= 30,
      },
    ],
  };

  const pillars = {} as Record<GreenRtmsPillar, GreenRtmsPillarScore>;
  for (const pillar of GREEN_RTMS_PILLARS) {
    const checks = pillarChecks[pillar];
    pillars[pillar] = {
      pillar,
      score: pillarScore(checks),
      checks,
    };
  }

  const overall = Math.round(
    GREEN_RTMS_PILLARS.reduce((sum, p) => sum + pillars[p].score, 0) /
      GREEN_RTMS_PILLARS.length
  );

  return {
    overall,
    tier: rtmsTier(overall),
    pillars,
  };
}

/** Bridge wizard dossier data when available (full RTMS). */
export function computeRtmsForAssistant(
  input: RtmsAssistantInput
): GreenRtmsScore {
  if (countSummaryWords(input.projectSummary) >= MIN_SUMMARY_WORDS) {
    return computePreliminaryRtmsFromSummary(input);
  }
  return computeGreenRtmsScore({
    ...initialWizardData,
    description: input.projectSummary,
    country: input.country ?? "",
  });
}

export type RtmsGapPriority = {
  id: string;
  pillar: GreenRtmsPillar;
  label: string;
};

const GAP_LABELS: Record<string, Record<"fr" | "en" | "es", string>> = {
  production_signal: {
    fr: "Préciser la production ou l'impact énergétique",
    en: "Clarify production or energy impact",
    es: "Precisar producción o impacto energético",
  },
  summary_depth: {
    fr: "Enrichir le résumé du projet",
    en: "Expand the project summary",
    es: "Ampliar el resumen del proyecto",
  },
  supporting_doc: {
    fr: "Joindre un dossier PDF de soutien",
    en: "Attach a supporting PDF dossier",
    es: "Adjuntar un dossier PDF de apoyo",
  },
  traceability: {
    fr: "Documenter la traçabilité (PPA, REC, contrats)",
    en: "Document traceability (PPA, REC, contracts)",
    es: "Documentar trazabilidad (PPA, REC, contratos)",
  },
  stakeholders: {
    fr: "Identifier les parties prenantes (SPV, opérateur)",
    en: "Identify stakeholders (SPV, operator)",
    es: "Identificar partes (SPV, operador)",
  },
  disclosure: {
    fr: "Détailler davantage les informations publiques",
    en: "Add more public disclosure detail",
    es: "Detallar más la información pública",
  },
  impact_metrics: {
    fr: "Ajouter des métriques d'impact mesurables",
    en: "Add measurable impact metrics",
    es: "Añadir métricas de impacto medibles",
  },
  methodology: {
    fr: "Préciser méthodologie ou registre carbone",
    en: "Specify methodology or carbon registry",
    es: "Precisar metodología o registro de carbono",
  },
  document_upload: {
    fr: "Téléverser un PDF pour corroborer les métriques",
    en: "Upload a PDF to corroborate metrics",
    es: "Subir un PDF para corroborar métricas",
  },
  jurisdiction: {
    fr: "Indiquer pays ou juridiction du projet",
    en: "State project country or jurisdiction",
    es: "Indicar país o jurisdicción del proyecto",
  },
  legal_mentions: {
    fr: "Mentionner structure juridique ou conformité",
    en: "Mention legal structure or compliance",
    es: "Mencionar estructura jurídica o cumplimiento",
  },
  risk_ack: {
    fr: "Reconnaître limites ou hypothèses du dossier",
    en: "Acknowledge dossier limits or assumptions",
    es: "Reconocer límites o supuestos del dossier",
  },
};

function gapLabel(id: string, locale: string): string {
  const loc = locale === "es" ? "es" : locale === "en" ? "en" : "fr";
  return GAP_LABELS[id]?.[loc] ?? id;
}

/** UX: max 3 visible gap priorities (readiness-ease pattern). */
export function extractTopRtmsGapPriorities(
  score: GreenRtmsScore,
  locale: string = "fr",
  max = 3
): RtmsGapPriority[] {
  const out: RtmsGapPriority[] = [];
  for (const pillar of GREEN_RTMS_PILLARS) {
    for (const check of score.pillars[pillar].checks) {
      if (check.pass) continue;
      out.push({
        id: check.id,
        pillar,
        label: gapLabel(check.id, locale),
      });
      if (out.length >= max) return out;
    }
  }
  return out;
}

export { MIN_SUMMARY_WORDS };