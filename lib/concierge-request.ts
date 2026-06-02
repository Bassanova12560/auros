import { valueInEur } from "@/lib/platform-match";
import type { Currency } from "@/lib/wizard-types";

export const AUROS_CONCIERGE_REQUEST_KEY = "auros_concierge_request";

export type ConciergeRequest = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  submittedAt: string;
  dossierScore?: number;
  assetValueEur?: number;
};

export function shouldShowConcierge(
  score: number | undefined,
  estimatedValue: number,
  currency: Currency
): boolean {
  if (typeof score !== "number" || score < 75) return false;
  return valueInEur(estimatedValue, currency) >= 500_000;
}

export function loadConciergeRequest(): ConciergeRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUROS_CONCIERGE_REQUEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConciergeRequest;
    if (
      typeof parsed.name === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.submittedAt === "string"
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveConciergeRequest(payload: ConciergeRequest): void {
  localStorage.setItem(AUROS_CONCIERGE_REQUEST_KEY, JSON.stringify(payload));
}
