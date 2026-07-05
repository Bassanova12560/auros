export const GREEN_LABEL_REVIEW_AMOUNT_CENTS = 30_000;

export const GREEN_LABEL_REVIEW_LABELS = {
  fr: "AUROS Green Label — revue documentaire RTMS (300 €)",
  en: "AUROS Green Label — RTMS document review (€300)",
  es: "AUROS Green Label — revisión documental RTMS (300 €)",
} as const;

export function greenLabelReviewProduct() {
  return {
    currency: "eur" as const,
    amountCents: GREEN_LABEL_REVIEW_AMOUNT_CENTS,
    name: GREEN_LABEL_REVIEW_LABELS,
  };
}
