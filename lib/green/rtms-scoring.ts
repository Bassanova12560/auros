import { DOC_NONE } from "@/lib/wizard-constants";
import type { WizardData } from "@/lib/wizard-types";

import {
  GREEN_RTMS_PILLARS,
  GREEN_WIZARD_ASSET_TYPE,
  type GreenRtmsPillar,
} from "./constants";

export type RtmsCheck = {
  id: string;
  pass: boolean;
};

export type GreenRtmsPillarScore = {
  pillar: GreenRtmsPillar;
  score: number;
  checks: RtmsCheck[];
};

export type GreenRtmsTier = "early" | "progress" | "ready";

export type GreenRtmsScore = {
  overall: number;
  tier: GreenRtmsTier;
  pillars: Record<GreenRtmsPillar, GreenRtmsPillarScore>;
};

export function isGreenWizardAsset(assetType?: string): boolean {
  return assetType === GREEN_WIZARD_ASSET_TYPE;
}

function textBlob(data: WizardData): string {
  return [
    data.description,
    data.additionalNotes,
    data.incomeDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function realDocuments(data: WizardData): string[] {
  return data.documents.filter((d) => d !== DOC_NONE);
}

function pillarScore(checks: RtmsCheck[]): number {
  if (!checks.length) return 0;
  const passed = checks.filter((c) => c.pass).length;
  return Math.round((passed / checks.length) * 100);
}

function rtmsTier(overall: number): GreenRtmsTier {
  if (overall >= 75) return "ready";
  if (overall >= 50) return "progress";
  return "early";
}

export function computeGreenRtmsScore(data: WizardData): GreenRtmsScore {
  const text = textBlob(data);
  const docs = realDocuments(data);

  const pillarChecks: Record<GreenRtmsPillar, RtmsCheck[]> = {
    real: [
      {
        id: "production_evidence",
        pass: /mwh|kwh|solaire|solar|éolien|wind|hydro|production|surplus|rec|ppa|carbone|co2/.test(
          text
        ),
      },
      {
        id: "supporting_docs",
        pass: docs.length > 0,
      },
      {
        id: "asset_value",
        pass: (data.estimatedValue ?? 0) > 0,
      },
    ],
    transparent: [
      {
        id: "contact_email",
        pass: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email?.trim() ?? ""),
      },
      {
        id: "platform_path",
        pass: Boolean(data.platform?.trim()),
      },
      {
        id: "traceability_notes",
        pass: /ppa|rec|registre|contrat|contract|trace|source|audit|attestation/.test(
          text
        ),
      },
    ],
    measurable: [
      {
        id: "impact_metrics",
        pass: /mwh|kwh|tco2|carbone|mesur|metric|période|period|kpi|baseline/.test(
          text
        ),
      },
      {
        id: "data_room_depth",
        pass: docs.length >= 2,
      },
      {
        id: "timeline_defined",
        pass: Boolean(data.timeline?.trim()),
      },
    ],
    sound: [
      {
        id: "legal_structure",
        pass: Boolean(data.legalStructure?.trim()),
      },
      {
        id: "legal_status",
        pass: data.legalStatus.length > 0,
      },
      {
        id: "jurisdiction_set",
        pass: Boolean(data.country?.trim()),
      },
    ],
  };

  const pillars = {} as Record<GreenRtmsPillar, GreenRtmsPillarScore>;
  for (const pillar of GREEN_RTMS_PILLARS) {
    const checks = pillarChecks[pillar];
    pillars[pillar] = {
      pillar,
      checks,
      score: pillarScore(checks),
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
