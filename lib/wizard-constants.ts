import { ALL_RWA_DOCUMENT_IDS } from "@/lib/rwa-document-phases";
import type { Currency, WizardData } from "@/lib/wizard-types";

export const STORAGE_KEY = "tokenization_wizard_state_v1";
export const DOSSIER_STORAGE_KEY = "auros_dossier";
export const TOTAL_STEPS = 15;

export const STEP_STORAGE_KEYS: Record<number, string> = {
  2: "auros_wizard_step2",
  3: "auros_wizard_step3",
  4: "auros_wizard_step4",
  5: "auros_wizard_step5",
  6: "auros_wizard_step6",
  7: "auros_wizard_step7",
  8: "auros_wizard_step8",
  9: "auros_wizard_step9",
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PRIME_LOCATIONS = ["France", "Germany", "Switzerland", "Italy"];

export const VALUE_MIN = 10_000;
export const VALUE_MAX = 10_000_000;
export const VALUE_STEP = 10_000;
export const VALUE_DEFAULT = 250_000;
export const STEP2_MIN_WORDS = 20;

export const CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "CHF"];

export const DOC_NONE = "None yet";

/** @deprecated Legacy labels — wizard uses RWA data-room IDs from rwa-document-phases */
export const LEGACY_DOCUMENTS = [
  "Title deed",
  "Expert valuation",
  "Photos",
  "Insurance policy",
  "Notarial certificate",
  "Tax records",
  "Purchase invoice",
] as const;

/** 15-document data room checklist (+ none) */
export const DOCUMENTS = [...ALL_RWA_DOCUMENT_IDS, DOC_NONE] as const;

export const GOALS: Array<{ id: string; label: string; subtitle: string }> = [
  {
    id: "income",
    label: "Generate passive income",
    subtitle: "Receive regular returns from your tokenized asset",
  },
  {
    id: "liquidity",
    label: "Access liquidity",
    subtitle: "Convert part of your asset into immediate cash",
  },
  {
    id: "diversification",
    label: "Portfolio diversification",
    subtitle: "Spread your wealth across multiple asset classes",
  },
  {
    id: "estate",
    label: "Estate planning",
    subtitle: "Prepare and simplify asset transmission",
  },
];

export const TIMELINES: Array<{ label: string; subtitle: string }> = [
  {
    label: "As soon as possible",
    subtitle: "I want to start the process immediately",
  },
  {
    label: "Within 3 months",
    subtitle: "I have some time to prepare",
  },
  {
    label: "Within 6 months",
    subtitle: "I am exploring my options",
  },
  {
    label: "No rush",
    subtitle: "I want to understand before committing",
  },
];

export const PLATFORM_AUROS_DOSSIER = "AUROS dossier";
export const PLATFORM_CONCIERGE = "Concierge support";
export const PLATFORM_UNDECIDED = "Not decided yet";

/** How the user wants to proceed with AUROS (stored in `platform` field). */
export const PLATFORMS: Array<{ label: string; subtitle: string }> = [
  {
    label: PLATFORM_AUROS_DOSSIER,
    subtitle: "Prepare and submit your dossier with our team",
  },
  {
    label: PLATFORM_CONCIERGE,
    subtitle: "An AUROS expert guides you step by step",
  },
  {
    label: PLATFORM_UNDECIDED,
    subtitle: "We propose next steps after reviewing your asset",
  },
];

export const initialWizardData: WizardData = {
  assetType: "",
  description: "",
  estimatedValue: VALUE_DEFAULT,
  currency: "EUR",
  country: "",
  city: "",
  documents: [],
  goals: [],
  timeline: "",
  platform: PLATFORM_AUROS_DOSSIER,
  firstName: "",
  email: "",
  marketingConsent: false,
  legalStructure: "",
  incomeType: "",
  incomeAmountYear: 0,
  incomeDescription: "",
  legalStatus: [],
  investorProfile: "",
  additionalNotes: "",
  valueBucket: undefined,
  mica: undefined,
};
