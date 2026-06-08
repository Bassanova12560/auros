import type { Locale } from "@/lib/i18n";
import type { KycLevel } from "./types";

export type JurisdictionMessages = {
  languageAria: string;
  tool: string;
  nav: {
    dossierCta: string;
    dossierShort: string;
    compareInvest: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryPath: string;
    ctaPrimary: string;
    ctaExplore: string;
    metrics: readonly { value: string; label: string }[];
    social: {
      quote: string;
      name: string;
      role: string;
      project: string;
      initials: string;
    };
    preview: {
      label: string;
      compareLabel: string;
      jurisdictionA: string;
      jurisdictionB: string;
      stateFees: string;
      advisoryFees: string;
      licenseDelay: string;
      taxNote: string;
    };
  };
  trust: {
    badges: readonly string[];
  };
  path: {
    eyebrow: string;
    title: string;
    steps: readonly { title: string; description: string }[];
  };
  comparatorSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  filters: {
    quickLabel: string;
    quickAll: string;
    quickCost: string;
    quickDelay: string;
    advancedLabel: string;
    assetLabel: string;
    assetAll: string;
    assetRealEstate: string;
    assetBonds: string;
    assetPrivateCredit: string;
    assetFunds: string;
    budgetLabel: string;
    budgetAll: string;
    budgetUnder15k: string;
    budgetMid15_40: string;
    budgetOver40: string;
    delayLabel: string;
    delayAll: string;
    delayUnder3: string;
    delayMid3_6: string;
    delayOver6: string;
  };
  table: {
    jurisdiction: string;
    fees: string;
    feeState: string;
    feeAdvisory: string;
    delay: string;
    delayLicense: string;
    delayProduction: string;
    taxInvestor: string;
    stability: string;
    language: string;
    actions: string;
    actionCompare: string;
    actionQuote: string;
    taxAlertPrefix: string;
    recommended: string;
    bestValue: string;
    noResults: string;
    count: (n: number) => string;
    disclaimer: string;
  };
  stabilityLabels: {
    high: string;
    medium: string;
    risky: string;
  };
  kyc: Record<KycLevel, string>;
  names: Record<string, string>;
  fees: Record<string, string>;
  delays: Record<string, string>;
  licenses: Record<string, string>;
  assets: Record<string, string>;
  tax: Record<string, string>;
  minInvestors: Record<string, string>;
  audience: Record<string, string>;
  guide: {
    eyebrow: string;
    title: string;
    subtitle: string;
    timeEstimate: string;
    bullets: string[];
    footnote: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    featuredLabel: string;
    starterNote: string;
    reassurance: readonly string[];
    tiers: {
      id: string;
      name: string;
      price: string;
      description: string;
      deliverables?: string[];
    }[];
    cta: string;
    ctaLegal: string;
    ctaStarter: string;
    ctaStarterStart: string;
    ctaStarterDetail: string;
    ctaLaunch: string;
    pricingOverviewLink: string;
  };
  forms: {
    firstName: string;
    name: string;
    email: string;
    projectType: string;
    jurisdictions: string;
    jurisdiction: string;
    projectValue: string;
    messageOptional: string;
    select: string;
    submitGuide: string;
    submitCompare: string;
    compareA: string;
    compareB: string;
    submitQuote: string;
    submitting: string;
    successGuide: string;
    successQuote: string;
    aiBriefTitle: string;
    aiBriefEmailNote: string;
    errorInvalid: string;
    errorRateLimit: string;
    errorGeneric: string;
    projectTypes: Record<string, string>;
    projectValues: Record<string, string>;
    jurisdictionUnsure: string;
    checkoutStarter: string;
    checkoutLaunch: string;
    checkoutLoading: string;
    checkoutUnavailable: string;
    alreadyPaid: string;
    payNow: string;
    paymentSuccessTitle: string;
    paymentSuccessBody: string;
    dismiss: string;
    hotLeadLabel: string;
    aiQuoteTitle: string;
  };
  footer: {
    disclaimer: string;
    legal: string;
    privacy: string;
    contact: string;
  };
};

