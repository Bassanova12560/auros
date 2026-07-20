import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export type CommentTokeniserSlug =
  | "immobilier"
  | "art"
  | "fonds"
  | "obligations"
  | "credit-prive"
  | "energie"
  | "nucleaire"
  | "eau";

export type CommentTokeniserLanding = {
  slug: CommentTokeniserSlug;
  wizardAssetType: string;
  defaultValueEur: number;
  defaultCountry: string;
  /** Green wizard entry (?type=green&asset=renewable) for infra actifs */
  greenWizard?: boolean;
};

export type CommentTokeniserRevenueLink = {
  href: string;
  label: string;
  detail: string;
  trackId: string;
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
  /** Max 3 paid AUROS paths — infrastructure landings only */
  revenueLinks?: [
    CommentTokeniserRevenueLink,
    CommentTokeniserRevenueLink,
    CommentTokeniserRevenueLink,
  ];
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
  {
    slug: "obligations",
    wizardAssetType: "Other",
    defaultValueEur: 3_000_000,
    defaultCountry: "Luxembourg",
  },
  {
    slug: "credit-prive",
    wizardAssetType: "Private equity / SME shares",
    defaultValueEur: 2_000_000,
    defaultCountry: "Luxembourg",
  },
  {
    slug: "energie",
    wizardAssetType: "Renewable energy",
    defaultValueEur: 4_000_000,
    defaultCountry: "France",
    greenWizard: true,
  },
  {
    slug: "nucleaire",
    wizardAssetType: "Other",
    defaultValueEur: 50_000_000,
    defaultCountry: "France",
  },
  {
    slug: "eau",
    wizardAssetType: "Renewable energy",
    defaultValueEur: 3_500_000,
    defaultCountry: "France",
    greenWizard: true,
  },
];

