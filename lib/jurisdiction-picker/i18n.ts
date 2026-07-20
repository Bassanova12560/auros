import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";
import type { JurisdictionAssetType } from "@/lib/jurisdictions/types";

import type { RationaleId } from "./types";

export const ASSET_FILTER_ORDER = [
  "all",
  "real_estate",
  "bonds",
  "private_credit",
  "funds",
] as const;

export type JurisdictionPickerCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimer: string;
  speedLabel: string;
  speedLow: string;
  speedHigh: string;
  costLabel: string;
  costLow: string;
  costHigh: string;
  taxLabel: string;
  taxLow: string;
  taxHigh: string;
  assetLabel: string;
  assetHint: string;
  assetFilters: Record<(typeof ASSET_FILTER_ORDER)[number], string>;
  resultTitle: string;
  resultHint: string;
  matchScore: string;
  jurisdictionsCta: string;
  wizardCta: string;
  estimateCta: string;
  micaCta: string;
  relatedTitle: string;
  relatedLinks: { href: string; label: string }[];
  faqTitle: string;
  rationales: Record<RationaleId, string>;
};

const FR: JurisdictionPickerCopy = {
  eyebrow: "Outil gratuit · Juridictions",
  title: "Où tokeniser ? — sélecteur de juridiction",
  intro:
    "Ajustez délai, coût et fiscalité pour obtenir un top 3 indicatif parmi les 8 juridictions du comparateur AUROS — sans compte.",
  disclaimer:
    "Résultat indicatif, non juridique — validation par counsel et revue substance économique requises avant toute structuration.",
  speedLabel: "Délai de mise sur le marché",
  speedLow: "Approche approfondie",
  speedHigh: "Rapidité prioritaire",
  costLabel: "Sensibilité au coût",
  costLow: "Budget premium accepté",
  costHigh: "Budget serré",
  taxLabel: "Optimisation fiscale",
  taxLow: "Priorité basse",
  taxHigh: "Priorité haute",
  assetLabel: "Type d'actif (optionnel)",
  assetHint: "Filtre les juridictions compatibles avec votre classe d'actif",
  assetFilters: {
    all: "Tous types",
    real_estate: "Immobilier",
    bonds: "Obligations / titres",
    private_credit: "Crédit privé",
    funds: "Fonds / véhicules",
  },
  resultTitle: "Top 3 juridictions indicatives",
  resultHint: "Classement pondéré selon vos curseurs — affinez sur le comparateur détaillé.",
  matchScore: "Correspondance",
  jurisdictionsCta: "Comparer les 8 juridictions",
  wizardCta: "Structurer mon dossier — wizard",
  estimateCta: "Score de préparation",
  micaCta: "Test MiCA",
  relatedTitle: "Aller plus loin",
  relatedLinks: [
    { href: "/tools/mica-checker", label: "Test MiCA" },
    { href: "/tools/cost-estimator", label: "Estimateur coût tokenisation" },
    { href: "/tools/yield-calculator", label: "Calculateur rendement RWA" },
    { href: "/compare", label: "Comparateur rendements (120+ produits)" },
    { href: "/jurisdictions/starter-kit", label: "Starter Kit juridiction" },
  ],
  faqTitle: "Questions fréquentes",
  rationales: {
    fast_track: "Parmi les délais licence les plus courts du comparateur.",
    cost_efficient: "Fourchette de setup compétitive pour votre profil budget.",
    tax_favorable: "Cadre fiscal investisseur favorable (0 % PV typique).",
    asset_fit: "Couvre votre classe d'actif dans le comparateur AUROS.",
    eu_passport: "Écosystème UE / passport réglementaire (MiCA, AIF).",
    stability: "Stabilité réglementaire et juridique élevée.",
    institutional: "Place institutionnelle mature — gouvernance et liquidité.",
  },
};

