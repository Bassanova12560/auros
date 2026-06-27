import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";

import {
  computeCarbonQualityForCompareRow,
  computeCarbonQualityFromProfile,
  inferCarbonProfileFromText,
  type CarbonQualityScore,
} from "./carbon-quality";

export type CarbonQualityBatchInput = {
  id?: string;
  text?: string;
};

export function resolveCarbonQualityBatchItem(
  item: CarbonQualityBatchInput
): { ok: true; result: CarbonQualityScore } | { ok: false; code: string; message: string } {
  if (item.id) {
    const row = GREEN_COMPARE_ROWS.find((r) => r.id === item.id);
    if (!row) {
      return { ok: false, code: "not_found", message: `Unknown compare id: ${item.id}` };
    }
    const result = computeCarbonQualityForCompareRow(row);
    if (!result) {
      return {
        ok: false,
        code: "not_carbon_asset",
        message: `Reference ${item.id} is not a carbon asset`,
      };
    }
    return { ok: true, result };
  }

  if (item.text) {
    const profile = inferCarbonProfileFromText(item.text);
    return { ok: true, result: computeCarbonQualityFromProfile(profile) };
  }

  return { ok: false, code: "validation_error", message: "id or text required" };
}
