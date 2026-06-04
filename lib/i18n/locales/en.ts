import type { Messages } from "../types";

export const en: Messages = {
  nav: {
    score: "Score",
    tokenize: "Tokenize",
    dossiers: "Dossiers",
    jurisdictions: "Jurisdictions",
    partners: "Platforms",
    login: "Sign in",
    start: "Get started",
    menu: "Menu",
  },
  breadcrumb: {
    ariaLabel: "Breadcrumb",
    green: "Green",
    compare: "Compare",
  },
  hero: {
    eyebrow: "Real World Assets",
    title: "Tokenize the real world.",
    subtitle:
      "Score, data room, and regulatory studio — prepare your dossier before any RWA platform.",
    ctaPrimary: "Create my dossier",
    ctaEstimate: "Estimate my asset",
    metricAssets: "Asset classes",
    metricJurisdictions: "Jurisdictions",
    metricDossier: "Avg. dossier time",
  },
  platforms: {
    caption: "RWA dossier preparation — no venue comparison grid",
  },
  score: {
    eyebrow: "Score",
    title: "Is your asset ready?",
    subtitle: "One sentence is enough. Instant result, no account required.",
    placeholder: "E.g. 180 m² stone house in Bordeaux, est. €1.2M…",
    submit: "Calculate score",
    emailPlaceholder: "Email (optional)",
    saveEmail: "Save",
    emailSaved: "Saved ✓",
    linkCopied: "Link copied",
    linkFailed: "Failed",
    share: "Share score",
    reset: "New estimate",
    calculate: "Calculate",
    shareBtn: "Share",
    fullDossier: "Full dossier",
    otherAsset: "Another asset",
    disclaimer: "Indicative score — not regulated advice",
    indicativeNote:
      "Indicative score based on provided information. Not legal or financial advice.",
    emptyQuery: "Describe your asset in one sentence to calculate the score.",
    tierHigh: "High tokenization potential",
    tierMid: "Good potential",
    tierLow: "Needs preparation",
    quickExamplesLabel: "3 quick examples",
    quickExamples: [
      "T3 apartment Paris 15th, value €450,000",
      "Contemporary art portfolio, 3 works, €180,000",
      "Trade receivable, SME Lyon, €250,000",
    ],
    inputHint: "~30 seconds · No account · Indicative result",
    exampleCard: {
      title: "Sample result",
      readiness: "Dossier ready at 72%",
      badgeLegal: "Legal ✓",
      badgeKyc: "KYC ✓",
      badgeMica: "MiCA ⚠",
      badgeDataRoom: "Data room ✓",
      disclaimer: "Illustrative example — your score will be calculated in real time",
    },
  },
  regulatory: {
    eyebrow: "Compliance",
    title: "Transparent regulatory framing",
    subtitle:
      "AUROS provides indicative analysis — not legal or financial advice.",
    kyc: "KYC / AML",
    kycDesc:
      "Identity pathway aligned with common tokenization KYC/AML standards.",
    jurisdictions: "Covered jurisdictions",
    jurisdictionsDesc:
      "40+ jurisdictions modeled — analysis tailored to asset country and MiCA / local frameworks.",
    indicative: "Indicative score",
    indicativeDesc:
      "Readiness estimate — final validation by your advisors and the AUROS team.",
    partners: "AUROS guidance",
    partnersDesc:
      "Dossier structuring and human review — no third-party venue pushed without agreement.",
    disclaimer:
      "AUROS results are for informational purposes only and do not constitute investment, legal, or tax advice.",
  },
  socialProof: {
    eyebrow: "Proof",
    title: "Asset owners & operators",
    statDossiers: "2,400+",
    statDossiersLabel: "Dossiers generated (pilot)",
    statJurisdictions: "40+",
    statJurisdictionsLabel: "Jurisdictions modeled",
    statTime: "~12 min",
    statTimeLabel: "Average dossier time",
    statPlatforms: "5",
    statPlatformsLabel: "Data room phases",
    t1quote:
      "Score and dossier in one afternoon — without upfront legal back-and-forth.",
    t1name: "Sofia M.",
    t1role: "Real estate · Lyon",
    t2quote: "The structured dossier saved us weeks.",
    t2name: "James K.",
    t2role: "Private credit · London",
    t3quote: "Clear presentation for our LPs.",
    t3name: "Elena R.",
    t3role: "Art · Geneva",
  },
  dossierPreview: {
    eyebrow: "Deliverables",
    title: "A preparation studio — not a fake PDF mockup",
    subtitle:
      "After the wizard you get an online space: dossier readiness, regulatory studio, data room — plus PDF export when needed.",
    disclaimer:
      "Outline of real /dossier sections — your content and score, not a fixed sample vineyard.",
    ctaWizard: "Create my dossier",
    ctaDemo: "View demo dossier",
    blocks: [
      {
        tag: "01",
        title: "Score & admission",
        description:
          "Indicative score, admission %, up to 3 priorities — not a wall of 15 gaps.",
      },
      {
        tag: "02",
        title: "Tokenization studio",
        description:
          "Regulatory path, tokenomics, roadmap and providers — from your answers.",
      },
      {
        tag: "03",
        title: "Data room (15 docs)",
        description:
          "Priorities + progressive upload; full checklist stays collapsed until you need it.",
      },
      {
        tag: "04",
        title: "Request to AUROS",
        description:
          "Submit to our team within 48h — no venue comparison or third-party logos.",
      },
      {
        tag: "05",
        title: "Export & share",
        description:
          "PDF, legal pack .md, share link — alongside the live dossier space.",
      },
    ],
  },
  quickScore: {
    title: "Quick estimate",
    close: "Close",
    stepAsset: "Asset type",
    stepValue: "Estimated value",
    stepCountry: "Asset country",
    next: "Next",
    back: "Back",
    seeScore: "See score",
    ctaFull: "Get full report",
    prefillNote: "The wizard will be prefilled with your 3 answers.",
    resultStep: "Result",
  },
  stats: {
    scoreMax: "Max score (indicative)",
    jurisdictions: "Jurisdictions",
    sections: "Dossier sections",
    avgTime: "Average time",
  },
  trust: {
    mica: "MiCA",
    gdpr: "GDPR",
    kyc: "KYC / AML",
    jurisdictions: "jurisdictions",
  },
  tiers: {
    high: "High tokenization potential",
    mid: "Good potential",
    low: "Needs preparation",
  },
  quickScoreExplain: {
    default:
      "Indicative score based on asset type, declared value, and jurisdiction.",
    high:
      "Strong profile for tokenization — dossier well positioned for AUROS review.",
    mid:
      "Good potential — complete the dossier (title, compliance, income) to maximize eligibility.",
    low:
      "Preparation recommended — clarify documentation and legal structure first.",
  },
  story: {
    act1Title: "You hold real-world assets",
    act1Body:
      "Real estate, art, metals, vehicles — tangible wealth that digital markets still struggle to read.",
    act2Title: "The digital world does not see them yet",
    act2Body:
      "Regulation, illiquidity, scattered documentation: tokenization requires a language most assets do not speak natively.",
    act3Title: "AUROS translates the asset for on-chain",
    act3Body:
      "Score, institutional dossier, and roadmap — in minutes, with no commitment.",
  },
  progress: {
    title: "Tokenization readiness",
    subtitle: "Complete the dossier to raise your score",
    itemAsset: "Asset type identified",
    itemValue: "Estimated value",
    itemLocation: "Jurisdiction",
    itemDescription: "Detailed description (20+ words)",
    itemDocuments: "Documentation on hand",
    itemDossier: "Full dossier generated",
  },
  scoreReveal: {
    tierHigh: "HIGH TOKENIZATION POTENTIAL",
    tierStrong: "STRONG TOKENIZATION POTENTIAL",
    tierModerate: "MODERATE TOKENIZATION POTENTIAL",
    tierPrep: "REQUIRES PREPARATION",
    microHigh: "Top 12% of assets in this category",
    microStrong: "Top 28% of assets in this category",
    microModerate: "Median range for this asset class",
    microPrep: "Structuring guidance available",
  },
  howItWorks: {
    eyebrow: "Journey",
    title: "Three steps to your dossier",
    step1Title: "Describe the asset",
    step1Desc: "15 guided steps: type, value, structure, income, compliance.",
    step2Title: "Score & AI dossier",
    step2Desc: "Institutional report, regulatory studio, PDF export.",
    step3Title: "Submission",
    step3Desc: "Send to AUROS team, MiCA framing, concrete next steps.",
    step1Duration: "~2 min",
    step2Duration: "~8 min",
    step3Duration: "within 48h",
    screenshotPlaceholder: "Wizard screenshot",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Is the AUROS wizard free?",
        answer: "Yes. Wizard, active dossier and admission score are free. The jurisdiction Starter Kit is a separate paid product at €5,000 excl. VAT.",
      },
      {
        question: "Does AUROS replace a lawyer or investment advisor?",
        answer: "No. All AUROS analyses are indicative. Validate your structure with qualified counsel before any issuance.",
      },
      {
        question: "What asset types can I tokenize with AUROS?",
        answer: "Real estate, bonds, private credit, backed stablecoins, commodities, funds and renewable energy.",
      },
      {
        question: "What is the admission score?",
        answer: "A 0–100 index based on dossier completeness — preparation maturity, not a guarantee of issuance.",
      },
      {
        question: "How long does dossier preparation take?",
        answer: "Wizard ~12 min on average. Instant score ~30 s. AUROS review within 48h after submission.",
      },
    ],
  },
  finalCta: {
    title: "Move to tokenization with a ready dossier",
    subtitle: "Free to start. Score, AI dossier, PDF export.",
    wizard: "Start the wizard",
    score: "Try the score",
  },
  greenPromo: {
    eyebrow: "AUROS Green",
    title: "Green energy ecosystem & tokenized RWA",
    subtitle:
      "Worldwide marketplace, RTMS standard, public registry and Verified label — honest statuses, no greenwashing.",
    cta: "Ecosystem hub",
    marketCta: "Marketplace",
    registerCta: "Sell my surplus",
  },
  assetUniverse: {
    eyebrow: "RWA universe",
    title: "Every real asset, ready for tokenization",
    subtitle:
      "Dossier readiness, data room, and regulatory studio — on-chain deploy in phase 2.",
    cards: [
      {
        title: "Real estate",
        desc: "Residential, commercial, tokenizable land.",
        stat: "€2.4T",
        statLabel: "EU market (indicative)",
      },
      {
        title: "Art & collectibles",
        desc: "Works, watches, wine.",
        stat: "48h",
        statLabel: "typical dossier",
      },
      {
        title: "Private credit",
        desc: "Structured institutional pools.",
        stat: "MiCA",
        statLabel: "EU framing",
      },
      {
        title: "Metals & energy",
        desc: "Gold, productive infrastructure.",
        stat: "12+",
        statLabel: "asset classes",
      },
    ],
  },
  footer: {
    tagline: "Tokenization intelligence for real-world assets.",
    product: "Product",
    legal: "Legal",
    terms: "Terms",
    privacy: "Privacy",
    legalNotice: "Legal notice",
    rights: "AUROS · All rights reserved.",
  },
};