const FR: JurisdictionMessages = {
  languageAria: "Langue",
  tool: "juridictions",
  nav: {
    dossierCta: "Préparer mon dossier avec Auros",
    dossierShort: "Mon dossier",
    compareInvest: "Comparer les rendements",
  },
  hero: {
    eyebrow: "Comparateur B2B · Tokenisation RWA",
    title: "Où structurer votre émission RWA ?",
    subtitle:
      "Immobilier, obligations, fonds, crédit — comparez DIFC, Luxembourg, Bahreïn : SPV, régulateur et fiscalité investisseur avant le cabinet. Étude gratuite, memo phase 0 si validation.",
    primaryPath: "~3 min · comparateur gratuit · memo 5 000 € si validation",
    ctaPrimary: "Obtenir mon étude comparative",
    ctaExplore: "Explorer le comparateur",
    metrics: [
      { value: "8", label: "juridictions comparées" },
      { value: "150+", label: "projets accompagnés" },
      { value: "48 h", label: "réponse devis" },
    ],
    social: {
      quote:
        "Comparateur clair — DIFC vs Luxembourg tranché en une matinée, memo phase 0 le soir pour brief notre avocat.",
      name: "Sophie Laurent",
      role: "Directrice financière · foncière",
      project: "Actif tokenisé · 4 M€ · UE",
      initials: "SL",
    },
    preview: {
      label: "Étude comparative",
      compareLabel: "DIFC vs Singapour",
      jurisdictionA: "Dubai DIFC",
      jurisdictionB: "Singapour",
      stateFees: "État 3–8 k€",
      advisoryFees: "Conseil 5–22 k€",
      licenseDelay: "Licence 2–3 mois",
      taxNote: "0 % PV investisseur",
    },
  },
  trust: {
    badges: [
      "Cadres MiCA · CSSF · VARA · MAS",
      "Revue humaine avant livraison",
      "RGPD · hébergement UE",
      "150+ projets RWA accompagnés",
    ],
  },
  path: {
    eyebrow: "Parcours recommandé",
    title: "Quatre étapes, une seule décision à la fois",
    steps: [
      {
        title: "Explorer",
        description: "Comparez les 8 juridictions — filtres rapides, données indicatives.",
      },
      {
        title: "Étude",
        description: "Brief IA personnalisé sur deux juridictions — gratuit, par email.",
      },
      {
        title: "Échange",
        description: "Call 30 min avec AUROS — validation de votre profil projet.",
      },
      {
        title: "Starter Kit",
        description:
          "Memo juridiction + SPV + régulateur — 5 000 €, livraison immédiate (~19 000 € equiv. cabinet).",
      },
    ],
  },
  comparatorSection: {
    eyebrow: "Comparateur",
    title: "8 juridictions, un coup d'œil",
    subtitle:
      "Données compilées par AUROS — indicatives. Votre avocat valide avant toute décision.",
  },
  filters: {
    quickLabel: "Filtres rapides",
    quickAll: "Toutes",
    quickCost: "Meilleur coût global",
    quickDelay: "Délai < 6 mois",
    advancedLabel: "Affiner par actif et budget",
    assetLabel: "Type d'actif",
    assetAll: "Tous",
    assetRealEstate: "Immobilier",
    assetBonds: "Obligations",
    assetPrivateCredit: "Crédit privé",
    assetFunds: "Fonds",
    budgetLabel: "Budget setup",
    budgetAll: "Tous",
    budgetUnder15k: "< 15 k€",
    budgetMid15_40: "15–40 k€",
    budgetOver40: "> 40 k€",
    delayLabel: "Délai",
    delayAll: "Tous",
    delayUnder3: "< 3 mois",
    delayMid3_6: "3–6 mois",
    delayOver6: "> 6 mois",
  },
  table: {
    jurisdiction: "Juridiction",
    fees: "Frais d'émission",
    feeState: "État",
    feeAdvisory: "Conseil",
    delay: "Délai",
    delayLicense: "Licence",
    delayProduction: "Production",
    taxInvestor: "Fiscalité investisseur",
    stability: "Stabilité rég.",
    language: "Langue",
    actions: "Action",
    actionCompare: "Comparer",
    actionQuote: "Devis",
    taxAlertPrefix: "Alerte",
    recommended: "Recommandé",
    bestValue: "Meilleur coût/délai",
    noResults: "Aucune juridiction ne correspond à ces filtres.",
    count: (n) => `${n} juridiction${n > 1 ? "s" : ""}`,
    disclaimer:
      "Données indicatives compilées à titre informatif. Consultez un avocat spécialisé avant toute décision.",
  },
  stabilityLabels: {
    high: "Haute",
    medium: "Moyenne",
    risky: "Risquée",
  },
  kyc: { strong: "Fort", medium: "Moyen", light: "Léger" },
  names: {
    luxembourg: "Luxembourg",
    "dubai-difc": "Dubai DIFC",
    singapore: "Singapour",
    switzerland: "Suisse",
    france: "France",
    ireland: "Irlande",
    bahrain: "Bahreïn",
    gibraltar: "Gibraltar",
  },
  fees: {
    luxembourg: "15–50 k€",
    "dubai-difc": "8–30 k€",
    singapore: "20–60 k€",
    switzerland: "10–40 k€",
    france: "5–20 k€",
    ireland: "10–35 k€",
    bahrain: "5–15 k€",
    gibraltar: "5–20 k€",
  },
  delays: {
    luxembourg: "6–12 mois",
    "dubai-difc": "2–4 mois",
    singapore: "3–6 mois",
    switzerland: "3–6 mois",
    france: "4–8 mois",
    ireland: "4–8 mois",
    bahrain: "2–3 mois",
    gibraltar: "2–4 mois",
  },
  licenses: {
    cssfRaif: "CSSF / RAIF",
    varaFsra: "VARA / FSRA",
    masCms: "MAS / CMS",
    finmaDlt: "FINMA / DLT Act",
    amfPsan: "AMF / PSAN",
    cbiMica: "CBI / MiCA",
    cbb: "CBB",
    gfscDlt: "GFSC / DLT",
  },
  assets: {
    immoFundsBonds: "Immo, fonds, oblig.",
    allAssets: "Tous actifs",
    immoAsiaReit: "Immo Asie, REIT",
    financialSecurities: "Titres financiers",
    fundsBonds: "Fonds, obligations",
    immoSukuk: "Immo, sukuk",
    tokensSecurity: "Tokens, security",
  },
  tax: {
    zeroPvHolding: "0 % PV (holding)",
    zeroIsPv: "0 % IS + 0 % PV",
    zeroPvIs17: "0 % PV, 17 % IS",
    cantonVariable: "Variable / canton",
    flatTax30: "30 % flat tax",
    is125: "12,5 % IS",
    zeroIs: "0 % IS",
    is10: "10 % IS",
  },
  minInvestors: {
    none: "Aucun",
    retailPossible: "Retail possible",
  },
  audience: {
    institutionalEu: "Institutionnels EU",
    globalHnwi: "Global, HNWI",
    asiaPacific: "Asie-Pacifique",
    euGlobal: "EU + Global",
    frEu: "FR / EU",
    euPassport: "Passeport EU",
    mena: "MENA",
    cryptoNative: "Crypto-natif",
  },
  guide: {
    eyebrow: "Étape 2 · Gratuit",
    title: "Votre étude comparative sur mesure",
    subtitle:
      "Deux juridictions, votre contexte projet — brief structuré par IA, relu par AUROS, envoyé par email.",
    timeEstimate: "Envoi en moins de 5 minutes",
    bullets: [
      "Comparatif frais État / conseil et délais licence / production",
      "Fiscalité investisseur et alertes structure",
      "Stabilité réglementaire et langue requise",
    ],
    footnote: "Aucune carte bancaire. Vous décidez ensuite si le Starter Kit a du sens.",
  },
  pricing: {
    eyebrow: "Étape 4 · Après validation",
    title: "Quand vous êtes prêt à structurer",
    subtitle:
      "Le Starter Kit remplace ~19 000 € de travail cabinet en phase 0 — forfait 5 000 € après validation de votre dossier.",
    featuredLabel: "Recommandé après l'étude",
    starterNote:
      "Paiement en ligne après validation AUROS — Starter Kit généré automatiquement (portail + PDF). Call 30 min inclus avant engagement.",
    reassurance: [
      "Call découverte 30 min inclus",
      "Revue humaine avant tout paiement",
      "Données chiffrées · conformité RGPD",
    ],
    tiers: [
      {
        id: "legal",
        name: "Analyse juridique",
        price: "Gratuit",
        description: "Mise en relation avec un cabinet partenaire spécialisé RWA.",
        deliverables: ["Appel découverte 30 min", "Orientation juridiction", "Sans engagement"],
      },
      {
        id: "starter",
        name: "Starter Kit",
        price: "5 000 €",
        description: "Structure juridique + prestataire tech — livraison portail et PDF immédiate.",
        deliverables: [
          "Portail Starter Kit + PDF (livraison immédiate)",
          "Analyse d'encadrement réglementaire (IA + revue AUROS)",
          "Structure holding / SPV recommandée",
          "Checklist réglementaire et calendrier indicatif",
          "Shortlist prestataires tech RWA vetted",
          "Dossier AUROS pré-rempli (/wizard)",
        ],
      },
      {
        id: "launch",
        name: "Accompagnement Launch",
        price: "Sur devis",
        description: "Suivi complet jusqu'à l'émission du token.",
        deliverables: [
          "Pilotage juridique + tech",
          "Coordination émission token",
          "Support investisseurs qualifiés",
        ],
      },
    ],
    cta: "Demander un devis gratuit",
    ctaLegal: "Demander l'analyse gratuite",
    ctaStarter: "Régler le Starter Kit",
    ctaStarterStart: "Commencer par l'étude gratuite",
    ctaStarterDetail: "Voir le détail Starter Kit →",
    ctaLaunch: "Demander un devis Launch",
    pricingOverviewLink: "Voir tous les tarifs →",
  },
  forms: {
    firstName: "Prénom",
    name: "Nom complet",
    email: "Email professionnel",
    projectType: "Type de projet",
    jurisdictions: "Juridictions à comparer",
    jurisdiction: "Juridiction cible",
    projectValue: "Valeur du projet",
    messageOptional: "Message (optionnel)",
    select: "Choisir…",
    submitGuide: "Recevoir le guide maintenant",
    submitCompare: "Télécharger l'étude comparative",
    compareA: "Juridiction A",
    compareB: "Juridiction B",
    submitQuote: "Demander un devis gratuit",
    submitting: "Envoi en cours…",
    successGuide: "Votre brief personnalisé est prêt.",
    successQuote: "Demande reçue — réponse sous 48 h.",
    aiBriefTitle: "Votre brief juridictions (IA)",
    aiBriefEmailNote: "Une copie vous a aussi été envoyée par email.",
    errorInvalid: "Vérifiez les champs obligatoires.",
    errorRateLimit: "Trop de tentatives — réessayez plus tard.",
    errorGeneric: "Erreur d'envoi — réessayez.",
    projectTypes: {
      real_estate: "Immobilier",
      bonds: "Obligations",
      private_credit: "Crédit privé",
      funds: "Fonds",
      other: "Autre",
    },
    projectValues: {
      under1m: "< 1 M€",
      "1to5m": "1–5 M€",
      "5to20m": "5–20 M€",
      over20m: "> 20 M€",
    },
    jurisdictionUnsure: "Je ne sais pas encore",
    checkoutStarter: "Régler le Starter Kit — 5 000 €",
    checkoutLaunch: "Demander l'accompagnement Launch",
    checkoutLoading: "Redirection vers le paiement…",
    checkoutUnavailable: "Paiement en ligne bientôt disponible — répondez à l'email reçu.",
    alreadyPaid: "Paiement déjà enregistré pour ce dossier.",
    payNow: "Payer maintenant",
    paymentSuccessTitle: "Paiement confirmé",
    paymentSuccessBody: "Votre Starter Kit est en cours de génération — vous serez redirigé vers votre portail.",
    dismiss: "Fermer",
    hotLeadLabel: "Projet prioritaire",
    aiQuoteTitle: "Votre proposition (IA)",
  },
  footer: {
    disclaimer:
      "Ce comparateur est fourni à titre informatif. Consultez un avocat spécialisé avant toute décision.",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    contact: "Contact",
  },
};

