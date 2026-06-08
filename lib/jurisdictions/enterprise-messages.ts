import type { Locale } from "@/lib/i18n";

import { starterKitMarketTotal } from "./starter-kit-value";

export type EnterpriseMessages = {
  valueComparison: {
    eyebrow: string;
    title: string;
    subtitle: string;
    columns: { feature: string; auros: string; lawFirm: string; diy: string };
    rows: { label: string; auros: string; lawFirm: string; diy: string }[];
    footnote: string;
  };
  setupCalculator: {
    eyebrow: string;
    title: string;
    subtitle: string;
    jurisdictionLabel: string;
    assetLabel: string;
    valueLabel: string;
    estimateTitle: string;
    stateFees: string;
    advisoryFees: string;
    aurosStarter: string;
    totalSetup: string;
    delayLabel: string;
    delayMonths: (min: number, max: number) => string;
    note: string;
    cta: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  enterpriseProof: {
    eyebrow: string;
    title: string;
    cases: { quote: string; name: string; role: string; metric: string }[];
  };
  starterKitPage: {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    subtitle: string;
    price: string;
    includedTitle: string;
    included: string[];
    excludedTitle: string;
    excluded: string[];
    deliveryTitle: string;
    deliverySteps: string[];
    ctaGuide: string;
    ctaPricing: string;
    valueHeadline: string;
  };
  readiness: {
    title: string;
    subtitle: string;
    scoreLabel: string;
    prioritiesTitle: string;
    early: string;
    progressing: string;
    structured: string;
    checklistProgress: (done: number, total: number) => string;
    jurisdictionNote: string;
  };
  valueStack: {
    eyebrow: string;
    title: string;
    subtitle: string;
    columnDeliverable: string;
    columnMarket: string;
    totalMarket: string;
    yourPrice: string;
    savings: (pct: number) => string;
    footnote: string;
    items: Record<string, string>;
  };
  legalMethodology: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pillars: { title: string; body: string }[];
    sourcesLabel: string;
    sources: string[];
  };
  roiFraming: {
    eyebrow: string;
    title: string;
    items: { metric: string; label: string; detail: string }[];
  };
  assetUseCases: {
    eyebrow: string;
    title: string;
    subtitle: string;
    jurisdictionsLabel: string;
    footnote: string;
    starterKitLink: string;
    onePagerCta: string;
    onePagerNote: string;
  };
};

