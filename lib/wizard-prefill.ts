import type { CostAssetType, DealSizeRange } from "@/lib/cost-estimator/types";
import { DEAL_SIZE_MID_EUR } from "@/lib/cost-estimator/estimates";
import { jurisdictionIdToCountry } from "@/lib/jurisdictions/jurisdiction-countries";
import type { JurisdictionPriorities } from "@/lib/jurisdiction-picker/types";
import type { MicaAnswers } from "@/lib/mica-checker/types";
import { GREEN_WIZARD_ASSET_TYPE } from "@/lib/green/constants";
import type { ValueBucketId, WizardMode } from "@/lib/wizard-modes";
import type { Currency } from "@/lib/wizard-types";

export const WIZARD_PREFILL_KEY = "auros_wizard_prefill_v1";

export type WizardPrefillFromTool =
  | "mica-checker"
  | "csrd-checker"
  | "estimate"
  | "cost-estimator"
  | "jurisdiction-picker";

export type WizardPrefill = {
  assetType: string;
  estimatedValue: number;
  currency: Currency;
  country: string;
  city?: string;
  quickScore?: number;
  fromStarterKit?: boolean;
  lockedJurisdictionCountry?: string;
  /** Target wizard path after prefill. */
  mode?: WizardMode;
  /** Partial MiCA answers (e.g. from mica-checker). */
  mica?: Partial<MicaAnswers>;
  /** Originating tool for analytics / UX continuity. */
  fromTool?: WizardPrefillFromTool;
  /** Free-text description from estimate widget. */
  description?: string;
  /** Explore value bucket when coming from cost estimator. */
  valueBucket?: ValueBucketId;
  /** Jurisdiction picker slider state. */
  jurisdictionPriorities?: JurisdictionPriorities;
  /** Top jurisdiction id from tools. */
  jurisdictionId?: string;
};

const COST_ASSET_TO_WIZARD: Record<CostAssetType, string> = {
  real_estate: "Real estate",
  funds: "Other",
  bonds: "Other",
  private_credit: "Private equity / SME shares",
  green_carbon: GREEN_WIZARD_ASSET_TYPE,
};

const DEAL_SIZE_TO_BUCKET: Record<DealSizeRange, ValueBucketId> = {
  under_500k: "100k_500k",
  "500k_2m": "500k_2m",
  "2m_10m": "over_2m",
  over_10m: "over_2m",
};

const JURISDICTION_ASSET_TO_WIZARD: Record<string, string> = {
  real_estate: "Real estate",
  bonds: "Other",
  private_credit: "Private equity / SME shares",
  funds: "Other",
  all: "",
};

export function prefillFromCostEstimator(input: {
  assetType: CostAssetType;
  dealSize: DealSizeRange;
  jurisdictionId: string;
}): WizardPrefill {
  const country = jurisdictionIdToCountry(input.jurisdictionId) ?? "";
  return {
    assetType: COST_ASSET_TO_WIZARD[input.assetType],
    estimatedValue: DEAL_SIZE_MID_EUR[input.dealSize],
    currency: "EUR",
    country,
    valueBucket: DEAL_SIZE_TO_BUCKET[input.dealSize],
    jurisdictionId: input.jurisdictionId,
    mode: "explore",
    fromTool: "cost-estimator",
  };
}

export function prefillFromJurisdictionPicker(input: {
  asset: string;
  priorities: JurisdictionPriorities;
  topJurisdictionId: string;
}): WizardPrefill {
  const country = jurisdictionIdToCountry(input.topJurisdictionId) ?? "";
  return {
    assetType: JURISDICTION_ASSET_TO_WIZARD[input.asset] ?? "",
    estimatedValue: 1_000_000,
    currency: "EUR",
    country,
    jurisdictionId: input.topJurisdictionId,
    jurisdictionPriorities: input.priorities,
    mode: "pro",
    fromTool: "jurisdiction-picker",
  };
}

export function prefillFromCsrdChecker(): WizardPrefill {
  return {
    assetType: GREEN_WIZARD_ASSET_TYPE,
    estimatedValue: 1_000_000,
    currency: "EUR",
    country: "",
    mode: "pro",
    fromTool: "csrd-checker",
  };
}

export function prefillFromMicaChecker(input: {
  answers: MicaAnswers;
  score?: number;
}): WizardPrefill {
  return {
    assetType: "",
    estimatedValue: 500_000,
    currency: "EUR",
    country: "",
    quickScore: input.score,
    mica: input.answers,
    mode: "pro",
    fromTool: "mica-checker",
  };
}

export function prefillFromEstimate(input: {
  description?: string;
  quickScore?: number;
  estimatedValue?: number;
}): WizardPrefill {
  return {
    assetType: "",
    estimatedValue: input.estimatedValue ?? 250_000,
    currency: "EUR",
    country: "",
    description: input.description,
    quickScore: input.quickScore,
    mode: "explore",
    fromTool: "estimate",
  };
}

export function saveWizardPrefill(prefill: WizardPrefill) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(WIZARD_PREFILL_KEY, JSON.stringify(prefill));
  } catch {
    // ignore
  }
}

export function loadWizardPrefill(): WizardPrefill | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(WIZARD_PREFILL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WizardPrefill;
  } catch {
    return null;
  }
}

export function clearWizardPrefill() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(WIZARD_PREFILL_KEY);
  } catch {
    // ignore
  }
}
