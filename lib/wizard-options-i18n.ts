import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

/** Maps stored wizard values (English keys) → localized labels. */
export type WizardOptionMaps = {
  documents: Record<string, string>;
  goals: Record<string, string>;
  timelines: Record<string, string>;
  platforms: Record<string, string>;
  legalStructures: Record<string, string>;
  incomeTypes: Record<string, string>;
  legalStatus: Record<string, string>;
  investorProfiles: Record<string, string>;
  assetTypes: Record<string, string>;
};

const FR: WizardOptionMaps = {
  documents: {
    proof_of_ownership: "Preuve de propriété",
    valuation_report: "Rapport de valorisation indépendant",
    due_diligence_report: "Rapport de due diligence",
    spv_documents: "Documents SPV (statuts, K-bis, UBO)",
    legal_opinion: "Avis juridique (legal opinion)",
    tax_memo: "Note fiscale",
    whitepaper: "Livre blanc / présentation projet",
    tokenomics: "Documentation tokenomics",
    smart_contract_audit: "Audit smart contract",
    prospectus: "Prospectus / mémorandum d'investissement",
    risk_disclosure: "Déclaration des risques",
    kyc_aml_policy: "Politique KYC/AML",
    custody_audit_agreements: "Accords de garde et d'audit",
    financial_reporting_plan: "Plan de reporting financier",
    insurance_guarantees: "Assurance / garanties",
    "None yet": "Aucun pour l'instant",
  },
  goals: {
    income: "Générer des revenus passifs",
    liquidity: "Accéder à la liquidité",
    diversification: "Diversifier le patrimoine",
    estate: "Transmission / succession",
  },
  timelines: {
    "As soon as possible": "Dès que possible",
    "Within 3 months": "Sous 3 mois",
    "Within 6 months": "Sous 6 mois",
    "No rush": "Sans urgence",
  },
  platforms: {
    "AUROS dossier": "Dossier AUROS",
    "Concierge support": "Accompagnement concierge",
    "Not decided yet": "Pas encore décidé",
  },
  legalStructures: {
    "Personal ownership (direct)": "Détention personnelle (directe)",
    "Through a company / SCI": "Via société / SCI",
    "Through a trust or foundation": "Via trust ou fondation",
    "Other structure": "Autre structure",
  },
  incomeTypes: {
    rental: "Oui — revenus locatifs",
    other: "Oui — autres revenus",
    none: "Pas de revenus actuellement",
    future: "Revenus potentiels futurs",
  },
  legalStatus: {
    "Clear title — no disputes": "Titre clair — sans litige",
    "No mortgage or encumbrance": "Sans hypothèque ni charge",
    "No ongoing litigation": "Sans procédure en cours",
    "Tax compliant in jurisdiction": "Conforme fiscalement",
    "I need to verify some of these": "À vérifier pour certains points",
  },
  investorProfiles: {
    "Retail investors (general public)": "Investisseurs particuliers",
    "Accredited investors only": "Investisseurs accrédités uniquement",
    "Institutional investors": "Investisseurs institutionnels",
    "I don't know yet": "Je ne sais pas encore",
  },
  assetTypes: {
    "Renewable energy": "Énergie renouvelable",
    "Real estate": "Immobilier",
    "Fine art": "Œuvre d'art",
    Collectibles: "Collection & yacht",
    "Vehicles & classic cars": "Automobile",
    "Wine & spirits": "Vin & spiritueux",
    "Watches & jewelry": "Montres & joaillerie",
    "Music & royalties": "Musique & royalties",
    "Film & IP rights": "Cinéma & IP",
    "Land & island": "Terrain & île",
    "Fashion & luxury goods": "Mode & luxe",
    "Private equity / SME shares": "Private equity",
    "Commodities & precious metals": "Métaux précieux",
    Other: "Autre actif",
  },
};

