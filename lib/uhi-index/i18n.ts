import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export function formatUhiEditionLabel(editionIso: string, locale: Locale): string {
  const d = new Date(`${editionIso}T00:00:00.000Z`);
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

type UhiIndexCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimer: string;
  editionLabel: (month: string) => string;
  performanceTitle: string;
  monthLabel: string;
  ytdLabel: string;
  metricsTitle: string;
  catalogCount: string;
  topTitle: string;
  table: {
    rank: string;
    name: string;
    segment: string;
    uhi: string;
    watt: string;
    taxonomy: string;
    yield: string;
    mom: string;
    source: string;
  };
  segmentsTitle: string;
  segmentCount: string;
  segmentAvgUhi: string;
  downloadCsv: string;
  ctaGreenIndex: string;
  ctaCompare: string;
  segments: Record<string, string>;
  csvHeaders: {
    rank: string;
    name: string;
    segment: string;
    uhi: string;
    watt: string;
    taxonomy: string;
    yield: string;
    mom: string;
    source: string;
  };
};

const FR: UhiIndexCopy = {
  eyebrow: "Indice mensuel · AUROS",
  title: "AUROS UHI Index",
  intro:
    "Universal High Income — les actifs tokenisés productifs qui alimentent l'économie de l'abondance : énergie mesurée en watts, trésorerie tokenisée, crédit privé liquide. Référence indicative pour family offices et presse.",
  disclaimer:
    "Données indicatives — pas un conseil en investissement. Performance MoM/YTD illustratives sur les premières éditions.",
  editionLabel: (month) => `Édition ${month}`,
  performanceTitle: "Performance indicative",
  monthLabel: "Ce mois",
  ytdLabel: "YTD (indicatif)",
  metricsTitle: "Vue d'ensemble",
  catalogCount: "Actifs éligibles suivis",
  topTitle: "Top 30 — score UHI AUROS",
  table: {
    rank: "#",
    name: "Actif",
    segment: "Segment",
    uhi: "UHI",
    watt: "Watt",
    taxonomy: "Taxonomy",
    yield: "Rend. %",
    mom: "MoM %",
    source: "Source",
  },
  segmentsTitle: "Par segment",
  segmentCount: "Actifs",
  segmentAvgUhi: "UHI moy.",
  downloadCsv: "Télécharger CSV",
  ctaGreenIndex: "Green RWA Index →",
  ctaCompare: "Comparateur RWA →",
  segments: {
    energy: "Énergie",
    treasury: "Trésorerie",
    credit: "Crédit",
    storage: "Stockage / immo",
    compute: "Compute AI",
  },
  csvHeaders: {
    rank: "rank",
    name: "name",
    segment: "segment",
    uhi: "uhi_score",
    watt: "watt_score",
    taxonomy: "taxonomy_score",
    yield: "indicative_yield_pct",
    mom: "mom_pct",
    source: "source_url",
  },
};

const EN: UhiIndexCopy = {
  ...FR,
  eyebrow: "Monthly index · AUROS",
  title: "AUROS UHI Index",
  intro:
    "Universal High Income — productive tokenized assets powering the abundance economy: energy (Watt Score), tokenized treasury, on-chain private credit. Indicative reference for family offices and press.",
  disclaimer:
    "Indicative data — not investment advice. MoM/YTD performance is illustrative on early editions.",
  editionLabel: (month) => `${month} edition`,
  performanceTitle: "Indicative performance",
  monthLabel: "This month",
  ytdLabel: "YTD (indicative)",
  metricsTitle: "Overview",
  catalogCount: "Eligible assets tracked",
  topTitle: "Top 30 — AUROS UHI score",
  segmentsTitle: "By segment",
  segmentCount: "Assets",
  segmentAvgUhi: "Avg UHI",
  downloadCsv: "Download CSV",
  ctaGreenIndex: "Green RWA Index →",
  ctaCompare: "RWA comparator →",
  segments: {
    energy: "Energy",
    treasury: "Treasury",
    credit: "Credit",
    storage: "Storage / real estate",
    compute: "AI compute",
  },
};

const ES: UhiIndexCopy = {
  ...FR,
  eyebrow: "Índice mensual · AUROS",
  title: "AUROS UHI Index",
  intro:
    "Universal High Income — activos tokenizados productivos: energía (Watt Score), tesorería tokenizada y crédito privado on-chain. Referencia indicativa para family offices y prensa.",
  disclaimer:
    "Datos indicativos — no es asesoramiento de inversión. Rendimiento MoM/YTD ilustrativo en primeras ediciones.",
  editionLabel: (month) => `Edición ${month}`,
  performanceTitle: "Rendimiento indicativo",
  monthLabel: "Este mes",
  ytdLabel: "YTD (indicativo)",
  metricsTitle: "Resumen",
  catalogCount: "Activos elegibles seguidos",
  topTitle: "Top 30 — puntuación UHI AUROS",
  segmentsTitle: "Por segmento",
  segmentCount: "Activos",
  segmentAvgUhi: "UHI media",
  downloadCsv: "Descargar CSV",
  ctaGreenIndex: "Green RWA Index →",
  ctaCompare: "Comparador RWA →",
  segments: {
    energy: "Energía",
    treasury: "Tesorería",
    credit: "Crédito",
    storage: "Almacenamiento / inmobiliario",
    compute: "Compute IA",
  },
};

const COPY: CatalogMap< UhiIndexCopy> = { fr: FR, en: EN, es: ES };

export function getUhiIndexCopy(locale: Locale): UhiIndexCopy {
  return COPY[resolveCatalogLocale(locale)] ?? FR;
}
