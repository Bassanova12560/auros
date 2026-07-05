"use server";

import { normalizePartnerCode } from "@/lib/partner-attribution";
import {
  getPartnerPortalSnapshot,
  type PartnerPortalLookupError,
  type PartnerPortalSnapshot,
} from "@/lib/partners/portal-data";
import { SITE_URL } from "@/lib/comparators/site";

export type PartnerPortalLookupResult =
  | { ok: true; snapshot: PartnerPortalSnapshot }
  | { ok: false; error: PartnerPortalLookupError };

export async function lookupPartnerPortalAction(
  rawCode: string,
): Promise<PartnerPortalLookupResult> {
  const code = normalizePartnerCode(rawCode);
  if (!code) return { ok: false, error: "invalid_code" };

  const result = await getPartnerPortalSnapshot(code, SITE_URL);
  if (!result.ok) return { ok: false, error: result.error };

  return { ok: true, snapshot: result.snapshot };
}
