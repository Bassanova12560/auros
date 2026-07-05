import { buildEauEmbedUrl, buildEauEmbedIframeSnippet, buildEauEmbedScriptSnippet } from "@/lib/eau/embed";

import { countPartnerEmbedEvents } from "./embed-events";
import { maskPartnerEmail } from "./mask-email";
import { validatePartnerCode } from "./partner-codes";
import {
  listPartnerReferrals,
  type PartnerReferralRow,
} from "./referral-report";

/** Indicative grid — contractual amounts may differ. */
export const PARTNER_INDICATIVE_COMMISSION_EUR = {
  perLead: 50,
  perDossier: 200,
  perSubmittedDossier: 400,
} as const;

export type PartnerPortalActivity = {
  id: string;
  recordType: "lead" | "dossier";
  createdAt: string;
  assetType: string | null;
  score: number | null;
  status: string | null;
  source: string | null;
  contactHint: string | null;
};

export type PartnerPortalSnapshot = {
  partnerCode: string;
  partnerLabel: string | null;
  leads: number;
  dossiers: number;
  submittedDossiers: number;
  embedEvents: number;
  total: number;
  indicativeCommissionEur: number;
  wizardUrl: string;
  embedUrl: string;
  embedIframeSnippet: string;
  embedScriptSnippet: string;
  eauGuideUrl: string;
  recent: PartnerPortalActivity[];
};

export type PartnerPortalLookupError =
  | "invalid_code"
  | "not_registered"
  | "inactive"
  | "unavailable";

export type PartnerPortalLookup =
  | { ok: true; snapshot: PartnerPortalSnapshot }
  | { ok: false; error: PartnerPortalLookupError };

function toActivity(row: PartnerReferralRow): PartnerPortalActivity {
  return {
    id: row.id,
    recordType: row.recordType,
    createdAt: row.createdAt,
    assetType: row.assetType,
    score: row.score,
    status: row.status,
    source: row.source,
    contactHint:
      row.recordType === "lead" && row.email ? maskPartnerEmail(row.email) : null,
  };
}

export function estimateIndicativeCommission(
  leads: number,
  dossiers: number,
  submittedDossiers: number,
): number {
  return (
    leads * PARTNER_INDICATIVE_COMMISSION_EUR.perLead +
    (dossiers - submittedDossiers) * PARTNER_INDICATIVE_COMMISSION_EUR.perDossier +
    submittedDossiers * PARTNER_INDICATIVE_COMMISSION_EUR.perSubmittedDossier
  );
}

export async function getPartnerPortalSnapshot(
  partnerCode: string,
  siteOrigin = "https://getauros.com",
): Promise<PartnerPortalLookup> {
  const code = partnerCode.trim().toUpperCase();
  if (code.length < 2) return { ok: false, error: "invalid_code" };

  const codeCheck = await validatePartnerCode(code);
  if (!codeCheck.ok) {
    if (codeCheck.reason === "invalid_format") {
      return { ok: false, error: "invalid_code" };
    }
    if (codeCheck.reason === "database_unavailable") {
      return { ok: false, error: "unavailable" };
    }
    if (codeCheck.reason === "not_registered") {
      return { ok: false, error: "not_registered" };
    }
    return { ok: false, error: "inactive" };
  }

  const rows = await listPartnerReferrals(code);
  const filtered = rows.filter((r) => r.partnerCode === code);
  const leads = filtered.filter((r) => r.recordType === "lead").length;
  const dossiers = filtered.filter((r) => r.recordType === "dossier").length;
  const submittedDossiers = filtered.filter(
    (r) => r.recordType === "dossier" && r.status === "submitted",
  ).length;
  const embedEvents = (await countPartnerEmbedEvents(code)) ?? 0;

  const wizardUrl = new URL("/wizard", siteOrigin.replace(/\/$/, ""));
  wizardUrl.searchParams.set("partner", code);

  const origin = siteOrigin.replace(/\/$/, "");
  const eauGuide = new URL("/comment-tokeniser/eau", origin);
  eauGuide.searchParams.set("partner", code);

  return {
    ok: true,
    snapshot: {
      partnerCode: code,
      partnerLabel: codeCheck.label ?? null,
      leads,
      dossiers,
      submittedDossiers,
      embedEvents,
      total: leads + dossiers,
      indicativeCommissionEur: estimateIndicativeCommission(
        leads,
        dossiers,
        submittedDossiers,
      ),
      wizardUrl: wizardUrl.toString(),
      embedUrl: buildEauEmbedUrl({ partner: code, origin }),
      embedIframeSnippet: buildEauEmbedIframeSnippet({ partner: code, origin }),
      embedScriptSnippet: buildEauEmbedScriptSnippet({ partner: code, origin }),
      eauGuideUrl: eauGuide.toString(),
      recent: filtered.slice(0, 12).map(toActivity),
    },
  };
}
