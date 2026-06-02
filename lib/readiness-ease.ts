import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import { getEaseMessages, type EaseMessages } from "@/lib/ease-i18n";
import { DOC_NONE } from "@/lib/wizard-constants";
import { normalizeDocumentIds } from "@/lib/rwa-document-phases";
import type { Locale } from "@/lib/i18n";
import type { WizardData } from "@/lib/wizard-types";

export type EasePriority = {
  id: string;
  label: string;
};

export type EaseSummary = {
  headline: string;
  subline: string;
  essentialsDone: number;
  essentialsTotal: number;
  admissionPercent: number;
  score: number;
  priorities: EasePriority[];
  tone: "ready" | "progress" | "start";
};

function essentialsCheck(data: WizardData): boolean[] {
  const docs = normalizeDocumentIds(
    (data.documents ?? []).filter((d) => d !== DOC_NONE)
  );
  const hasDocsChoice =
    docs.length > 0 || (data.documents ?? []).includes(DOC_NONE);
  const wordCount = data.description?.trim().split(/\s+/).filter(Boolean).length ?? 0;

  return [
    !!data.assetType?.trim(),
    wordCount >= 20,
    (data.estimatedValue ?? 0) >= 10_000 && !!data.country?.trim(),
    hasDocsChoice,
    !!data.platform?.trim() && !!data.timeline?.trim(),
    !!data.email?.trim() && !!data.legalStructure?.trim(),
  ];
}

function buildPriorities(data: WizardData, m: EaseMessages): EasePriority[] {
  const held = new Set(normalizeDocumentIds(data.documents ?? []));
  const out: EasePriority[] = [];

  const wordCount = data.description?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  if (wordCount < 20) {
    out.push({ id: "description", label: m.gaps.description });
  }
  if ((data.estimatedValue ?? 0) < 10_000 || !data.country?.trim()) {
    out.push({ id: "value", label: m.gaps.valueLocation });
  }
  if (!data.email?.trim()) {
    out.push({ id: "contact", label: m.gaps.contact });
  }
  if (!data.legalStructure?.trim() || (data.legalStatus?.length ?? 0) === 0) {
    out.push({ id: "compliance", label: m.gaps.compliance });
  }
  if (held.size < 3 && !(data.documents ?? []).includes(DOC_NONE)) {
    out.push({ id: "documents", label: m.gaps.documents });
  }
  if (!held.has("proof_of_ownership")) {
    out.push({ id: "ownership", label: m.gaps.ownership });
  }
  if (!held.has("valuation_report")) {
    out.push({ id: "valuation", label: m.gaps.valuation });
  }

  const seen = new Set<string>();
  const unique: EasePriority[] = [];
  for (const p of out) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    unique.push(p);
    if (unique.length >= 3) break;
  }
  return unique;
}

export function computeEaseSummary(
  data: WizardData,
  locale: Locale,
  score?: number
): EaseSummary {
  const m = getEaseMessages(locale);
  const readiness = computeAdmissionReadiness(data);
  const essentials = essentialsCheck(data);
  const essentialsDone = essentials.filter(Boolean).length;
  const essentialsTotal = essentials.length;
  const admissionPercent = readiness.overallAdmission;
  const resolvedScore = score ?? admissionPercent;

  let tone: EaseSummary["tone"] = "start";
  if (essentialsDone >= 5 && admissionPercent >= 55) tone = "ready";
  else if (essentialsDone >= 3 || admissionPercent >= 35) tone = "progress";

  const priorities = buildPriorities(data, m);

  return {
    headline: m.headlines[tone],
    subline: m.sublines[tone],
    essentialsDone,
    essentialsTotal,
    admissionPercent,
    score: resolvedScore,
    priorities,
    tone,
  };
}