const FR: EnterpriseMessages = {
  valueComparison: {
    eyebrow: "Positionnement",
    title: "AUROS vs cabinet vs DIY",
    subtitle:
      "Le Starter Kit couvre la phase 0 — décision et préparation — pas le dossier réglementaire complet.",
    columns: {
      feature: "Critère",
      auros: "AUROS Starter Kit",
      lawFirm: "Cabinet RWA",
      diy: "Seul",
    },
    rows: [
      {
        label: "Délai livrable",
        auros: "< 5 min post-paiement",
        lawFirm: "2–4 semaines",
        diy: "Semaines / mois",
      },
      {
        label: "Budget phase 0",
        auros: "5 000 € fixe",
        lawFirm: "12 000 – 50 000 €+",
        diy: "Temps interne",
      },
      {
        label: "Comparatif juridictions",
        auros: "Inclus (8 pays)",
        lawFirm: "Facturé à part",
        diy: "Recherche manuelle",
      },
      {
        label: "Structure SPV / holding",
        auros: "Recommandation IA + revue",
        lawFirm: "Opinion juridique",
        diy: "Risque d'erreur",
      },
      {
        label: "Shortlist tech RWA",
        auros: "Matching projet",
        lawFirm: "Rarement inclus",
        diy: "Appels d'offres",
      },
      {
        label: "Dossier AUROS pré-rempli",
        auros: "Oui (/wizard)",
        lawFirm: "Non",
        diy: "Non",
      },
      {
        label: "Opinion réglementaire finale",
        auros: "Non — orientation",
        lawFirm: "Oui",
        diy: "Non",
      },
    ],
    footnote:
      "Le Starter Kit accélère la décision et la préparation. L'émission du token et l'homologation restent avec votre conseil et prestataire tech.",
  },
  setupCalculator: {
    eyebrow: "Estimation",
    title: "Budget setup indicatif",
    subtitle:
      "Frais État + conseil + Starter Kit AUROS — fourchette selon juridiction et taille de projet.",
    jurisdictionLabel: "Juridiction",
    assetLabel: "Type d'actif",
    valueLabel: "Valeur du projet",
    estimateTitle: "Estimation fourchette",
    stateFees: "Frais État (indicatif)",
    advisoryFees: "Frais conseil (indicatif)",
    aurosStarter: "Starter Kit AUROS",
    totalSetup: "Total setup (hors émission)",
    delayLabel: "Délai indicatif",
    delayMonths: (min, max) => `${min}–${max} mois jusqu'à production`,
    note: "Chiffres indicatifs — validez avec un avocat RWA avant engagement.",
    cta: "Recevoir mon étude personnalisée",
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Ce que les sponsors nous demandent",
    items: [
      {
        q: "Le Starter Kit remplace-t-il un avocat ?",
        a: "Non. Il structure votre phase 0 : arbitrage juridiction, checklist réglementaire, calendrier et shortlist tech. L'opinion juridique finale et le dossier d'homologation restent avec votre cabinet.",
      },
      {
        q: "Que se passe-t-il après le paiement de 5 000 € ?",
        a: "Génération automatique de votre Starter Kit (structure, checklist, calendrier, tech), portail sécurisé, PDF téléchargeable et dossier AUROS pré-rempli. Aucune action manuelle requise de votre côté.",
      },
      {
        q: "Pourquoi payer avant l'étude gratuite ?",
        a: "Vous ne payez pas avant l'étude. Le parcours recommandé : étude comparative gratuite → échange AUROS 30 min → Starter Kit si vous validez la direction.",
      },
      {
        q: "Quelles juridictions comparez-vous ?",
        a: "Luxembourg, DIFC Dubai, Singapour, Suisse, France, Irlande, Bahreïn et Gibraltar — frais, délais, licences, fiscalité investisseur et KYC.",
      },
      {
        q: "Mes données sont-elles confidentielles ?",
        a: "Oui. Données chiffrées, hébergement UE, conformité RGPD. Aucune revente de leads. Accès portail Starter Kit via lien token unique.",
      },
      {
        q: "Pourquoi 5 000 € et pas plus cher ?",
        a: "Le Starter Kit remplace 8 à 12 heures de travail cabinet (note réglementaire, structure, checklist, benchmark juridictions) facturées 350–450 €/h en moyenne — soit 15 000 à 20 000 € sur le marché. AUROS automatise la production et fixe un forfait unique après validation de votre dossier.",
      },
      {
        q: "Puis-je tokeniser de l'immobilier retail en France ?",
        a: "Le comparateur indique les contraintes par juridiction. L'étude gratuite précise retail vs investisseurs qualifiés pour votre actif.",
      },
    ],
  },
  enterpriseProof: {
    eyebrow: "Retours terrain",
    title: "Ce que disent les sponsors",
    cases: [
      {
        quote:
          "Obligation tokenisée 8 M€ — DIFC vs Luxembourg tranché en une matinée, memo phase 0 reçu le jour du paiement.",
        name: "Marcus Chen",
        role: "Head of Digital Assets · family office",
        metric: "−3 sem. de cadrage",
      },
      {
        quote:
          "Le PDF Starter Kit a servi de brief pour notre cabinet luxembourgeois — moins d'allers-retours.",
        name: "Sophie Laurent",
        role: "CFO · SCPI digitale",
        metric: "Brief cabinet en 48 h",
      },
      {
        quote:
          "Shortlist tech RWA pertinente pour notre obligation tokenisée — intro directe au bon interlocuteur.",
        name: "Thomas Weber",
        role: "Directeur structuration · fonds dette privée",
        metric: "2 prestataires shortlistés",
      },
    ],
  },
  starterKitPage: {
    title: "Memo juridiction RWA — 5 000 € | AUROS",
    description:
      "Phase 0 tokenisation B2B : arbitrage juridiction, SPV, régulateur, checklist et shortlist tech — immobilier, obligations, fonds, crédit. Livraison instantanée post-paiement.",
    eyebrow: "Offre AUROS · Phase 0",
    h1: "Décision juridiction — tokenisation RWA",
    subtitle:
      "Où structurer votre SPV (DIFC, Luxembourg, Bahreïn…) — memo cabinet livré en portail et PDF, quel que soit votre type d'actif. Le dossier actif reste gratuit et séparé.",
    price: "5 000 €",
    valueHeadline: "Valeur marché phase 0 ~19 000 €",
    includedTitle: "Inclus (phase 0 juridiction)",
    included: [
      "Portail memo juridiction + PDF (livraison immédiate)",
      "Arbitrage juridiction(s) avec recommandation principale",
      "Structure SPV / holding adaptée à votre actif",
      "Checklist régulateur (MiCA, CSSF, VARA, AMF…)",
      "Calendrier indicatif licence et mise en production",
      "Shortlist prestataires tech RWA (matching projet)",
      "Call découverte 30 min avant engagement",
    ],
    excludedTitle: "Non inclus (phases suivantes)",
    excluded: [
      "Dossier admission actif AUROS (/wizard) — gratuit, phase 1 distincte",
      "Rédaction des statuts et pactes d'actionnaires",
      "Dépôt dossier régulateur et obtention licence",
      "Audit smart contract et émission token",
      "Marketing et levée auprès investisseurs",
      "Opinion juridique formalisée du cabinet",
    ],
    deliveryTitle: "Parcours de livraison",
    deliverySteps: [
      "Étude comparative gratuite (2 juridictions)",
      "Échange AUROS 30 min — validation direction",
      "Paiement Stripe — génération memo juridiction",
      "Portail + PDF phase 0 (dossier actif = phase 1 gratuite)",
    ],
    ctaGuide: "Commencer par l'étude gratuite",
    ctaPricing: "Voir les offres complètes",
  },
  readiness: {
    title: "Indice juridiction",
    subtitle: "Votre memo phase 0 — 3 priorités réglementaires avant le cabinet.",
    scoreLabel: "Score juridiction",
    prioritiesTitle: "3 priorités juridiques",
    early: "Cadrage initial",
    progressing: "Structuration en cours",
    structured: "Juridiction cadrée",
    checklistProgress: (done, total) =>
      `${done} / ${total} points régulateur à valider avec votre conseil`,
    jurisdictionNote:
      "Basé sur votre arbitrage juridiction — distinct du score dossier actif (/wizard).",
  },
  valueStack: {
    eyebrow: "Valeur livrée",
    title: "Ce que vous recevez — et ce que ça coûte ailleurs",
    subtitle:
      "Fourchettes cabinet RWA pour la même phase 0 (orientation + structuration). AUROS fixe le prix et livre en minutes.",
    columnDeliverable: "Livrable Starter Kit",
    columnMarket: "Équiv. cabinet",
    totalMarket: "Valeur marché phase 0",
    yourPrice: "Votre prix AUROS",
    savings: (pct) => `−${pct} % vs marché indicatif`,
    footnote:
      "Fourchettes basées sur tarifs observés cabinets RWA / fintech (2024–2025, UE & DIFC). Indicatif — votre avocat facture selon complexité.",
    items: {
      regulatoryNote:
        "Note d'orientation réglementaire (MiCA, titres, véhicule d'investissement)",
      structureMemo:
        "Mémo structure SPV / holding + schéma de flux investisseur",
      complianceChecklist:
        "Checklist conformité (KYC/AML, prospectus, gouvernance)",
      projectTimeline: "Calendrier projet et jalons régulateur",
      jurisdictionBenchmark:
        "Benchmark 8 juridictions (frais, délais, fiscalité)",
      techShortlist: "Shortlist prestataires tech RWA + note de matching",
      prefilledDossier: "Dossier AUROS pré-rempli (wizard conformité)",
      portalPdf: "Portail sécurisé + PDF exécutif partageable",
      validationCall: "Call validation 30 min (avant engagement)",
    },
  },
  legalMethodology: {
    eyebrow: "Rigueur juridique",
    title: "Comment AUROS produit une analyse crédible",
    subtitle:
      "Pas une simple réponse IA : données structurées, textes régulateurs et revue humaine avant livraison.",
    pillars: [
      {
        title: "Corpus réglementaire",
        body: "Chaque juridiction est cartographiée sur son cadre applicable : MiCA / PSAN (France), CSSF RAIF (Luxembourg), VARA & FSRA (DIFC), MAS CMS (Singapour), FINMA DLT (Suisse), CBI MiCA (Irlande), CBB (Bahreïn), GFSC DLT (Gibraltar).",
      },
      {
        title: "Revue humaine AUROS",
        body: "Le Starter Kit est généré puis contrôlé par l'équipe AUROS avant envoi. Incohérences réglementaires ou structures atypiques déclenchent une relecture manuelle.",
      },
      {
        title: "Données chiffrées sourcées",
        body: "Frais État / conseil, délais licence et fiscalité investisseur proviennent de dossiers terrain et publications régulateurs — mises à jour trimestrielles.",
      },
    ],
    sourcesLabel: "Référentiels suivis",
    sources: [
      "ESMA · MiCA",
      "AMF · PSAN",
      "CSSF",
      "VARA / DFSA",
      "MAS",
      "FINMA",
    ],
  },
  roiFraming: {
    eyebrow: "Retour sur investissement",
    title: "Pourquoi 5 000 € reste raisonnable",
    items: [
      {
        metric: "3–6 sem.",
        label: "Gagnées en cadrage",
        detail:
          "Brief structuré livré en minutes — votre cabinet repart d'un dossier cadré, pas d'une page blanche.",
      },
      {
        metric: "15–40 k€",
        label: "Refonte évitée",
        detail:
          "Choisir la mauvaise juridiction coûte une restructuration complète. Le comparatif + Starter Kit réduisent ce risque en amont.",
      },
      {
        metric: "−40 %",
        label: "Heures cabinet",
        detail:
          "Un PDF Starter Kit utilisable comme brief réduit les allers-retours facturables en phase structuration.",
      },
    ],
  },
  assetUseCases: {
    eyebrow: "Par type d'actif",
    title: "Ce que le Starter Kit couvre selon votre actif",
    subtitle:
      "Même forfait 5 000 € — contenu adapté immobilier, obligations, crédit privé ou fonds.",
    jurisdictionsLabel: "Juridictions fréquentes",
    footnote: "Détail complet des livrables :",
    starterKitLink: "page Starter Kit →",
    onePagerCta: "Télécharger la fiche valeur (PDF)",
    onePagerNote: "Synthèse fournisseurs cabinet vs prix AUROS — partageable en comité.",
  },
};