const EN: JurisdictionMessages = {
  ...FR,
  tool: "jurisdictions",
  nav: {
    dossierCta: "Prepare my dossier with Auros",
    dossierShort: "My dossier",
    compareInvest: "Compare yields",
  },
  hero: {
    eyebrow: "B2B comparator · RWA tokenization",
    title: "Where to structure your RWA issuance?",
    subtitle:
      "Real estate, bonds, funds, private credit — compare DIFC, Luxembourg, Bahrain: SPV, regulator and investor tax before counsel. Free study, phase 0 memo if validated.",
    primaryPath: "~3 min · free comparator · €5,000 memo if validated",
    ctaPrimary: "Get my comparative study",
    ctaExplore: "Explore the comparator",
    metrics: [
      { value: "8", label: "jurisdictions compared" },
      { value: "150+", label: "projects supported" },
      { value: "48 h", label: "quote response" },
    ],
    social: {
      quote:
        "Clear comparator — DIFC vs Luxembourg decided in one morning, phase 0 memo same evening to brief our lawyer.",
      name: "Sophie Laurent",
      role: "CFO · real estate fund",
      project: "Tokenized asset · €4M · EU",
      initials: "SL",
    },
    preview: {
      label: "Comparative study",
      compareLabel: "DIFC vs Singapore",
      jurisdictionA: "Dubai DIFC",
      jurisdictionB: "Singapore",
      stateFees: "State €3–8k",
      advisoryFees: "Advisory €5–22k",
      licenseDelay: "Licence 2–3 months",
      taxNote: "0% investor CG",
    },
  },
  trust: {
    badges: [
      "MiCA · CSSF · VARA · MAS frameworks",
      "GDPR",
      "Human review before delivery",
      "150+ RWA projects supported",
    ],
  },
  path: {
    eyebrow: "Recommended path",
    title: "Four steps, one decision at a time",
    steps: [
      {
        title: "Explore",
        description: "Compare 8 jurisdictions — quick filters, indicative data.",
      },
      {
        title: "Study",
        description: "Personalized AI brief on two jurisdictions — free, by email.",
      },
      {
        title: "Call",
        description: "30-min call with AUROS — validate your project profile.",
      },
      {
        title: "Starter Kit",
        description: "Structure + tech intro — €5,000 after dossier validation.",
      },
    ],
  },
  comparatorSection: {
    eyebrow: "Comparator",
    title: "8 jurisdictions at a glance",
    subtitle:
      "Data compiled by AUROS — indicative. Your counsel validates before any decision.",
  },
  filters: {
    quickLabel: "Quick filters",
    quickAll: "All",
    quickCost: "Best total cost",
    quickDelay: "Timeline < 6 months",
    advancedLabel: "Refine by asset and budget",
    assetLabel: "Asset type",
    assetAll: "All",
    assetRealEstate: "Real estate",
    assetBonds: "Bonds",
    assetPrivateCredit: "Private credit",
    assetFunds: "Funds",
    budgetLabel: "Setup budget",
    budgetAll: "All",
    budgetUnder15k: "< €15k",
    budgetMid15_40: "€15–40k",
    budgetOver40: "> €40k",
    delayLabel: "Timeline",
    delayAll: "All",
    delayUnder3: "< 3 months",
    delayMid3_6: "3–6 months",
    delayOver6: "> 6 months",
  },
  table: {
    jurisdiction: "Jurisdiction",
    fees: "Issuance fees",
    feeState: "State",
    feeAdvisory: "Advisory",
    delay: "Timeline",
    delayLicense: "Licence",
    delayProduction: "Production",
    taxInvestor: "Investor tax",
    stability: "Reg. stability",
    language: "Language",
    actions: "Action",
    actionCompare: "Compare",
    actionQuote: "Quote",
    taxAlertPrefix: "Alert",
    recommended: "Recommended",
    bestValue: "Best cost/timeline",
    noResults: "No jurisdictions match these filters.",
    count: (n) => `${n} jurisdiction${n === 1 ? "" : "s"}`,
    disclaimer:
      "Indicative data for information only. Consult a specialized lawyer before any decision.",
  },
  stabilityLabels: {
    high: "High",
    medium: "Medium",
    risky: "Risky",
  },
  kyc: { strong: "Strong", medium: "Medium", light: "Light" },
  names: {
    luxembourg: "Luxembourg",
    "dubai-difc": "Dubai DIFC",
    singapore: "Singapore",
    switzerland: "Switzerland",
    france: "France",
    ireland: "Ireland",
    bahrain: "Bahrain",
    gibraltar: "Gibraltar",
  },
  fees: {
    luxembourg: "€15–50k",
    "dubai-difc": "€8–30k",
    singapore: "€20–60k",
    switzerland: "€10–40k",
    france: "€5–20k",
    ireland: "€10–35k",
    bahrain: "€5–15k",
    gibraltar: "€5–20k",
  },
  delays: {
    luxembourg: "6–12 months",
    "dubai-difc": "2–4 months",
    singapore: "3–6 months",
    switzerland: "3–6 months",
    france: "4–8 months",
    ireland: "4–8 months",
    bahrain: "2–3 months",
    gibraltar: "2–4 months",
  },
  licenses: FR.licenses,
  assets: {
    immoFundsBonds: "RE, funds, bonds",
    allAssets: "All assets",
    immoAsiaReit: "Asia RE, REIT",
    financialSecurities: "Financial securities",
    fundsBonds: "Funds, bonds",
    immoSukuk: "RE, sukuk",
    tokensSecurity: "Tokens, security",
  },
  tax: {
    zeroPvHolding: "0% CG (holding)",
    zeroIsPv: "0% CIT + 0% CG",
    zeroPvIs17: "0% CG, 17% CIT",
    cantonVariable: "Varies by canton",
    flatTax30: "30% flat tax",
    is125: "12.5% CIT",
    zeroIs: "0% CIT",
    is10: "10% CIT",
  },
  minInvestors: { none: "None", retailPossible: "Retail possible" },
  audience: {
    institutionalEu: "EU institutional",
    globalHnwi: "Global, HNWI",
    asiaPacific: "Asia-Pacific",
    euGlobal: "EU + Global",
    frEu: "FR / EU",
    euPassport: "EU passport",
    mena: "MENA",
    cryptoNative: "Crypto-native",
  },
  guide: {
    eyebrow: "Step 2 · Free",
    title: "Your tailored comparative study",
    subtitle:
      "Two jurisdictions, your project context — structured AI brief, reviewed by AUROS, sent by email.",
    timeEstimate: "Delivered in under 5 minutes",
    bullets: [
      "State vs advisory fees and licence vs production timelines",
      "Investor tax and structural alerts",
      "Regulatory stability and required language",
    ],
    footnote: "No credit card. You decide later if the Starter Kit makes sense.",
  },
  pricing: {
    eyebrow: "Step 4 · After validation",
    title: "When you are ready to structure",
    subtitle:
      "The Starter Kit comes after your study and an AUROS call — no impulse payment.",
    featuredLabel: "Recommended after the study",
    starterNote:
      "Online payment only after AUROS validates your dossier. 30-min call included before commitment.",
    reassurance: [
      "30-min discovery call included",
      "Human review before any payment",
      "Encrypted data · GDPR compliant",
    ],
    tiers: [
      {
        id: "legal",
        name: "Legal analysis",
        price: "Free",
        description: "Introduction to a specialized RWA law firm partner.",
        deliverables: ["30-min discovery call", "Jurisdiction orientation", "No commitment"],
      },
      {
        id: "starter",
        name: "Starter Kit",
        price: "€5,000",
        description: "Legal structure + tech — instant portal and PDF delivery.",
        deliverables: [
          "Starter Kit portal + PDF (instant delivery)",
          "Regulatory framing analysis (AI + AUROS review)",
          "Recommended holding / SPV structure",
          "Regulatory checklist and indicative timeline",
          "Vetted RWA tech provider shortlist",
          "Pre-filled AUROS dossier (/wizard)",
        ],
      },
      {
        id: "launch",
        name: "Launch support",
        price: "Custom quote",
        description: "Full support through token issuance.",
        deliverables: [
          "Legal + tech project management",
          "Token issuance coordination",
          "Qualified investor support",
        ],
      },
    ],
    cta: "Request a free quote",
    ctaLegal: "Request free analysis",
    ctaStarter: "Pay Starter Kit",
    ctaStarterStart: "Start with the free study",
    ctaStarterDetail: "Starter Kit details →",
    ctaLaunch: "Request Launch quote",
    pricingOverviewLink: "View all pricing →",
  },
  forms: {
    firstName: "First name",
    name: "Full name",
    email: "Work email",
    projectType: "Project type",
    jurisdictions: "Jurisdictions to compare",
    jurisdiction: "Target jurisdiction",
    projectValue: "Project value",
    messageOptional: "Message (optional)",
    select: "Select…",
    submitGuide: "Get the guide now",
    submitCompare: "Download comparative study",
    compareA: "Jurisdiction A",
    compareB: "Jurisdiction B",
    submitQuote: "Request a free quote",
    submitting: "Sending…",
    successGuide: "Your personalized brief is ready.",
    successQuote: "Request received — response within 48 hours.",
    aiBriefTitle: "Your jurisdiction brief (AI)",
    aiBriefEmailNote: "A copy was also sent to your email.",
    errorInvalid: "Please check required fields.",
    errorRateLimit: "Too many attempts — try again later.",
    errorGeneric: "Submission failed — please retry.",
    projectTypes: {
      real_estate: "Real estate",
      bonds: "Bonds",
      private_credit: "Private credit",
      funds: "Funds",
      other: "Other",
    },
    projectValues: {
      under1m: "< €1M",
      "1to5m": "€1–5M",
      "5to20m": "€5–20M",
      over20m: "> €20M",
    },
    jurisdictionUnsure: "Not sure yet",
    checkoutStarter: "Pay Starter Kit — €5,000",
    checkoutLaunch: "Request Launch support",
    checkoutLoading: "Redirecting to checkout…",
    checkoutUnavailable: "Online payment coming soon — reply to your email.",
    alreadyPaid: "Payment already recorded for this lead.",
    payNow: "Pay now",
    paymentSuccessTitle: "Payment confirmed",
    paymentSuccessBody: "Your Starter Kit is being generated — redirecting to your portal.",
    dismiss: "Dismiss",
    hotLeadLabel: "Priority project",
    aiQuoteTitle: "Your proposal (AI)",
  },
  footer: {
    disclaimer:
      "This comparator is provided for information only. Consult a specialized lawyer before any decision.",
    legal: "Legal notice",
    privacy: "Privacy",
    contact: "Contact",
  },
};

