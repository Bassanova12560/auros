export const LOCALES = ["fr", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_STORAGE_KEY = "auros_locale";

export type Messages = {
  nav: {
    score: string;
    tokenize: string;
    dossiers: string;
    jurisdictions: string;
    partners: string;
    login: string;
    start: string;
    menu: string;
  };
  breadcrumb: {
    ariaLabel: string;
    green: string;
    compare: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaEstimate: string;
    metricAssets: string;
    metricJurisdictions: string;
    metricDossier: string;
  };
  platforms: {
    caption: string;
  };
  score: {
    eyebrow: string;
    title: string;
    subtitle: string;
    placeholder: string;
    submit: string;
    emailPlaceholder: string;
    saveEmail: string;
    emailSaved: string;
    linkCopied: string;
    linkFailed: string;
    share: string;
    reset: string;
    calculate: string;
    shareBtn: string;
    fullDossier: string;
    otherAsset: string;
    disclaimer: string;
    indicativeNote: string;
    emptyQuery: string;
    tierHigh: string;
    tierMid: string;
    tierLow: string;
    quickExamplesLabel: string;
    quickExamples: readonly [string, string, string];
    inputHint: string;
    exampleCard: {
      title: string;
      readiness: string;
      maturity: string;
      badgeLegal: string;
      badgeKyc: string;
      badgeMica: string;
      badgeDataRoom: string;
      disclaimer: string;
    };
  };
  regulatory: {
    eyebrow: string;
    title: string;
    subtitle: string;
    kyc: string;
    kycDesc: string;
    jurisdictions: string;
    jurisdictionsDesc: string;
    indicative: string;
    indicativeDesc: string;
    partners: string;
    partnersDesc: string;
    disclaimer: string;
  };
  socialProof: {
    eyebrow: string;
    title: string;
    statDossiers: string;
    statDossiersLabel: string;
    statJurisdictions: string;
    statJurisdictionsLabel: string;
    statTime: string;
    statTimeLabel: string;
    statPlatforms: string;
    statPlatformsLabel: string;
    t1quote: string;
    t1name: string;
    t1role: string;
    t2quote: string;
    t2name: string;
    t2role: string;
    t3quote: string;
    t3name: string;
    t3role: string;
  };
  dossierPreview: {
    eyebrow: string;
    title: string;
    subtitle: string;
    disclaimer: string;
    ctaWizard: string;
    ctaDemo: string;
    blocks: readonly {
      tag: string;
      title: string;
      description: string;
    }[];
  };
  quickScore: {
    title: string;
    close: string;
    stepAsset: string;
    stepValue: string;
    stepCountry: string;
    next: string;
    back: string;
    seeScore: string;
    ctaFull: string;
    prefillNote: string;
    resultStep: string;
  };
  stats: {
    scoreMax: string;
    jurisdictions: string;
    sections: string;
    avgTime: string;
  };
  trust: {
    mica: string;
    gdpr: string;
    kyc: string;
    jurisdictions: string;
  };
  tiers: {
    high: string;
    mid: string;
    low: string;
  };
  quickScoreExplain: {
    default: string;
    high: string;
    mid: string;
    low: string;
  };
  story: {
    act1Title: string;
    act1Body: string;
    act2Title: string;
    act2Body: string;
    act3Title: string;
    act3Body: string;
  };
  progress: {
    title: string;
    subtitle: string;
    itemAsset: string;
    itemValue: string;
    itemLocation: string;
    itemDescription: string;
    itemDocuments: string;
    itemDossier: string;
  };
  scoreReveal: {
    tierHigh: string;
    tierStrong: string;
    tierModerate: string;
    tierPrep: string;
    microHigh: string;
    microStrong: string;
    microModerate: string;
    microPrep: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step1Duration: string;
    step2Duration: string;
    step3Duration: string;
    screenshotPlaceholder: string;
    faqTitle: string;
    faq: readonly { question: string; answer: string }[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    wizard: string;
    score: string;
  };
  greenPromo: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    marketCta: string;
    registerCta: string;
  };
  assetUniverse: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: readonly [
      { title: string; desc: string; stat: string; statLabel: string },
      { title: string; desc: string; stat: string; statLabel: string },
      { title: string; desc: string; stat: string; statLabel: string },
      { title: string; desc: string; stat: string; statLabel: string },
    ];
  };
  footer: {
    tagline: string;
    product: string;
    legal: string;
    terms: string;
    privacy: string;
    legalNotice: string;
    rights: string;
  };
};
