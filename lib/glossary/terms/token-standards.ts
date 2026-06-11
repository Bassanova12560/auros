import type { GlossaryTerm } from "../types";

export const TOKEN_STANDARDS_TERMS: GlossaryTerm[] = [
  {
    slug: "erc-3643",
    title: "ERC-3643 (T-REX)",
    category: "token-standards",
    shortDefinition:
      "Standard de jeton permissionné pour titres tokenisés avec règles de transfert et identité on-chain.",
    extended:
      "ERC-3643 (ex T-REX) intègre compliance on-chain : whitelist, restrictions de transfert et registre d'identités. C'est une référence fréquente pour les security tokens RWA en Europe. Le choix du standard doit s'aligner sur la qualification juridique et les exigences des investisseurs institutionnels.",
    relatedTerms: ["security-token", "permissioned-ledger", "on-chain-identity", "transfer-restriction"],
    internalLinks: [
      { href: "/wizard", label: "Wizard structuration" },
      { href: "/academy", label: "Formation RWA" },
    ],
    faq: [
      {
        question: "ERC-3643 garantit-il la conformité MiCA ?",
        answer:
          "Non. C'est un standard technique. La conformité réglementaire repose sur la structuration juridique, le whitepaper et les agréments — pas sur le seul choix ERC.",
      },
    ],
  },
  {
    slug: "erc-20",
    title: "ERC-20",
    category: "token-standards",
    shortDefinition:
      "Standard Ethereum pour jetons fongibles interchangeables — base technique de nombreux RWA.",
    extended:
      "ERC-20 définit les fonctions transfer, approve et balanceOf pour des jetons fongibles. Simple et largement supporté, il manque nativement les contrôles de transfert requis pour des titres régulés. Souvent couplé à des modules compliance ou remplacé par ERC-3643 en contexte institutionnel.",
    relatedTerms: ["rwa-token", "erc-3643", "smart-contract"],
    internalLinks: [{ href: "/compare", label: "Produits RWA on-chain" }],
  },
  {
    slug: "erc-1400",
    title: "ERC-1400",
    category: "token-standards",
    shortDefinition:
      "Famille de standards pour security tokens avec partitions, documents et contrôles de transfert.",
    extended:
      "ERC-1400 et ses déclinaisons visent les titres numériques avec traçabilité documentaire on-chain. Moins déployé qu'ERC-3643 en Europe mais présent dans certains projets internationaux. L'évaluation technique doit inclure support wallets, custodians et audits.",
    relatedTerms: ["erc-3643", "security-token", "transfer-restriction"],
    internalLinks: [{ href: "/academy", label: "Academy RWA" }],
  },
  {
    slug: "erc-721",
    title: "ERC-721 (NFT)",
    category: "token-standards",
    shortDefinition:
      "Standard de jeton non fongible représentant un actif ou droit unique et identifiable.",
    extended:
      "ERC-721 attribue un identifiant unique par token — utile pour parcelles immobilières, œuvres ou certificats unitaires. La fractionnalisation passe souvent par des structures SPV + parts ERC-20 plutôt que NFT pur. Attention à la qualification réglementaire si l'NFT revêt un caractère financier.",
    relatedTerms: ["fractional-nft", "propriete-fractionnee", "rwa-token"],
    internalLinks: [{ href: "/real-estate", label: "Comparateur immobilier RWA" }],
  },
  {
    slug: "security-token",
    title: "Security token",
    category: "token-standards",
    shortDefinition:
      "Jeton représentant un instrument financier ou un droit assimilé, soumis au droit des valeurs mobilières.",
    extended:
      "Un security token encode des droits économiques (dividendes, remboursement, gouvernance économique) typiques d'un titre. MiCA ne remplace pas la qualification nationale : un security token peut relever du prospectus et des intermédiaires agréés. La structuration AUROS sépare clairement analyse technique et qualification juridique.",
    relatedTerms: ["erc-3643", "utility-token-mica", "prospectus-eu", "prospectus"],
    internalLinks: [
      { href: "/tools/mica-checker", label: "Test MiCA" },
      { href: "/wizard", label: "Wizard dossier" },
    ],
  },
  {
    slug: "permissioned-ledger",
    title: "Blockchain permissionnée",
    category: "token-standards",
    shortDefinition:
      "Réseau dont l'accès et la validation sont restreints à des acteurs identifiés et autorisés.",
    extended:
      "Les émissions RWA institutionnelles utilisent souvent des chaînes permissionnées ou L2 avec liste blanche pour la conformité KYC. Le compromis est moins de décentralisation permissionless, plus de contrôle réglementaire. Le choix de chaîne impacte custody, liquidité secondaire et coûts gas.",
    relatedTerms: ["on-chain-identity", "transfer-restriction", "erc-3643"],
    internalLinks: [{ href: "/compare", label: "Chaînes des produits RWA" }],
  },
  {
    slug: "rwa-token",
    title: "Jeton RWA",
    category: "token-standards",
    shortDefinition:
      "Représentation numérique on-chain d'un droit sur un actif réel (immobilier, dette, matière première…).",
    extended:
      "Le jeton RWA est l'interface investisseur : il matérialise la détention économique définie off-chain (contrat, SPV, registre). Sa valeur dépend de la qualité de l'ancrage juridique, pas seulement du smart contract. AUROS accompagne la cohérence entre tokenomics et documentation légale.",
    relatedTerms: ["tokenisation", "rwa-real-world-asset", "erc-20", "security-token"],
    internalLinks: [
      { href: "/wizard", label: "Tokeniser un actif" },
      { href: "/compare", label: "120+ produits RWA" },
    ],
  },
  {
    slug: "soulbound-token",
    title: "Soulbound token (SBT)",
    category: "token-standards",
    shortDefinition:
      "Jeton non transférable attaché à une identité pour attestations, credentials ou réputation.",
    extended:
      "Les SBT peuvent porter des attestations KYC ou des certifications (ex. Academy) sans revente. En RWA, ils complètent parfois l'accès à des offres privées. Leur usage reste expérimental côté régulation — bien séparer identité et titre financier.",
    relatedTerms: ["on-chain-identity", "kyc", "permissioned-ledger"],
    internalLinks: [{ href: "/academy", label: "Certification AUROS Academy" }],
  },
  {
    slug: "wrapped-asset",
    title: "Actif encapsulé (wrapped)",
    category: "token-standards",
    shortDefinition:
      "Jeton représentant un actif détenu en réserve, échangeable contre l'actif sous-jacent selon des règles définies.",
    extended:
      "Le wrapping permet d'apporter de l'or, des obligations ou des devises on-chain via un custodian. Les risques portent sur la défaillance de l'émetteur du wrapper et la transparence des réserves. Distinct des ART MiCA mais soumis à une logique de confiance similaire.",
    relatedTerms: ["art-asset-referenced-token", "stablecoin", "chaine-custody"],
    internalLinks: [{ href: "/commodities", label: "Comparateur matières premières" }],
  },
  {
    slug: "stablecoin",
    title: "Stablecoin",
    category: "token-standards",
    shortDefinition:
      "Crypto-actif conçu pour limiter la volatilité, souvent adossé à une monnaie ou des réserves.",
    extended:
      "En RWA, les stablecoins servent de rail de règlement et de trésorerie on-chain. Sous MiCA, ART et EMT encadrent les émissions stables régulées. Les stablecoins non régulés comportent des risques de peg et de contrepartie documentés dans tout dossier sérieux.",
    relatedTerms: ["emt-e-money-token", "art-asset-referenced-token", "wrapped-asset"],
    internalLinks: [{ href: "/stablecoins", label: "Comparateur stablecoins" }],
  },
  {
    slug: "tokenomics",
    title: "Tokenomics",
    category: "token-standards",
    shortDefinition:
      "Architecture économique du jeton : émission, distribution, utilité, incitations et mécanismes de valeur.",
    extended:
      "Des tokenomics claires alignent émetteurs et investisseurs : supply fixe ou dynamique, frais, droits de gouvernance. Pour un RWA, elles doivent refléter les flux réels de l'actif (loyers, coupons) sans promesse de rendement non fondée. Le calculateur AUROS aide à contextualiser les rendements indicatifs.",
    relatedTerms: ["mint-et-burn", "waterfall-distribution", "apy-rendement"],
    internalLinks: [{ href: "/tools/yield-calculator", label: "Calculateur rendement" }],
  },
  {
    slug: "mint-et-burn",
    title: "Mint & burn",
    category: "token-standards",
    shortDefinition:
      "Création (mint) et destruction (burn) de jetons selon souscriptions, rachats ou événements de l'actif.",
    extended:
      "Le mint/burn synchronise l'offre on-chain avec les flux off-chain (entrées investisseurs, remboursements). Des processus manuels ou automatisés via oracle doivent être audités. Toute faille de mint non autorisé est un risque critique pour un RWA.",
    relatedTerms: ["tokenomics", "oracle-blockchain", "souscription-rachat"],
    internalLinks: [{ href: "/wizard", label: "Structurer l'émission" }],
  },
  {
    slug: "on-chain-identity",
    title: "Identité on-chain",
    category: "token-standards",
    shortDefinition:
      "Système d'attestation liant une adresse blockchain à une identité vérifiée (KYC, LEI, statut investisseur).",
    extended:
      "L'identité on-chain est le prérequis des transferts permissionnés ERC-3643. Les registres d'identité doivent respecter RGPD et durée de conservation. Les wallets institutionnels intègrent ces vérifications dans le parcours souscription.",
    relatedTerms: ["erc-3643", "kyc", "permissioned-ledger", "soulbound-token"],
    internalLinks: [{ href: "/trust", label: "Confiance & KYC" }],
  },
  {
    slug: "transfer-restriction",
    title: "Restriction de transfert",
    category: "token-standards",
    shortDefinition:
      "Règle limitant à qui et quand un jeton peut être transféré — pilier de la compliance titres tokenisés.",
    extended:
      "Les restrictions implémentent périodes de lock-up, listes blanches et plafonds de détention. Elles traduisent en code les engagements du pacte d'actionnaires ou de la note d'offre. Toute modification post-émission requiert gouvernance et mise à jour documentaire.",
    relatedTerms: ["erc-3643", "lock-up", "permissioned-ledger"],
    internalLinks: [{ href: "/wizard", label: "Préparer le dossier" }],
  },
  {
    slug: "fractional-nft",
    title: "NFT fractionnalisé",
    category: "token-standards",
    shortDefinition:
      "Découpage économique d'un NFT en parts fongibles, souvent via un vault ou une SPV intermédiaire.",
    extended:
      "La fractionnalisation permet d'abaisser le ticket d'entrée sur un actif unique (immobilier de prestige, art). La structure juridique prime : parts de SPV vs vault de tokens. Qualification réglementaire et droits de revente doivent être explicites.",
    relatedTerms: ["erc-721", "propriete-fractionnee", "spv"],
    internalLinks: [{ href: "/real-estate", label: "RWA immobilier" }],
  },
  {
    slug: "oracle-blockchain",
    title: "Oracle blockchain",
    category: "token-standards",
    shortDefinition:
      "Service reliant données off-chain (prix, événements, NAV) au smart contract on-chain.",
    extended:
      "Les oracles alimentent mint/burn, indexation de rendement ou déclencheurs de défaut. Leur fiabilité et gouvernance sont des points d'audit majeurs. Pour un RWA, documenter la source de vérité off-chain (expert, agent, flux bancaire) est aussi important que l'oracle lui-même.",
    relatedTerms: ["mint-et-burn", "nav-valeur-liquidative", "smart-contract"],
    internalLinks: [{ href: "/compare", label: "Données marché RWA" }],
  },
  {
    slug: "smart-contract",
    title: "Smart contract",
    category: "token-standards",
    shortDefinition:
      "Programme autonome déployé sur blockchain exécutant des règles de transfert, gouvernance ou distribution.",
    extended:
      "Le smart contract encode la logique du jeton RWA : émission, frais, restrictions. Un audit de sécurité est attendu par les investisseurs institutionnels. Il ne remplace pas les contrats civils liant l'actif réel — les deux couches doivent être cohérentes.",
    relatedTerms: ["erc-20", "erc-3643", "oracle-blockchain"],
    internalLinks: [{ href: "/wizard", label: "Dossier technique" }],
  },
];