const ES: JurisdictionMessages = {
  ...EN,
  tool: "jurisdicciones",
  nav: {
    dossierCta: "Preparar mi expediente con Auros",
    dossierShort: "Mi expediente",
    compareInvest: "Comparar rendimientos",
  },
  hero: {
    eyebrow: "Comparador B2B · Tokenización",
    title: "¿Dónde tokenizar su activo?",
    subtitle:
      "Costes Estado vs asesoría, plazos licencia vs producción, fiscalidad inversor — datos orientativos antes del abogado.",
    primaryPath: "~3 min · estudio gratuito · sin compromiso",
    ctaPrimary: "Obtener mi estudio comparativo",
    ctaExplore: "Explorar el comparador",
    metrics: [
      { value: "8", label: "jurisdicciones comparadas" },
      { value: "150+", label: "proyectos acompañados" },
      { value: "48 h", label: "respuesta presupuesto" },
    ],
    social: {
      quote:
        "Comparador claro — elegimos DIFC vs Baréin en una mañana y validamos el Starter Kit tras la llamada AUROS.",
      name: "Karim El-Mansouri",
      role: "Director financiero",
      project: "Inmobiliaria tokenizada · 6,8 M€ · MENA",
      initials: "KE",
    },
    preview: {
      label: "Estudio comparativo",
      compareLabel: "DIFC vs Singapur",
      jurisdictionA: "Dubai DIFC",
      jurisdictionB: "Singapur",
      stateFees: "Estado 3–8 k€",
      advisoryFees: "Asesoría 5–22 k€",
      licenseDelay: "Licencia 2–3 meses",
      taxNote: "0 % PV inversor",
    },
  },
  trust: {
    badges: [
      "Marco MiCA",
      "RGPD",
      "Datos cifrados",
      "Revisión humana antes del compromiso",
    ],
  },
  path: {
    eyebrow: "Recorrido recomendado",
    title: "Cuatro pasos, una decisión cada vez",
    steps: [
      {
        title: "Explorar",
        description: "Compare 8 jurisdicciones — filtros rápidos, datos orientativos.",
      },
      {
        title: "Estudio",
        description: "Brief IA personalizado sobre dos jurisdicciones — gratis, por email.",
      },
      {
        title: "Intercambio",
        description: "Llamada 30 min con AUROS — validación de su perfil de proyecto.",
      },
      {
        title: "Starter Kit",
        description: "Estructura + intro tech — 5 000 € tras validación del expediente.",
      },
    ],
  },
  comparatorSection: {
    eyebrow: "Comparador",
    title: "8 jurisdicciones de un vistazo",
    subtitle:
      "Datos compilados por AUROS — orientativos. Su abogado valida antes de decidir.",
  },
  filters: {
    quickLabel: "Filtros rápidos",
    quickAll: "Todas",
    quickCost: "Mejor coste global",
    quickDelay: "Plazo < 6 meses",
    advancedLabel: "Afinar por activo y presupuesto",
    assetLabel: "Tipo de activo",
    assetAll: "Todos",
    assetRealEstate: "Inmobiliario",
    assetBonds: "Bonos",
    assetPrivateCredit: "Crédito privado",
    assetFunds: "Fondos",
    budgetLabel: "Presupuesto setup",
    budgetAll: "Todos",
    budgetUnder15k: "< 15 k€",
    budgetMid15_40: "15–40 k€",
    budgetOver40: "> 40 k€",
    delayLabel: "Plazo",
    delayAll: "Todos",
    delayUnder3: "< 3 meses",
    delayMid3_6: "3–6 meses",
    delayOver6: "> 6 meses",
  },
  table: {
    jurisdiction: "Jurisdicción",
    fees: "Costes emisión",
    feeState: "Estado",
    feeAdvisory: "Asesoría",
    delay: "Plazo",
    delayLicense: "Licencia",
    delayProduction: "Producción",
    taxInvestor: "Fiscalidad inversor",
    stability: "Estab. reg.",
    language: "Idioma",
    actions: "Acción",
    actionCompare: "Comparar",
    actionQuote: "Presupuesto",
    taxAlertPrefix: "Alerta",
    recommended: "Recomendado",
    bestValue: "Mejor coste/plazo",
    noResults: "Ninguna jurisdicción coincide con estos filtros.",
    count: (n) => `${n} jurisdicción${n === 1 ? "" : "es"}`,
    disclaimer:
      "Datos indicativos con fines informativos. Consulte a un abogado especializado antes de decidir.",
  },
  stabilityLabels: {
    high: "Alta",
    medium: "Media",
    risky: "Riesgosa",
  },
  kyc: { strong: "Alto", medium: "Medio", light: "Ligero" },
  names: {
    luxembourg: "Luxemburgo",
    "dubai-difc": "Dubai DIFC",
    singapore: "Singapur",
    switzerland: "Suiza",
    france: "Francia",
    ireland: "Irlanda",
    bahrain: "Baréin",
    gibraltar: "Gibraltar",
  },
  guide: {
    eyebrow: "Paso 2 · Gratis",
    title: "Su estudio comparativo a medida",
    subtitle:
      "Dos jurisdicciones, su contexto de proyecto — brief IA estructurado, revisado por AUROS, enviado por email.",
    timeEstimate: "Envío en menos de 5 minutos",
    bullets: [
      "Comparativa costes Estado / asesoría y plazos licencia / producción",
      "Fiscalidad inversor y alertas de estructura",
      "Estabilidad regulatoria e idioma requerido",
    ],
    footnote: "Sin tarjeta bancaria. Usted decide después si el Starter Kit tiene sentido.",
  },
  pricing: {
    eyebrow: "Paso 4 · Tras validación",
    title: "Cuando esté listo para estructurar",
    subtitle:
      "El Starter Kit llega tras su estudio y una llamada AUROS — sin pago impulsivo.",
    featuredLabel: "Recomendado tras el estudio",
    starterNote:
      "Pago en línea solo tras validación de su expediente por AUROS. Llamada 30 min incluida antes del compromiso.",
    reassurance: [
      "Llamada descubrimiento 30 min incluida",
      "Revisión humana antes de cualquier pago",
      "Datos cifrados · conformidad RGPD",
    ],
    tiers: [
      {
        id: "legal",
        name: "Análisis jurídico",
        price: "Gratis",
        description: "Puesta en contacto con bufete partner especializado RWA.",
        deliverables: ["Llamada descubrimiento 30 min", "Orientación jurisdicción", "Sin compromiso"],
      },
      {
        id: "starter",
        name: "Starter Kit",
        price: "5 000 €",
        description: "Estructura jurídica + tech — portal y PDF al instante.",
        deliverables: [
          "Portal Starter Kit + PDF (entrega inmediata)",
          "Análisis marco regulatorio (IA + revisión AUROS)",
          "Estructura holding / SPV recomendada",
          "Checklist regulatorio y cronograma indicativo",
          "Shortlist proveedores tech RWA verificados",
          "Expediente AUROS pre-rellenado (/wizard)",
        ],
      },
      {
        id: "launch",
        name: "Acompañamiento Launch",
        price: "A medida",
        description: "Seguimiento completo hasta la emisión del token.",
        deliverables: [
          "Pilotaje jurídico + tech",
          "Coordinación emisión token",
          "Soporte inversores cualificados",
        ],
      },
    ],
    cta: "Solicitar presupuesto gratuito",
    ctaLegal: "Solicitar análisis gratuito",
    ctaStarter: "Pagar Starter Kit",
    ctaStarterStart: "Empezar por el estudio gratuito",
    ctaStarterDetail: "Detalle Starter Kit →",
    ctaLaunch: "Solicitar presupuesto Launch",
    pricingOverviewLink: "Ver todos los precios →",
  },
  forms: {
    firstName: "Nombre",
    name: "Nombre completo",
    email: "Email profesional",
    projectType: "Tipo de proyecto",
    jurisdictions: "Jurisdicciones a comparar",
    jurisdiction: "Jurisdicción objetivo",
    projectValue: "Valor del proyecto",
    messageOptional: "Mensaje (opcional)",
    select: "Elegir…",
    submitGuide: "Recibir la guía ahora",
    submitCompare: "Descargar estudio comparativo",
    compareA: "Jurisdicción A",
    compareB: "Jurisdicción B",
    submitQuote: "Solicitar presupuesto gratuito",
    submitting: "Enviando…",
    successGuide: "Su briefing personalizado está listo.",
    successQuote: "Solicitud recibida — respuesta en 48 h.",
    aiBriefTitle: "Su briefing jurisdiccional (IA)",
    aiBriefEmailNote: "También le enviamos una copia por email.",
    errorInvalid: "Revise los campos obligatorios.",
    errorRateLimit: "Demasiados intentos — inténtelo más tarde.",
    errorGeneric: "Error de envío — reintente.",
    projectTypes: {
      real_estate: "Inmobiliario",
      bonds: "Bonos",
      private_credit: "Crédito privado",
      funds: "Fondos",
      other: "Otro",
    },
    projectValues: {
      under1m: "< 1 M€",
      "1to5m": "1–5 M€",
      "5to20m": "5–20 M€",
      over20m: "> 20 M€",
    },
    jurisdictionUnsure: "Aún no lo sé",
    checkoutStarter: "Pagar Starter Kit — 5 000 €",
    checkoutLaunch: "Solicitar acompañamiento Launch",
    checkoutLoading: "Redirigiendo al pago…",
    checkoutUnavailable: "Pago en línea próximamente — responda al email recibido.",
    alreadyPaid: "Pago ya registrado para este expediente.",
    payNow: "Pagar ahora",
    paymentSuccessTitle: "Pago confirmado",
    paymentSuccessBody: "Su Starter Kit se está generando — redirección al portal.",
    dismiss: "Cerrar",
    hotLeadLabel: "Proyecto prioritario",
    aiQuoteTitle: "Su propuesta (IA)",
  },
  footer: {
    disclaimer:
      "Este comparador se proporciona con fines informativos. Consulte a un abogado especializado antes de decidir.",
    legal: "Aviso legal",
    privacy: "Privacidad",
    contact: "Contacto",
  },
};

const CATALOG: Record<Locale, JurisdictionMessages> = { fr: FR, en: EN, es: ES };

export function getJurisdictionMessages(locale: Locale): JurisdictionMessages {
  return CATALOG[locale] ?? FR;
}

export function jurisdictionLabel(
  messages: JurisdictionMessages,
  id: string
): string {
  return messages.names[id] ?? id;
}
