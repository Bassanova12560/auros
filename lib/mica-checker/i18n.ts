import type { Locale } from "@/lib/i18n";

export type MicaCheckerCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimer: string;
  timeHint: string;
  progress: (current: number, total: number) => string;
  next: string;
  back: string;
  seeResult: string;
  restart: string;
  resultTitle: string;
  scoreLabel: string;
  tierEarly: string;
  tierProgress: string;
  tierSolid: string;
  priorities: string;
  wizardCta: string;
  estimateCta: string;
  relatedTitle: string;
  relatedLinks: { href: string; label: string }[];
  faqTitle: string;
  questions: {
    id: string;
    title: string;
    hint: string;
    options: { value: string; label: string; detail?: string }[];
  }[];
  recommendations: Record<string, string>;
};

const FR: MicaCheckerCopy = {
  eyebrow: "Outil gratuit · Conformité",
  title: "Test MiCA — suis-je prêt ?",
  intro:
    "Cinq questions pour estimer votre maturité MiCA avant de structurer un jeton RWA en Europe. Résultat indicatif en ~2 minutes — sans compte.",
  disclaimer:
    "Analyse indicative, non juridique — validation par counsel requis avant toute offre au public ou en UE.",
  timeHint: "~2 min · 5 questions",
  progress: (current, total) => `Question ${current} / ${total}`,
  next: "Continuer",
  back: "Retour",
  seeResult: "Voir mon score",
  restart: "Recommencer",
  resultTitle: "Score MiCA indicatif",
  scoreLabel: "Sur 100",
  tierEarly: "Amorçage — clarifiez structure et périmètre UE",
  tierProgress: "En progression — priorisez documentation et investisseurs",
  tierSolid: "Bonne base — affinez via wizard et revue counsel",
  priorities: "Priorités indicatives (max. 3)",
  wizardCta: "Compléter le wizard — partie Conformité",
  estimateCta: "Score de préparation détaillé",
  relatedTitle: "Aller plus loin",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Sélecteur de juridiction" },
    { href: "/tools/cost-estimator", label: "Estimateur coût tokenisation" },
    { href: "/tools/yield-calculator", label: "Calculateur rendement RWA" },
    { href: "/jurisdictions", label: "Comparateur juridictions" },
    { href: "/compare", label: "Comparateur rendements RWA" },
    { href: "/trust", label: "Confiance & conformité" },
  ],
  faqTitle: "Questions fréquentes",
  questions: [
    {
      id: "issuerType",
      title: "Qui émettra le jeton ?",
      hint: "MiCA attend une entité identifiée — SPV, fonds ou société émettrice.",
      options: [
        {
          value: "company_spv",
          label: "Société ou SPV dédié",
          detail: "Structure la plus courante pour un RWA tokenisé.",
        },
        {
          value: "existing_fund",
          label: "Fonds ou véhicule existant",
          detail: "AIF / fonds avec gouvernance en place.",
        },
        {
          value: "individual",
          label: "Personne physique",
          detail: "À restructurer avant une offre institutionnelle.",
        },
        { value: "unsure", label: "Pas encore décidé" },
      ],
    },
    {
      id: "assetClass",
      title: "Quelle nature pour le jeton ?",
      hint: "ART, EMT ou instrument financier — le régime MiCA / prospectus change.",
      options: [
        {
          value: "financial_instrument",
          label: "Jeton de créance ou de participation",
          detail: "Souvent prospectus + règles titres en plus de MiCA.",
        },
        {
          value: "art_utility",
          label: "Jeton d'actif réel (ART) ou utilité",
          detail: "Cadre MiCA ART — livre blanc émetteur requis.",
        },
        {
          value: "e_money",
          label: "Stablecoin / monnaie électronique",
          detail: "Régime EMT strict — réserves et agrément CASP.",
        },
        { value: "unsure", label: "Je ne sais pas encore" },
      ],
    },
    {
      id: "euNexus",
      title: "Quel lien avec l'Union européenne ?",
      hint: "Émetteur, actif ou investisseurs en UE déclenchent le périmètre MiCA.",
      options: [
        {
          value: "issuer_eu",
          label: "Émetteur établi dans l'UE",
        },
        {
          value: "asset_eu",
          label: "Actif situé dans l'UE",
        },
        {
          value: "investors_eu",
          label: "Investisseurs cibles en UE",
        },
        {
          value: "no_eu",
          label: "Pas de lien UE prévu",
          detail: "MiCA peut ne pas s'appliquer — valider avant une extension EU.",
        },
        { value: "unsure", label: "À clarifier" },
      ],
    },
    {
      id: "whitepaper",
      title: "Où en est votre livre blanc émetteur ?",
      hint: "MiCA impose un white paper pour les ART — brouillon acceptable à ce stade.",
      options: [
        {
          value: "ready",
          label: "Validé ou en relecture finale",
        },
        {
          value: "draft",
          label: "Brouillon en cours",
        },
        {
          value: "none",
          label: "Pas encore commencé",
        },
        { value: "unsure", label: "Je ne sais pas ce qu'il faut" },
      ],
    },
    {
      id: "investorType",
      title: "Quel public visez-vous ?",
      hint: "Le retail en UE renforce exigences prospectus, PRIIPs et communication.",
      options: [
        {
          value: "professional",
          label: "Investisseurs professionnels / qualifiés",
        },
        {
          value: "retail",
          label: "Grand public (retail)",
        },
        {
          value: "mixed",
          label: "Mix retail et professionnels",
        },
        { value: "unsure", label: "Pas encore défini" },
      ],
    },
  ],
  recommendations: {
    issuer_structure:
      "Constituer un SPV ou une société émettrice avant de rédiger le livre blanc.",
    issuer_governance:
      "Documenter la gouvernance du fonds et les pouvoirs de l'émetteur token.",
    asset_emt:
      "Les stablecoins relèvent du régime EMT — prévoir réserves, gouvernance et partenaire CASP.",
    asset_classify:
      "Classifier le jeton (ART, EMT ou titre) avec un conseil — c'est la base du dossier MiCA.",
    asset_prospectus:
      "Anticiper prospectus ou exemptions nationales si le jeton est un instrument financier.",
    asset_whitepaper:
      "Planifier le livre blanc ART : risques, gouvernance, droits des détenteurs.",
    eu_nexus:
      "Cartographier émetteur, actif et investisseurs pour confirmer le périmètre MiCA.",
    eu_casp:
      "Identifier les services crypto (custody, exchange) nécessitant un agrément CASP.",
    eu_prospectus:
      "Offre vers l'UE : aligner KYC, prospectus et communication marketing.",
    eu_optional:
      "Sans lien UE aujourd'hui — documenter la stratégie avant une extension européenne.",
    whitepaper_draft:
      "Démarrer un brouillon de livre blanc — même partiel, il accélère la revue counsel.",
    whitepaper_review:
      "Faire relire le brouillon par un cabinet MiCA avant diffusion.",
    investor_retail:
      "Ciblage retail : renforcer prospectus, PRIIPs et politique KYC/AML.",
    investor_define:
      "Trancher le profil investisseur — cela conditionne exemptions et documentation.",
    counsel:
      "Planifier une revue counsel MiCA avant toute communication publique.",
  },
};

