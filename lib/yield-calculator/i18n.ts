import type { Locale } from "@/lib/i18n";

import type { YieldAssetClass } from "./types";

export type YieldCalculatorCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimer: string;
  amountLabel: string;
  amountHint: string;
  assetClassLabel: string;
  holdingLabel: string;
  holdingHint: string;
  holdingMonths: (n: number) => string;
  resultTitle: string;
  annualReturn: string;
  monthlyReturn: string;
  apyRange: string;
  vsInflation: string;
  inflationLabel: string;
  yieldLabel: string;
  beatsInflation: string;
  belowInflation: string;
  sourceNote: string;
  compareCta: string;
  wizardCta: string;
  estimateCta: string;
  relatedTitle: string;
  relatedLinks: { href: string; label: string }[];
  faqTitle: string;
  assetClasses: Record<YieldAssetClass, string>;
};

const FR: YieldCalculatorCopy = {
  eyebrow: "Outil gratuit · Rendements",
  title: "Calculateur de rendement RWA",
  intro:
    "Estimez une fourchette de rendement annuel indicatif selon la classe d'actif tokenisée et votre montant — basé sur les moyennes du comparateur AUROS.",
  disclaimer:
    "Estimation indicative, non conseil en investissement — les APY réels varient selon plateforme, frais et marché.",
  amountLabel: "Montant investi (EUR)",
  amountHint: "Ex. 10 000 € — montant indicatif",
  assetClassLabel: "Classe d'actif tokenisée",
  holdingLabel: "Durée de détention (mois)",
  holdingHint: "Optionnel — prorata linéaire sur la période",
  holdingMonths: (n) => `${n} mois`,
  resultTitle: "Estimation indicative",
  annualReturn: "Rendement annuel estimé",
  monthlyReturn: "Équivalent mensuel",
  apyRange: "Fourchette APY (hub AUROS)",
  vsInflation: "Rendement vs inflation UE",
  inflationLabel: "Inflation illustrative (~2,5 %)",
  yieldLabel: "Rendement estimé (milieu de fourchette)",
  beatsInflation: "Au-dessus du benchmark inflation sur cette fourchette",
  belowInflation: "Fourchette basse sous l'inflation illustrative — vérifier le profil risque",
  sourceNote: "Source des données",
  compareCta: "Comparer les produits live",
  wizardCta: "Structurer mon dossier — wizard",
  estimateCta: "Score de préparation détaillé",
  relatedTitle: "Aller plus loin",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Sélecteur de juridiction" },
    { href: "/tools/cost-estimator", label: "Estimateur coût tokenisation" },
    { href: "/tools/mica-checker", label: "Test MiCA" },
    { href: "/compare", label: "Comparateur rendements RWA (120+ produits)" },
    { href: "/jurisdictions", label: "Comparateur juridictions" },
  ],
  faqTitle: "Questions fréquentes",
  assetClasses: {
    tbills: "T-Bills / obligations souveraines tokenisées",
    stablecoins: "Stablecoins yield / trésorerie tokenisée",
    real_estate: "Immobilier tokenisé",
    private_credit: "Private credit on-chain",
    commodities: "Matières premières tokenisées",
    green_carbon: "Green / crédits carbone tokenisés",
  },
};

