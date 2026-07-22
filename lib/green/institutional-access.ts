/**
 * Institutional access helpers — domain allowlist + Clerk org signals.
 * Server-safe (no React). Does not replace Green API keys.
 */

import type { GreenApiTier } from "@/lib/green/api/auth";

export function institutionalDomainsFromEnv(
  raw = process.env.AUROS_INSTITUTIONAL_DOMAINS
): string[] {
  return (raw ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter((d) => d.includes("."));
}

export function institutionalOrgIdsFromEnv(
  raw = process.env.AUROS_INSTITUTIONAL_ORG_IDS
): string[] {
  return (raw ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
}

export function emailDomain(email: string): string | null {
  const at = email.trim().toLowerCase().lastIndexOf("@");
  if (at < 0) return null;
  const domain = email.trim().toLowerCase().slice(at + 1).trim();
  return domain.includes(".") ? domain : null;
}

export function isInstitutionalEmailDomain(
  email: string,
  allowlist = institutionalDomainsFromEnv()
): boolean {
  const domain = emailDomain(email);
  if (!domain || allowlist.length === 0) return false;
  return allowlist.some(
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`)
  );
}

export function isInstitutionalOrgId(
  orgId: string | null | undefined,
  allowlist = institutionalOrgIdsFromEnv()
): boolean {
  if (!orgId || allowlist.length === 0) return false;
  return allowlist.includes(orgId);
}

/**
 * Map Clerk session context → volume tier boost (never demotes an API key).
 * - orgId on allowlist or institutional email → enterprise
 * - any signed-in user → free
 * - else null (keep anonymous)
 */
export function sessionTierBoost(input: {
  userId: string | null | undefined;
  orgId?: string | null;
  email?: string | null;
  /** Override env allowlist (tests) */
  domains?: string[];
  orgIds?: string[];
}): GreenApiTier | null {
  if (!input.userId) return null;
  if (isInstitutionalOrgId(input.orgId, input.orgIds)) return "enterprise";
  if (
    input.email &&
    isInstitutionalEmailDomain(input.email, input.domains)
  ) {
    return "enterprise";
  }
  return "free";
}

export function tierRank(tier: GreenApiTier): number {
  switch (tier) {
    case "enterprise":
      return 4;
    case "premium":
      return 3;
    case "free":
    case "demo":
      return 2;
    default:
      return 1;
  }
}

export function maxTier(a: GreenApiTier, b: GreenApiTier): GreenApiTier {
  return tierRank(a) >= tierRank(b) ? a : b;
}
