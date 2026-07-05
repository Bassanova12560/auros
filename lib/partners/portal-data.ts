import { buildEauEmbedUrl, buildEauEmbedIframeSnippet, buildEauEmbedScriptSnippet } from "@/lib/eau/embed";

import { maskPartnerEmail } from "./mask-email";
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
  leads: number;
  dossiers: number;
  submittedDossiers: number;
  total: number;
  indicativeCommissionEur: number;
  wizardUrl: string;
  embedUrl: string;
  embedIframeSnippet: string;
  embedScriptSnippet: string;
  eauGuideUrl: string;
  recent: PartnerPortalActivity[];
};

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
): Promise<PartnerPortalSnapshot | null> {
  const code = partnerCode.trim().toUpperCase();
  if (code.length < 2) return null;

  const rows = await listPartnerReferrals(code);
  const filtered = rows.filter((r) => r.partnerCode === code);
  const leads = filtered.filter((r) => r.recordType === "lead").length;
  const dossiers = filtered.filter((r) => r.recordType === "dossier").length;
  const submittedDossiers = filtered.filter(
    (r) => r.recordType === "dossier" && r.status === "submitted",
  ).length;

  const wizardUrl = new URL("/wizard", siteOrigin.replace(/\/$/, ""));
  wizardUrl.searchParams.set("partner", code);

  const origin = siteOrigin.replace(/\/$/, "");
  const eauGuide = new URL("/comment-tokeniser/eau", origin);
  eauGuide.searchParams.set("partner", code);

  return {
    partnerCode: code,
    leads,
    dossiers,
    submittedDossiers,
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
  };
}