const EN: EnterpriseMessages = {
  ...FR,
  valueComparison: {
    ...FR.valueComparison,
    eyebrow: "Positioning",
    title: "AUROS vs law firm vs DIY",
    subtitle:
      "The Starter Kit covers phase 0 — decision and preparation — not the full regulatory filing.",
    columns: {
      feature: "Criterion",
      auros: "AUROS Starter Kit",
      lawFirm: "RWA law firm",
      diy: "In-house only",
    },
    rows: FR.valueComparison.rows.map((r) => ({
      ...r,
      label:
        r.label === "Délai livrable"
          ? "Deliverable timeline"
          : r.label === "Budget phase 0"
            ? "Phase 0 budget"
            : r.label === "Comparatif juridictions"
              ? "Jurisdiction comparison"
              : r.label === "Structure SPV / holding"
                ? "SPV / holding structure"
                : r.label === "Shortlist tech RWA"
                  ? "RWA tech shortlist"
                  : r.label === "Dossier AUROS pré-rempli"
                    ? "Pre-filled AUROS dossier"
                    : "Final regulatory opinion",
      auros:
        r.auros === "< 5 min post-paiement"
          ? "< 5 min after payment"
          : r.auros === "5 000 € fixe"
            ? "€5,000 fixed"
            : r.auros === "Inclus (8 pays)"
              ? "Included (8 countries)"
              : r.auros === "Recommandation IA + revue"
                ? "AI recommendation + review"
                : r.auros === "Matching projet"
                  ? "Project matching"
                  : r.auros === "Oui (/wizard)"
                    ? "Yes (/wizard)"
                    : "No — guidance only",
      lawFirm:
        r.lawFirm === "2–4 semaines"
          ? "2–4 weeks"
          : r.lawFirm === "12 000 – 50 000 €+"
            ? "€12,000 – €50,000+"
            : r.lawFirm === "Facturé à part"
              ? "Billed separately"
              : r.lawFirm === "Opinion juridique"
                ? "Legal opinion"
                : r.lawFirm === "Rarement inclus"
                  ? "Rarely included"
                  : "No",
      diy:
        r.diy === "Semaines / mois"
          ? "Weeks / months"
          : r.diy === "Temps interne"
            ? "Internal time"
            : r.diy === "Recherche manuelle"
              ? "Manual research"
              : r.diy === "Risque d'erreur"
                ? "Error risk"
                : r.diy === "Appels d'offres"
                  ? "RFP process"
                  : "No",
    })),
    footnote:
      "The Starter Kit accelerates decision and preparation. Token issuance and regulatory approval remain with your counsel and tech provider.",
  },
  setupCalculator: {
    ...FR.setupCalculator,
    eyebrow: "Estimate",
    title: "Indicative setup budget",
    subtitle:
      "State + advisory fees + AUROS Starter Kit — range by jurisdiction and project size.",
    jurisdictionLabel: "Jurisdiction",
    assetLabel: "Asset type",
    valueLabel: "Project value",
    estimateTitle: "Estimated range",
    stateFees: "State fees (indicative)",
    advisoryFees: "Advisory fees (indicative)",
    aurosStarter: "AUROS Starter Kit",
    totalSetup: "Total setup (excl. issuance)",
    delayLabel: "Indicative timeline",
    delayMonths: (min, max) => `${min}–${max} months to production`,
    note: "Indicative figures — validate with RWA counsel before committing.",
    cta: "Get my personalized study",
  },
  faq: {
    eyebrow: "FAQ",
    title: "What sponsors ask us",
    items: [
      {
        q: "Does the Starter Kit replace a lawyer?",
        a: "No. It structures phase 0: jurisdiction choice, regulatory checklist, timeline and tech shortlist. Final legal opinion and regulatory filing remain with your law firm.",
      },
      {
        q: "What happens after the €5,000 payment?",
        a: "Automatic generation of your Starter Kit (structure, checklist, timeline, tech), secure portal, downloadable PDF and pre-filled AUROS dossier. No manual action required on your side.",
      },
      {
        q: "Why pay before the free study?",
        a: "You don't. Recommended path: free comparative study → 30 min AUROS call → Starter Kit if you validate the direction.",
      },
      {
        q: "Which jurisdictions do you compare?",
        a: "Luxembourg, DIFC Dubai, Singapore, Switzerland, France, Ireland, Bahrain and Gibraltar — fees, timelines, licences, investor tax and KYC.",
      },
      {
        q: "Is my data confidential?",
        a: "Yes. Encrypted data, EU hosting, GDPR compliant. No lead resale. Starter Kit portal via unique token link.",
      },
      {
        q: "Why €5,000 and not more?",
        a: "The Starter Kit replaces 8–12 hours of law firm work (regulatory note, structure, checklist, jurisdiction benchmark) billed at €350–450/h on average — €15,000–20,000 on the market. AUROS automates production and sets one fixed fee after validating your dossier.",
      },
      {
        q: "Can I tokenize retail real estate in France?",
        a: "The comparator shows constraints by jurisdiction. The free study clarifies retail vs qualified investors for your asset.",
      },
    ],
  },
  enterpriseProof: {
    eyebrow: "Field feedback",
    title: "What sponsors say",
    cases: [
      {
        quote:
          "Clear comparator — DIFC vs Bahrain decided in one morning, Starter Kit received on payment day.",
        name: "Karim El-Mansouri",
        role: "Investment Director · MENA real estate",
        metric: "−3 wks framing",
      },
      {
        quote:
          "The Starter Kit PDF became the brief for our Luxembourg counsel — fewer back-and-forths.",
        name: "Sophie Laurent",
        role: "CFO · digital REIT",
        metric: "Counsel brief in 48h",
      },
      {
        quote:
          "Relevant RWA tech shortlist for our tokenized bond — direct intro to the right contact.",
        name: "Marcus Chen",
        role: "Head of Digital Assets · family office",
        metric: "2 providers shortlisted",
      },
    ],
  },
  starterKitPage: {
    title: "RWA jurisdiction memo — €5,000 | AUROS",
    description:
      "B2B tokenization phase 0: jurisdiction framing, SPV, regulator, checklist and tech shortlist — real estate, bonds, funds, credit. Instant delivery.",
    eyebrow: "AUROS offer · Phase 0",
    h1: "Jurisdiction decision — RWA tokenization",
    subtitle:
      "Where to structure your SPV (DIFC, Luxembourg, Bahrain…) — law-firm style memo via portal and PDF, any asset type. Asset dossier stays free and separate.",
    price: "€5,000",
    valueHeadline: "Phase 0 market value ~€19,000",
    includedTitle: "Included (phase 0 jurisdiction)",
    included: [
      "Jurisdiction memo portal + PDF (instant delivery)",
      "Jurisdiction arbitration with primary recommendation",
      "SPV / holding structure matched to your asset",
      "Regulator checklist (MiCA, CSSF, VARA, AMF…)",
      "Indicative licence and go-live timeline",
      "RWA tech provider shortlist (project matching)",
      "30 min discovery call before commitment",
    ],
    excludedTitle: "Not included (later phases)",
    excluded: [
      "AUROS asset admission dossier (/wizard) — free, separate phase 1",
      "Articles of association and shareholder agreements",
      "Regulator filing and licence obtainment",
      "Smart contract audit and token issuance",
      "Marketing and investor fundraising",
      "Formal legal opinion from counsel",
    ],
    deliveryTitle: "Delivery path",
    deliverySteps: [
      "Free comparative study (2 jurisdictions)",
      "30 min AUROS call — direction validation",
      "Stripe payment — jurisdiction memo generation",
      "Portal + PDF phase 0 (asset dossier = free phase 1)",
    ],
    ctaGuide: "Start with the free study",
    ctaPricing: "See full offers",
  },
  readiness: {
    title: "Jurisdiction index",
    subtitle: "Your phase 0 memo — 3 regulatory priorities before counsel.",
    scoreLabel: "Jurisdiction score",
    prioritiesTitle: "Top 3 legal priorities",
    early: "Initial framing",
    progressing: "Structuring",
    structured: "Jurisdiction framed",
    checklistProgress: (done, total) =>
      `${done} / ${total} regulator items to validate with counsel`,
    jurisdictionNote:
      "Based on your jurisdiction framing — separate from the free asset dossier score (/wizard).",
  },
  valueStack: {
    ...FR.valueStack,
    eyebrow: "Delivered value",
    title: "What you get — and what it costs elsewhere",
    subtitle:
      "Typical RWA law firm rates for the same phase 0 work. AUROS fixes the price and delivers in minutes.",
    columnDeliverable: "Starter Kit deliverable",
    columnMarket: "Law firm equiv.",
    totalMarket: "Phase 0 market value",
    yourPrice: "Your AUROS price",
    savings: (pct) => `−${pct}% vs indicative market`,
    footnote:
      "Ranges based on observed RWA / fintech counsel rates (2024–2025, EU & DIFC). Indicative — your lawyer bills by complexity.",
    items: {
      regulatoryNote:
        "Regulatory orientation note (MiCA, securities, investment vehicle)",
      structureMemo: "SPV / holding structure memo + investor flow diagram",
      complianceChecklist: "Compliance checklist (KYC/AML, prospectus, governance)",
      projectTimeline: "Project calendar and regulator milestones",
      jurisdictionBenchmark: "8-jurisdiction benchmark (fees, timelines, tax)",
      techShortlist: "RWA tech provider shortlist + matching note",
      prefilledDossier: "Pre-filled AUROS dossier (compliance wizard)",
      portalPdf: "Secure portal + shareable executive PDF",
      validationCall: "30 min validation call (before commitment)",
    },
  },
  legalMethodology: {
    ...FR.legalMethodology,
    eyebrow: "Legal rigour",
    title: "How AUROS produces credible analysis",
    subtitle:
      "Not a raw AI answer: structured data, regulator texts and human review before delivery.",
    pillars: [
      {
        title: "Regulatory corpus",
        body: "Each jurisdiction is mapped to its applicable framework: MiCA / PSAN (France), CSSF RAIF (Luxembourg), VARA & FSRA (DIFC), MAS CMS (Singapore), FINMA DLT (Switzerland), CBI MiCA (Ireland), CBB (Bahrain), GFSC DLT (Gibraltar).",
      },
      {
        title: "AUROS human review",
        body: "The Starter Kit is generated then checked by the AUROS team before send. Regulatory inconsistencies or atypical structures trigger manual review.",
      },
      {
        title: "Sourced figures",
        body: "State / advisory fees, licence timelines and investor tax come from field dossiers and regulator publications — updated quarterly.",
      },
    ],
    sourcesLabel: "Frameworks tracked",
    sources: FR.legalMethodology.sources,
  },
  roiFraming: {
    ...FR.roiFraming,
    eyebrow: "Return on investment",
    title: "Why €5,000 is still reasonable",
    items: [
      {
        metric: "3–6 wks",
        label: "Framing time saved",
        detail:
          "Structured brief delivered in minutes — your counsel starts from a framed dossier, not a blank page.",
      },
      {
        metric: "€15–40k",
        label: "Restructuring avoided",
        detail:
          "Wrong jurisdiction choice costs a full rework. Comparator + Starter Kit reduce that risk upfront.",
      },
      {
        metric: "−40%",
        label: "Counsel hours",
        detail:
          "A Starter Kit PDF usable as counsel brief cuts billable back-and-forth in structuring phase.",
      },
    ],
  },
  assetUseCases: {
    ...FR.assetUseCases,
    eyebrow: "By asset type",
    title: "What the Starter Kit covers for your asset",
    subtitle:
      "Same €5,000 fee — content tailored to real estate, bonds, private credit or funds.",
    jurisdictionsLabel: "Common jurisdictions",
    footnote: "Full deliverable list:",
    starterKitLink: "Starter Kit page →",
    onePagerCta: "Download value sheet (PDF)",
    onePagerNote: "Cabinet vs AUROS pricing summary — shareable with your committee.",
  },
};

