import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";

import {
  computeWattScoreForCompareRow,
  computeWattScoreFromText,
  type WattScoreResult,
} from "./watt-score";

export type WattBatchInput = {
  id?: string;
  text?: string;
};

export function resolveWattBatchItem(
  item: WattBatchInput
): { ok: true; result: WattScoreResult } | { ok: false; code: string; message: string } {
  if (item.id) {
    const row = GREEN_COMPARE_ROWS.find((r) => r.id === item.id);
    if (!row) {
      return { ok: false, code: "not_found", message: `Unknown compare id: ${item.id}` };
    }
    const result = computeWattScoreForCompareRow(row);
    if (!result) {
      return {
        ok: false,
        code: "not_energy_asset",
        message: `Reference ${item.id} is not an energy asset`,
      };
    }
    return { ok: true, result };
  }

  if (item.text) {
    const result = computeWattScoreFromText(item.text);
    if (!result) {
      return {
        ok: false,
        code: "not_energy_asset",
        message: "Text does not describe a recognizable energy asset (solar, wind, REC, PPA, battery…)",
      };
    }
    return { ok: true, result };
  }

  return { ok: false, code: "validation_error", message: "id or text required" };
}
