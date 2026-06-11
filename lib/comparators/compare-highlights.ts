export type CompareCellHighlight = "best" | "worst" | null;

export function parseFeesCompareValue(fees: string): number {
  const matches = fees.replace(",", ".").match(/[\d.]+/g);
  if (!matches?.length) return Number.POSITIVE_INFINITY;
  const values = matches.map(Number).filter(Number.isFinite);
  if (!values.length) return Number.POSITIVE_INFINITY;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function highlightNumericRow(
  values: number[],
  higherIsBetter: boolean
): CompareCellHighlight[] {
  if (values.length < 2) return values.map(() => null);

  const finite = values.filter((value) => Number.isFinite(value));
  if (finite.length < 2) return values.map(() => null);

  const bestVal = higherIsBetter ? Math.max(...finite) : Math.min(...finite);
  const worstVal = higherIsBetter ? Math.min(...finite) : Math.max(...finite);
  if (bestVal === worstVal) return values.map(() => null);

  return values.map((value) => {
    if (!Number.isFinite(value)) return null;
    if (value === bestVal) return "best";
    if (value === worstVal) return "worst";
    return null;
  });
}

export function compareCellHighlightClass(
  highlight: CompareCellHighlight
): string {
  switch (highlight) {
    case "best":
      return "rounded-md bg-emerald-500/10 text-emerald-200/90";
    case "worst":
      return "rounded-md bg-white/[0.04] text-white/40";
    default:
      return "";
  }
}
