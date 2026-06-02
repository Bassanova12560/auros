/** Cabinet-equivalent line items — indicative market rates for phase 0 RWA work. */
export const STARTER_KIT_PRICE_EUR = 5_000;

export type ValueStackItem = {
  id: string;
  labelKey: string;
  marketValueEur: number;
};

export const STARTER_KIT_VALUE_STACK: ValueStackItem[] = [
  { id: "regulatory", labelKey: "regulatoryNote", marketValueEur: 3_500 },
  { id: "structure", labelKey: "structureMemo", marketValueEur: 4_000 },
  { id: "checklist", labelKey: "complianceChecklist", marketValueEur: 2_500 },
  { id: "timeline", labelKey: "projectTimeline", marketValueEur: 1_500 },
  { id: "benchmark", labelKey: "jurisdictionBenchmark", marketValueEur: 2_000 },
  { id: "tech", labelKey: "techShortlist", marketValueEur: 2_500 },
  { id: "wizard", labelKey: "prefilledDossier", marketValueEur: 1_500 },
  { id: "portal", labelKey: "portalPdf", marketValueEur: 1_000 },
  { id: "call", labelKey: "validationCall", marketValueEur: 500 },
];

export function starterKitMarketTotal(): number {
  return STARTER_KIT_VALUE_STACK.reduce((sum, i) => sum + i.marketValueEur, 0);
}

export function starterKitSavingsPercent(): number {
  const total = starterKitMarketTotal();
  if (total <= STARTER_KIT_PRICE_EUR) return 0;
  return Math.round(((total - STARTER_KIT_PRICE_EUR) / total) * 100);
}
