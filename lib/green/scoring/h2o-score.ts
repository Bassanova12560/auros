import { siteOrigin } from "@/lib/emails/constants";

import type { WaterCompareRow } from "../water-compare-data";
import { h2oPreviewId } from "@/lib/eau/passport";

export const H2O_TEXT_RE =
  /eau|water|hydrique|hydrological|m³|m3|mm³|desal|dessalement|concession|droits?\s+d.eau|blue\s*bond|obligation\s*bleue|hydro|barrage|aquif[eè]re|irrigation|potable|affermage/i;

export type H2oAssetClass =
  | "water_rights"
  | "desalination"
  | "hydro_infra"
  | "blue_bond"
  | "concession"
  | "unknown";

export type H2oPriorityKey =
  | "flow_metering"
  | "concession_title"
  | "hydrological_audit"
  | "dnsh_water"
  | "contract_tenor"
  | "investor_disclosure";

export type H2oScoreResult = {
  rating: number;
  tier: "high" | "mid" | "low";
  asset_class: H2oAssetClass;
  priority_keys: H2oPriorityKey[];
  flow_m3_per_year: number | null;
  concession_years: number | null;
  passport_status: "preview" | "registry_eligible";
  passport_required: boolean;
  passport_unlock_url: string;
  preview_id: string;
};

function tierFromRating(rating: number): H2oScoreResult["tier"] {
  if (rating >= 70) return "high";
  if (rating >= 50) return "mid";
  return "low";
}

export function detectH2oAssetClass(text: string): H2oAssetClass {
  const t = text.toLowerCase();
  if (/blue\s*bond|obligation\s*bleue/.test(t)) return "blue_bond";
  if (/desal|dessalement|dessalinisation/.test(t)) return "desalination";
  if (/droits?\s+d.eau|water\s*rights|allocation\s+eau/.test(t)) return "water_rights";
  if (/barrage|hydro\s*(électrique|electric)?|centrale\s+hydro/.test(t)) return "hydro_infra";
  if (/concession|affermage|régie|potable/.test(t)) return "concession";
  return "unknown";
}

export function parseFlowM3FromText(text: string): number | null {
  const mm3 = text.match(/(\d+(?:[.,]\d+)?)\s*mm³/i);
  if (mm3) {
    return Math.round(Number.parseFloat(mm3[1]!.replace(",", ".")) * 1_000_000);
  }
  const m3 = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m³|m3)\s*\/\s*(?:an|year)/i);
  if (m3) return Math.round(Number.parseFloat(m3[1]!.replace(",", ".")));
  const m3plain = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m³|m3)\b/i);
  if (m3plain) return Math.round(Number.parseFloat(m3plain[1]!.replace(",", ".")));
  return null;
}

export function parseConcessionYears(text: string): number | null {
  const m = text.match(/(\d+)\s*(?:ans?|years?)\b/i);
  return m ? Number.parseInt(m[1]!, 10) : null;
}

function buildPriorities(
  text: string,
  flow: number | null,
  years: number | null,
  rating: number
): H2oPriorityKey[] {
  const t = text.toLowerCase();
  const keys: H2oPriorityKey[] = [];
  if (!flow) keys.push("flow_metering");
  if (!/titre|title|concession|décret|arrêté|contract/.test(t)) keys.push("concession_title");
  if (!/audit|hydrolog|bilan\s+eau|stress/.test(t)) keys.push("hydrological_audit");
  if (!/dnsh|taxonom|do no significant harm|eau/.test(t)) keys.push("dnsh_water");
  if (!years || years < 10) keys.push("contract_tenor");
  if (!/investisseur|institution|professional|prospectus|note/.test(t)) {
    keys.push("investor_disclosure");
  }
  if (keys.length === 0 && rating < 75) keys.push("flow_metering");
  return keys.slice(0, 3);
}

function passportUnlockUrl(): string {
  return `${siteOrigin()}/comment-tokeniser/eau`;
}

export function computeH2oScoreFromText(text: string): H2oScoreResult | null {
  const trimmed = text.trim();
  if (!trimmed || !H2O_TEXT_RE.test(trimmed)) return null;

  const lower = trimmed.toLowerCase();
  const flow = parseFlowM3FromText(trimmed);
  const years = parseConcessionYears(trimmed);
  const asset_class = detectH2oAssetClass(trimmed);

  let rating = 38;
  if (flow) rating += 18;
  if (years && years >= 10) rating += 14;
  else if (years && years >= 5) rating += 8;
  if (/concession|titre|title|décret|arrêté/.test(lower)) rating += 14;
  if (/audit|hydrolog|bilan\s+eau/.test(lower)) rating += 12;
  if (/dnsh|taxonom|do no significant harm/.test(lower)) rating += 10;
  if (/institution|professional|investisseur\s+qualifié/.test(lower)) rating += 8;
  if (/spv|prospectus|data\s*room/.test(lower)) rating += 6;
  if (/historical|legacy|high risk|variable/.test(lower)) rating -= 8;

  rating = Math.max(0, Math.min(100, Math.round(rating)));

  return {
    rating,
    tier: tierFromRating(rating),
    asset_class,
    priority_keys: buildPriorities(trimmed, flow, years, rating),
    flow_m3_per_year: flow,
    concession_years: years,
    passport_status: "preview",
    passport_required: true,
    passport_unlock_url: passportUnlockUrl(),
    preview_id: h2oPreviewId(trimmed),
  };
}

export function computeH2oScoreForCompareRow(row: WaterCompareRow): H2oScoreResult {
  const base = computeH2oScoreFromText(
    `${row.name}. ${row.impactNote}. ${row.yieldNote}. ${row.flowNote}`
  );
  const rating = Math.max(
    base?.rating ?? row.base_rating,
    row.base_rating
  );

  return {
    rating,
    tier: tierFromRating(rating),
    asset_class: row.assetClass,
    priority_keys: (base?.priority_keys ?? ["flow_metering"]).slice(0, 3),
    flow_m3_per_year: row.flow_m3_per_year,
    concession_years: row.concession_years,
    passport_status: row.labelStatus === "certified" ? "registry_eligible" : "preview",
    passport_required: row.labelStatus !== "certified",
    passport_unlock_url: passportUnlockUrl(),
    preview_id: `h2o-ref-${row.id}`,
  };
}