const EN: JurisdictionPickerCopy = {
  ...FR,
  eyebrow: "Free tool · Jurisdictions",
  title: "Where to tokenize? — jurisdiction picker",
  intro:
    "Adjust timeline, cost and tax priorities for an indicative top 3 among AUROS's 8 comparator jurisdictions — no account required.",
  disclaimer:
    "Indicative result, not legal advice — counsel and economic-substance review required before structuring.",
  speedLabel: "Speed to market",
  speedLow: "Thorough approach",
  speedHigh: "Speed priority",
  costLabel: "Cost sensitivity",
  costLow: "Premium budget OK",
  costHigh: "Budget conscious",
  taxLabel: "Tax optimization",
  taxLow: "Low priority",
  taxHigh: "High priority",
  assetLabel: "Asset type (optional)",
  assetHint: "Filters jurisdictions compatible with your asset class",
  assetFilters: {
    all: "All types",
    real_estate: "Real estate",
    bonds: "Bonds / securities",
    private_credit: "Private credit",
    funds: "Funds / vehicles",
  },
  resultTitle: "Indicative top 3 jurisdictions",
  resultHint: "Weighted ranking from your sliders — refine on the detailed comparator.",
  matchScore: "Match",
  jurisdictionsCta: "Compare all 8 jurisdictions",
  wizardCta: "Structure my dossier — wizard",
  estimateCta: "Readiness score",
  micaCta: "MiCA check",
  relatedTitle: "Go further",
  relatedLinks: [
    { href: "/tools/mica-checker", label: "MiCA readiness check" },
    { href: "/tools/cost-estimator", label: "Tokenization cost estimator" },
    { href: "/tools/yield-calculator", label: "RWA yield calculator" },
    { href: "/compare", label: "Yield comparator (120+ products)" },
    { href: "/jurisdictions/starter-kit", label: "Jurisdiction Starter Kit" },
  ],
  faqTitle: "Frequently asked questions",
  rationales: {
    fast_track: "Among the shortest licence timelines in the comparator.",
    cost_efficient: "Competitive setup range for your budget profile.",
    tax_favorable: "Investor-friendly tax framework (typically 0% CGT).",
    asset_fit: "Covers your asset class in the AUROS comparator.",
    eu_passport: "EU ecosystem / regulatory passport (MiCA, AIF).",
    stability: "High regulatory and legal stability.",
    institutional: "Mature institutional hub — governance and depth.",
  },
};

const ES: JurisdictionPickerCopy = {
  ...FR,
  eyebrow: "Herramienta gratuita · Jurisdicciones",
  title: "¿Dónde tokenizar? — selector de jurisdicción",
  intro:
    "Ajuste plazo, coste y fiscalidad para un top 3 indicativo entre las 8 jurisdicciones del comparador AUROS — sin cuenta.",
  disclaimer:
    "Resultado indicativo, no asesoramiento jurídico — se requiere counsel y revisión de sustancia económica.",
  speedLabel: "Plazo de salida al mercado",
  speedLow: "Enfoque exhaustivo",
  speedHigh: "Prioridad rapidez",
  costLabel: "Sensibilidad al coste",
  costLow: "Presupuesto premium aceptado",
  costHigh: "Presupuesto ajustado",
  taxLabel: "Optimización fiscal",
  taxLow: "Prioridad baja",
  taxHigh: "Prioridad alta",
  assetLabel: "Tipo de activo (opcional)",
  assetHint: "Filtra jurisdicciones compatibles con su clase de activo",
  assetFilters: {
    all: "Todos los tipos",
    real_estate: "Inmobiliario",
    bonds: "Bonos / valores",
    private_credit: "Crédito privado",
    funds: "Fondos / vehículos",
  },
  resultTitle: "Top 3 jurisdicciones indicativas",
  resultHint: "Clasificación ponderada según sus controles — refine en el comparador.",
  matchScore: "Correspondencia",
  jurisdictionsCta: "Comparar las 8 jurisdicciones",
  wizardCta: "Estructurar mi expediente — wizard",
  estimateCta: "Puntuación de preparación",
  micaCta: "Test MiCA",
  relatedTitle: "Ir más lejos",
  relatedLinks: [
    { href: "/tools/mica-checker", label: "Test MiCA" },
    { href: "/tools/cost-estimator", label: "Estimador coste tokenización" },
    { href: "/tools/yield-calculator", label: "Calculadora rendimiento RWA" },
    { href: "/compare", label: "Comparador rendimientos (120+ productos)" },
    { href: "/jurisdictions/starter-kit", label: "Starter Kit jurisdicción" },
  ],
  faqTitle: "Preguntas frecuentes",
  rationales: {
    fast_track: "Entre los plazos de licencia más cortos del comparador.",
    cost_efficient: "Rango de setup competitivo para su perfil presupuestario.",
    tax_favorable: "Marco fiscal favorable al inversor (0 % PV típico).",
    asset_fit: "Cubre su clase de activo en el comparador AUROS.",
    eu_passport: "Ecosistema UE / pasaporte regulatorio (MiCA, AIF).",
    stability: "Alta estabilidad regulatoria y jurídica.",
    institutional: "Hub institucional maduro — gobernanza y profundidad.",
  },
};

const CATALOG: CatalogMap< JurisdictionPickerCopy> = { fr: FR, en: EN, es: ES };

export function getJurisdictionPickerCopy(locale: Locale): JurisdictionPickerCopy {
  return CATALOG[resolveCatalogLocale(locale)] ?? FR;
}

export function assetFilterLabel(
  copy: JurisdictionPickerCopy,
  asset: (typeof ASSET_FILTER_ORDER)[number]
): string {
  return copy.assetFilters[asset];
}

export type { JurisdictionAssetType };
