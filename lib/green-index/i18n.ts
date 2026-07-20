import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export function formatGreenEditionLabel(editionIso: string, locale: Locale): string {
  const d = new Date(`${editionIso}T00:00:00.000Z`);
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

type GreenIndexCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimer: string;
  editionLabel: (month: string) => string;
  metricsTitle: string;
  references: string;
  registryVerified: string;
  topTitle: string;
  table: {
    rank: string;
    name: string;
    type: string;
    composite: string;
    taxonomy: string;
    cqs: string;
    watt: string;
    mom: string;
    source: string;
  };
  segmentsTitle: string;
  segmentCount: string;
  segmentAvgComposite: string;
  downloadCsv: string;
  ctaCompare: string;
  ctaWizard: string;
  projectTypes: Record<string, string>;
  csvHeaders: {
    rank: string;
    name: string;
    type: string;
    composite: string;
    taxonomy: string;
    cqs: string;
    watt: string;
    mom: string;
    source: string;
  };
};

const FR: GreenIndexCopy = {
  eyebrow: "Indice mensuel · AUROS Green",
  title: "AUROS Green RWA Index",
  intro:
    "Les actifs climatiques tokenisés les mieux scorés en Europe — Taxonomy EU, Carbon Quality Score (CQS) et Watt Score. Référence indicative pour presse, family offices et due diligence.",
  disclaimer:
    "Données indicatives — pas un conseil en investissement. Les scores CQS et Watt sont des signaux AUROS, pas des audits tiers (Verra, ICVCM).",
  editionLabel: (month) => `Édition ${month}`,
  metricsTitle: "Vue d'ensemble",
  references: "Références suivies",
  registryVerified: "Projets Verified AUROS",
  topTitle: "Top 20 — score composite AUROS",
  table: {
    rank: "#",
    name: "Actif",
    type: "Type",
    composite: "Composite",
    taxonomy: "Taxonomy",
    cqs: "CQS",
    watt: "Watt",
    mom: "MoM %",
    source: "Source",
  },
  segmentsTitle: "Par segment",
  segmentCount: "Références",
  segmentAvgComposite: "Composite moy.",
  downloadCsv: "Télécharger CSV",
  ctaCompare: "Comparateur Green →",
  ctaWizard: "Structurer mon actif →",
  projectTypes: {
    solar: "Solaire",
    wind: "Éolien",
    rec: "REC",
    carbon: "Carbone",
    ppa: "PPA",
    other: "Autre",
  },
  csvHeaders: {
    rank: "rank",
    name: "name",
    type: "type",
    composite: "composite_score",
    taxonomy: "taxonomy_score",
    cqs: "carbon_quality_score",
    watt: "watt_score",
    mom: "mom_pct",
    source: "source_url",
  },
};

const EN: GreenIndexCopy = {
  ...FR,
  eyebrow: "Monthly index · AUROS Green",
  title: "AUROS Green RWA Index",
  intro:
    "Top-scored tokenized climate assets in Europe — EU Taxonomy, Carbon Quality Score (CQS) and Watt Score. Indicative reference for press, family offices and due diligence.",
  disclaimer:
    "Indicative data — not investment advice. CQS and Watt scores are AUROS signals, not third-party audits (Verra, ICVCM).",
  editionLabel: (month) => `${month} edition`,
  metricsTitle: "Overview",
  references: "References tracked",
  registryVerified: "AUROS Verified projects",
  topTitle: "Top 20 — AUROS composite score",
  segmentsTitle: "By segment",
  segmentCount: "References",
  segmentAvgComposite: "Avg composite",
  downloadCsv: "Download CSV",
  ctaCompare: "Green comparator →",
  ctaWizard: "Structure my asset →",
  projectTypes: {
    solar: "Solar",
    wind: "Wind",
    rec: "REC",
    carbon: "Carbon",
    ppa: "PPA",
    other: "Other",
  },
};

const ES: GreenIndexCopy = {
  ...FR,
  eyebrow: "Índice mensual · AUROS Green",
  title: "AUROS Green RWA Index",
  intro:
    "Activos climáticos tokenizados mejor puntuados en Europa — Taxonomía UE, Carbon Quality Score (CQS) y Watt Score. Referencia indicativa para prensa y due diligence.",
  disclaimer:
    "Datos indicativos — no es asesoramiento de inversión. CQS y Watt son señales AUROS, no auditorías de terceros.",
  editionLabel: (month) => `Edición ${month}`,
  metricsTitle: "Resumen",
  references: "Referencias seguidas",
  registryVerified: "Proyectos Verified AUROS",
  topTitle: "Top 20 — puntuación compuesta AUROS",
  segmentsTitle: "Por segmento",
  segmentCount: "Referencias",
  segmentAvgComposite: "Compuesta media",
  downloadCsv: "Descargar CSV",
  ctaCompare: "Comparador Green →",
  ctaWizard: "Estructurar mi activo →",
  projectTypes: {
    solar: "Solar",
    wind: "Eólico",
    rec: "REC",
    carbon: "Carbono",
    ppa: "PPA",
    other: "Otro",
  },
};

const COPY: CatalogMap< GreenIndexCopy> = { fr: FR, en: EN, es: ES };

export function getGreenIndexCopy(locale: Locale): GreenIndexCopy {
  return COPY[resolveCatalogLocale(locale)] ?? FR;
}
