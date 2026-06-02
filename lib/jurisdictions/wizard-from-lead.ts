import type { Locale } from "@/lib/i18n";
import type { WizardPrefill } from "@/lib/wizard-prefill";
import type { Currency } from "@/lib/wizard-types";

import { jurisdictionIdToCountry } from "./jurisdiction-countries";

const PROJECT_TO_ASSET: Record<string, string> = {
  real_estate: "Real estate",
  bonds: "Bonds",
  private_credit: "Private credit",
  funds: "Fund",
  other: "Other",
};

const VALUE_TO_EUR: Record<string, number> = {
  under1m: 750_000,
  "1to5m": 2_500_000,
  "5to20m": 10_000_000,
  over20m: 30_000_000,
};

export function wizardPrefillFromLead(input: {
  projectType: string;
  projectValue?: string | null;
  jurisdictions: string[];
  firstName: string;
  email: string;
}): WizardPrefill {
  const primary = input.jurisdictions.find((j) => j !== "unsure") ?? "luxembourg";
  const country = jurisdictionIdToCountry(primary) ?? "Luxembourg";
  const assetType = PROJECT_TO_ASSET[input.projectType] ?? "Other";
  const estimatedValue =
    (input.projectValue && VALUE_TO_EUR[input.projectValue]) || 2_000_000;

  return {
    assetType,
    estimatedValue,
    currency: "EUR" as Currency,
    country,
    city: "",
    quickScore: 72,
    fromStarterKit: true,
    lockedJurisdictionCountry: country,
  };
}

export function wizardSeedFromLead(input: {
  projectType: string;
  projectValue?: string | null;
  jurisdictions: string[];
  firstName: string;
  email: string;
  locale: Locale;
}): Partial<{
  assetType: string;
  estimatedValue: number;
  currency: Currency;
  country: string;
  firstName: string;
  email: string;
  goals: string[];
  timeline: string;
  fromStarterKit: boolean;
  lockedJurisdictionIds: string[];
}> {
  const prefill = wizardPrefillFromLead(input);
  const primary = input.jurisdictions.find((j) => j !== "unsure") ?? "luxembourg";
  const isRealEstate = input.projectType === "real_estate";
  const goals =
    input.locale === "en"
      ? isRealEstate
        ? ["liquidity", "diversification", "institutional_investors"]
        : ["liquidity", "diversification"]
      : input.locale === "es"
        ? isRealEstate
          ? ["liquidity", "diversification", "institutional_investors"]
          : ["liquidity", "diversification"]
        : isRealEstate
          ? ["liquidity", "diversification", "institutional_investors"]
          : ["liquidity", "diversification"];

  return {
    assetType: prefill.assetType,
    estimatedValue: prefill.estimatedValue,
    currency: prefill.currency,
    country: prefill.country,
    firstName: input.firstName,
    email: input.email,
    goals,
    timeline: input.locale === "en" ? "3-6 months" : input.locale === "es" ? "3-6 meses" : "3-6 mois",
    fromStarterKit: true,
    lockedJurisdictionIds: [primary],
  };
}
