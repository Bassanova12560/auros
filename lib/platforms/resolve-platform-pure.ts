import { normalizePartnerCode } from "@/lib/partner-attribution";
import type { PartnerRecord } from "@/lib/partners/types";

/**
 * Pure ranking helper — prefers exact code match, then company substring.
 */
export function pickPlatformFromCandidates(
  candidates: PartnerRecord[],
  wizardPlatform: string | null | undefined,
  referredBy: string | null | undefined
): PartnerRecord | null {
  const active = candidates.filter(
    (p) => p.kind === "platform" && p.status === "active"
  );
  if (!active.length) return null;

  const ref = normalizePartnerCode(referredBy ?? "");
  if (ref) {
    const byRef = active.find((p) => p.code.toUpperCase() === ref);
    if (byRef) return byRef;
  }

  const tip = (wizardPlatform ?? "").trim().toLowerCase();
  if (tip) {
    const byCode = active.find(
      (p) => p.code.toLowerCase() === tip || tip.includes(p.code.toLowerCase())
    );
    if (byCode) return byCode;
    const byCompany = active.find(
      (p) =>
        tip.includes(p.company.toLowerCase()) ||
        p.company.toLowerCase().includes(tip)
    );
    if (byCompany) return byCompany;
  }

  return null;
}

export function resolveWebhookTarget(partner: PartnerRecord | null): {
  url: string | null;
  secret: string | null;
  source: "tenant" | "env" | "none";
} {
  if (partner?.kind === "platform" && partner.webhook_url?.trim()) {
    return {
      url: partner.webhook_url.trim(),
      secret: partner.webhook_secret?.trim() || null,
      source: "tenant",
    };
  }
  const envUrl = process.env.PARTNER_WEBHOOK_URL?.trim() || null;
  if (envUrl) {
    return {
      url: envUrl,
      secret: process.env.PARTNER_WEBHOOK_SECRET?.trim() || null,
      source: "env",
    };
  }
  return { url: null, secret: null, source: "none" };
}
