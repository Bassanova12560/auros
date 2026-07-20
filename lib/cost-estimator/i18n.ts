import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

import type { CostAssetType, DealSizeRange } from "./types";

export const COST_ASSET_ORDER: CostAssetType[] = [
  "real_estate",
  "funds",
  "bonds",
  "private_credit",
  "green_carbon",
];

export const DEAL_SIZE_ORDER: DealSizeRange[] = [
  "under_500k",
  "500k_2m",
  "2m_10m",
  "over_10m",
];

export type CostEstimatorCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimer: string;
  assetLabel: string;
  assetHint: string;
  assetTypes: Record<CostAssetType, string>;
  dealSizeLabel: string;
  dealSizeHint: string;
  dealSizes: Record<DealSizeRange, string>;
  jurisdictionLabel: string;
  jurisdictionHint: string;
  jurisdictionRecommend: string;
  resultTitle: string;
  setupTotal: string;
  firstYearTotal: string;
  ongoingAnnual: string;
  delayLabel: string;
  delayRange: (min: number, max: number) => string;
  breakdownLabels: Record<"legal" | "licensing" | "audit" | "ongoing", string>;
  recommendedBadge: string;
  sourceNote: string;
  wizardCta: string;
  estimateCta: string;
  jurisdictionsCta: string;
  pickerCta: string;
  relatedTitle: string;
  relatedLinks: { href: string; label: string }[];
  faqTitle: string;
};

const FR: CostEstimatorCopy = {
  eyebrow: "Outil gratuit · Budget",
  title: "Estimateur coût tokenisation RWA",
  intro:
    "Fourchette indicative en euros — setup juridique, licence, audit et frais annuels selon actif, taille de deal et juridiction. Basé sur le comparateur AUROS — sans compte.",
  disclaimer:
    "Estimation indicative, non contractuelle — pas un devis. Validation counsel et chiffrage auditeur requis avant engagement.",
  assetLabel: "Type d'actif",
  assetHint: "Complexité structurelle — immo, fonds, obligations, crédit privé, green",
  assetTypes: {
    real_estate: "Immobilier tokenisé",
    funds: "Fonds / véhicule d'investissement",
    bonds: "Obligations / titres financiers",
    private_credit: "Crédit privé / dette",
    green_carbon: "Green / carbone / énergie",
  },
  dealSizeLabel: "Taille du deal / AUM visé",
  dealSizeHint: "Encours indicatif — influence gouvernance et compliance annuelle",
  dealSizes: {
    under_500k: "Moins de 500 k€",
    "500k_2m": "500 k€ – 2 M€",
    "2m_10m": "2 M€ – 10 M€",
    over_10m: "10 M€ et plus",
  },
  jurisdictionLabel: "Juridiction",
  jurisdictionHint: "8 places du comparateur AUROS — ou recommandation automatique",
  jurisdictionRecommend: "Me recommander une juridiction",
  resultTitle: "Fourchette indicative",
  setupTotal: "Setup one-shot (juridique + licence + audit)",
  firstYearTotal: "Total année 1 (setup + récurrent)",
  ongoingAnnual: "Frais annuels récurrents (compliance, reporting)",
  delayLabel: "Délai indicatif mise sur le marché",
  delayRange: (min, max) => `${min}–${max} mois`,
  breakdownLabels: {
    legal: "Juridique & structuration (SPV, prospectus)",
    licensing: "Licence & régulateur",
    audit: "Audit initial (financier, smart contract)",
    ongoing: "Récurrent annuel",
  },
  recommendedBadge: "Juridiction recommandée",
  sourceNote: "Source des données",
  wizardCta: "Structurer mon dossier — wizard",
  estimateCta: "Score de préparation détaillé",
  jurisdictionsCta: "Comparer les 8 juridictions",
  pickerCta: "Sélecteur de juridiction",
  relatedTitle: "Aller plus loin",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Sélecteur de juridiction" },
    { href: "/tools/mica-checker", label: "Test MiCA" },
    { href: "/tools/yield-calculator", label: "Calculateur rendement RWA" },
    { href: "/jurisdictions", label: "Comparateur juridictions" },
    { href: "/compare", label: "Comparateur rendements" },
  ],
  faqTitle: "Questions fréquentes",
};

