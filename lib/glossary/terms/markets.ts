import type { GlossaryTerm } from "../types";

export const MARKETS_TERMS: GlossaryTerm[] = [
  {
    slug: "rwa-real-world-asset",
    title: "RWA (Real World Asset)",
    titleEn: "RWA (Real World Asset)",
    category: "markets",
    shortDefinition:
      "Actif tangible ou financier du monde réel représenté ou adossé à un jeton blockchain.",
    extended:
      "Les RWA couvrent immobilier, dette privée, obligations, matières premières et actifs énergétiques. La tokenisation vise liquidité, fractionnalisation et rails de règlement programmables. La valeur repose sur l'ancrage juridique off-chain autant que sur la technologie.",
    relatedTerms: ["tokenisation", "rwa-token", "propriete-fractionnee"],
    internalLinks: [
      { href: "/compare", label: "Comparateur 120+ produits" },
      { href: "/discover", label: "Univers RWA AUROS" },
    ],
    faq: [
      {
        question: "Un RWA est-il toujours un crypto-actif MiCA ?",
        answer:
          "Pas nécessairement : la qualification dépend du jeton, du mode d'offre et de la juridiction. MiCA, droit des valeurs mobilières et exemptions nationales peuvent s'appliquer conjointement.",
      },
    ],
  },
  {
    slug: "tokenisation",
    title: "Tokenisation",
    category: "markets",
    shortDefinition:
      "Processus de création d'un jeton numérique matérialisant des droits sur un actif réel.",
    extended:
      "La tokenisation combine structuration juridique, documentation, technologie et distribution. AUROS découpe ce parcours en quatre parties : actif, stratégie, conformité, récap — pour réduire la charge cognitive. Le résultat n'est pas une promesse de listing ni d'agrément automatique.",
    relatedTerms: ["rwa-real-world-asset", "rwa-token", "data-room"],
    internalLinks: [
      { href: "/wizard", label: "Wizard gratuit" },
      { href: "/tools/cost-estimator", label: "Estimateur de coûts" },
      { href: "/how-it-works", label: "Comment ça marche" },
    ],
  },
  {
    slug: "propriete-fractionnee",
    title: "Propriété fractionnée",
    category: "markets",
    shortDefinition:
      "Découpage des droits économiques sur un actif en parts accessibles à de nombreux investisseurs.",
    extended:
      "La fractionnalisation abaisse le ticket minimum et élargit la base investisseurs. Elle s'appuie sur SPV, parts sociales ou jetons fongibles. Les règles de gouvernance collective et de revente doivent être explicites dès l'offre.",
    relatedTerms: ["fractional-nft", "spv", "marche-secondaire"],
    internalLinks: [{ href: "/real-estate", label: "Immobilier tokenisé" }],
  },
  {
    slug: "marche-primaire",
    title: "Marché primaire",
    category: "markets",
    shortDefinition:
      "Phase d'émission et de souscription initiale des jetons ou titres auprès des investisseurs.",
    extended:
      "Le primaire concentre marketing, KYC, collecte et mint initial. Les conditions (prix, minimum, closing) sont fixées dans l'OM ou le prospectus. Une fois le primaire clos, l'attention passe au registre et à la liquidité secondaire si prévue.",
    relatedTerms: ["souscription-rachat", "offering-memorandum", "marche-secondaire"],
    internalLinks: [{ href: "/wizard", label: "Préparer l'émission" }],
  },
  {
    slug: "marche-secondaire",
    title: "Marché secondaire",
    category: "markets",
    shortDefinition:
      "Échanges de jetons RWA entre investisseurs après l'émission primaire.",
    extended:
      "La liquidité secondaire RWA reste limitée vs crypto permissionless : plateformes ATS, OTC et pools permissionnés dominent. Les restrictions de transfert et le nombre d'investisseurs qualifiés structurent le volume. Promettre une liquidité équivalente aux grandes cryptos est trompeur.",
    relatedTerms: ["marche-primaire", "pool-liquidite", "transfer-restriction"],
    internalLinks: [{ href: "/compare", label: "Produits et plateformes" }],
  },
  {
    slug: "pool-liquidite",
    title: "Pool de liquidité",
    category: "markets",
    shortDefinition:
      "Réserve de jetons et stablecoins permettant échanges automatisés via smart contract (AMM).",
    extended:
      "Les pools DeFi sont rares pour security tokens régulés en raison des restrictions KYC. Certains RWA commodity ou stable yield utilisent des pools permissionnés. Risque de impermanent loss et de contrepartie à documenter pour investisseurs avertis.",
    relatedTerms: ["marche-secondaire", "tvl", "stablecoin"],
    internalLinks: [{ href: "/compare", label: "TVL des produits" }],
  },
  {
    slug: "tvl",
    title: "TVL (Total Value Locked)",
    category: "markets",
    shortDefinition:
      "Valeur totale des actifs déposés dans un protocole ou produit tokenisé — indicateur de taille, pas de qualité.",
    extended:
      "Le TVL agrège encours on-chain mais peut inclure double comptage ou leverage. Pour un RWA, croiser TVL avec actif réel audité et juridiction SPV. Le comparateur AUROS affiche TVL indicatif avec transparence sur les sources.",
    relatedTerms: ["aum", "distributeur-plateforme", "pool-liquidite"],
    internalLinks: [{ href: "/compare", label: "TVL comparateur" }],
  },
  {
    slug: "apy-rendement",
    title: "APY / Rendement",
    category: "markets",
    shortDefinition:
      "Taux de rendement annualisé affiché — souvent indicatif, avant frais, fiscalité et risque de défaut.",
    extended:
      "Les APY RWA proviennent de coupons, loyers ou rewards protocol. Ils fluctuent et peuvent inclure composants incitatifs temporaires. AUROS affiche des fourchettes indicatives et renvoie vers le calculateur pour contextualiser vs inflation.",
    relatedTerms: ["token-dividende", "nav-valeur-liquidative", "due-diligence"],
    internalLinks: [{ href: "/tools/yield-calculator", label: "Calculateur rendement" }],
  },
  {
    slug: "due-diligence",
    title: "Due diligence",
    category: "markets",
    shortDefinition:
      "Enquête documentaire et opérationnelle préalable à un investissement ou une labellisation.",
    extended:
      "La due diligence couvre juridique, financier, technique et compliance. Pour les RWA verts, AUROS Green ajoute la grille RTMS. Aucun score automatisé ne remplace l'analyse humaine avant engagement de capitaux.",
    relatedTerms: ["data-room", "kyc", "aml"],
    internalLinks: [
      { href: "/wizard", label: "Préparer le dossier" },
      { href: "/green/standards", label: "Grille RTMS" },
    ],
  },
  {
    slug: "kyc",
    title: "KYC (Know Your Customer)",
    category: "markets",
    shortDefinition:
      "Vérification d'identité et de profil d'investisseur avant souscription ou transfert.",
    extended:
      "Le KYC est obligatoire dans la plupart des émissions RWA régulées et alimente les whitelists on-chain. Données sensibles soumises au RGPD. Les processus doivent être clairs sur durée de conservation et droits des personnes.",
    relatedTerms: ["aml", "on-chain-identity", "rgpd-donnees-emetteur"],
    internalLinks: [{ href: "/trust", label: "Confiance & données" }],
  },
  {
    slug: "aml",
    title: "AML (Anti-Money Laundering)",
    category: "markets",
    shortDefinition:
      "Dispositifs de lutte contre le blanchiment : vigilance, déclarations et gel des avoirs.",
    extended:
      "Émetteurs et CASP doivent détecter flux suspects et tenir registres de vigilance. La tokenisation ne supprime pas les obligations LCB-FT nationales. Intégrer AML dès le design du parcours investisseur évite des blocages en phase de closing.",
    relatedTerms: ["kyc", "casp", "due-diligence"],
    internalLinks: [{ href: "/trust", label: "Cadre conformité" }],
  },
  {
    slug: "investisseur-qualifie",
    title: "Investisseur qualifié / averti",
    category: "markets",
    shortDefinition:
      "Investisseur répondant à critères légaux de expérience, patrimoine ou statut professionnel.",
    extended:
      "De nombreuses offres RWA se limitent aux qualifiés pour bénéficier d'exemptions prospectus. Les critères varient (MiFID, Reg D, etc.). L'auto-certification insuffit souvent — preuves et renouvellement périodique requis.",
    relatedTerms: ["offering-memorandum", "marche-primaire", "reverse-solicitation"],
    internalLinks: [{ href: "/jurisdictions", label: "Règles par pays" }],
  },
  {
    slug: "nav-valeur-liquidative",
    title: "NAV (Valeur liquidative)",
    category: "markets",
    shortDefinition:
      "Valeur par part ou par jeton calculée à partir de l'actif net du véhicule.",
    extended:
      "La NAV se calcule selon méthodologie publiée (évaluateur indépendant, mark-to-market). Pour un RWA, la fréquence et les frais de calcul doivent être dans la data room. Les oracles on-chain reprennent parfois la NAV off-chain avec délai.",
    relatedTerms: ["oracle-blockchain", "aum", "apy-rendement"],
    internalLinks: [{ href: "/compare", label: "Produits et métriques" }],
  },
  {
    slug: "souscription-rachat",
    title: "Souscription & rachat",
    category: "markets",
    shortDefinition:
      "Entrée (souscription) et sortie (rachat) des investisseurs dans un véhicule ou jeton RWA.",
    extended:
      "Les fenêtres de souscription/rachat peuvent être périodiques avec délais de settlement. Le mint/burn on-chain doit refléter ces flux avec contrôles opérationnels. Liquidité promise vs liquidité réelle est un point de vigilance investisseur.",
    relatedTerms: ["mint-et-burn", "agent-transfert", "marche-primaire"],
    internalLinks: [{ href: "/wizard", label: "Structurer les flux" }],
  },
  {
    slug: "aum",
    title: "AUM (Assets Under Management)",
    category: "markets",
    shortDefinition:
      "Encours total des actifs gérés par un véhicule, plateforme ou gestionnaire.",
    extended:
      "L'AUM mesure la taille d'un produit RWA hors blockchain. Le TVL on-chain peut différer si l'ancrage n'est pas 1:1 ou si plusieurs wrappers existent. Comparer les deux indicateurs fait partie de la due diligence.",
    relatedTerms: ["tvl", "nav-valeur-liquidative"],
    internalLinks: [{ href: "/compare", label: "Comparateur encours" }],
  },
  {
    slug: "prime-negociation",
    title: "Prime / décote (NAV)",
    category: "markets",
    shortDefinition:
      "Écart entre prix de marché secondaire et NAV ou valeur intrinsèque de l'actif.",
    extended:
      "Une prime signale une demande forte ou une liquidité faible ; une décote peut refléter risque perçu ou frictions de sortie. Les produits RWA illiquides affichent souvent des écarts importants. Transparence sur la méthode de calcul NAV est essentielle.",
    relatedTerms: ["nav-valeur-liquidative", "marche-secondaire"],
    internalLinks: [{ href: "/compare", label: "Prix marché" }],
  },
  {
    slug: "distributeur-plateforme",
    title: "Plateforme de distribution RWA",
    category: "markets",
    shortDefinition:
      "Intermédiaire présentant, qualifiant et routant les investisseurs vers des émissions tokenisées.",
    extended:
      "Les plateformes agrègent deals, gèrent KYC et parfois custody. Certaines sont CASP ou PSI selon activités. Les émetteurs évaluent coûts, juridictions couvertes et qualité due diligence avant listing. Le comparateur AUROS liste des produits éducatifs, pas des recommandations d'investissement.",
    relatedTerms: ["casp", "marche-primaire", "due-diligence"],
    internalLinks: [{ href: "/compare", label: "Explorer les plateformes" }],
  },
  {
    slug: "rwa-intelligence-layer",
    title: "RWA Intelligence Layer",
    category: "markets",
    shortDefinition:
      "Couche d'API et d'outils qui score, compare et documente un projet RWA avant émission — sans remplacer counsel ni marketplace réglementée.",
    extended:
      "AUROS Protocol est la RWA Intelligence Layer de référence : score MiCA, catalogue, compare, juridictions, Watts, ChargeFlow, Copilot et RAG. Définition : /guides/rwa-intelligence-layer.",
    relatedTerms: ["rwa-real-world-asset", "tokenisation", "mica"],
    internalLinks: [
      { href: "/guides/rwa-intelligence-layer", label: "Définition" },
      { href: "/developers", label: "AUROS Protocol" },
      { href: "/developers/institutions", label: "Institutions" },
      { href: "/copilot", label: "Copilot" },
    ],
  },
  {
    slug: "energie-nucleaire-rwa",
    title: "Énergie nucléaire (RWA / low-carbon)",
    category: "markets",
    shortDefinition:
      "Production nucléaire préparée comme actif bas-carbone via AUROS Power — hors label Green Verified renouvelable.",
    extended:
      "AUROS traite le nucléaire dans la verticale /power avec Watts (generation_source=nuclear) et CFU ChargeFlow. Ce n'est ni un GO/REC ni Green Verified. Guide : /guides/low-carbon-power et /comment-tokeniser/nucleaire.",
    relatedTerms: ["rwa-real-world-asset", "tokenisation", "booking-engine-watts"],
    internalLinks: [
      { href: "/power", label: "AUROS Power" },
      { href: "/guides/low-carbon-power", label: "Définition low-carbon" },
      { href: "/comment-tokeniser/nucleaire", label: "Guide nucléaire" },
    ],
    faq: [
      {
        question: "Nucléaire = Green Verified ?",
        answer:
          "Non. Green Verified reste renouvelable / RTMS. Utilisez AUROS Power et disclaimers low-carbon.",
      },
    ],
  },
];
