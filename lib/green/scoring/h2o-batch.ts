import { WATER_COMPARE_ROWS } from "@/lib/green/water-compare-data";

import {
  computeH2oScoreForCompareRow,
  computeH2oScoreFromText,
  type H2oScoreResult,
} from "./h2o-score";

export type H2oBatchInput = {
  id?: string;
  text?: string;
};

export function resolveH2oBatchItem(
  item: H2oBatchInput
): { ok: true; result: H2oScoreResult } | { ok: false; code: string; message: string } {
  if (item.id) {
    const row = WATER_COMPARE_ROWS.find((r) => r.id === item.id);
    if (!row) {
      return { ok: false, code: "not_found", message: `Unknown water reference id: ${item.id}` };
    }
    return { ok: true, result: computeH2oScoreForCompareRow(row) };
  }

  if (item.text) {
    const result = computeH2oScoreFromText(item.text);
    if (!result) {
      return {
        ok: false,
        code: "not_water_asset",
        message:
          "Text does not describe a recognizable hydrological asset (water rights, concession, desalination, blue bond…)",
      };
    }
    return { ok: true, result };
  }

  return { ok: false, code: "validation_error", message: "id or text required" };
}
