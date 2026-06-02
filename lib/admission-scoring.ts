/**
 * Platform admission readiness — distinct from generic "tokenization score".
 * Drives AUROS differentiation: show % chance of acceptance + actionable gaps.
 */

import { COUNTRIES_EUROPE } from "@/lib/wizard-countries";
import {
  ALL_RWA_DOCUMENT_IDS,
  documentPhaseProgress,
  normalizeDocumentIds,
  RWA_DOCUMENT_WEIGHTS,
  type RwaDocumentId,
} from "@/lib/rwa-document-phases";
import {
  RWA_PLATFORMS,
  type RwaPlatformDef,
  type RwaPlatformId,
} from "@/lib/rwa-platforms";
import { assetSlugFromLabel, valueInEur } from "@/lib/platform-match";
import type { WizardData } from "@/lib/wizard-types";

const EU_SET = new Set<string>(COUNTRIES_EUROPE);

export type AdmissionCriterion = {
  id: string;
  label: string;
  met: boolean;
  weight: number;
  tip?: string;
};

export type PlatformAdmissionResult = {
  id: RwaPlatformId;
  name: string;
  admissionPercent: number;
  matchPercent: number;
  label: "HIGH ADMISSION" | "LIKELY" | "POSSIBLE" | "LOW";
  description: string;
  url: string;
  processTimeline: string;
  keyRequirements: string;
  missingDocuments: string[];
  criteria: AdmissionCriterion[];
};

export type AdmissionReadiness = {
  /** Best achievable admission among platforms (0–100) */
  overallAdmission: number;
  /** Data room completion from 15-doc checklist */
  dataRoomPercent: number;
  /** Cross-cutting regulatory & legal readiness */
  compliancePercent: number;
  label: "READY TO SUBMIT" | "STRONG CANDIDATE" | "IN PREPARATION" | "EARLY STAGE";
  topPlatforms: PlatformAdmissionResult[];
  phaseProgress: ReturnType<typeof documentPhaseProgress>;
  missingDocuments: string[];
  nextActions: string[];
};

function admissionLabel(
  percent: number
): PlatformAdmissionResult["label"] {
  if (percent >= 82) return "HIGH ADMISSION";
  if (percent >= 68) return "LIKELY";
  if (percent >= 50) return "POSSIBLE";
  return "LOW";
}

function overallLabel(percent: number): AdmissionReadiness["label"] {
  if (percent >= 85) return "READY TO SUBMIT";
  if (percent >= 70) return "STRONG CANDIDATE";
  if (percent >= 50) return "IN PREPARATION";
  return "EARLY STAGE";
}

function computeComplianceScore(data: WizardData): {
  percent: number;
  criteria: AdmissionCriterion[];
} {
  const criteria: AdmissionCriterion[] = [
    {
      id: "legal_structure",
      label: "Legal structure defined (SPV / company / trust)",
      met: Boolean(data.legalStructure?.trim()),
      weight: 12,
      tip: "Complete step 10 in the wizard",
    },
    {
      id: "clear_title",
      label: "Clear title — no disputes",
      met: data.legalStatus.includes("Clear title — no disputes"),
      weight: 14,
      tip: "Confirm ownership in compliance step",
    },
    {
      id: "tax_compliant",
      label: "Tax compliant in jurisdiction",
      met: data.legalStatus.includes("Tax compliant in jurisdiction"),
      weight: 10,
      tip: "Validate tax status with your advisor",
    },
    {
      id: "no_encumbrance",
      label: "No mortgage or encumbrance",
      met: data.legalStatus.includes("No mortgage or encumbrance"),
      weight: 8,
    },
    {
      id: "investor_profile",
      label: "Investor profile defined",
      met: Boolean(data.investorProfile?.trim()),
      weight: 8,
    },
    {
      id: "cashflow_declared",
      label: "Income / cashflow documented",
      met:
        (data.incomeType === "rental" || data.incomeType === "other") &&
        data.incomeAmountYear > 0,
      weight: 10,
      tip: "Declare rental or asset income in the wizard",
    },
    {
      id: "location",
      label: "Asset location complete",
      met: Boolean(data.country?.trim() && data.city?.trim()),
      weight: 8,
    },
    {
      id: "description",
      label: "Asset description (20+ words)",
      met: (data.description?.split(/\s+/).filter(Boolean).length ?? 0) >= 20,
      weight: 10,
    },
    {
      id: "valuation",
      label: "Estimated value provided",
      met: data.estimatedValue > 0,
      weight: 10,
    },
    {
      id: "contact",
      label: "Contact details for issuer",
      met: Boolean(data.email?.trim() && data.firstName?.trim()),
      weight: 10,
    },
  ];

  const max = criteria.reduce((s, c) => s + c.weight, 0);
  const earned = criteria.filter((c) => c.met).reduce((s, c) => s + c.weight, 0);
  return {
    percent: max ? Math.round((earned / max) * 100) : 0,
    criteria,
  };
}

