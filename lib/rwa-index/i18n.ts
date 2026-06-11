import type { Locale } from "@/lib/i18n";

import type { RwaIndexCategoryId } from "./types";

export type RwaIndexCopy = {
  eyebrow: string;
  title: string;
  editionLabel: (monthYear: string) => string;
  intro: string;
  disclaimer: string;
  metricsTitle: string;
  totalProducts: string;
  activeJurisdictions: string;
  dataFreshness: (date: string) => string;
  dossierTrendsTitle: string;
  dossierTrendsValue: (n: number, pct: number) => string;
  dossierTrendsNote: string;
  tableTitle: string;
  tableCategory: string;
  tableProducts: string;
  tableAvg: string;
  tableMin: string;
  tableMax: string;
  tableMedian: string;
  illustrativeBadge: string;
  methodologyTitle: string;
  methodologyBody: string[];
  downloadCta: string;
  relatedTitle: string;
  relatedLinks: { href: string; label: string }[];
  faqTitle: string;
  categories: Record<RwaIndexCategoryId, string>;
};

function editionMonthYear(iso: string, locale: string): string {
  const [year, month] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, 1));
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

export function formatEditionLabel(iso: string, locale: Locale): string {
  const tag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";
  const label = editionMonthYear(iso, tag);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const FR: RwaIndexCopy = {
  eyebrow: "Données · Pilier SEO",
  title: "AUROS RWA Index",
  editionLabel: (m) => `Édition ${m}`,
  intro:
    "Indice mensuel des rendements tokenisés en Europe — moyennes APY par classe d'actif, volume produits et juridictions actives. Source indicative pour analystes et presse.",
  disclaimer:
    "Données indicatives issues du comparateur AUROS — non conseil en investissement. Validez toute décision avec counsel et plateforme d'émission.",
  metricsTitle: "Vue d'ensemble",
  totalProducts: "Produits RWA suivis",
  activeJurisdictions: "Juridictions actives",
  dataFreshness: (d) => `Dernière collecte comparateur : ${d}`,
  dossierTrendsTitle: "Tendance dossiers (indicatif)",
  dossierTrendsValue: (n, pct) => `~${n} démarrages wizard / mois (+${pct} % vs mois précédent, estimation)`,
  dossierTrendsNote:
    "Estimation interne — pas de statistiques publiques consolidées.",
  tableTitle: "Rendements par classe d'actif",
  tableCategory: "Classe",
  tableProducts: "Produits",
  tableAvg: "Moy. APY",
  tableMin: "Min",
  tableMax: "Max",
  tableMedian: "Médiane",
  illustrativeBadge: "Fourchette illustrative",
  methodologyTitle: "Méthodologie",
  methodologyBody: [
    "L'index agrège les produits du hub /compare AUROS : obligations, stablecoins, immobilier, private credit et matières premières (JSON catalogue + DefiLlama).",
    "Pour chaque classe, min / max / médiane / moyenne sont calculés sur les APY strictement positifs. Les classes sans coupon fixe (commodities, green) affichent une fourchette documentée.",
    "Le nombre de juridictions actives provient du comparateur /jurisdictions (8 places AUROS). L'édition est datée du premier jour du mois de publication.",
    "Export CSV libre — citation : « AUROS RWA Index, édition [mois], auros.io/data/rwa-index ».",
  ],
  downloadCta: "Télécharger l'index (CSV)",
  relatedTitle: "Explorer AUROS",
  relatedLinks: [
    { href: "/compare", label: "Comparateur rendements RWA" },
    { href: "/data/state-of-rwa-issuers", label: "State of RWA Issuers (trimestriel)" },
    { href: "/tools", label: "Outils tokenisation" },
    { href: "/blog", label: "Blog RWA" },
    { href: "/glossary", label: "Glossaire RWA" },
    { href: "/jurisdictions", label: "Comparateur juridictions" },
    { href: "/wizard", label: "Wizard tokenisation" },
  ],
  faqTitle: "Questions fréquentes",
  categories: {
    bonds: "Obligations / T-Bills",
    stablecoins: "Stablecoins yield",
    real_estate: "Immobilier tokenisé",
    private_credit: "Private credit",
    commodities: "Matières premières",
    green: "Green / carbone",
  },
};

const EN: RwaIndexCopy = {
  ...FR,
  eyebrow: "Data · SEO pillar",
  editionLabel: (m) => `${m} edition`,
  intro:
    "Monthly index of tokenized yields in Europe — average APY by asset class, product count and active jurisdictions. Indicative reference for analysts and press.",
  disclaimer:
    "Indicative data from the AUROS comparator — not investment advice. Validate decisions with counsel and your issuance platform.",
  metricsTitle: "Overview",
  totalProducts: "RWA products tracked",
  activeJurisdictions: "Active jurisdictions",
  dataFreshness: (d) => `Last comparator fetch: ${d}`,
  dossierTrendsTitle: "Dossier trend (indicative)",
  dossierTrendsValue: (n, pct) =>
    `~${n} wizard starts / month (+${pct}% vs prior month, estimate)`,
  dossierTrendsNote: "Internal estimate — no consolidated public statistics.",
  tableTitle: "Yields by asset class",
  tableCategory: "Class",
  tableProducts: "Products",
  tableAvg: "Avg APY",
  tableMin: "Min",
  tableMax: "Max",
  tableMedian: "Median",
  illustrativeBadge: "Illustrative range",
  methodologyTitle: "Methodology",
  methodologyBody: [
    "The index aggregates products from the AUROS /compare hub: bonds, stablecoins, real estate, private credit and commodities (catalog JSON + DefiLlama).",
    "Per class, min / max / median / mean are computed on strictly positive APYs. Classes without fixed coupons (commodities, green) show a documented illustrative range.",
    "Active jurisdiction count comes from /jurisdictions (8 AUROS venues). Edition is dated the first day of the publication month.",
    "Free CSV export — cite as: « AUROS RWA Index, [month] edition, auros.io/data/rwa-index ».",
  ],
  downloadCta: "Download index (CSV)",
  relatedTitle: "Explore AUROS",
  relatedLinks: [
    { href: "/compare", label: "RWA yield comparator" },
    { href: "/data/state-of-rwa-issuers", label: "State of RWA Issuers (quarterly)" },
    { href: "/tools", label: "Tokenization tools" },
    { href: "/blog", label: "RWA blog" },
    { href: "/glossary", label: "RWA glossary" },
    { href: "/jurisdictions", label: "Jurisdiction comparator" },
    { href: "/wizard", label: "Tokenization wizard" },
  ],
  faqTitle: "Frequently asked questions",
  categories: {
    bonds: "Bonds / T-Bills",
    stablecoins: "Yield stablecoins",
    real_estate: "Tokenized real estate",
    private_credit: "Private credit",
    commodities: "Commodities",
    green: "Green / carbon",
  },
};

const ES: RwaIndexCopy = {
  ...FR,
  eyebrow: "Datos · Pilar SEO",
  editionLabel: (m) => `Edición ${m}`,
  intro:
    "Índice mensual de rendimientos tokenizados en Europa — APY medio por clase de activo, productos y jurisdicciones activas. Referencia indicativa para analistas y prensa.",
  disclaimer:
    "Datos indicativos del comparador AUROS — no es asesoramiento de inversión. Valide con counsel y su plataforma de emisión.",
  metricsTitle: "Resumen",
  totalProducts: "Productos RWA seguidos",
  activeJurisdictions: "Jurisdicciones activas",
  dataFreshness: (d) => `Última recogida comparador: ${d}`,
  dossierTrendsTitle: "Tendencia expedientes (indicativo)",
  dossierTrendsValue: (n, pct) =>
    `~${n} inicios wizard / mes (+${pct}% vs mes anterior, estimación)`,
  dossierTrendsNote: "Estimación interna — sin estadísticas públicas consolidadas.",
  tableTitle: "Rendimientos por clase de activo",
  tableCategory: "Clase",
  tableProducts: "Productos",
  tableAvg: "APY medio",
  tableMin: "Mín",
  tableMax: "Máx",
  tableMedian: "Mediana",
  illustrativeBadge: "Rango ilustrativo",
  methodologyTitle: "Metodología",
  methodologyBody: FR.methodologyBody.map((_, i) =>
    [
      "El índice agrega productos del hub /compare AUROS: bonos, stablecoins, inmobiliario, private credit y materias primas (JSON catálogo + DefiLlama).",
      "Por clase, mín / máx / mediana / media sobre APY estrictamente positivos. Clases sin cupón fijo (commodities, green) muestran rango ilustrativo documentado.",
      "Jurisdicciones activas desde /jurisdictions (8 sedes AUROS). Edición fechada el primer día del mes de publicación.",
      "Export CSV libre — citar: « AUROS RWA Index, edición [mes], auros.io/data/rwa-index ».",
    ][i]!
  ),
  downloadCta: "Descargar índice (CSV)",
  relatedTitle: "Explorar AUROS",
  relatedLinks: [
    { href: "/compare", label: "Comparador rendimientos RWA" },
    { href: "/tools", label: "Herramientas tokenización" },
    { href: "/blog", label: "Blog RWA" },
    { href: "/glossary", label: "Glosario RWA" },
    { href: "/jurisdictions", label: "Comparador jurisdicciones" },
    { href: "/wizard", label: "Wizard tokenización" },
  ],
  faqTitle: "Preguntas frecuentes",
  categories: {
    bonds: "Bonos / T-Bills",
    stablecoins: "Stablecoins yield",
    real_estate: "Inmobiliario tokenizado",
    private_credit: "Private credit",
    commodities: "Materias primas",
    green: "Green / carbono",
  },
};

const COPY: Record<Locale, RwaIndexCopy> = { fr: FR, en: EN, es: ES };

export function getRwaIndexCopy(locale: Locale): RwaIndexCopy {
  return COPY[locale] ?? FR;
}

export function formatApyDisplay(value: number | null, locale: Locale): string {
  if (value === null) return "—";
  const tag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";
  return `${new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)} %`;
}

export function formatFetchedDate(iso: string, locale: Locale): string {
  const tag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
