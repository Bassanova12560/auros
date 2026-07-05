"use server";

import { normalizePartnerCode } from "@/lib/partner-attribution";
import { getPartnerPortalSnapshot } from "@/lib/partners/portal-data";
import { SITE_URL } from "@/lib/comparators/site";

export type PartnerPortalLookupResult =
  | { ok: true; snapshot: Awaited<ReturnType<typeof getPartnerPortalSnapshot>> }
  | { ok: false; error: "invalid_code" | "unavailable" };

export async function lookupPartnerPortalAction(
  rawCode: string,
): Promise<PartnerPortalLookupResult> {
  const code = normalizePartnerCode(rawCode);
  if (!code) return { ok: false, error: "invalid_code" };

  const snapshot = await getPartnerPortalSnapshot(code, SITE_URL);
  if (!snapshot) return { ok: false, error: "invalid_code" };

  return { ok: true, snapshot };
}