function computeDataRoomPercent(held: RwaDocumentId[]): number {
  const max = ALL_RWA_DOCUMENT_IDS.reduce(
    (s, id) => s + (RWA_DOCUMENT_WEIGHTS[id] ?? 0),
    0
  );
  const earned = held.reduce(
    (s, id) => s + (RWA_DOCUMENT_WEIGHTS[id] ?? 0),
    0
  );
  return max ? Math.round((earned / max) * 100) : 0;
}

function scorePlatform(
  platform: RwaPlatformDef,
  data: WizardData,
  held: RwaDocumentId[],
  compliancePercent: number
): PlatformAdmissionResult {
  const slug = assetSlugFromLabel(data.assetType);
  const value = valueInEur(data.estimatedValue, data.currency ?? "EUR");
  const heldSet = new Set(held);
  const missingDocuments = platform.requiredDocuments.filter(
    (id) => !heldSet.has(id)
  );

  const criteria: AdmissionCriterion[] = [];

  let assetFit = 35;
  if (platform.preferredAssets.includes(slug)) assetFit = 85;
  else if (platform.preferredAssets.includes("other")) assetFit = 45;
  criteria.push({
    id: "asset_fit",
    label: "Asset class fit for platform",
    met: assetFit >= 80,
    weight: 20,
  });

  let valueFit = 50;
  if (platform.minValueEur && value < platform.minValueEur) valueFit = 25;
  else if (platform.maxValueEur && value > platform.maxValueEur) valueFit = 40;
  else if (platform.minValueEur && value >= platform.minValueEur) valueFit = 90;
  else valueFit = 70;
  criteria.push({
    id: "value_band",
    label: "Value within platform range",
    met: valueFit >= 70,
    weight: 15,
    tip:
      platform.minValueEur && value < platform.minValueEur
        ? `Minimum ~€${platform.minValueEur.toLocaleString()} for this platform`
        : undefined,
  });

  if (platform.requiresEu) {
    const eu = EU_SET.has(data.country);
    criteria.push({
      id: "eu_jurisdiction",
      label: "EU / regulated jurisdiction",
      met: eu,
      weight: 10,
    });
  }

  if (platform.requiresAccredited) {
    const acc =
      data.investorProfile === "Accredited investors only" ||
      data.investorProfile === "Institutional investors";
    criteria.push({
      id: "accredited",
      label: "Accredited / institutional investor profile",
      met: acc,
      weight: 12,
      tip: "Set investor profile to accredited in the wizard",
    });
  }

  if (platform.requiresCashflow) {
    const cf =
      (data.incomeType === "rental" || data.incomeType === "other") &&
      data.incomeAmountYear > 0;
    criteria.push({
      id: "cashflow",
      label: "Recognized cashflow or yield",
      met: cf,
      weight: 12,
      tip: "Document rental or operating income",
    });
  }

  const docWeight = platform.requiredDocuments.length
    ? Math.round(
        (platform.requiredDocuments.filter((id) => heldSet.has(id)).length /
          platform.requiredDocuments.length) *
          100
      )
    : 0;
  criteria.push({
    id: "required_docs",
    label: "Required data-room documents",
    met: docWeight >= 80,
    weight: 25,
    tip:
      missingDocuments.length > 0
        ? `Missing: ${missingDocuments.slice(0, 3).join(", ")}`
        : undefined,
  });

  const criteriaScore =
    criteria.reduce((s, c) => (c.met ? s + c.weight : s), 0) /
    Math.max(1, criteria.reduce((s, c) => s + c.weight, 0));

  const admissionPercent = Math.min(
    100,
    Math.round(
      docWeight * 0.4 +
        compliancePercent * 0.25 +
        assetFit * 0.2 +
        valueFit * 0.15 * criteriaScore
    )
  );

  const matchPercent = Math.min(
    100,
    Math.round(assetFit * 0.35 + valueFit * 0.25 + docWeight * 0.4)
  );

  return {
    id: platform.id,
    name: platform.name,
    admissionPercent,
    matchPercent,
    label: admissionLabel(admissionPercent),
    description: platform.description,
    url: platform.url,
    processTimeline: platform.processTimeline,
    keyRequirements: platform.keyRequirements,
    missingDocuments,
    criteria,
  };
}

