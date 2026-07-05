import type { Locale } from "@/lib/i18n";

export type CommentTokeniserSlug = "immobilier" | "art" | "fonds";

export type CommentTokeniserLanding = {
  slug: CommentTokeniserSlug;
  wizardAssetType: string;
  defaultValueEur: number;
  defaultCountry: string;
};

export type CommentTokeniserCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Max 3 — UX psychology */
  priorities: [string, string, string];
  parts: { label: string; detail: string }[];
  ctaWizard: string;
  ctaEstimate: string;
  ctaJurisdictions: string;
  defaultDescription: string;
};

const LANDINGS: CommentTokeniserLanding[] = [
  {
    slug: "immobilier",
    wizardAssetType: "Real estate",
    defaultValueEur: 1_500_000,
    defaultCountry: "France",
  },
  {
    slug: "art",
    wizardAssetType: "Fine art",
    defaultValueEur: 750_000,
    defaultCountry: "Luxembourg",
  },
  {
    slug: "fonds",
    wizardAssetType: "Other",
    defaultValueEur: 5_000_000,
    defaultCountry: "Luxembourg",
  },
];

const COPY: Record<CommentTokeniserSlug, Record<Locale, CommentTokeniserCopy>> = {
  immobilier: {
    fr: {
      title: "Comment tokeniser un immeuble ou actif immobilier | AUROS",
      description:
        "Guide indicatif pour préparer un dossier RWA immobilier en Europe : SPV, data room, MiCA et score d'admission plateforme — wizard gratuit AUROS.",
      h1: "Comment tokeniser un actif immobilier",
      intro:
        "AUROS structure l'amont réglementaire : qualification, data room 15 pièces et dossier indicatif — sans promesse de déploiement on-chain. Parcours en 4 parties, réversible, sans engagement.",
      priorities: [
        "Clarifier la structure (SPV, fonds, titres) et la juridiction cible avant la blockchain.",
        "Préparer 3 pièces prioritaires : titre de propriété, business plan, KYC émetteur.",
        "Tester votre score d'admission plateforme — indicatif, revue humaine AUROS.",
      ],
      parts: [
        { label: "Actif", detail: "Type, valeur, localisation — ~2 min" },
        { label: "Stratégie", detail: "Objectifs, plateforme cible, calendrier" },
        { label: "Conformité", detail: "MiCA, data room, profil investisseur" },
        { label: "Récap", detail: "Score admission, studio, PDF dossier" },
      ],
      ctaWizard: "Créer mon dossier immobilier",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Immeuble de bureaux ou retail en Europe, SPV dédié, investisseurs professionnels, data room en cours.",
    },
    en: {
      title: "How to tokenize real estate | AUROS",
      description:
        "Indicative guide to prepare a tokenized real estate dossier in Europe — SPV, data room, MiCA readiness and platform admission score.",
      h1: "How to tokenize real estate",
      intro:
        "AUROS structures the regulated upstream: qualification, 15-document data room and indicative dossier — no on-chain deployment promise. Four-part journey, reversible, no commitment.",
      priorities: [
        "Clarify structure (SPV, fund, securities) and target jurisdiction before blockchain.",
        "Prepare 3 priority documents: title, business plan, issuer KYC.",
        "Test your platform admission score — indicative, human AUROS review.",
      ],
      parts: [
        { label: "Asset", detail: "Type, value, location — ~2 min" },
        { label: "Strategy", detail: "Goals, target platform, timeline" },
        { label: "Compliance", detail: "MiCA, data room, investor profile" },
        { label: "Summary", detail: "Admission score, studio, PDF dossier" },
      ],
      ctaWizard: "Start my real estate dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "Office or retail building in Europe, dedicated SPV, professional investors, data room in progress.",
    },
    es: {
      title: "Cómo tokenizar inmobiliario | AUROS",
      description:
        "Guía indicativa para preparar un dossier RWA inmobiliario en Europa — SPV, data room, MiCA y puntuación de admisión.",
      h1: "Cómo tokenizar un activo inmobiliario",
      intro:
        "AUROS estructura la fase previa regulada: calificación, data room de 15 documentos y dossier indicativo — sin promesa de despliegue on-chain.",
      priorities: [
        "Aclarar estructura (SPV, fondo) y jurisdicción antes de la blockchain.",
        "Preparar 3 documentos prioritarios: título, plan de negocio, KYC emisor.",
        "Probar su puntuación de admisión — indicativo, revisión humana AUROS.",
      ],
      parts: [
        { label: "Activo", detail: "Tipo, valor, ubicación — ~2 min" },
        { label: "Estrategia", detail: "Objetivos, plataforma, calendario" },
        { label: "Cumplimiento", detail: "MiCA, data room, perfil inversor" },
        { label: "Resumen", detail: "Puntuación, estudio, PDF dossier" },
      ],
      ctaWizard: "Crear mi dossier inmobiliario",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Edificio de oficinas en Europa, SPV dedicado, inversores profesionales, data room en curso.",
    },
  },
  art: {
    fr: {
      title: "Comment tokeniser une œuvre d'art ou collection | AUROS",
      description:
        "Préparer un dossier RWA art & collectibles : provenance, custody, MiCA et admission plateforme — parcours wizard AUROS gratuit.",
      h1: "Comment tokeniser de l'art ou des collectibles",
      intro:
        "L'art tokenisé exige une traçabilité documentaire forte. AUROS vous guide sur la data room et la conformité indicatif — le déploiement reste chez plateformes et conseils.",
      priorities: [
        "Documenter la provenance et le custody (certificat, expert, assurance).",
        "Choisir la structure juridique adaptée (utility vs instrument financier).",
        "Valider la lisibilité du dossier pour investisseurs qualifiés.",
      ],
      parts: [
        { label: "Actif", detail: "Œuvre, collection, valeur estimée" },
        { label: "Stratégie", detail: "Offre, liquidité visée, plateforme" },
        { label: "Conformité", detail: "Provenance, KYC, classification MiCA" },
        { label: "Récap", detail: "Score, studio réglementaire, PDF" },
      ],
      ctaWizard: "Créer mon dossier art",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Collection d'art contemporain ou œuvre unique, provenance documentée, custody tiers, investisseurs professionnels EU.",
    },
    en: {
      title: "How to tokenize fine art & collectibles | AUROS",
      description:
        "Prepare an art RWA dossier: provenance, custody, MiCA and platform admission — free AUROS wizard.",
      h1: "How to tokenize art & collectibles",
      intro:
        "Tokenized art needs strong documentary traceability. AUROS guides your data room and indicative compliance — deployment stays with platforms and counsel.",
      priorities: [
        "Document provenance and custody (certificate, expert, insurance).",
        "Choose the right legal structure (utility vs financial instrument).",
        "Validate dossier clarity for qualified investors.",
      ],
      parts: [
        { label: "Asset", detail: "Work, collection, estimated value" },
        { label: "Strategy", detail: "Offering, liquidity goal, platform" },
        { label: "Compliance", detail: "Provenance, KYC, MiCA class" },
        { label: "Summary", detail: "Score, regulatory studio, PDF" },
      ],
      ctaWizard: "Start my art dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "Contemporary art collection or single work, documented provenance, third-party custody, EU professional investors.",
    },
    es: {
      title: "Cómo tokenizar arte y coleccionables | AUROS",
      description:
        "Preparar dossier RWA arte: procedencia, custodia, MiCA y admisión plataforma — wizard AUROS gratuito.",
      h1: "Cómo tokenizar arte y coleccionables",
      intro:
        "El arte tokenizado requiere trazabilidad documental sólida. AUROS guía su data room y cumplimiento indicativo.",
      priorities: [
        "Documentar procedencia y custodia (certificado, experto, seguro).",
        "Elegir estructura jurídica (utility vs instrumento financiero).",
        "Validar claridad del dossier para inversores cualificados.",
      ],
      parts: [
        { label: "Activo", detail: "Obra, colección, valor estimado" },
        { label: "Estrategia", detail: "Oferta, liquidez, plataforma" },
        { label: "Cumplimiento", detail: "Procedencia, KYC, MiCA" },
        { label: "Resumen", detail: "Puntuación, estudio, PDF" },
      ],
      ctaWizard: "Crear mi dossier arte",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Colección de arte contemporáneo, procedencia documentada, custodia terceros, inversores profesionales UE.",
    },
  },
  fonds: {
    fr: {
      title: "Comment tokeniser un fonds ou véhicule d'investissement | AUROS",
      description:
        "Structurer un dossier RWA fonds / private equity : prospectus, data room, MiCA et juridictions EU — wizard AUROS.",
      h1: "Comment tokeniser un fonds ou un véhicule",
      intro:
        "Fonds et parts tokenisées demandent un cadrage réglementaire clair. AUROS aide à préparer le dossier indicatif avant plateformes et conseils.",
      priorities: [
        "Identifier le type de parts (debt, equity, fund units) et l'investisseur cible.",
        "Aligner prospectus / note d'information et data room sur MiCA.",
        "Comparer Luxembourg, Irlande ou Suisse selon délai et budget.",
      ],
      parts: [
        { label: "Actif", detail: "Véhicule, stratégie, AUM indicatif" },
        { label: "Stratégie", detail: "Tokenomics, distribution, plateforme" },
        { label: "Conformité", detail: "Prospectus, KYC/AML, reporting" },
        { label: "Récap", detail: "Admission, studio, export PDF" },
      ],
      ctaWizard: "Créer mon dossier fonds",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Fonds immobilier ou private credit tokenisé, parts professionnelles EU, prospectus brouillon, SPV Luxembourg.",
    },
    en: {
      title: "How to tokenize a fund or investment vehicle | AUROS",
      description:
        "Structure an RWA fund dossier: prospectus, data room, MiCA and EU jurisdictions — AUROS wizard.",
      h1: "How to tokenize a fund or vehicle",
      intro:
        "Tokenized fund units need clear regulatory framing. AUROS helps prepare the indicative dossier before platforms and counsel.",
      priorities: [
        "Identify unit type (debt, equity, fund) and target investor profile.",
        "Align prospectus and data room with MiCA expectations.",
        "Compare Luxembourg, Ireland or Switzerland on timeline and budget.",
      ],
      parts: [
        { label: "Asset", detail: "Vehicle, strategy, indicative AUM" },
        { label: "Strategy", detail: "Tokenomics, distribution, platform" },
        { label: "Compliance", detail: "Prospectus, KYC/AML, reporting" },
        { label: "Summary", detail: "Admission, studio, PDF export" },
      ],
      ctaWizard: "Start my fund dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "Real estate or private credit fund tokenization, EU professional units, draft prospectus, Luxembourg SPV.",
    },
    es: {
      title: "Cómo tokenizar un fondo o vehículo | AUROS",
      description:
        "Estructurar dossier RWA fondos: folleto, data room, MiCA y jurisdicciones UE — wizard AUROS.",
      h1: "Cómo tokenizar un fondo o vehículo",
      intro:
        "Las participaciones tokenizadas requieren marco regulatorio claro. AUROS ayuda a preparar el dossier indicativo.",
      priorities: [
        "Identificar tipo de participaciones e inversor objetivo.",
        "Alinear folleto y data room con MiCA.",
        "Comparar Luxemburgo, Irlanda o Suiza según plazo y presupuesto.",
      ],
      parts: [
        { label: "Activo", detail: "Vehículo, estrategia, AUM indicativo" },
        { label: "Estrategia", detail: "Tokenomics, distribución, plataforma" },
        { label: "Cumplimiento", detail: "Folleto, KYC/AML, reporting" },
        { label: "Resumen", detail: "Admisión, estudio, PDF" },
      ],
      ctaWizard: "Crear mi dossier fondos",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Fondo inmobiliario tokenizado, partes profesionales UE, folleto borrador, SPV Luxemburgo.",
    },
  },
};

export function getAllCommentTokeniserLandings(): CommentTokeniserLanding[] {
  return LANDINGS;
}

export function getCommentTokeniserLanding(
  slug: string
): CommentTokeniserLanding | null {
  return LANDINGS.find((l) => l.slug === slug) ?? null;
}

export function getCommentTokeniserCopy(
  slug: CommentTokeniserSlug,
  locale: Locale
): CommentTokeniserCopy {
  return COPY[slug][locale] ?? COPY[slug].fr;
}

export function commentTokeniserPath(slug: CommentTokeniserSlug): string {
  return `/comment-tokeniser/${slug}`;
}

export function getCommentTokeniserDisclaimer(locale: Locale): string {
  const copy = {
    fr: "Indicatif uniquement — pas un conseil juridique, fiscal ou d'investissement.",
    en: "Indicative only — not legal, tax or investment advice.",
    es: "Solo indicativo — no es asesoramiento legal, fiscal ni de inversión.",
  } as const;
  return copy[locale] ?? copy.fr;
}