const EN: MicaCheckerCopy = {
  ...FR,
  eyebrow: "Free tool · Compliance",
  title: "MiCA check — am I ready?",
  intro:
    "Five questions to estimate your MiCA readiness before structuring an EU RWA token. Indicative result in ~2 minutes — no account.",
  disclaimer:
    "Indicative analysis, not legal advice — counsel validation required before any public or EU offer.",
  timeHint: "~2 min · 5 questions",
  progress: (current, total) => `Question ${current} / ${total}`,
  next: "Continue",
  back: "Back",
  seeResult: "See my score",
  restart: "Start over",
  resultTitle: "Indicative MiCA score",
  scoreLabel: "Out of 100",
  tierEarly: "Early — clarify structure and EU scope",
  tierProgress: "In progress — prioritize docs and investor profile",
  tierSolid: "Solid base — refine via wizard and counsel review",
  priorities: "Indicative priorities (max 3)",
  wizardCta: "Complete wizard — Compliance section",
  estimateCta: "Detailed readiness score",
  relatedTitle: "Go further",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Jurisdiction picker" },
    { href: "/tools/cost-estimator", label: "Tokenization cost estimator" },
    { href: "/tools/yield-calculator", label: "RWA yield calculator" },
    { href: "/jurisdictions", label: "Jurisdiction comparator" },
    { href: "/compare", label: "RWA yield comparator" },
    { href: "/trust", label: "Trust & compliance" },
  ],
  faqTitle: "Frequently asked questions",
  questions: FR.questions.map((q) => ({
    ...q,
    title:
      q.id === "issuerType"
        ? "Who will issue the token?"
        : q.id === "assetClass"
          ? "What type of token?"
          : q.id === "euNexus"
            ? "What is your EU nexus?"
            : q.id === "whitepaper"
              ? "Whitepaper status?"
              : "Target investors?",
    hint:
      q.id === "issuerType"
        ? "MiCA expects an identified issuer — SPV, fund or issuing company."
        : q.id === "assetClass"
          ? "ART, EMT or financial instrument — MiCA / prospectus rules differ."
          : q.id === "euNexus"
            ? "EU issuer, asset or investors trigger MiCA scope."
            : q.id === "whitepaper"
              ? "MiCA requires an issuer white paper for ART — draft is fine at this stage."
              : "EU retail strengthens prospectus, PRIIPs and marketing rules.",
    options: q.options.map((o) => ({
      ...o,
      label:
        o.value === "company_spv"
          ? "Company or dedicated SPV"
          : o.value === "existing_fund"
            ? "Existing fund or vehicle"
            : o.value === "individual"
              ? "Individual"
              : o.value === "unsure"
                ? "Not decided yet"
                : o.value === "financial_instrument"
                  ? "Debt or equity token"
                  : o.value === "art_utility"
                    ? "Real-world asset (ART) or utility"
                    : o.value === "e_money"
                      ? "Stablecoin / e-money token"
                      : o.value === "issuer_eu"
                        ? "Issuer established in the EU"
                        : o.value === "asset_eu"
                          ? "Asset located in the EU"
                          : o.value === "investors_eu"
                            ? "Target investors in the EU"
                            : o.value === "no_eu"
                              ? "No EU link planned"
                              : o.value === "ready"
                                ? "Finalized or in legal review"
                                : o.value === "draft"
                                  ? "Draft in progress"
                                  : o.value === "none"
                                    ? "Not started"
                                    : o.value === "professional"
                                      ? "Professional / qualified investors"
                                      : o.value === "retail"
                                        ? "Retail (general public)"
                                        : o.value === "mixed"
                                          ? "Mixed retail and professional"
                                          : o.label,
    })),
  })),
  recommendations: {
    issuer_structure:
      "Set up an SPV or issuing company before drafting the white paper.",
    issuer_governance:
      "Document fund governance and token issuer powers.",
    asset_emt:
      "Stablecoins fall under EMT — plan reserves, governance and CASP partner.",
    asset_classify:
      "Classify the token (ART, EMT or security) with counsel — foundation of the MiCA file.",
    asset_prospectus:
      "Anticipate prospectus or national exemptions if the token is a financial instrument.",
    asset_whitepaper:
      "Plan the ART white paper: risks, governance, holder rights.",
    eu_nexus:
      "Map issuer, asset and investors to confirm MiCA scope.",
    eu_casp:
      "Identify crypto services (custody, exchange) requiring CASP authorization.",
    eu_prospectus:
      "EU offering: align KYC, prospectus and marketing communications.",
    eu_optional:
      "No EU link today — document strategy before any European expansion.",
    whitepaper_draft:
      "Start a white paper draft — even partial, it speeds counsel review.",
    whitepaper_review:
      "Have a MiCA counsel review the draft before publication.",
    investor_retail:
      "Retail targeting: strengthen prospectus, PRIIPs and KYC/AML policy.",
    investor_define:
      "Define investor profile — it drives exemptions and documentation.",
    counsel: "Schedule MiCA counsel review before any public communication.",
  },
};