export function computeAdmissionReadiness(data: WizardData): AdmissionReadiness {
  const held = normalizeDocumentIds(data.documents ?? []);
  const dataRoomPercent = computeDataRoomPercent(held);
  const { percent: compliancePercent } = computeComplianceScore(data);
  const phaseProgress = documentPhaseProgress(held);

  const topPlatforms = RWA_PLATFORMS.map((p) =>
    scorePlatform(p, data, held, compliancePercent)
  )
    .sort((a, b) => b.admissionPercent - a.admissionPercent)
    .slice(0, 5);

  const overallAdmission = Math.min(
    100,
    Math.round(
      dataRoomPercent * 0.45 +
        compliancePercent * 0.35 +
        (topPlatforms[0]?.admissionPercent ?? 0) * 0.2
    )
  );

  const missingDocuments = ALL_RWA_DOCUMENT_IDS.filter(
    (id) => !held.includes(id)
  ).map((id) => id.replace(/_/g, " "));

  const nextActions: string[] = [];
  if (!held.includes("proof_of_ownership")) {
    nextActions.push("Obtain proof of ownership (title, registry extract, or certificate)");
  }
  if (!held.includes("valuation_report")) {
    nextActions.push("Commission an independent valuation report");
  }
  if (!held.includes("legal_opinion")) {
    nextActions.push("Request a legal opinion for your jurisdiction and instrument");
  }
  if (!held.includes("kyc_aml_policy")) {
    nextActions.push("Prepare KYC/AML procedures for issuer and investors");
  }
  if (compliancePercent < 70) {
    nextActions.push("Complete compliance fields in the wizard (steps 10–14)");
  }
  if (dataRoomPercent < 60) {
    nextActions.push("Fill the 5-phase data room checklist in step 5");
  }

  return {
    overallAdmission,
    dataRoomPercent,
    compliancePercent,
    label: overallLabel(overallAdmission),
    topPlatforms,
    phaseProgress,
    missingDocuments: missingDocuments.slice(0, 8),
    nextActions: nextActions.slice(0, 6),
  };
}

/** Map wizard platform label → our platform id for highlighted target */
export function targetPlatformId(platformLabel: string): RwaPlatformId | null {
  const map: Record<string, RwaPlatformId> = {
    Centrifuge: "centrifuge",
    TokenFi: "tokenfi",
    "RWA.xyz": "rwa_xyz",
    "IX Swap": "ix_swap",
    Stobox: "stobox",
    "Ondo Finance": "ondo",
    Polymesh: "polymesh",
    DeFiLlama: "defillama",
  };
  return map[platformLabel] ?? null;
}
