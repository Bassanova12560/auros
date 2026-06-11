import type { Locale } from "@/lib/i18n";
import type { RwaIndexCategoryId } from "@/lib/rwa-index/types";

export type StateOfRwaIssuersCopy = {
  eyebrow: string;
  title: string;
  editionLabel: (edition: string) => string;
  intro: string;
  disclaimer: string;
  previewTitle: string;
  assetMixTitle: string;
  assetMixCategory: string;
  assetMixProducts: string;
  assetMixShare: string;
  micaTitle: string;
  micaAvg: string;
  micaAvgValue: (pct: number) => string;
  micaSignal: string;
  micaNote: string;
  blockersTitle: string;
  blockersShare: string;
  jurisdictionTitle: string;
  jurisdictionShare: string;
  jurisdictionCost: string;
  jurisdictionLicense: string;
  trendsTitle: string;
  trendsValue: (n: number, pct: number) => string;
  trendsNote: string;
  gateTitle: string;
  gateIntro: string;
  gateNameLabel: string;
  gateNamePlaceholder: string;
  gateEmailLabel: string;
  gateEmailPlaceholder: string;
  gateSubmit: string;
  gateSubmitting: string;
  gateSuccess: string;
  gateDownload: string;
  gatePrivacy: string;
  gateErrors: {
    invalidEmail: string;
    invalidName: string;
    rateLimit: string;
    network: string;
    generic: string;
  };
  methodologyTitle: string;
  methodologyBody: string[];
  relatedTitle: string;
  relatedLinks: { href: string; label: string }[];
  faqTitle: string;
  categories: Record<RwaIndexCategoryId, string>;
  micaSignals: Record<string, string>;
  blockers: Record<string, string>;
  jurisdictions: Record<string, string>;
  pdf: {
    title: string;
    subtitle: string;
    disclaimer: string;
    generatedAt: string;
    sectionAssetMix: string;
    sectionMica: string;
    sectionBlockers: string;
    sectionJurisdictions: string;
    sectionTrends: string;
    footer: string;
  };
};

