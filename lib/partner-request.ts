import { isValidCaptureEmail } from "@/lib/email-capture";

export const AUROS_PARTNER_REQUEST_KEY = "auros_partner_request";

export type PartnerRequest = {
  companyName: string;
  contactName: string;
  email: string;
  platformType: string;
  monthlyVolume: string;
  message?: string;
  submittedAt: string;
};

export function loadPartnerRequest(): PartnerRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUROS_PARTNER_REQUEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PartnerRequest;
    if (
      typeof parsed.companyName === "string" &&
      typeof parsed.contactName === "string" &&
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

export function savePartnerRequest(payload: PartnerRequest): void {
  localStorage.setItem(AUROS_PARTNER_REQUEST_KEY, JSON.stringify(payload));
}

export function isValidPartnerRequest(payload: {
  companyName: string;
  contactName: string;
  email: string;
  platformType: string;
  monthlyVolume: string;
}): boolean {
  return (
    payload.companyName.trim().length > 0 &&
    payload.contactName.trim().length > 0 &&
    isValidCaptureEmail(payload.email) &&
    payload.platformType.length > 0 &&
    payload.monthlyVolume.length > 0
  );
}
