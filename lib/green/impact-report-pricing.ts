import type { CatalogMap } from "@/lib/i18n";

export type GreenImpactReportTier = "standard" | "institutional";

export const GREEN_IMPACT_REPORT_AMOUNTS: Record<GreenImpactReportTier, number> = {
  standard: 4_900,
  institutional: 19_900,
};

export const GREEN_IMPACT_REPORT_LABELS: Record<
  GreenImpactReportTier,
  CatalogMap<string>
> = {
  standard: {
    fr: "Rapport d'impact Green — Standard (49 €)",
    en: "Green Impact Report — Standard (€49)",
    es: "Informe de impacto Green — Standard (49 €)",
  },
  institutional: {
    fr: "Rapport d'impact Green — Institutionnel (199 €)",
    en: "Green Impact Report — Institutional (€199)",
    es: "Informe de impacto Green — Institucional (199 €)",
  },
};

export function isGreenImpactReportTier(value: string): value is GreenImpactReportTier {
  return value === "standard" || value === "institutional";
}

export function greenImpactReportProduct(tier: GreenImpactReportTier) {
  return {
    tier,
    currency: "eur" as const,
    amountCents: GREEN_IMPACT_REPORT_AMOUNTS[tier],
    name: GREEN_IMPACT_REPORT_LABELS[tier],
  };
}
