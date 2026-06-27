import type { Locale } from "@/lib/i18n";

import type { WizardGreenScorePriorityKey } from "./scoring/wizard-green-scores";
import { formatCarbonQualityTierLabel } from "./scoring/carbon-quality";
import type { CarbonQualityScore } from "./scoring/carbon-quality";
import type { WattScoreResult } from "./scoring/watt-score";

export type GreenScoringCopy = {
  panelEyebrow: string;
  wattLabel: string;
  wattUnit: string;
  lifetimeLabel: string;
  energyValueLabel: string;
  cqsLabel: string;
  cqsUnit: string;
  prioritiesTitle: string;
  disclaimer: string;
  compareLink: string;
  apiLink: string;
  priorities: Record<WizardGreenScorePriorityKey, string>;
};

const FR: GreenScoringCopy = {
  panelEyebrow: "Scores AUROS Green · indicatif",
  wattLabel: "Watt Score",
  wattUnit: "/100 · valeur énergétique",
  lifetimeLabel: "Énergie sur durée de vie",
  energyValueLabel: "Valeur énergie indicative",
  cqsLabel: "Carbon Quality Score",
  cqsUnit: "/100 · qualité crédit carbone",
  prioritiesTitle: "3 priorités pour renforcer le dossier",
  disclaimer:
    "Signaux AUROS — pas une certification Verra, ICVCM ou audit tiers. Hypothèses de capacité et prix énergie indicatives.",
  compareLink: "Comparateur Green →",
  apiLink: "API CQS publique →",
  priorities: {
    watt_capacity: "Préciser la capacité installée (MW/MWh) dans la description.",
    watt_ppa: "Documenter un PPA ou contrat d'achat énergie signé.",
    watt_meter: "Ajouter preuves de production mesurée (compteur, MWh/an).",
    cqs_ccp: "Viser l'alignement CCP/ICVCM ou changer de programme carbone.",
    cqs_registry: "Tracer le retrait registre Verra/Gold Standard avant tokenisation.",
    cqs_additionality: "Documenter l'additionnalité et la permanence du projet carbone.",
  },
};

const EN: GreenScoringCopy = {
  ...FR,
  panelEyebrow: "AUROS Green scores · indicative",
  wattLabel: "Watt Score",
  wattUnit: "/100 · energy value signal",
  lifetimeLabel: "Lifetime energy",
  energyValueLabel: "Indicative energy value",
  cqsLabel: "Carbon Quality Score",
  cqsUnit: "/100 · carbon credit quality",
  prioritiesTitle: "Top 3 priorities to strengthen the dossier",
  disclaimer:
    "AUROS signals — not Verra, ICVCM or third-party certification. Capacity and energy price assumptions are indicative.",
  compareLink: "Green comparator →",
  apiLink: "Public CQS API →",
  priorities: {
    watt_capacity: "Specify installed capacity (MW/MWh) in the description.",
    watt_ppa: "Document a signed PPA or energy offtake contract.",
    watt_meter: "Add measured production evidence (meter, MWh/year).",
    cqs_ccp: "Target CCP/ICVCM alignment or switch carbon programme.",
    cqs_registry: "Trace Verra/Gold Standard registry retirement before tokenizing.",
    cqs_additionality: "Document additionality and permanence for the carbon project.",
  },
};

const ES: GreenScoringCopy = {
  ...FR,
  panelEyebrow: "Puntuaciones AUROS Green · indicativo",
  wattLabel: "Watt Score",
  wattUnit: "/100 · señal valor energético",
  lifetimeLabel: "Energía vida útil",
  energyValueLabel: "Valor energía indicativo",
  cqsLabel: "Carbon Quality Score",
  cqsUnit: "/100 · calidad crédito carbono",
  prioritiesTitle: "3 prioridades para reforzar el expediente",
  disclaimer:
    "Señales AUROS — no certificación Verra, ICVCM ni auditoría de terceros.",
  compareLink: "Comparador Green →",
  apiLink: "API CQS pública →",
  priorities: {
    watt_capacity: "Precise capacidad instalada (MW/MWh) en la descripción.",
    watt_ppa: "Documente un PPA o contrato de compra de energía firmado.",
    watt_meter: "Añada pruebas de producción medida (contador, MWh/año).",
    cqs_ccp: "Apunte alineación CCP/ICVCM o cambie de programa de carbono.",
    cqs_registry: "Trace retiro en registro Verra/Gold Standard antes de tokenizar.",
    cqs_additionality: "Documente adicionalidad y permanencia del proyecto de carbono.",
  },
};

const COPY: Record<Locale, GreenScoringCopy> = { fr: FR, en: EN, es: ES };

export function getGreenScoringCopy(locale: Locale): GreenScoringCopy {
  return COPY[locale] ?? FR;
}

export function formatWattTierLabel(
  tier: WattScoreResult["tier"],
  locale: Locale
): string {
  const labels = {
    fr: { high: "Élevé", mid: "Intermédiaire", early: "Early" },
    en: { high: "High", mid: "Mid", early: "Early" },
    es: { high: "Alto", mid: "Medio", early: "Early" },
  } as const;
  return labels[locale]?.[tier] ?? labels.fr[tier];
}

export function formatCqsTierLabel(
  tier: CarbonQualityScore["tier"],
  locale: Locale
): string {
  return formatCarbonQualityTierLabel(tier, locale);
}
