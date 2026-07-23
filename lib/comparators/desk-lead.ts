import { buildCompareHubShareUrl, encodeCompareProductIdsParam } from "./compare-selection";
import { SITE_URL } from "./site";

export const COMPARE_DESK_EMAIL = "hello@getauros.com";

export type CompareDeskLeadInput = {
  productIds: string[];
  productLabels?: string[];
  locale?: string;
  partnerCode?: string | null;
};

/** Soft B2B mailto with selection context — no pay-to-rank. */
export function buildCompareDeskMailto(input: CompareDeskLeadInput): string {
  const ids = input.productIds.map((id) => id.trim()).filter(Boolean).slice(0, 4);
  const share = buildCompareHubShareUrl(ids, SITE_URL);
  const labels =
    input.productLabels?.filter(Boolean).slice(0, 4).join(", ") ||
    encodeCompareProductIdsParam(ids);
  const partner = input.partnerCode?.trim();
  const lines = [
    "Hello AUROS desk,",
    "",
    "I compared products on AUROS and would like a platform intro / desk conversation.",
    "",
    `Products: ${labels}`,
    `IDs: ${encodeCompareProductIdsParam(ids)}`,
    `Share: ${share}`,
  ];
  if (partner) lines.push(`Partner: ${partner}`);
  if (input.locale) lines.push(`Locale: ${input.locale}`);
  lines.push("", "—");

  const subject = encodeURIComponent(
    `AUROS Compare desk — ${ids.length} product${ids.length === 1 ? "" : "s"}`
  );
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${COMPARE_DESK_EMAIL}?subject=${subject}&body=${body}`;
}
