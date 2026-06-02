import type { Currency } from "@/lib/wizard-types";

export const WIZARD_PREFILL_KEY = "auros_wizard_prefill_v1";

export type WizardPrefill = {
  assetType: string;
  estimatedValue: number;
  currency: Currency;
  country: string;
  city?: string;
  quickScore?: number;
  fromStarterKit?: boolean;
  lockedJurisdictionCountry?: string;
};

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