const EN: WizardOptionMaps = {
  documents: Object.fromEntries(
    Object.keys(FR.documents).map((k) => [k, k])
  ) as WizardOptionMaps["documents"],
  goals: {
    income: "Generate passive income",
    liquidity: "Access liquidity",
    diversification: "Portfolio diversification",
    estate: "Estate planning",
  },
  timelines: Object.fromEntries(
    Object.keys(FR.timelines).map((k) => [k, k])
  ) as WizardOptionMaps["timelines"],
  platforms: Object.fromEntries(
    Object.keys(FR.platforms).map((k) => [k, k])
  ) as WizardOptionMaps["platforms"],
  legalStructures: Object.fromEntries(
    Object.keys(FR.legalStructures).map((k) => [k, k])
  ) as WizardOptionMaps["legalStructures"],
  incomeTypes: {
    rental: "Yes — rental income",
    other: "Yes — other income",
    none: "No income currently",
    future: "Potential future income",
  },
  legalStatus: Object.fromEntries(
    Object.keys(FR.legalStatus).map((k) => [k, k])
  ) as WizardOptionMaps["legalStatus"],
  investorProfiles: Object.fromEntries(
    Object.keys(FR.investorProfiles).map((k) => [k, k])
  ) as WizardOptionMaps["investorProfiles"],
  assetTypes: Object.fromEntries(
    Object.keys(FR.assetTypes).map((k) => [k, k])
  ) as WizardOptionMaps["assetTypes"],
};

const ES: WizardOptionMaps = {
  ...EN,
  documents: {
    proof_of_ownership: "Prueba de propiedad",
    valuation_report: "Informe de valoración independiente",
    due_diligence_report: "Informe de due diligence",
    spv_documents: "Documentos SPV",
    legal_opinion: "Dictamen jurídico",
    tax_memo: "Memorando fiscal",
    whitepaper: "Whitepaper del proyecto",
    tokenomics: "Documentación tokenomics",
    smart_contract_audit: "Auditoría del smart contract",
    prospectus: "Prospecto / memorando",
    risk_disclosure: "Declaración de riesgos",
    kyc_aml_policy: "Política KYC/AML",
    custody_audit_agreements: "Acuerdos de custodia y auditoría",
    financial_reporting_plan: "Plan de reporting financiero",
    insurance_guarantees: "Seguro / garantías",
    "None yet": "Ninguno por ahora",
  },
  goals: {
    income: "Ingresos pasivos",
    liquidity: "Acceder a liquidez",
    diversification: "Diversificación",
    estate: "Planificación sucesoria",
  },
  timelines: {
    "As soon as possible": "Lo antes posible",
    "Within 3 months": "En 3 meses",
    "Within 6 months": "En 6 meses",
    "No rush": "Sin prisa",
  },
  platforms: {
    "AUROS dossier": "Dossier AUROS",
    "Concierge support": "Acompañamiento concierge",
    "Not decided yet": "Aún no decidido",
  },
  legalStructures: {
    "Personal ownership (direct)": "Propiedad personal (directa)",
    "Through a company / SCI": "Vía sociedad / SCI",
    "Through a trust or foundation": "Vía trust o fundación",
    "Other structure": "Otra estructura",
  },
  incomeTypes: {
    rental: "Sí — ingresos por alquiler",
    other: "Sí — otros ingresos",
    none: "Sin ingresos actualmente",
    future: "Ingresos futuros potenciales",
  },
  legalStatus: {
    "Clear title — no disputes": "Título claro — sin litigios",
    "No mortgage or encumbrance": "Sin hipoteca ni carga",
    "No ongoing litigation": "Sin litigios en curso",
    "Tax compliant in jurisdiction": "Cumplimiento fiscal",
    "I need to verify some of these": "Debo verificar algunos puntos",
  },
  investorProfiles: {
    "Retail investors (general public)": "Inversores minoristas",
    "Accredited investors only": "Solo inversores acreditados",
    "Institutional investors": "Inversores institucionales",
    "I don't know yet": "Aún no lo sé",
  },
  assetTypes: {
    "Renewable energy": "Energía renovable",
    "Real estate": "Inmobiliario",
    "Fine art": "Bellas artes",
    Collectibles: "Coleccionables y yate",
    "Vehicles & classic cars": "Automóvil",
    "Wine & spirits": "Vino y destilados",
    "Watches & jewelry": "Relojes y joyería",
    "Music & royalties": "Música y royalties",
    "Film & IP rights": "Cine y derechos IP",
    "Land & island": "Terreno e isla",
    "Fashion & luxury goods": "Moda y lujo",
    "Private equity / SME shares": "Private equity",
    "Commodities & precious metals": "Metales preciosos",
    Other: "Otro activo",
  },
};

