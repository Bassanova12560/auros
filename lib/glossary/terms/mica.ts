import type { GlossaryTerm } from "../types";

export const MICA_TERMS: GlossaryTerm[] = [
  {
    slug: "mica",
    title: "MiCA (Markets in Crypto-Assets)",
    titleEn: "MiCA (Markets in Crypto-Assets)",
    category: "mica",
    shortDefinition:
      "Règlement européen harmonisant l'émission, l'offre et les services sur crypto-actifs au sein de l'UE.",
    extended:
      "MiCA (Règlement UE 2023/1114) fixe un cadre commun pour les émetteurs de jetons et les prestataires de services sur crypto-actifs (CASP). Pour un RWA européen, il structure notamment les obligations de whitepaper, de gouvernance et d'agrément selon la nature du jeton. L'analyse reste indicative : seul un counsel qualifié peut qualifier votre projet avant toute offre.",
    relatedTerms: ["whitepaper-mica", "casp", "art-asset-referenced-token", "emt-e-money-token"],
    internalLinks: [
      { href: "/tools/mica-checker", label: "Test MiCA indicatif" },
      { href: "/trust", label: "Confiance & conformité AUROS" },
      { href: "/wizard", label: "Wizard tokenisation" },
    ],
    faq: [
      {
        question: "MiCA s'applique-t-il à tous les jetons RWA ?",
        answer:
          "Le périmètre dépend de la qualification du jeton (utility, ART, EMT, security token hors MiCA…). Une analyse au cas par cas par counsel est indispensable avant émission en UE.",
      },
    ],
  },
  {
    slug: "casp",
    title: "CASP (Crypto-Asset Service Provider)",
    titleEn: "CASP (Crypto-Asset Service Provider)",
    category: "mica",
    shortDefinition:
      "Prestataire de services sur crypto-actifs soumis à agrément national sous MiCA (custody, exchange, conseil…).",
    extended:
      "Un CASP agréé peut proposer custody, échange, placement ou conseil sur crypto-actifs selon son périmètre d'agrément. Pour un émetteur RWA, identifier si des intermédiaires du parcours sont des CASP conditionne la conformité marketing et la chaîne de distribution. AUROS aide à cartographier ces rôles dans le dossier — sans se substituer à l'agrément.",
    relatedTerms: ["mica", "significant-casp", "custody-crypto-actifs", "marketing-crypto-actifs"],
    internalLinks: [
      { href: "/tools/mica-checker", label: "Test MiCA" },
      { href: "/jurisdictions", label: "Comparateur juridictions" },
    ],
  },
  {
    slug: "art-asset-referenced-token",
    title: "ART (Asset-Referenced Token)",
    category: "mica",
    shortDefinition:
      "Jeton crypto visant à maintenir une valeur stable par référence à un panier d'actifs ou de droits.",
    extended:
      "Les ART sous MiCA sont soumis à des exigences d'émission, de réserves et de gouvernance spécifiques. Certains RWA structurés comme des parts adossées à un actif réel peuvent entrer dans cette logique selon leur mécanisme — qualification juridique requise. Le whitepaper MiCA et les réserves constituent le cœur documentaire attendu.",
    relatedTerms: ["emt-e-money-token", "stablecoin", "whitepaper-mica", "mica"],
    internalLinks: [
      { href: "/tools/mica-checker", label: "Test MiCA" },
      { href: "/compare", label: "Comparateur RWA" },
    ],
  },
  {
    slug: "emt-e-money-token",
    title: "EMT (E-Money Token)",
    category: "mica",
    shortDefinition:
      "Jeton représentant une créance numérique sur de la monnaie électronique au sens de la directive 2009/110/CE.",
    extended:
      "Les EMT se distinguent des ART par leur ancrage sur une seule monnaie fiduciaire. En RWA, peu de projets purs EMT existent, mais la frontière avec stablecoins régulés est un point de vigilance pour les émetteurs multi-actifs. L'agrément établissement de monnaie électronique ou partenariat EMI peut être requis.",
    relatedTerms: ["art-asset-referenced-token", "stablecoin", "mica"],
    internalLinks: [{ href: "/compare", label: "Stablecoins — comparateur" }],
  },
  {
    slug: "utility-token-mica",
    title: "Jeton utilitaire (MiCA)",
    category: "mica",
    shortDefinition:
      "Crypto-actif donnant accès numérique à un bien ou service, sans être un instrument financier.",
    extended:
      "Sous MiCA, le jeton utilitaire non financier peut être soumis à obligations de whitepaper selon le seuil et le mode d'offre. Beaucoup de RWA « utility » restent analysés aussi sous le droit des valeurs mobilières nationales. La double qualification (MiCA + droit financier local) est fréquente — ne pas présumer une échappatoire réglementaire.",
    relatedTerms: ["security-token", "whitepaper-mica", "rwa-token"],
    internalLinks: [
      { href: "/tools/mica-checker", label: "Test MiCA" },
      { href: "/wizard", label: "Wizard gratuit" },
    ],
  },
  {
    slug: "whitepaper-mica",
    title: "Whitepaper MiCA",
    category: "mica",
    shortDefinition:
      "Document d'information réglementé décrivant l'émetteur, le jeton, les risques et les droits des détenteurs.",
    extended:
      "Le whitepaper MiCA est le document central pour une offre publique de crypto-actifs soumise au règlement. Il doit être clair, équilibré et mis à jour en cas de fait nouveau significatif. AUROS structure une data room complémentaire (15 pièces indicatives) pour préparer ce niveau de transparence.",
    relatedTerms: ["mica", "prospectus", "data-room", "prospectus-eu"],
    internalLinks: [
      { href: "/wizard", label: "Préparer le dossier" },
      { href: "/tools/mica-checker", label: "Test MiCA" },
    ],
    faq: [
      {
        question: "Le whitepaper MiCA remplace-t-il un prospectus financier ?",
        answer:
          "Non nécessairement. Si le jeton est qualifié valeur mobilière, des exigences prospectus ou exemptions nationales peuvent s'ajouter. Counsel requis.",
      },
    ],
  },
  {
    slug: "passporting-europeen",
    title: "Passeport européen (MiCA)",
    category: "mica",
    shortDefinition:
      "Mécanisme permettant à un agrément obtenu dans un État membre d'être reconnu dans les autres États UE.",
    extended:
      "Un CASP ou un émetteur peut, sous conditions, commercialiser dans toute l'UE après agrément dans un État membre de référence. Le choix de juridiction d'ancrage (Luxembourg, France, Allemagne…) impacte délais et coûts. Le comparateur AUROS aide à comparer ces paramètres de façon indicative.",
    relatedTerms: ["mica", "casp", "cssf-luxembourg", "amf-france"],
    internalLinks: [
      { href: "/jurisdictions", label: "8 juridictions comparées" },
      { href: "/tools/cost-estimator", label: "Estimateur de coûts" },
    ],
  },
  {
    slug: "significant-casp",
    title: "CASP significatif",
    category: "mica",
    shortDefinition:
      "CASP dépassant des seuils d'activité déclenchant une supervision renforcée au niveau européen (EBA).",
    extended:
      "Au-delà de certains seuils de clients ou d'encours, un CASP devient « significatif » et relève d'une supervision paneuropéenne accrue. Pour les plateformes RWA en croissance, anticiper ce seuil influence la gouvernance et les investissements compliance.",
    relatedTerms: ["casp", "mica", "custody-crypto-actifs"],
    internalLinks: [{ href: "/trust", label: "Cadre conformité AUROS" }],
  },
  {
    slug: "periode-transitoire-mica",
    title: "Période transitoire MiCA",
    category: "mica",
    shortDefinition:
      "Délai accordé aux acteurs existants pour se mettre en conformité avant application pleine des agréments MiCA.",
    extended:
      "Les prestataires déjà en activité bénéficient de régimes transitoires nationaux variables selon l'État membre. Les nouveaux projets RWA doivent planifier une conformité dès la conception. Les échéances évoluent — vérifier la date applicable à votre juridiction avec counsel.",
    relatedTerms: ["mica", "casp", "passporting-europeen"],
    internalLinks: [{ href: "/jurisdictions", label: "Comparer les juridictions" }],
  },
  {
    slug: "reverse-solicitation",
    title: "Reverse solicitation",
    category: "mica",
    shortDefinition:
      "Exception où un client initié hors UE peut accéder à un service sans que l'offre soit considérée comme marketing local.",
    extended:
      "La reverse solicitation est encadrée strictement : l'initiative doit venir du client, avec preuves documentaires. Ce n'est pas un contournement général de MiCA. Les émetteurs RWA internationaux doivent documenter chaque cas avec counsel.",
    relatedTerms: ["marketing-crypto-actifs", "mica", "investisseur-qualifie"],
    internalLinks: [{ href: "/jurisdictions", label: "Juridictions & distribution" }],
  },
  {
    slug: "marketing-crypto-actifs",
    title: "Marketing de crypto-actifs (UE)",
    category: "mica",
    shortDefinition:
      "Communication promotionnelle soumise à règles MiCA selon le jeton, le public cible et la juridiction.",
    extended:
      "Promouvoir un jeton RWA en Europe peut exiger whitepaper approuvé, mentions de risque et respect des interdictions de ciblage retail selon le statut. Les réseaux sociaux et influenceurs entrent dans le périmètre. Préparer un plan marketing conforme fait partie du dossier AUROS.",
    relatedTerms: ["whitepaper-mica", "reverse-solicitation", "mica"],
    internalLinks: [
      { href: "/tools/mica-checker", label: "Test MiCA" },
      { href: "/wizard", label: "Structurer le dossier" },
    ],
  },
  {
    slug: "custody-crypto-actifs",
    title: "Conservation de crypto-actifs (custody)",
    category: "mica",
    shortDefinition:
      "Service de garde des clés privées ou des jetons pour le compte de tiers, agréé comme activité CASP.",
    extended:
      "La custody institutionnelle sous MiCA impose ségrégation des actifs, plans de continuité et audits. Pour un RWA, la chaîne custody (on-chain + off-chain) doit être traçable dans la data room. Les solutions self-custody retail ne remplacent pas une custody régulée pour des fonds professionnels.",
    relatedTerms: ["casp", "chaine-custody", "significant-casp"],
    internalLinks: [{ href: "/trust", label: "Confiance & custody" }],
  },
  {
    slug: "amf-france",
    title: "AMF (Autorité des marchés financiers)",
    category: "mica",
    shortDefinition:
      "Régulateur français des marchés financiers, autorité compétente pour MiCA et valeurs mobilières en France.",
    extended:
      "L'AMF supervise les offres au public, les PSAN/CASP et la qualification des instruments financiers en France. Un RWA visant la France doit croiser MiCA, le droit des valeurs mobilières et la doctrine AMF. Le comparateur juridictions AUROS inclut la France avec paramètres indicatifs.",
    relatedTerms: ["cssf-luxembourg", "passporting-europeen", "prospectus-eu"],
    internalLinks: [{ href: "/jurisdictions", label: "Fiche France" }],
  },
  {
    slug: "cssf-luxembourg",
    title: "CSSF (Luxembourg)",
    category: "mica",
    shortDefinition:
      "Commission de surveillance du secteur financier luxembourgeois, hub fréquent pour fonds et CASP européens.",
    extended:
      "Le Luxembourg attire de nombreux véhicules d'investissement et prestataires crypto pour son écosystème financier établi. Les délais et coûts d'agrément varient selon le périmètre. Une structuration SPV luxembourgeoise est courante en RWA institutionnel — analyse fiscale et réglementaire requise.",
    relatedTerms: ["amf-france", "spv", "passporting-europeen"],
    internalLinks: [
      { href: "/jurisdictions", label: "Fiche Luxembourg" },
      { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
    ],
  },
  {
    slug: "vara-dubai",
    title: "VARA (Dubai)",
    category: "mica",
    shortDefinition:
      "Autorité de régulation des actifs virtuels à Dubaï, cadre hors MiCA pour les acteurs MENA.",
    extended:
      "VARA délivre des licences par activité (brokerage, custody, advisory…) dans l'émirat de Dubaï. Les émetteurs RWA internationaux comparent souvent VARA et l'UE selon leur marché cible. Pas d'équivalence automatique avec MiCA — due diligence juridictionnelle nécessaire.",
    relatedTerms: ["mica", "passporting-europeen"],
    internalLinks: [{ href: "/jurisdictions", label: "Comparateur juridictions" }],
  },
  {
    slug: "prospectus-eu",
    title: "Prospectus UE",
    category: "mica",
    shortDefinition:
      "Document d'information pour offre publique de valeurs mobilières harmonisé par le règlement Prospectus UE.",
    extended:
      "Si un jeton RWA est qualifié titre financier, un prospectus (ou une exemption) peut être exigé indépendamment de MiCA. Le prospectus UE permet le passeport européen pour les titres. La coordination whitepaper MiCA + prospectus est un travail counsel central en structuration.",
    relatedTerms: ["whitepaper-mica", "prospectus", "security-token"],
    internalLinks: [{ href: "/wizard", label: "Préparer la documentation" }],
  },
  {
    slug: "rgpd-donnees-emetteur",
    title: "RGPD & données émetteur",
    category: "mica",
    shortDefinition:
      "Cadre européen de protection des données personnelles applicable aux dossiers KYC et investisseurs.",
    extended:
      "Tokeniser un actif implique souvent des données personnelles (KYC, cap table, communications). Le RGPD impose base légale, minimisation et droits des personnes. AUROS applique une politique confidentialité claire — le dossier émetteur doit aligner data room et traitements déclarés.",
    relatedTerms: ["kyc", "data-room", "due-diligence"],
    internalLinks: [
      { href: "/privacy", label: "Politique confidentialité" },
      { href: "/trust", label: "Confiance AUROS" },
    ],
  },
];
