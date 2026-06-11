import type { GlossaryTerm } from "../types";

export const STRUCTURES_TERMS: GlossaryTerm[] = [
  {
    slug: "spv",
    title: "SPV (Special Purpose Vehicle)",
    category: "structures",
    shortDefinition:
      "Véhicule juridique ad hoc détenant l'actif et émettant les droits économiques aux investisseurs.",
    extended:
      "La SPV isole l'actif du bilan de l'émetteur promoteur, facilitant financement et cession. En RWA, elle est le lien off-chain central entre immeuble, portefeuille de prêts ou parc énergétique et les jetons. Le choix de juridiction SPV impacte fiscalité, délais et confiance investisseurs.",
    relatedTerms: ["trust-structure", "securisation", "cap-table", "data-room"],
    internalLinks: [
      { href: "/jurisdictions", label: "Où structurer ?" },
      { href: "/tools/jurisdiction-picker", label: "Sélecteur juridiction" },
    ],
    faq: [
      {
        question: "Une SPV est-elle obligatoire pour tokeniser ?",
        answer:
          "Pas toujours, mais c'est la structure la plus courante pour isoler l'actif et clarifier les droits des porteurs de jetons. Alternatives : fonds, trust — selon counsel.",
      },
    ],
  },
  {
    slug: "data-room",
    title: "Data room",
    category: "structures",
    shortDefinition:
      "Espace documentaire structuré regroupant les pièces légales, financières et techniques d'une émission RWA.",
    extended:
      "La data room permet à investisseurs et counsel de vérifier titres, audits, contrats et KYC. AUROS propose un modèle indicatif de 15 documents priorisés en trois niveaux — sans culpabiliser l'incomplet au départ. Une data room vivante se met à jour à chaque fait nouveau.",
    relatedTerms: ["due-diligence", "prospectus", "whitepaper-mica", "kyc"],
    internalLinks: [
      { href: "/wizard", label: "Générer la data room" },
      { href: "/estimate", label: "Score de préparation" },
    ],
  },
  {
    slug: "prospectus",
    title: "Prospectus (offre de titres)",
    category: "structures",
    shortDefinition:
      "Document d'information réglementé pour une offre au public de valeurs mobilières ou assimilées.",
    extended:
      "Le prospectus détaille risques, gouvernance, finances et utilisation des fonds. Il peut coexister avec un whitepaper MiCA selon la qualification du jeton. Les exemptions (placement privé, seuils) varient par juridiction — ne pas présumer une dispense sans analyse.",
    relatedTerms: ["prospectus-eu", "offering-memorandum", "whitepaper-mica"],
    internalLinks: [{ href: "/wizard", label: "Préparer le dossier" }],
  },
  {
    slug: "offering-memorandum",
    title: "Offering memorandum (OM)",
    category: "structures",
    shortDefinition:
      "Note d'information pour placement privé, hors offre au public retail, détaillant termes et risques.",
    extended:
      "L'OM est fréquent en levée privée RWA auprès d'investisseurs qualifiés. Moins formalisé qu'un prospectus public mais engageant sur les disclosures. Doit rester cohérent avec le smart contract et la terminologie marketing.",
    relatedTerms: ["prospectus", "investisseur-qualifie", "marche-primaire"],
    internalLinks: [{ href: "/jurisdictions", label: "Règles par juridiction" }],
  },
  {
    slug: "securisation",
    title: "Sécurisation (securitization)",
    category: "structures",
    shortDefinition:
      "Structuration de flux de créances ou actifs en tranches vendables à des investisseurs.",
    extended:
      "La sécurisation transforme un portefeuille d'actifs en titres à différents niveaux de risque (senior, mezzanine). En RWA on-chain, chaque tranche peut être tokenisée avec des waterfalls codifiés. Régulation ABS européenne et due diligence rating sont des sujets counsel.",
    relatedTerms: ["waterfall-distribution", "spv", "apy-rendement"],
    internalLinks: [{ href: "/private-credit", label: "Comparateur private credit" }],
  },
  {
    slug: "trust-structure",
    title: "Trust",
    category: "structures",
    shortDefinition:
      "Structure fiduciaire où un trustee détient l'actif au bénéfice des investisseurs ou porteurs de jetons.",
    extended:
      "Le trust est courant en common law (UK, Jersey, US) pour détenir actifs immobiliers ou fonds. La reconnaissance cross-border en civil law exige une analyse spécifique. Alternative ou complément à la SPV selon juridiction cible.",
    relatedTerms: ["spv", "chaine-custody", "registraire"],
    internalLinks: [{ href: "/jurisdictions", label: "Juridictions trust" }],
  },
  {
    slug: "cap-table",
    title: "Cap table",
    category: "structures",
    shortDefinition:
      "Table de capitalisation listant détenteurs, classes d'actions/parts et droits économiques.",
    extended:
      "La cap table off-chain doit se réconcilier avec le registre on-chain des jetons. Toute émission RWA sérieuse prévoit des mises à jour synchronisées après souscriptions et transferts permissionnés. Outil central pour gouvernance et reporting investisseurs.",
    relatedTerms: ["registraire", "pacte-actionnaires", "souscription-rachat"],
    internalLinks: [{ href: "/wizard", label: "Structurer les droits" }],
  },
  {
    slug: "pacte-actionnaires",
    title: "Pacte d'actionnaires",
    category: "structures",
    shortDefinition:
      "Accord entre associés définissant gouvernance, sortie, droits de préemption et restrictions.",
    extended:
      "Le pacte encode ce que le smart contract reflète souvent partiellement : tag-along, drag-along, lock-up. En tokenisation, l'alignement pacte / transfer restrictions évite les conflits entre détenteurs on-chain et off-chain.",
    relatedTerms: ["lock-up", "transfer-restriction", "cap-table"],
    internalLinks: [{ href: "/wizard", label: "Dossier juridique" }],
  },
  {
    slug: "agent-transfert",
    title: "Agent de transfert",
    category: "structures",
    shortDefinition:
      "Intermédiaire tenant le registre des porteurs et exécutant transferts, souscriptions et rachats.",
    extended:
      "L'agent de transfert assure la concordance registre nominatif et blockchain permissionnée. En émission régulée, son rôle est souvent imposé ou attendu par les investisseurs institutionnels. Délégation et SLA doivent figurer dans la data room.",
    relatedTerms: ["registraire", "souscription-rachat", "chaine-custody"],
    internalLinks: [{ href: "/trust", label: "Chaîne opérationnelle" }],
  },
  {
    slug: "registraire",
    title: "Registraire",
    category: "structures",
    shortDefinition:
      "Entité officielle ou contractuelle tenant le registre légal des titres et des propriétaires.",
    extended:
      "Le registraire fait foi en cas de litige sur la détention. Tokeniser sans registre off-chain aligné crée un risque juridique. Les solutions RWA matures doublent registre traditionnel et miroir on-chain avec réconciliation périodique.",
    relatedTerms: ["agent-transfert", "cap-table", "on-chain-identity"],
    internalLinks: [{ href: "/wizard", label: "Préparer le registre" }],
  },
  {
    slug: "chaine-custody",
    title: "Chaîne de custody",
    category: "structures",
    shortDefinition:
      "Enchaînement documenté des dépositaires de l'actif — physique, juridique et numérique.",
    extended:
      "De l'actif réel au wallet investisseur, chaque maillon (custodian bancaire, dépositaire titres, custodian crypto) doit être identifié. Les audits et assurances s'appuient sur cette traçabilité. Point clé des due diligences institutionnelles.",
    relatedTerms: ["custody-crypto-actifs", "trust-structure", "spv"],
    internalLinks: [{ href: "/trust", label: "Confiance AUROS" }],
  },
  {
    slug: "escrow",
    title: "Escrow (séquestre)",
    category: "structures",
    shortDefinition:
      "Mécanisme bloquant fonds ou actifs jusqu'à conditions contractuelles remplies.",
    extended:
      "L'escrow sécurise closing immobilier, milestones de construction ou libération de fonds levée. Smart contract escrow et compte séquestre bancaire peuvent coexister. Les conditions de release doivent être non ambiguës pour investisseurs.",
    relatedTerms: ["souscription-rachat", "spv", "smart-contract"],
    internalLinks: [{ href: "/wizard", label: "Structuration closing" }],
  },
  {
    slug: "waterfall-distribution",
    title: "Waterfall de distribution",
    category: "structures",
    shortDefinition:
      "Ordre prioritaire d'allocation des flux de trésorerie entre classes d'investisseurs et frais.",
    extended:
      "La waterfall définit qui est payé en premier (frais, senior, promoteur carry). En RWA tokenisé, elle peut être codée partiellement on-chain mais reste ancrée dans les statuts et l'OM. Transparence sur le promoteur carry limite les tensions investisseurs.",
    relatedTerms: ["securisation", "token-dividende", "revenue-share-token"],
    internalLinks: [{ href: "/tools/yield-calculator", label: "Contextualiser le rendement" }],
  },
  {
    slug: "lock-up",
    title: "Période de lock-up",
    category: "structures",
    shortDefinition:
      "Durée pendant laquelle les jetons ou titres ne peuvent pas être transférés ou revendus.",
    extended:
      "Le lock-up aligne les horizons promoteurs-investisseurs et stabilise le marché secondaire naissant. Il est implémenté via smart contract ou registre off-chain. Sa durée et exceptions doivent être clairement dévoilées dans l'offre.",
    relatedTerms: ["transfer-restriction", "vesting", "pacte-actionnaires"],
    internalLinks: [{ href: "/wizard", label: "Définir les restrictions" }],
  },
  {
    slug: "vesting",
    title: "Vesting",
    category: "structures",
    shortDefinition:
      "Acquisition progressive de droits sur des jetons ou actions selon calendrier ou performance.",
    extended:
      "Le vesting retarde l'accès complet des fondateurs ou équipes à leurs tokens, réduisant le risque de dump. Les calendriers vesting doivent être publics et cohérents avec les engagements du whitepaper. Distinct du lock-up investisseurs mais souvent combiné.",
    relatedTerms: ["lock-up", "tokenomics", "pacte-actionnaires"],
    internalLinks: [{ href: "/wizard", label: "Tokenomics & gouvernance" }],
  },
  {
    slug: "token-dividende",
    title: "Dividende tokenisé",
    category: "structures",
    shortDefinition:
      "Distribution de flux de l'actif sous-jacent aux détenteurs de jetons selon règles définies.",
    extended:
      "Les dividendes peuvent transiter en stablecoin, virement bancaire ou réinvestissement automatique. Fiscalité par investisseur et retenues à la source complexifient l'opérationnel. Documenter la politique de distribution avant émission évite les litiges.",
    relatedTerms: ["waterfall-distribution", "revenue-share-token", "apy-rendement"],
    internalLinks: [{ href: "/tools/yield-calculator", label: "Calculateur rendement" }],
  },
  {
    slug: "revenue-share-token",
    title: "Jeton de partage de revenus",
    category: "structures",
    shortDefinition:
      "Jeton donnant droit à une quote-part des revenus d'un actif ou projet, sans nécessairement être une action.",
    extended:
      "Le revenue share est attractif pour actifs générateurs de cash (loyers, PPA, royalties). La qualification juridique varie : contrat de créance, part sociale ou security token. Les projections de revenus restent indicatives — risques opérationnels à exposer.",
    relatedTerms: ["token-dividende", "ppa-power-purchase", "tokenomics"],
    internalLinks: [
      { href: "/compare", label: "Produits à revenus" },
      { href: "/green", label: "RWA énergie" },
    ],
  },
];