const FR: StateOfRwaIssuersCopy = {
  eyebrow: "Données · Pilier SEO 4",
  title: "State of RWA Issuers",
  editionLabel: (e) => `Édition ${e}`,
  intro:
    "Rapport trimestriel AUROS sur les émetteurs RWA en Europe — mix d'actifs, signaux MiCA indicatifs, blocages courants et juridictions étudiées. Angle propriétaire complété par l'AUROS RWA Index.",
  disclaimer:
    "Estimations internes clairement étiquetées — non conseil en investissement, non audit réglementaire. Validez toute décision avec counsel qualifié.",
  previewTitle: "Aperçu de l'édition",
  assetMixTitle: "Mix d'actifs (RWA Index)",
  assetMixCategory: "Classe",
  assetMixProducts: "Produits",
  assetMixShare: "Part",
  micaTitle: "Signaux MiCA moyens (indicatif)",
  micaAvg: "Score composite indicatif",
  micaAvgValue: (pct) => `${pct} / 100`,
  micaSignal: "Signal",
  micaNote:
    "Modélisation AUROS MiCA checker — pas de statistiques publiques consolidées.",
  blockersTitle: "Blocages courants (estimation wizard)",
  blockersShare: "Part estimée",
  jurisdictionTitle: "Répartition juridictions étudiées",
  jurisdictionShare: "Intérêt indicatif",
  jurisdictionCost: "Coût moyen",
  jurisdictionLicense: "Licence max.",
  trendsTitle: "Tendance dossiers (indicatif)",
  trendsValue: (n, pct) =>
    `~${n} démarrages wizard / mois (+${pct} % vs mois précédent)`,
  trendsNote: "Estimation interne — non auditée.",
  gateTitle: "Télécharger le rapport PDF",
  gateIntro:
    "Nom et email pour débloquer le PDF complet — pas de compte requis. Prochaines éditions trimestrielles sur invitation.",
  gateNameLabel: "Nom",
  gateNamePlaceholder: "Prénom Nom ou société",
  gateEmailLabel: "Email professionnel",
  gateEmailPlaceholder: "vous@societe.com",
  gateSubmit: "Débloquer le PDF",
  gateSubmitting: "Validation…",
  gateSuccess: "Accès débloqué — téléchargez le rapport ci-dessous.",
  gateDownload: "Télécharger le PDF (Q2 2026)",
  gatePrivacy:
    "Vos données servent à vous envoyer les prochaines éditions. Politique : /privacy",
  gateErrors: {
    invalidEmail: "Email invalide.",
    invalidName: "Nom requis (2 caractères minimum).",
    rateLimit: "Trop de tentatives — réessayez plus tard.",
    network: "Erreur réseau — réessayez.",
    generic: "Impossible de valider — réessayez.",
  },
  methodologyTitle: "Méthodologie",
  methodologyBody: [
    "Mix d'actifs et rendements : AUROS RWA Index (/data/rwa-index) — agrégation hub /compare (JSON catalogue + DefiLlama).",
    "Signaux MiCA, blocages et parts juridictionnelles : estimations internes AUROS (wizard, MiCA checker, jurisdiction picker) — clairement étiquetées comme indicatives.",
    "Publication trimestrielle — édition Q2 2026 basée sur collecte juin 2026. Citation : « AUROS State of RWA Issuers, édition [trimestre], auros.io/data/state-of-rwa-issuers ».",
  ],
  relatedTitle: "Explorer AUROS",
  relatedLinks: [
    { href: "/data/rwa-index", label: "AUROS RWA Index mensuel" },
    { href: "/compare", label: "Comparateur rendements RWA" },
    { href: "/tools/mica-checker", label: "Test MiCA readiness" },
    { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
    { href: "/wizard", label: "Wizard tokenisation" },
    { href: "/blog", label: "Blog RWA" },
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
  micaSignals: {
    whitepaper: "Whitepaper / prospectus",
    issuer_structure: "Structure émetteur (SPV / fonds)",
    eu_nexus: "Nexus UE clarifié",
    investor_type: "Typologie investisseurs",
  },
  blockers: {
    whitepaper_missing: "Whitepaper absent ou incomplet",
    jurisdiction_undecided: "Juridiction non tranchée",
    legal_structure: "Structure juridique à formaliser",
    investor_classification: "Classification investisseurs (retail / pro)",
  },
  jurisdictions: {
    luxembourg: "Luxembourg",
    "dubai-difc": "Dubai DIFC",
    ireland: "Irlande",
    france: "France",
    singapore: "Singapour",
    switzerland: "Suisse",
    gibraltar: "Gibraltar",
    bahrain: "Bahreïn",
  },
  pdf: {
    title: "State of RWA Issuers",
    subtitle: "Rapport trimestriel émetteurs — Europe",
    disclaimer:
      "Données indicatives AUROS — non conseil en investissement. Estimations wizard clairement étiquetées.",
    generatedAt: "Généré le",
    sectionAssetMix: "1. Mix d'actifs (RWA Index)",
    sectionMica: "2. Signaux MiCA moyens (indicatif)",
    sectionBlockers: "3. Blocages courants (estimation wizard)",
    sectionJurisdictions: "4. Juridictions étudiées",
    sectionTrends: "5. Tendance dossiers",
    footer: "© AUROS — auros.io/data/state-of-rwa-issuers · CC BY 4.0 (RWA Index)",
  },
};

const EN: StateOfRwaIssuersCopy = {
  ...FR,
  eyebrow: "Data · SEO pillar 4",
  editionLabel: (e) => `${e} edition`,
  intro:
    "AUROS quarterly report on RWA issuers in Europe — asset mix, indicative MiCA signals, common blockers and jurisdictions studied. Proprietary angle complemented by AUROS RWA Index.",
  disclaimer:
    "Clearly labeled internal estimates — not investment advice or regulatory audit. Validate decisions with qualified counsel.",
  previewTitle: "Edition preview",
  assetMixTitle: "Asset mix (RWA Index)",
  assetMixCategory: "Class",
  assetMixProducts: "Products",
  assetMixShare: "Share",
  micaTitle: "Average MiCA signals (indicative)",
  micaAvg: "Indicative composite score",
  micaAvgValue: (pct) => `${pct} / 100`,
  micaSignal: "Signal",
  micaNote: "AUROS MiCA checker modeling — no consolidated public statistics.",
  blockersTitle: "Common blockers (wizard estimate)",
  blockersShare: "Estimated share",
  jurisdictionTitle: "Jurisdiction breakdown studied",
  jurisdictionShare: "Indicative interest",
  jurisdictionCost: "Avg cost",
  jurisdictionLicense: "Max license",
  trendsTitle: "Dossier trend (indicative)",
  trendsValue: (n, pct) => `~${n} wizard starts / month (+${pct}% vs prior month)`,
  trendsNote: "Internal estimate — not audited.",
  gateTitle: "Download the PDF report",
  gateIntro:
    "Name and email to unlock the full PDF — no account required. Future quarterly editions by invitation.",
  gateNameLabel: "Name",
  gateNamePlaceholder: "First Last or company",
  gateEmailLabel: "Work email",
  gateEmailPlaceholder: "you@company.com",
  gateSubmit: "Unlock PDF",
  gateSubmitting: "Validating…",
  gateSuccess: "Access unlocked — download the report below.",
  gateDownload: "Download PDF (Q2 2026)",
  gatePrivacy: "Your data is used to send future editions. Policy: /privacy",
  gateErrors: {
    invalidEmail: "Invalid email.",
    invalidName: "Name required (2 characters minimum).",
    rateLimit: "Too many attempts — try again later.",
    network: "Network error — retry.",
    generic: "Could not validate — retry.",
  },
  methodologyTitle: "Methodology",
  methodologyBody: [
    "Asset mix and yields: AUROS RWA Index (/data/rwa-index) — /compare hub aggregation.",
    "MiCA signals, blockers and jurisdiction shares: internal AUROS estimates — clearly labeled indicative.",
    "Quarterly publication — Q2 2026 edition based on June 2026 collection.",
  ],
  relatedTitle: "Explore AUROS",
  relatedLinks: [
    { href: "/data/rwa-index", label: "Monthly AUROS RWA Index" },
    { href: "/compare", label: "RWA yield comparator" },
    { href: "/tools/mica-checker", label: "MiCA readiness test" },
    { href: "/tools/jurisdiction-picker", label: "Jurisdiction picker" },
    { href: "/wizard", label: "Tokenization wizard" },
    { href: "/blog", label: "RWA blog" },
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
  pdf: {
    ...FR.pdf,
    title: "State of RWA Issuers",
    subtitle: "Quarterly issuer report — Europe",
    disclaimer:
      "Indicative AUROS data — not investment advice. Wizard estimates clearly labeled.",
    generatedAt: "Generated",
    sectionAssetMix: "1. Asset mix (RWA Index)",
    sectionMica: "2. Average MiCA signals (indicative)",
    sectionBlockers: "3. Common blockers (wizard estimate)",
    sectionJurisdictions: "4. Jurisdictions studied",
    sectionTrends: "5. Dossier trend",
    footer: "© AUROS — auros.io/data/state-of-rwa-issuers · CC BY 4.0 (RWA Index)",
  },
};

const ES: StateOfRwaIssuersCopy = {
  ...EN,
  eyebrow: "Datos · Pilar SEO 4",
  editionLabel: (e) => `Edición ${e}`,
  intro:
    "Informe trimestral AUROS sobre emisores RWA en Europa — mix de activos, señales MiCA indicativas, bloqueos frecuentes y jurisdicciones estudiadas.",
  disclaimer:
    "Estimaciones internas claramente etiquetadas — no es asesoramiento de inversión ni auditoría regulatoria.",
  previewTitle: "Vista previa de la edición",
  assetMixTitle: "Mix de activos (RWA Index)",
  micaTitle: "Señales MiCA medias (indicativo)",
  blockersTitle: "Bloqueos frecuentes (estimación wizard)",
  jurisdictionTitle: "Reparto jurisdicciones estudiadas",
  gateTitle: "Descargar informe PDF",
  gateSubmit: "Desbloquear PDF",
  gateDownload: "Descargar PDF (Q2 2026)",
  faqTitle: "Preguntas frecuentes",
  relatedTitle: "Explorar AUROS",
};

const COPY: Record<Locale, StateOfRwaIssuersCopy> = { fr: FR, en: EN, es: ES };

export function getStateOfRwaIssuersCopy(locale: Locale): StateOfRwaIssuersCopy {
  return COPY[locale] ?? FR;
}

export function formatEditionQuarter(edition: string, locale: Locale): string {
  const match = /^(\d{4})-Q([1-4])$/.exec(edition);
  if (!match) return edition;
  const year = match[1];
  const q = match[2];
  if (locale === "en") return `Q${q} ${year}`;
  if (locale === "es") return `T${q} ${year}`;
  return `T${q} ${year}`;
}

export function formatCostEur(value: number, locale: Locale): string {
  const tag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
