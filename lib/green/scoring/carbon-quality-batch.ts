import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { lookupRegistryConnect } from "@/lib/green/registry-connect";

import {
  computeCarbonQualityForCompareRow,
  computeCarbonQualityFromProfile,
  inferCarbonProfileFromText,
  type CarbonQualityScore,
} from "./carbon-quality";

export type CarbonQualityBatchInput = {
  id?: string;
  text?: string;
  registry?: string;
  serial?: string;
};

export async function resolveCarbonQualityBatchItem(
  item: CarbonQualityBatchInput
): Promise<
  | { ok: true; result: CarbonQualityScore; registry_serial?: string }
  | { ok: false; code: string; message: string }
> {
  if (item.registry && item.serial) {
    const outcome = await lookupRegistryConnect({ registry: item.registry, serial: item.serial });
    if (!outcome.ok) {
      return { ok: false, code: outcome.code, message: outcome.message };
    }
    return {
      ok: true,
      result: outcome.data.scores.carbon_quality,
      registry_serial: outcome.data.serial,
    };
  }

  if (item.serial && !item.id && !item.text) {
    const outcome = await lookupRegistryConnect({ serial: item.serial });
    if (!outcome.ok) {
      return { ok: false, code: outcome.code, message: outcome.message };
    }
    return {
      ok: true,
      result: outcome.data.scores.carbon_quality,
      registry_serial: outcome.data.serial,
    };
  }

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