const ES: MicaCheckerCopy = {
  ...EN,
  eyebrow: "Herramienta gratuita · Cumplimiento",
  title: "Test MiCA — ¿estoy listo?",
  intro:
    "Cinco preguntas para estimar su madurez MiCA antes de estructurar un token RWA en Europa. Resultado indicativo en ~2 min — sin cuenta.",
  disclaimer:
    "Análisis indicativo, no asesoramiento jurídico — validación por counsel antes de cualquier oferta pública o en la UE.",
  timeHint: "~2 min · 5 preguntas",
  progress: (c, t) => `Pregunta ${c} / ${t}`,
  next: "Continuar",
  back: "Volver",
  seeResult: "Ver mi puntuación",
  restart: "Reiniciar",
  resultTitle: "Puntuación MiCA indicativa",
  scoreLabel: "Sobre 100",
  tierEarly: "Inicio — aclarar estructura y ámbito UE",
  tierProgress: "En progreso — priorizar documentación e inversores",
  tierSolid: "Buena base — afinar con wizard y revisión counsel",
  priorities: "Prioridades indicativas (máx. 3)",
  wizardCta: "Completar wizard — parte Conformidad",
  estimateCta: "Puntuación de preparación detallada",
  relatedTitle: "Profundizar",
  relatedLinks: [
    { href: "/tools/jurisdiction-picker", label: "Selector de jurisdicción" },
    { href: "/tools/cost-estimator", label: "Estimador coste tokenización" },
    { href: "/tools/yield-calculator", label: "Calculadora rendimiento RWA" },
    { href: "/jurisdictions", label: "Comparador jurisdicciones" },
    { href: "/compare", label: "Comparador rendimientos RWA" },
    { href: "/trust", label: "Confianza y cumplimiento" },
  ],
  faqTitle: "Preguntas frecuentes",
};

const COPY: Record<Locale, MicaCheckerCopy> = { fr: FR, en: EN, es: ES };

export function getMicaCheckerCopy(locale: Locale): MicaCheckerCopy {
  return COPY[locale] ?? FR;
}