const EN: CostEstimatorCopy = {
  ...FR,
  eyebrow: "Free tool · Budget",
  title: "RWA tokenization cost estimator",
  intro:
    "Indicative EUR range — legal setup, licensing, audit and annual fees by asset type, deal size and jurisdiction. Based on the AUROS comparator — no account required.",
  disclaimer:
    "Indicative estimate, not a quote — counsel and auditor pricing required before commitment.",
  assetLabel: "Asset type",
  assetHint: "Structural complexity — real estate, funds, bonds, private credit, green",
  assetTypes: {
    real_estate: "Tokenized real estate",
    funds: "Fund / investment vehicle",
    bonds: "Bonds / financial securities",
    private_credit: "Private credit / debt",
    green_carbon: "Green / carbon / energy",
  },
  dealSizeLabel: "Deal size / target AUM",
  dealSizeHint: "Indicative notional — affects governance and annual compliance",
  dealSizes: {
    under_500k: "Under €500k",
    "500k_2m": "€500k – €2M",
    "2m_10m": "€2M – €10M",
    over_10m: "€10M and above",
  },
  jurisdictionLabel: "Jurisdiction",
  jurisdictionHint: "8 AUROS comparator venues — or automatic recommendation",
  jurisdictionRecommend: "Recommend a jurisdiction for me",
  resultTitle: "Indicative range",
  setupTotal: "One-off setup (legal + licensing + audit)",
  firstYearTotal: "Year 1 total (setup + recurring)",
  ongoingAnnual: "Annual recurring fees (compliance, reporting)",
  delayLabel: "Indicative time to market",
  delayRange: (min, max) => `${min}–${max} months`,
  breakdownLabels: {
    legal: "Legal & structuring (SPV, prospectus)",
    licensing: "Licence & regulator",
    audit: "Initial audit (financial, smart contract)",
    ongoing: "Annual recurring",
  },
  recommendedBadge: "Recommended jurisdiction",
  sourceNote: "Data source",
  wizardCta: "Structure my dossier — wizard",
  estimateCta: "Detailed readiness score",
  jurisdictionsCta: "Compare all 8 jurisdictions",
  pickerCta: "Jurisdiction picker",
  relatedTitle: "Go further",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Jurisdiction picker" },
    { href: "/tools/mica-checker", label: "MiCA readiness check" },
    { href: "/tools/yield-calculator", label: "RWA yield calculator" },
    { href: "/jurisdictions", label: "Jurisdiction comparator" },
    { href: "/compare", label: "Yield comparator" },
  ],
  faqTitle: "Frequently asked questions",
};

const ES: CostEstimatorCopy = {
  ...FR,
  eyebrow: "Herramienta gratuita · Presupuesto",
  title: "Estimador coste tokenización RWA",
  intro:
    "Rango indicativo en euros — setup legal, licencia, auditoría y gastos anuales según activo, tamaño del deal y jurisdicción. Basado en el comparador AUROS — sin cuenta.",
  disclaimer:
    "Estimación indicativa, no contractual — no es un presupuesto. Se requiere validación legal y auditoría antes de comprometerse.",
  assetLabel: "Tipo de activo",
  assetHint: "Complejidad estructural — inmobiliario, fondos, bonos, crédito privado, green",
  assetTypes: {
    real_estate: "Inmobiliario tokenizado",
    funds: "Fondo / vehículo de inversión",
    bonds: "Bonos / valores financieros",
    private_credit: "Crédito privado / deuda",
    green_carbon: "Green / carbono / energía",
  },
  dealSizeLabel: "Tamaño del deal / AUM objetivo",
  dealSizeHint: "Importe indicativo — influye en gobernanza y compliance anual",
  dealSizes: {
    under_500k: "Menos de 500 k€",
    "500k_2m": "500 k€ – 2 M€",
    "2m_10m": "2 M€ – 10 M€",
    over_10m: "10 M€ o más",
  },
  jurisdictionLabel: "Jurisdicción",
  jurisdictionHint: "8 sedes del comparador AUROS — o recomendación automática",
  jurisdictionRecommend: "Recomiéndame una jurisdicción",
  resultTitle: "Rango indicativo",
  setupTotal: "Setup único (legal + licencia + auditoría)",
  firstYearTotal: "Total año 1 (setup + recurrente)",
  ongoingAnnual: "Gastos anuales recurrentes (compliance, reporting)",
  delayLabel: "Plazo indicativo de salida al mercado",
  delayRange: (min, max) => `${min}–${max} meses`,
  breakdownLabels: {
    legal: "Legal y estructuración (SPV, prospecto)",
    licensing: "Licencia y regulador",
    audit: "Auditoría inicial (financiera, smart contract)",
    ongoing: "Recurrente anual",
  },
  recommendedBadge: "Jurisdicción recomendada",
  sourceNote: "Fuente de datos",
  wizardCta: "Estructurar mi expediente — wizard",
  estimateCta: "Puntuación de preparación detallada",
  jurisdictionsCta: "Comparar las 8 jurisdicciones",
  pickerCta: "Selector de jurisdicción",
  relatedTitle: "Ir más allá",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Selector de jurisdicción" },
    { href: "/tools/mica-checker", label: "Test MiCA" },
    { href: "/tools/yield-calculator", label: "Calculadora rendimiento RWA" },
    { href: "/jurisdictions", label: "Comparador jurisdicciones" },
    { href: "/compare", label: "Comparador rendimientos" },
  ],
  faqTitle: "Preguntas frecuentes",
};

const COPY: CatalogMap< CostEstimatorCopy> = { fr: FR, en: EN, es: ES };

export function getCostEstimatorCopy(locale: Locale): CostEstimatorCopy {
  return COPY[resolveCatalogLocale(locale)] ?? FR;
}
