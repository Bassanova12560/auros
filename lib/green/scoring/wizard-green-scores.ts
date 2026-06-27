import type { WizardData } from "@/lib/wizard-types";

import { isGreenWizardContext } from "./green-compliance";
import {
  computeCarbonQualityForWizard,
  type CarbonQualityScore,
} from "./carbon-quality";
import { computeWattScoreForWizard, type WattScoreResult } from "./watt-score";

export type WizardGreenScorePriorityKey =
  | "watt_capacity"
  | "watt_ppa"
  | "watt_meter"
  | "cqs_ccp"
  | "cqs_registry"
  | "cqs_additionality";

export type WizardGreenScores = {
  watt: WattScoreResult | null;
  carbon_quality: CarbonQualityScore | null;
  /** Max 3 combined improvement signals (UX psychology). */
  priority_keys: WizardGreenScorePriorityKey[];
};

function wattPriorities(watt: WattScoreResult): WizardGreenScorePriorityKey[] {
  const keys: WizardGreenScorePriorityKey[] = [];
  if (watt.rating < 60) keys.push("watt_capacity");
  if (watt.rating < 75) keys.push("watt_ppa");
  if (watt.lifetime_gwh == null) keys.push("watt_meter");
  return keys;
}

function cqsPriorities(cqs: CarbonQualityScore): WizardGreenScorePriorityKey[] {
  const keys: WizardGreenScorePriorityKey[] = [];
  if (cqs.ccp_aligned !== true) keys.push("cqs_ccp");
  if (cqs.registry === "mixed" || cqs.registry === "unknown") {
    keys.push("cqs_registry");
  }
  if (cqs.priority_keys.includes("additionality")) keys.push("cqs_additionality");
  return keys;
}

export function computeWizardGreenScores(data: WizardData): WizardGreenScores | null {
  if (!isGreenWizardContext(data)) return null;

  const watt = computeWattScoreForWizard(data);
  const carbon_quality = computeCarbonQualityForWizard(data);
  if (!watt && !carbon_quality) return null;

  const priority_keys = [
    ...(carbon_quality ? cqsPriorities(carbon_quality) : []),
    ...(watt ? wattPriorities(watt) : []),
  ].slice(0, 3);

  return { watt, carbon_quality, priority_keys };
}