const EN: YieldCalculatorCopy = {
  ...FR,
  eyebrow: "Free tool · Yields",
  title: "RWA yield calculator",
  intro:
    "Estimate an indicative annual yield range by tokenized asset class and amount — based on AUROS comparator averages.",
  disclaimer:
    "Indicative estimate, not investment advice — actual APYs vary by platform, fees and market.",
  amountLabel: "Investment amount (EUR)",
  amountHint: "e.g. €10,000 — indicative amount",
  assetClassLabel: "Tokenized asset class",
  holdingLabel: "Holding period (months)",
  holdingHint: "Optional — linear proration over the period",
  holdingMonths: (n) => `${n} months`,
  resultTitle: "Indicative estimate",
  annualReturn: "Estimated annual return",
  monthlyReturn: "Monthly equivalent",
  apyRange: "APY range (AUROS hub)",
  vsInflation: "Yield vs EU inflation",
  inflationLabel: "Illustrative inflation (~2.5%)",
  yieldLabel: "Estimated yield (mid-range)",
  beatsInflation: "Above illustrative inflation benchmark on this range",
  belowInflation: "Low end below illustrative inflation — check risk profile",
  sourceNote: "Data source",
  compareCta: "Compare live products",
  wizardCta: "Structure my file — wizard",
  estimateCta: "Detailed readiness score",
  relatedTitle: "Go further",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Jurisdiction picker" },
    { href: "/tools/cost-estimator", label: "Tokenization cost estimator" },
    { href: "/tools/mica-checker", label: "MiCA check" },
    { href: "/compare", label: "RWA yield comparator (120+ products)" },
    { href: "/jurisdictions", label: "Jurisdiction comparator" },
  ],
  faqTitle: "Frequently asked questions",
  assetClasses: {
    tbills: "T-Bills / tokenized sovereign bonds",
    stablecoins: "Stablecoin yield / tokenized treasury",
    real_estate: "Tokenized real estate",
    private_credit: "On-chain private credit",
    commodities: "Tokenized commodities",
    green_carbon: "Green / tokenized carbon credits",
  },
};

const ES: YieldCalculatorCopy = {
  ...EN,
  eyebrow: "Herramienta gratuita · Rendimientos",
  title: "Calculadora de rendimiento RWA",
  intro:
    "Estime un rango indicativo de rendimiento anual según la clase de activo tokenizado y su importe — basado en las medias del comparador AUROS.",
  disclaimer:
    "Estimación indicativa, no asesoramiento de inversión — los APY reales varían según plataforma, comisiones y mercado.",
  amountLabel: "Importe invertido (EUR)",
  amountHint: "Ej. 10 000 € — importe indicativo",
  assetClassLabel: "Clase de activo tokenizado",
  holdingLabel: "Duración de tenencia (meses)",
  holdingHint: "Opcional — prorrateo lineal sobre el período",
  holdingMonths: (n) => `${n} meses`,
  resultTitle: "Estimación indicativa",
  annualReturn: "Rendimiento anual estimado",
  monthlyReturn: "Equivalente mensual",
  apyRange: "Rango APY (hub AUROS)",
  vsInflation: "Rendimiento vs inflación UE",
  inflationLabel: "Inflación ilustrativa (~2,5 %)",
  yieldLabel: "Rendimiento estimado (punto medio)",
  beatsInflation: "Por encima del benchmark de inflación en este rango",
  belowInflation: "Extremo bajo bajo inflación ilustrativa — verificar perfil de riesgo",
  sourceNote: "Fuente de datos",
  compareCta: "Comparar productos en vivo",
  wizardCta: "Estructurar mi expediente — wizard",
  estimateCta: "Puntuación de preparación detallada",
  relatedTitle: "Profundizar",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Selector de jurisdicción" },
    { href: "/tools/cost-estimator", label: "Estimador coste tokenización" },
    { href: "/tools/mica-checker", label: "Test MiCA" },
    { href: "/compare", label: "Comparador rendimientos RWA (120+ productos)" },
    { href: "/jurisdictions", label: "Comparador jurisdicciones" },
  ],
  faqTitle: "Preguntas frecuentes",
  assetClasses: {
    tbills: "T-Bills / bonos soberanos tokenizados",
    stablecoins: "Stablecoins yield / tesorería tokenizada",
    real_estate: "Inmobiliario tokenizado",
    private_credit: "Private credit on-chain",
    commodities: "Materias primas tokenizadas",
    green_carbon: "Green / créditos de carbono tokenizados",
  },
};

const COPY: Record<Locale, YieldCalculatorCopy> = { fr: FR, en: EN, es: ES };

export function getYieldCalculatorCopy(locale: Locale): YieldCalculatorCopy {
  return COPY[locale] ?? FR;
}

export const YIELD_ASSET_CLASS_ORDER: YieldAssetClass[] = [
  "tbills",
  "stablecoins",
  "real_estate",
  "private_credit",
  "commodities",
  "green_carbon",
];