const COPY: Record<CommentTokeniserSlug, CatalogMap< CommentTokeniserCopy>> = {
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
  obligations: {
    fr: {
      title: "Comment tokeniser des obligations ou titres de créance | AUROS",
      description:
        "Guide indicatif pour structurer un dossier RWA obligations en Europe : prospectus, data room, MiCA et admission plateforme — wizard AUROS gratuit.",
      h1: "Comment tokeniser des obligations",
      intro:
        "Les obligations tokenisées relèvent souvent d'un cadre titres financiers. AUROS vous aide à préparer le dossier indicatif — qualification, data room et score d'admission — avant conseils et plateformes.",
      priorities: [
        "Confirmer la qualification (titres vs utility) et le profil investisseur cible.",
        "Aligner prospectus / note d'information et 3 pièces prioritaires de la data room.",
        "Comparer Luxembourg, Irlande ou Suisse selon délai et coût de structuration.",
      ],
      parts: [
        { label: "Actif", detail: "Émission, nominal, devise — ~2 min" },
        { label: "Stratégie", detail: "Distribution, liquidité, plateforme cible" },
        { label: "Conformité", detail: "Prospectus, MiCA, KYC/AML émetteur" },
        { label: "Récap", detail: "Score admission, studio, PDF dossier" },
      ],
      ctaWizard: "Créer mon dossier obligations",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Émission obligataire corporate EU, investisseurs professionnels, prospectus brouillon, SPV Luxembourg, data room en cours.",
    },
    en: {
      title: "How to tokenize bonds or debt securities | AUROS",
      description:
        "Indicative guide to structure a tokenized bonds RWA dossier in Europe — prospectus, data room, MiCA and platform admission score.",
      h1: "How to tokenize bonds",
      intro:
        "Tokenized bonds often fall under securities regulation. AUROS helps prepare the indicative dossier — qualification, data room and admission score — before counsel and platforms.",
      priorities: [
        "Confirm qualification (securities vs utility) and target investor profile.",
        "Align prospectus and 3 priority data room documents.",
        "Compare Luxembourg, Ireland or Switzerland on timeline and structuring cost.",
      ],
      parts: [
        { label: "Asset", detail: "Issuance, nominal, currency — ~2 min" },
        { label: "Strategy", detail: "Distribution, liquidity, target platform" },
        { label: "Compliance", detail: "Prospectus, MiCA, issuer KYC/AML" },
        { label: "Summary", detail: "Admission score, studio, PDF dossier" },
      ],
      ctaWizard: "Start my bonds dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "EU corporate bond issuance, professional investors, draft prospectus, Luxembourg SPV, data room in progress.",
    },
    es: {
      title: "Cómo tokenizar bonos u obligaciones | AUROS",
      description:
        "Guía indicativa para estructurar un dossier RWA de bonos en Europa — folleto, data room, MiCA y puntuación de admisión.",
      h1: "Cómo tokenizar obligaciones",
      intro:
        "Los bonos tokenizados suelen encajar en regulación de valores. AUROS ayuda a preparar el dossier indicativo antes de asesores y plataformas.",
      priorities: [
        "Confirmar calificación (valores vs utility) e inversor objetivo.",
        "Alinear folleto y 3 documentos prioritarios de la data room.",
        "Comparar Luxemburgo, Irlanda o Suiza según plazo y coste.",
      ],
      parts: [
        { label: "Activo", detail: "Emisión, nominal, divisa — ~2 min" },
        { label: "Estrategia", detail: "Distribución, liquidez, plataforma" },
        { label: "Cumplimiento", detail: "Folleto, MiCA, KYC/AML emisor" },
        { label: "Resumen", detail: "Puntuación, estudio, PDF dossier" },
      ],
      ctaWizard: "Crear mi dossier obligaciones",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Emisión de bonos corporativos UE, inversores profesionales, folleto borrador, SPV Luxemburgo, data room en curso.",
    },
  },
  "credit-prive": {
    fr: {
      title: "Comment tokeniser du crédit privé | AUROS",
      description:
        "Préparer un dossier RWA crédit privé : structuration, data room, MiCA et admission plateforme — parcours wizard AUROS gratuit.",
      h1: "Comment tokeniser du crédit privé",
      intro:
        "Le crédit privé tokenisé combine structuration dette et conformité investisseurs qualifiés. AUROS structure l'amont réglementaire indicatif — sans promesse de déploiement on-chain.",
      priorities: [
        "Clarifier le véhicule (fonds dette, prêt direct, parts tokenisées) et la juridiction.",
        "Préparer 3 pièces prioritaires : term sheet, KYC emprunteur, politique risque crédit.",
        "Tester le score d'admission plateforme — indicatif, revue humaine AUROS.",
      ],
      parts: [
        { label: "Actif", detail: "Type de dette, ticket, durée" },
        { label: "Stratégie", detail: "Investisseurs cibles, rendement, plateforme" },
        { label: "Conformité", detail: "MiCA, data room, profil investisseur qualifié" },
        { label: "Récap", detail: "Score, studio réglementaire, PDF" },
      ],
      ctaWizard: "Créer mon dossier crédit privé",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Fonds de crédit privé mid-market EU, parts professionnelles, term sheet brouillon, SPV Luxembourg, data room en cours.",
    },
    en: {
      title: "How to tokenize private credit | AUROS",
      description:
        "Prepare a private credit RWA dossier: structuring, data room, MiCA and platform admission — free AUROS wizard.",
      h1: "How to tokenize private credit",
      intro:
        "Tokenized private credit blends debt structuring and qualified-investor compliance. AUROS structures the indicative regulated upstream — no on-chain deployment promise.",
      priorities: [
        "Clarify vehicle (debt fund, direct loan, tokenized units) and jurisdiction.",
        "Prepare 3 priority documents: term sheet, borrower KYC, credit risk policy.",
        "Test platform admission score — indicative, human AUROS review.",
      ],
      parts: [
        { label: "Asset", detail: "Debt type, ticket size, tenor" },
        { label: "Strategy", detail: "Target investors, yield, platform" },
        { label: "Compliance", detail: "MiCA, data room, qualified investor profile" },
        { label: "Summary", detail: "Score, regulatory studio, PDF" },
      ],
      ctaWizard: "Start my private credit dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "EU mid-market private credit fund, professional units, draft term sheet, Luxembourg SPV, data room in progress.",
    },
    es: {
      title: "Cómo tokenizar crédito privado | AUROS",
      description:
        "Preparar dossier RWA crédito privado: estructuración, data room, MiCA y admisión plataforma — wizard AUROS gratuito.",
      h1: "Cómo tokenizar crédito privado",
      intro:
        "El crédito privado tokenizado combina estructuración de deuda y cumplimiento para inversores cualificados. AUROS estructura la fase previa regulada indicativa.",
      priorities: [
        "Aclarar vehículo (fondo deuda, préstamo directo, participaciones tokenizadas) y jurisdicción.",
        "Preparar 3 documentos prioritarios: term sheet, KYC prestatario, política de riesgo.",
        "Probar puntuación de admisión — indicativo, revisión humana AUROS.",
      ],
      parts: [
        { label: "Activo", detail: "Tipo de deuda, ticket, plazo" },
        { label: "Estrategia", detail: "Inversores, rendimiento, plataforma" },
        { label: "Cumplimiento", detail: "MiCA, data room, inversor cualificado" },
        { label: "Resumen", detail: "Puntuación, estudio, PDF" },
      ],
      ctaWizard: "Crear mi dossier crédito privado",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Fondo de crédito privado mid-market UE, partes profesionales, term sheet borrador, SPV Luxemburgo, data room en curso.",
    },
  },
  energie: {
    fr: {
      title: "Comment tokeniser un actif énergie ou renouvelable | AUROS",
      description:
        "Guide indicatif RWA énergie : parc solaire, éolien, Green RTMS, data room et MiCA — wizard AUROS avec scoring Watt intégré.",
      h1: "Comment tokeniser un actif énergie",
      intro:
        "L'énergie renouvelable tokenisée exige traçabilité technique et conformité Green. AUROS combine wizard dossier, score Watt et RTMS indicatif — déploiement on-chain chez plateformes et conseils.",
      priorities: [
        "Documenter la capacité installée, les contrats PPA/offtake et la localisation.",
        "Préparer 3 pièces prioritaires : due diligence technique, KYC SPV, reporting carbone.",
        "Explorer le score Watt et l'admission plateforme — indicatif, revue humaine AUROS.",
      ],
      parts: [
        { label: "Actif", detail: "Technologie, MW, pays — ~2 min" },
        { label: "Stratégie", detail: "Investisseurs, Green label, plateforme" },
        { label: "Conformité", detail: "MiCA, CSRD, data room, RTMS" },
        { label: "Récap", detail: "Watt score, studio Green, PDF dossier" },
      ],
      ctaWizard: "Créer mon dossier énergie",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Parc solaire 25 MW en France, PPA signé, SPV dédié, reporting carbone en cours, investisseurs professionnels EU.",
    },
    en: {
      title: "How to tokenize renewable energy assets | AUROS",
      description:
        "Indicative RWA energy guide: solar, wind, Green RTMS, data room and MiCA — AUROS wizard with integrated Watt scoring.",
      h1: "How to tokenize energy assets",
      intro:
        "Tokenized renewable energy needs technical traceability and Green compliance. AUROS combines dossier wizard, Watt score and indicative RTMS — on-chain deployment stays with platforms and counsel.",
      priorities: [
        "Document installed capacity, PPA/offtake contracts and location.",
        "Prepare 3 priority documents: technical due diligence, SPV KYC, carbon reporting.",
        "Explore Watt score and platform admission — indicative, human AUROS review.",
      ],
      parts: [
        { label: "Asset", detail: "Technology, MW, country — ~2 min" },
        { label: "Strategy", detail: "Investors, Green label, platform" },
        { label: "Compliance", detail: "MiCA, CSRD, data room, RTMS" },
        { label: "Summary", detail: "Watt score, Green studio, PDF dossier" },
      ],
      ctaWizard: "Start my energy dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "25 MW solar park in France, signed PPA, dedicated SPV, carbon reporting in progress, EU professional investors.",
    },
    es: {
      title: "Cómo tokenizar activos de energía renovable | AUROS",
      description:
        "Guía indicativa RWA energía: solar, eólico, Green RTMS, data room y MiCA — wizard AUROS con puntuación Watt integrada.",
      h1: "Cómo tokenizar activos de energía",
      intro:
        "La energía renovable tokenizada requiere trazabilidad técnica y cumplimiento Green. AUROS combina wizard dossier, puntuación Watt y RTMS indicativo.",
      priorities: [
        "Documentar capacidad instalada, contratos PPA/offtake y ubicación.",
        "Preparar 3 documentos prioritarios: due diligence técnica, KYC SPV, reporting carbono.",
        "Explorar puntuación Watt y admisión plataforma — indicativo, revisión humana AUROS.",
      ],
      parts: [
        { label: "Activo", detail: "Tecnología, MW, país — ~2 min" },
        { label: "Estrategia", detail: "Inversores, etiqueta Green, plataforma" },
        { label: "Cumplimiento", detail: "MiCA, CSRD, data room, RTMS" },
        { label: "Resumen", detail: "Puntuación Watt, estudio Green, PDF dossier" },
      ],
      ctaWizard: "Crear mi dossier energía",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Parque solar 25 MW en Francia, PPA firmado, SPV dedicado, reporting carbono en curso, inversores profesionales UE.",
    },
  },
  nucleaire: {
    fr: {
      title: "Comment tokeniser un actif nucléaire / bas-carbone | AUROS",
      description:
        "Guide indicatif RWA low-carbon : nucléaire, hydro, mix — Watts + CFU, hors label Green Verified. Wizard AUROS dossier admission.",
      h1: "Comment préparer un dossier nucléaire / low-carbon",
      intro:
        "Le nucléaire n'entre pas dans AUROS Green Verified (renouvelable). AUROS Power + Watts + ChargeFlow permettent de réserver, prouver et documenter — analyses indicatives, counsel requis.",
      priorities: [
        "Séparer clairement low-carbon / nucléaire de Green Verified renouvelable.",
        "Utiliser generation_source=nuclear sur Watts / CFU — claim technologique, pas GO/REC.",
        "Structurer le dossier via wizard (actif Other) + API Protocol pour banques.",
      ],
      parts: [
        { label: "Actif", detail: "Technologie, MW, pays — ~2 min" },
        { label: "Stratégie", detail: "Investisseurs, SPV, calendrier" },
        { label: "Conformité", detail: "MiCA, data room, disclaimers low-carbon" },
        { label: "Récap", detail: "Score admission, PDF dossier" },
      ],
      ctaWizard: "Créer mon dossier",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Actif de production nucléaire / bas-carbone en France, SPV dédié, investisseurs professionnels, data room réglementaire en cours — hors label Green Verified.",
      revenueLinks: [
        {
          href: "/power",
          label: "Hub AUROS Power",
          detail: "Low-carbon & nucléaire",
          trackId: "ct-nucleaire-power",
        },
        {
          href: "/green/watts",
          label: "Watts Reserve",
          detail: "Booking + CFU",
          trackId: "ct-nucleaire-watts",
        },
        {
          href: "/developers/institutions",
          label: "API institutions",
          detail: "Export CFU + OpenAPI",
          trackId: "ct-nucleaire-api",
        },
      ],
    },
    en: {
      title: "How to tokenize nuclear / low-carbon power | AUROS",
      description:
        "Indicative low-carbon RWA guide: nuclear, hydro, mix — Watts + CFU, outside Green Verified. AUROS wizard admission dossier.",
      h1: "How to prepare a nuclear / low-carbon dossier",
      intro:
        "Nuclear is not AUROS Green Verified (renewables). AUROS Power + Watts + ChargeFlow help reserve, prove and document — indicative only, counsel required.",
      priorities: [
        "Keep low-carbon / nuclear clearly separate from Green Verified renewables.",
        "Use generation_source=nuclear on Watts / CFU — technology claim, not GO/REC.",
        "Structure the dossier via wizard (Other asset) + Protocol API for banks.",
      ],
      parts: [
        { label: "Asset", detail: "Technology, MW, country — ~2 min" },
        { label: "Strategy", detail: "Investors, SPV, timeline" },
        { label: "Compliance", detail: "MiCA, data room, low-carbon disclaimers" },
        { label: "Summary", detail: "Admission score, PDF dossier" },
      ],
      ctaWizard: "Start my dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "Nuclear / low-carbon generation asset in France, dedicated SPV, professional investors, regulatory data room in progress — outside Green Verified.",
      revenueLinks: [
        {
          href: "/power",
          label: "AUROS Power hub",
          detail: "Low-carbon & nuclear",
          trackId: "ct-nucleaire-power",
        },
        {
          href: "/green/watts",
          label: "Watts Reserve",
          detail: "Booking + CFU",
          trackId: "ct-nucleaire-watts",
        },
        {
          href: "/developers/institutions",
          label: "Institutions API",
          detail: "CFU export + OpenAPI",
          trackId: "ct-nucleaire-api",
        },
      ],
    },
    es: {
      title: "Cómo tokenizar energía nuclear / low-carbon | AUROS",
      description:
        "Guía indicativa RWA low-carbon: nuclear, hidro, mix — Watts + CFU, fuera de Green Verified. Wizard AUROS.",
      h1: "Cómo preparar un dossier nuclear / low-carbon",
      intro:
        "Lo nuclear no entra en AUROS Green Verified (renovable). AUROS Power + Watts + ChargeFlow permiten reservar, probar y documentar — indicativo, counsel requerido.",
      priorities: [
        "Separar claramente low-carbon / nuclear de Green Verified renovable.",
        "Usar generation_source=nuclear en Watts / CFU — claim tecnológico, no GO/REC.",
        "Estructurar el dossier vía wizard (activo Other) + API Protocol para bancos.",
      ],
      parts: [
        { label: "Activo", detail: "Tecnología, MW, país — ~2 min" },
        { label: "Estrategia", detail: "Inversores, SPV, calendario" },
        { label: "Cumplimiento", detail: "MiCA, data room, disclaimers" },
        { label: "Resumen", detail: "Score admisión, PDF dossier" },
      ],
      ctaWizard: "Crear mi dossier",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Activo de generación nuclear / low-carbon en Francia, SPV dedicado, inversores profesionales — fuera de Green Verified.",
      revenueLinks: [
        {
          href: "/power",
          label: "Hub AUROS Power",
          detail: "Low-carbon y nuclear",
          trackId: "ct-nucleaire-power",
        },
        {
          href: "/green/watts",
          label: "Watts Reserve",
          detail: "Booking + CFU",
          trackId: "ct-nucleaire-watts",
        },
        {
          href: "/developers/institutions",
          label: "API instituciones",
          detail: "Export CFU + OpenAPI",
          trackId: "ct-nucleaire-api",
        },
      ],
    },
  },
  eau: {
    fr: {
      title: "Comment tokeniser l'eau : droits, hydrique & blue bonds | AUROS",
      description:
        "Guide indicatif RWA hydrique : droits d'eau, dessalement, barrages, contrats m³ et Taxonomie EU — wizard AUROS, Watt Score et Label Green.",
      h1: "Comment tokeniser un actif hydrique",
      intro:
        "L'eau tokenisée (droits d'usage, concessions, infra dessalement ou hydro) exige des flux mesurables et un cadre ESG crédible. AUROS structure le dossier indicatif en 4 parties — scoring Watt, RTMS et revue documentaire en option, sans promesse de déploiement on-chain.",
      priorities: [
        "Ancrer le contrat économique : volume m³/an, durée, indexation et contrepartie investisseur qualifié.",
        "Préparer 3 pièces prioritaires : titre/concession, audit hydrologique, reporting eau & DNSH Taxonomie.",
        "Tester le score d'admission et le Watt Score indicatif — revue humaine AUROS sur dossier soumis.",
      ],
      parts: [
        { label: "Actif", detail: "Type hydrique, capacité m³, pays — ~2 min" },
        { label: "Stratégie", detail: "Blue bond, SPV, investisseurs, calendrier" },
        { label: "Conformité", detail: "MiCA, CSRD, data room, RTMS eau" },
        { label: "Récap", detail: "Watt score, studio Green, PDF dossier" },
      ],
      ctaWizard: "Créer mon dossier hydrique",
      ctaEstimate: "Score rapide gratuit",
      ctaJurisdictions: "Comparer les juridictions",
      defaultDescription:
        "Concession eau potable 15 ans, débit contractuel 2 Mm³/an, SPV France, reporting hydrique et Taxonomie EU en cours, investisseurs institutionnels.",
      revenueLinks: [
        {
          href: "/eau",
          label: "Passeport Hydrique AUROS",
          detail: "H₂O Score + readiness vérifiable — rail infra avant toute émission.",
          trackId: "h2o_passport",
        },
        {
          href: "/green/label",
          label: "Label Green Verified",
          detail: "Revue documentaire complète du dossier infra — candidature en ligne.",
          trackId: "green_label",
        },
        {
          href: "/developers/docs/endpoint-green-h2o",
          label: "API H₂O Score",
          detail: "Scoring batch concessions & blue bonds — clé API premium.",
          trackId: "h2o_api",
        },
      ],
    },
    en: {
      title: "How to tokenize water assets: rights, hydro & blue bonds | AUROS",
      description:
        "Indicative water RWA guide: water rights, desalination, hydro, m³ contracts and EU Taxonomy — AUROS wizard, Watt Score and Green Label.",
      h1: "How to tokenize water & hydrological assets",
      intro:
        "Tokenized water (usage rights, concessions, desalination or hydro infra) needs measurable flows and credible ESG framing. AUROS structures the indicative dossier in four parts — optional Watt scoring, RTMS and document review, no on-chain deployment promise.",
      priorities: [
        "Anchor the economic contract: m³/year volume, tenor, indexation and qualified-investor counterparty.",
        "Prepare 3 priority documents: title/concession, hydrological audit, water & DNSH Taxonomy reporting.",
        "Test admission score and indicative Watt Score — human AUROS review on submitted dossier.",
      ],
      parts: [
        { label: "Asset", detail: "Water type, m³ capacity, country — ~2 min" },
        { label: "Strategy", detail: "Blue bond, SPV, investors, timeline" },
        { label: "Compliance", detail: "MiCA, CSRD, data room, water RTMS" },
        { label: "Summary", detail: "Watt score, Green studio, PDF dossier" },
      ],
      ctaWizard: "Start my water dossier",
      ctaEstimate: "Free quick score",
      ctaJurisdictions: "Compare jurisdictions",
      defaultDescription:
        "15-year drinking-water concession, 2 Mm³/year contracted flow, France SPV, hydrological and EU Taxonomy reporting in progress, institutional investors.",
      revenueLinks: [
        {
          href: "/eau",
          label: "AUROS Hydrological Passport",
          detail: "H₂O Score + verifiable readiness — infra rail before any issuance.",
          trackId: "h2o_passport",
        },
        {
          href: "/green/label",
          label: "Green Verified label",
          detail: "Full documentary review of infra dossier — apply online.",
          trackId: "green_label",
        },
        {
          href: "/developers/docs/endpoint-green-h2o",
          label: "H₂O Score API",
          detail: "Batch scoring concessions & blue bonds — premium API key.",
          trackId: "h2o_api",
        },
      ],
    },
    es: {
      title: "Cómo tokenizar el agua: derechos, hidráulica y blue bonds | AUROS",
      description:
        "Guía indicativa RWA hídrica: derechos de agua, desalinización, presas, contratos m³ y Taxonomía UE — wizard AUROS, Watt Score y Label Green.",
      h1: "Cómo tokenizar un activo hídrico",
      intro:
        "El agua tokenizada (derechos de uso, concesiones, desalinización o infra hidro) exige flujos medibles y marco ESG creíble. AUROS estructura el dossier indicativo en 4 partes — scoring Watt, RTMS y revisión documental opcionales, sin promesa de despliegue on-chain.",
      priorities: [
        "Anclar el contrato económico: volumen m³/año, plazo, indexación e inversor cualificado.",
        "Preparar 3 documentos prioritarios: título/concesión, auditoría hidrológica, reporting agua y DNSH Taxonomía.",
        "Probar puntuación de admisión y Watt Score indicativo — revisión humana AUROS al enviar dossier.",
      ],
      parts: [
        { label: "Activo", detail: "Tipo hídrico, capacidad m³, país — ~2 min" },
        { label: "Estrategia", detail: "Blue bond, SPV, inversores, calendario" },
        { label: "Cumplimiento", detail: "MiCA, CSRD, data room, RTMS agua" },
        { label: "Resumen", detail: "Puntuación Watt, estudio Green, PDF dossier" },
      ],
      ctaWizard: "Crear mi dossier hídrico",
      ctaEstimate: "Puntuación rápida gratis",
      ctaJurisdictions: "Comparar jurisdicciones",
      defaultDescription:
        "Concesión agua potable 15 años, caudal contractual 2 Mm³/año, SPV Francia, reporting hídrico y Taxonomía UE en curso, inversores institucionales.",
      revenueLinks: [
        {
          href: "/eau",
          label: "Pasaporte Hídrico AUROS",
          detail: "H₂O Score + readiness verificable — raíl infra antes de emitir.",
          trackId: "h2o_passport",
        },
        {
          href: "/green/label",
          label: "Label Green Verified",
          detail: "Revisión documental completa del dossier infra — candidatura online.",
          trackId: "green_label",
        },
        {
          href: "/developers/docs/endpoint-green-h2o",
          label: "API H₂O Score",
          detail: "Scoring batch concesiones y blue bonds — clave API premium.",
          trackId: "h2o_api",
        },
      ],
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
  return COPY[slug][resolveCatalogLocale(locale)] ?? COPY[slug].fr;
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
  return copy[resolveCatalogLocale(locale)] ?? copy.fr;
}