const GOAL_SUBTITLES: CatalogMap< Record<string, string>> = {
  fr: {
    income: "Percevoir des rendements réguliers sur votre actif tokenisé",
    liquidity: "Convertir une partie de l'actif en liquidités immédiates",
    diversification: "Répartir votre patrimoine sur plusieurs classes d'actifs",
    estate: "Préparer et simplifier la transmission de l'actif",
  },
  en: {
    income: "Receive regular returns from your tokenized asset",
    liquidity: "Convert part of your asset into immediate cash",
    diversification: "Spread your wealth across multiple asset classes",
    estate: "Prepare and simplify asset transmission",
  },
  es: {
    income: "Recibir rendimientos regulares del activo tokenizado",
    liquidity: "Convertir parte del activo en liquidez inmediata",
    diversification: "Diversificar el patrimonio en varias clases de activos",
    estate: "Preparar y simplificar la transmisión del activo",
  },
};

const TIMELINE_SUBTITLES: CatalogMap< Record<string, string>> = {
  fr: {
    "As soon as possible": "Je souhaite démarrer immédiatement",
    "Within 3 months": "J'ai un peu de temps pour préparer le dossier",
    "Within 6 months": "J'explore mes options",
    "No rush": "Je veux comprendre avant de m'engager",
  },
  en: {
    "As soon as possible": "I want to start the process immediately",
    "Within 3 months": "I have some time to prepare",
    "Within 6 months": "I am exploring my options",
    "No rush": "I want to understand before committing",
  },
  es: {
    "As soon as possible": "Quiero iniciar el proceso de inmediato",
    "Within 3 months": "Tengo tiempo para preparar el expediente",
    "Within 6 months": "Estoy explorando mis opciones",
    "No rush": "Quiero entender antes de comprometerme",
  },
};

const CATALOG: CatalogMap< WizardOptionMaps> = { fr: FR, en: EN, es: ES };

export function wizardOptionLabel(
  locale: Locale,
  group: keyof WizardOptionMaps,
  value: string
): string {
  if (!value) return "—";
  const map = CATALOG[resolveCatalogLocale(locale)]?.[group] ?? CATALOG.fr[group];
  if (group === "goals" || group === "incomeTypes") {
    return map[value] ?? value;
  }
  return map[value] ?? value;
}

const PLATFORM_SUBTITLES: CatalogMap< Record<string, string>> = {
  fr: {
    "AUROS dossier": "Préparer et envoyer votre dossier avec notre équipe",
    "Concierge support": "Un expert AUROS vous guide étape par étape",
    "Not decided yet": "Nous vous proposerons la suite après analyse",
  },
  en: {
    "AUROS dossier": "Prepare and submit your dossier with our team",
    "Concierge support": "An AUROS expert guides you step by step",
    "Not decided yet": "We propose next steps after reviewing your asset",
  },
  es: {
    "AUROS dossier": "Preparar y enviar su dossier con nuestro equipo",
    "Concierge support": "Un experto AUROS le guía paso a paso",
    "Not decided yet": "Propondremos los siguientes pasos tras el análisis",
  },
};

export function wizardPlatformSubtitle(
  locale: Locale,
  platform: string
): string {
  return (
    PLATFORM_SUBTITLES[resolveCatalogLocale(locale)][platform] ??
    PLATFORM_SUBTITLES.fr[platform] ??
    ""
  );
}

export function wizardGoalSubtitle(locale: Locale, goalId: string): string {
  return GOAL_SUBTITLES[resolveCatalogLocale(locale)][goalId] ?? GOAL_SUBTITLES.fr[goalId] ?? "";
}

export function wizardTimelineSubtitle(locale: Locale, timelineLabel: string): string {
  return (
    TIMELINE_SUBTITLES[resolveCatalogLocale(locale)][timelineLabel] ??
    TIMELINE_SUBTITLES.fr[timelineLabel] ??
    ""
  );
}
