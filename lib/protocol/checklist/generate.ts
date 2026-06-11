import type { ChecklistRequest } from "../schemas/checklist";
import { getChecklistTemplates } from "./items";

export function generateChecklist(input: ChecklistRequest) {
  const items = getChecklistTemplates(input);
  const estimated_total_days = items.reduce((s, i) => s + i.estimated_time_days, 0);
  const estimated_total_cost_eur = items.reduce((s, i) => s + i.estimated_cost_eur, 0);

  return {
    asset_type: input.asset_type,
    jurisdiction: input.jurisdiction,
    structure: input.structure,
    items,
    total_items: items.length,
    estimated_total_days,
    estimated_total_cost_eur,
  };
}