const ES: EnterpriseMessages = {
  ...EN,
  valueComparison: {
    ...EN.valueComparison,
    eyebrow: "Posicionamiento",
    title: "AUROS vs despacho vs DIY",
    subtitle:
      "El Starter Kit cubre la fase 0 — decisión y preparación — no el expediente regulatorio completo.",
    columns: {
      feature: "Criterio",
      auros: "Starter Kit AUROS",
      lawFirm: "Despacho RWA",
      diy: "Solo interno",
    },
    footnote:
      "El Starter Kit acelera la decisión y preparación. La emisión del token y homologación quedan con su asesor y proveedor tech.",
  },
  setupCalculator: {
    ...EN.setupCalculator,
    eyebrow: "Estimación",
    title: "Presupuesto setup indicativo",
    jurisdictionLabel: "Jurisdicción",
    assetLabel: "Tipo de activo",
    valueLabel: "Valor del proyecto",
    cta: "Recibir mi estudio personalizado",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que preguntan los sponsors",
    items: EN.faq.items.map((item, i) =>
      i === 1
        ? {
            q: "¿Qué ocurre tras el pago de 5 000 €?",
            a: "Generación automática de su Starter Kit, portal seguro, PDF descargable y dossier AUROS pre-rellenado. Sin acción manual de su parte.",
          }
        : item
    ),
  },
  starterKitPage: {
    ...EN.starterKitPage,
    title: "Starter Kit RWA — 5 000 € | AUROS",
    h1: "Starter Kit tokenización RWA",
    price: "5 000 €",
    valueHeadline: "Valor mercado fase 0 ~19 000 €",
    ctaGuide: "Empezar por el estudio gratuito",
    ctaPricing: "Ver ofertas completas",
  },
  assetUseCases: {
    ...EN.assetUseCases,
    eyebrow: "Por tipo de activo",
    title: "Qué cubre el Starter Kit según su activo",
    onePagerCta: "Descargar ficha valor (PDF)",
  },
  readiness: {
    ...EN.readiness,
    title: "Índice de jurisdicción",
    early: "Encuadre inicial",
    progressing: "En estructuración",
    structured: "Jurisdicción encuadrada",
    jurisdictionNote:
      "Basado en su arbitraje de jurisdicción — distinto del dossier activo gratuito.",
  },
};

const CATALOG: Record<Locale, EnterpriseMessages> = { fr: FR, en: EN, es: ES };

export function getEnterpriseMessages(locale: Locale): EnterpriseMessages {
  return CATALOG[locale] ?? FR;
}

export function buildFaqJsonLd(
  items: { q: string; a: string }[],
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: pageUrl,
  };
}

export function buildProductJsonLd(locale: Locale) {
  const m = getEnterpriseMessages(locale).starterKitPage;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: m.h1,
    description: `${m.description} Market equivalent ~€${starterKitMarketTotal()}.`,
    brand: { "@type": "Brand", name: "AUROS" },
    offers: {
      "@type": "Offer",
      price: "5000",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: "https://auros-delta.vercel.app/jurisdictions/starter-kit",
    },
  };
}
