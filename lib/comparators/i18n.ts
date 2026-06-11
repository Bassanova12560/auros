import type { Locale } from "@/lib/i18n";

export type ComparatorPageCopy = {
  tool: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  disclaimer: string;
  stats: {
    bestApy: string;
    totalTvl: string;
    products: string;
    protocols: (n: number) => string;
    liveSource: (date: string) => string;
    cacheSource: (date: string) => string;
  };
  filters: {
    all: string;
    [key: string]: string;
  };
  table: {
    protocol: string;
    product: string;
    apy: string;
    tvl: string;
    chain: string;
    view: string;
    viewPlatform: string;
    search: string;
    sortBy: string;
    topBadge: string;
    manual: string;
    manualHint: string;
    noResults: string;
    productsCount: (n: number) => string;
    viewPlatformAria: (platform: string) => string;
  };
  cta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    button: string;
  };
  footerDisclaimer: string;
};

export type ComparatorMessages = {
  languageAria: string;
  nav: {
    dossierCta: string;
    dossierShort: string;
    comparatorsAria: string;
  };
  navDropdown: {
    label: string;
    compareAll: string;
    jurisdictions: string;
    current: string;
  };
  risk: {
    conservative: string;
    core: string;
    advanced: string;
    badgeHint: string;
  };
  crossLinks: {
    title: string;
    explore: string;
  };
  compareHub: {
    tool: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    disclaimer: string;
    tiers: {
      conservative: { label: string; description: string };
      core: { label: string; description: string };
      advanced: { label: string; description: string };
    };
    tierBest: string;
    tierProducts: (n: number) => string;
    viewComparator: string;
    viewPlatform: string;
    updated: (date: string) => string;
    totalProducts: (n: number) => string;
    dossierBanner: {
      title: string;
      subtitle: string;
      cta: string;
    };
    filters: {
      label: string;
      all: string;
      under500: string;
      under5000: string;
    };
    sort: {
      label: string;
      apy: string;
      liquidity: string;
    };
    liquidity: {
      instant: string;
      days: (n: number) => string;
    };
    table: {
      protocol: string;
      product: string;
      apy: string;
      minInvestment: string;
      liquidity: string;
      fees: string;
      risk: string;
      assetType: string;
      view: string;
    };
    noResults: string;
    metaDisclaimer: string;
    footerDisclaimer: string;
    selection: {
      barLabel: string;
      count: (n: number) => string;
      compare: string;
      compareHint: string;
      clear: string;
      maxReached: string;
      selectProduct: string;
      copyLink: string;
      linkCopied: string;
    };
    comparePanel: {
      eyebrow: string;
      title: string;
      close: string;
      yes: string;
      no: string;
      notAvailable: string;
      viewFiche: string;
      rows: {
        criterion: string;
        product: string;
        apy: string;
        minInvestment: string;
        liquidity: string;
        fees: string;
        jurisdiction: string;
        accredited: string;
        chain: string;
        fiche: string;
      };
    };
    ecosystem: {
      title: string;
      dossier: string;
      dashboard: string;
      score: string;
      partners: string;
      jurisdictions: string;
    };
  };
  productBadges: {
    accredited: string;
    accreditedHint: string;
    new: string;
    popular: string;
  };
  assetTypes: {
    stablecoins: string;
    immobilier: string;
    obligations: string;
    matieresPremieres: string;
    privateCredit: string;
  };
  tabs: {
    stablecoins: string;
    immobilier: string;
    obligations: string;
    matieresPremieres: string;
    privateCredit: string;
    soon: string;
  };
  stablecoins: ComparatorPageCopy;
  immobilier: ComparatorPageCopy;
  obligations: ComparatorPageCopy;
  matieresPremieres: ComparatorPageCopy;
  privateCredit: ComparatorPageCopy;
  footer: {
    dossier: string;
    legal: string;
    disclaimer: string;
  };
  error: {
    title: string;
    body: string;
    retry: string;
    home: string;
  };
  loading: string;
};

const FR: ComparatorMessages = {
  languageAria: "Langue",
  nav: {
    dossierCta: "Préparer mon dossier avec Auros",
    dossierShort: "Mon dossier",
    comparatorsAria: "Comparateurs Auros",
  },
  navDropdown: {
    label: "Autres comparateurs",
    compareAll: "Voir tous les rendements →",
    jurisdictions: "Comparateur juridictions",
    current: "Actuel",
  },
  risk: {
    conservative: "Trésorerie",
    core: "Core",
    advanced: "Alternatif",
    badgeHint: "Profil de risque indicatif — pas un conseil en investissement",
  },
  crossLinks: {
    title: "Aussi comparé sur AUROS",
    explore: "Explorer le comparateur →",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "Hub · Tous les comparateurs",
    title: "Rendements RWA par profil de risque",
    subtitle:
      "Vue agrégée des cinq comparateurs AUROS — le meilleur rendement est affiché par niveau de risque, pas en un seul classement global.",
    disclaimer:
      "Profils indicatifs. Chaque produit a ses propres conditions d'accès, liquidité et régulation.",
    tiers: {
      conservative: {
        label: "Conservateur",
        description: "Trésorerie, souverain, métaux — priorité préservation du capital.",
      },
      core: {
        label: "Core",
        description: "Immobilier résidentiel, crédit prime, obligations corporate.",
      },
      advanced: {
        label: "Alternatif",
        description: "Crédit structuré, foncier, agricole — rendement plus élevé, risque accru.",
      },
    },
    tierBest: "Meilleur rendement",
    tierProducts: (n) => `${n} produit${n > 1 ? "s" : ""} dans ce profil`,
    viewComparator: "Voir le comparateur",
    viewPlatform: "Voir la plateforme",
    updated: (date) => `Mis à jour · ${date}`,
    totalProducts: (n) => `${n} produit${n > 1 ? "s" : ""} unique${n > 1 ? "s" : ""}`,
    dossierBanner: {
      title: "Vous structurez un actif RWA ?",
      subtitle: "Préparez votre dossier d'admission en quelques minutes — score, data room, conformité.",
      cta: "Préparer mon dossier",
    },
    filters: {
      label: "Filtrer par minimum",
      all: "Tous",
      under500: "Minimum < 500 $",
      under5000: "Minimum < 5 000 $",
    },
    sort: {
      label: "Trier par",
      apy: "Rendement",
      liquidity: "Liquidité",
    },
    liquidity: {
      instant: "< 1 jour",
      days: (n) => `${n} j`,
    },
    table: {
      protocol: "Protocole",
      product: "Produit",
      apy: "APY",
      minInvestment: "Minimum",
      liquidity: "Liquidité",
      fees: "Frais",
      risk: "Profil",
      assetType: "Type d'actif",
      view: "Voir",
    },
    noResults: "Aucun produit ne correspond à ces filtres.",
    metaDisclaimer:
      "Minimum, liquidité et frais indicatifs — vérifiez les conditions exactes sur chaque plateforme avant d'investir.",
    footerDisclaimer:
      "Rendements indicatifs agrégés depuis les comparateurs AUROS. Pas un conseil en investissement — vérifiez chaque plateforme.",
    selection: {
      barLabel: "Sélection comparateur",
      count: (n) =>
        `${n} produit${n > 1 ? "s" : ""} sélectionné${n > 1 ? "s" : ""} · max. 4`,
      compare: "Comparer",
      compareHint: "Sélectionnez au moins 2 produits pour comparer.",
      clear: "Effacer",
      maxReached: "Maximum 4 produits — retirez-en un pour en ajouter.",
      selectProduct: "Sélectionner pour comparer",
      copyLink: "Copier le lien",
      linkCopied: "Lien copié",
    },
    comparePanel: {
      eyebrow: "Comparaison côte à côte",
      title: "Comparer les produits",
      close: "Fermer",
      yes: "Oui",
      no: "Non",
      notAvailable: "—",
      viewFiche: "Voir la fiche",
      rows: {
        criterion: "Critère",
        product: "Produit",
        apy: "APY",
        minInvestment: "Minimum",
        liquidity: "Liquidité",
        fees: "Frais",
        jurisdiction: "Juridiction",
        accredited: "Accrédité",
        chain: "Chaîne",
        fiche: "Fiche AUROS",
      },
    },
    ecosystem: {
      title: "Écosystème AUROS",
      dossier: "Préparer un dossier",
      dashboard: "Mes dossiers",
      score: "Score d'admission",
      partners: "Partenaires & ressources",
      jurisdictions: "Comparateur juridictions",
    },
  },
  productBadges: {
    accredited: "Accrédité",
    accreditedHint:
      "Investisseur qualifié ou équivalent requis — vérifiez l'éligibilité avant le KYC.",
    new: "Nouveau",
    popular: "Populaire",
  },
  assetTypes: {
    stablecoins: "Stablecoins",
    immobilier: "Immobilier",
    obligations: "Obligations",
    matieresPremieres: "Matières premières",
    privateCredit: "Crédit privé",
  },
  tabs: {
    stablecoins: "Stablecoins",
    immobilier: "Immobilier",
    obligations: "Obligations",
    matieresPremieres: "Matières premières",
    privateCredit: "Crédit privé",
    soon: "Bientôt",
  },
  stablecoins: {
    tool: "stablecoins",
    eyebrow: "Comparateur · Données live",
    title: "Stablecoins RWA",
    subtitle:
      "Rendements et liquidité des principaux protocoles — triés par APY, mis à jour toutes les heures.",
    disclaimer:
      "Rendements indicatifs. Vérifiez les conditions d'accès et la régulation sur chaque plateforme.",
    stats: {
      bestApy: "Meilleur rendement",
      totalTvl: "TVL combinée",
      products: "Produits comparés",
      protocols: (n) => `${n} protocole${n > 1 ? "s" : ""}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: { all: "Tous", treasury: "Trésorerie", credit: "Crédit" },
    table: {
      protocol: "Protocole",
      product: "Produit",
      apy: "APY",
      tvl: "TVL",
      chain: "Chaîne",
      view: "Voir",
      viewPlatform: "Voir la plateforme",
      search: "Rechercher…",
      sortBy: "Trier par",
      topBadge: "Meilleur rendement",
      manual: "manuel",
      manualHint: "Donnée non indexée DeFiLlama",
      noResults: "Aucun produit ne correspond à votre recherche.",
      productsCount: (n) => `${n} produit${n > 1 ? "s" : ""}`,
      viewPlatformAria: (platform) => `Voir ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Vous tokenisez vos propres actifs ?",
      subtitle: "Préparez votre dossier RWA en quelques minutes.",
      button: "Préparer mon dossier avec Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama, mise à jour horaire. Rendements indicatifs — pas un conseil en investissement. Vérifiez les conditions sur chaque plateforme.",
  },
  immobilier: {
    tool: "immobilier",
    eyebrow: "Comparateur · Données plateformes",
    title: "Immobilier tokenisé",
    subtitle:
      "Rendements locatifs indicatifs et actifs sous gestion — plateformes RWA immobilières, triées par rendement.",
    disclaimer:
      "Rendements bruts indicatifs, hors fiscalité et frais. Vérifiez l'éligibilité géographique et la liquidité sur chaque plateforme.",
    stats: {
      bestApy: "Meilleur rendement",
      totalTvl: "Actifs sous gestion",
      products: "Produits comparés",
      protocols: (n) => `${n} plateforme${n > 1 ? "s" : ""}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Plateformes · ${date}`,
    },
    filters: {
      all: "Tous",
      residential: "Résidentiel",
      commercial: "Commercial",
      land: "Foncier",
    },
    table: {
      protocol: "Plateforme",
      product: "Produit",
      apy: "Rendement",
      tvl: "AUM",
      chain: "Chaîne",
      view: "Voir",
      viewPlatform: "Voir la plateforme",
      search: "Rechercher…",
      sortBy: "Trier par",
      topBadge: "Meilleur rendement",
      manual: "manuel",
      manualHint: "Donnée non indexée DeFiLlama",
      noResults: "Aucun produit ne correspond à votre recherche.",
      productsCount: (n) => `${n} produit${n > 1 ? "s" : ""}`,
      viewPlatformAria: (platform) => `Voir ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Vous tokenisez de l'immobilier ?",
      subtitle: "Préparez votre dossier RWA en quelques minutes.",
      button: "Préparer mon dossier avec Auros",
    },
    footerDisclaimer:
      "Rendements indicatifs issus des données publiques des plateformes. Pas un conseil en investissement — vérifiez fiscalité, liquidité et régulation.",
  },
  obligations: {
    tool: "bonds",
    eyebrow: "Comparateur · Données live",
    title: "Obligations tokenisées",
    subtitle:
      "Rendements des tokens obligataires et fonds trésorerie — T-Bills, ETF obligataires et crédit structuré, triés par APY.",
    disclaimer:
      "Rendements indicatifs. Vérifiez la duration, la notation et l'éligibilité investisseur sur chaque plateforme.",
    stats: {
      bestApy: "Meilleur rendement",
      totalTvl: "TVL combinée",
      products: "Produits comparés",
      protocols: (n) => `${n} protocole${n > 1 ? "s" : ""}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "Tous",
      sovereign: "Souverain",
      corporate: "Corporate",
      structured: "Structuré",
    },
    table: {
      protocol: "Protocole",
      product: "Produit",
      apy: "APY",
      tvl: "TVL",
      chain: "Chaîne",
      view: "Voir",
      viewPlatform: "Voir la plateforme",
      search: "Rechercher…",
      sortBy: "Trier par",
      topBadge: "Meilleur rendement",
      manual: "manuel",
      manualHint: "Donnée non indexée DeFiLlama",
      noResults: "Aucun produit ne correspond à votre recherche.",
      productsCount: (n) => `${n} produit${n > 1 ? "s" : ""}`,
      viewPlatformAria: (platform) => `Voir ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Vous tokenisez des obligations ?",
      subtitle: "Préparez votre dossier RWA en quelques minutes.",
      button: "Préparer mon dossier avec Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama et données publiques, mise à jour horaire. Rendements indicatifs — pas un conseil en investissement.",
  },
  matieresPremieres: {
    tool: "commodities",
    eyebrow: "Comparateur · Données live",
    title: "Matières premières tokenisées",
    subtitle:
      "Rendements agricoles LandX et métaux précieux tokenisés — or et matières premières RWA, triés par APY.",
    disclaimer:
      "Les métaux précieux n'ont pas de rendement coupon. Vérifiez les frais, la custodie et la régulation.",
    stats: {
      bestApy: "Meilleur rendement",
      totalTvl: "TVL combinée",
      products: "Produits comparés",
      protocols: (n) => `${n} protocole${n > 1 ? "s" : ""}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "Tous",
      agricultural: "Agricole",
      precious_metals: "Métaux précieux",
    },
    table: {
      protocol: "Protocole",
      product: "Produit",
      apy: "APY",
      tvl: "TVL",
      chain: "Chaîne",
      view: "Voir",
      viewPlatform: "Voir la plateforme",
      search: "Rechercher…",
      sortBy: "Trier par",
      topBadge: "Meilleur rendement",
      manual: "manuel",
      manualHint: "Donnée non indexée DeFiLlama",
      noResults: "Aucun produit ne correspond à votre recherche.",
      productsCount: (n) => `${n} produit${n > 1 ? "s" : ""}`,
      viewPlatformAria: (platform) => `Voir ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Vous tokenisez des matières premières ?",
      subtitle: "Préparez votre dossier RWA en quelques minutes.",
      button: "Préparer mon dossier avec Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama et données publiques. Rendements indicatifs — pas un conseil en investissement.",
  },
  privateCredit: {
    tool: "private credit",
    eyebrow: "Comparateur · Données live",
    title: "Crédit privé tokenisé",
    subtitle:
      "Rendements des pools de crédit privé on-chain — Maple, Goldfinch, Nest Credit et Centrifuge, triés par APY.",
    disclaimer:
      "Crédit privé = risque de défaut plus élevé. Rendements indicatifs — vérifiez la due diligence de chaque pool.",
    stats: {
      bestApy: "Meilleur rendement",
      totalTvl: "TVL combinée",
      products: "Produits comparés",
      protocols: (n) => `${n} protocole${n > 1 ? "s" : ""}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "Tous",
      prime: "Institutionnel",
      emerging: "Marchés émergents",
      alternative: "Alternatif",
    },
    table: {
      protocol: "Protocole",
      product: "Produit",
      apy: "APY",
      tvl: "TVL",
      chain: "Chaîne",
      view: "Voir",
      viewPlatform: "Voir la plateforme",
      search: "Rechercher…",
      sortBy: "Trier par",
      topBadge: "Meilleur rendement",
      manual: "manuel",
      manualHint: "Donnée non indexée DeFiLlama",
      noResults: "Aucun produit ne correspond à votre recherche.",
      productsCount: (n) => `${n} produit${n > 1 ? "s" : ""}`,
      viewPlatformAria: (platform) => `Voir ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Vous structurez du crédit privé ?",
      subtitle: "Préparez votre dossier RWA en quelques minutes.",
      button: "Préparer mon dossier avec Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama, mise à jour horaire. Crédit privé — risque élevé, pas un conseil en investissement.",
  },
  footer: {
    dossier: "Dossier",
    legal: "Mentions légales",
    disclaimer:
      "APY via DeFiLlama, mise à jour horaire. Rendements indicatifs — pas un conseil en investissement. Vérifiez les conditions sur chaque plateforme.",
  },
  error: {
    title: "Erreur de chargement",
    body: "Le comparateur est temporairement indisponible. Réessayez ou revenez à l'accueil.",
    retry: "Réessayer",
    home: "Accueil",
  },
  loading: "Chargement des données…",
};

const EN: ComparatorMessages = {
  languageAria: "Language",
  nav: {
    dossierCta: "Prepare my dossier with Auros",
    dossierShort: "My dossier",
    comparatorsAria: "Auros comparators",
  },
  navDropdown: {
    label: "Other comparators",
    compareAll: "View all yields →",
    jurisdictions: "Jurisdiction comparator",
    current: "Current",
  },
  risk: {
    conservative: "Treasury",
    core: "Core",
    advanced: "Alternative",
    badgeHint: "Indicative risk profile — not investment advice",
  },
  crossLinks: {
    title: "Also compared on AUROS",
    explore: "Explore comparator →",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "Hub · All comparators",
    title: "RWA yields by risk profile",
    subtitle:
      "Aggregated view across all five AUROS comparators — best yield is shown per risk tier, not in one global ranking.",
    disclaimer:
      "Indicative profiles. Each product has its own access terms, liquidity and regulation.",
    tiers: {
      conservative: {
        label: "Conservative",
        description: "Treasury, sovereign, metals — capital preservation focus.",
      },
      core: {
        label: "Core",
        description: "Residential real estate, prime credit, corporate bonds.",
      },
      advanced: {
        label: "Alternative",
        description: "Structured credit, land, agriculture — higher yield, higher risk.",
      },
    },
    tierBest: "Best yield",
    tierProducts: (n) => `${n} product${n === 1 ? "" : "s"} in this profile`,
    viewComparator: "View comparator",
    viewPlatform: "View platform",
    updated: (date) => `Updated · ${date}`,
    totalProducts: (n) => `${n} unique product${n === 1 ? "" : "s"}`,
    dossierBanner: {
      title: "Structuring an RWA asset?",
      subtitle: "Prepare your admission dossier in minutes — score, data room, compliance.",
      cta: "Prepare my dossier",
    },
    filters: {
      label: "Filter by minimum",
      all: "All",
      under500: "Minimum < $500",
      under5000: "Minimum < $5,000",
    },
    sort: {
      label: "Sort by",
      apy: "Yield",
      liquidity: "Liquidity",
    },
    liquidity: {
      instant: "< 1 day",
      days: (n) => `${n}d`,
    },
    table: {
      protocol: "Protocol",
      product: "Product",
      apy: "APY",
      minInvestment: "Minimum",
      liquidity: "Liquidity",
      fees: "Fees",
      risk: "Profile",
      assetType: "Asset type",
      view: "View",
    },
    noResults: "No products match these filters.",
    metaDisclaimer:
      "Minimum, liquidity and fees are indicative — check exact terms on each platform before investing.",
    footerDisclaimer:
      "Indicative yields aggregated from AUROS comparators. Not investment advice — check each platform.",
    selection: {
      barLabel: "Comparator selection",
      count: (n) =>
        `${n} product${n === 1 ? "" : "s"} selected · max. 4`,
      compare: "Compare",
      compareHint: "Select at least 2 products to compare.",
      clear: "Clear",
      maxReached: "Maximum 4 products — remove one to add another.",
      selectProduct: "Select to compare",
      copyLink: "Copy link",
      linkCopied: "Link copied",
    },
    comparePanel: {
      eyebrow: "Side-by-side comparison",
      title: "Compare products",
      close: "Close",
      yes: "Yes",
      no: "No",
      notAvailable: "—",
      viewFiche: "View sheet",
      rows: {
        criterion: "Criterion",
        product: "Product",
        apy: "APY",
        minInvestment: "Minimum",
        liquidity: "Liquidity",
        fees: "Fees",
        jurisdiction: "Jurisdiction",
        accredited: "Accredited",
        chain: "Chain",
        fiche: "AUROS sheet",
      },
    },
    ecosystem: {
      title: "AUROS ecosystem",
      dossier: "Prepare a dossier",
      dashboard: "My dossiers",
      score: "Admission score",
      partners: "Partners & resources",
      jurisdictions: "Jurisdiction comparator",
    },
  },
  productBadges: {
    accredited: "Accredited",
    accreditedHint:
      "Qualified investor status may be required — check eligibility before KYC.",
    new: "New",
    popular: "Popular",
  },
  assetTypes: {
    stablecoins: "Stablecoins",
    immobilier: "Real estate",
    obligations: "Bonds",
    matieresPremieres: "Commodities",
    privateCredit: "Private credit",
  },
  tabs: {
    stablecoins: "Stablecoins",
    immobilier: "Real estate",
    obligations: "Bonds",
    matieresPremieres: "Commodities",
    privateCredit: "Private credit",
    soon: "Soon",
  },
  stablecoins: {
    tool: "stablecoins",
    eyebrow: "Comparator · Live data",
    title: "RWA Stablecoins",
    subtitle:
      "Yields and liquidity across leading protocols — sorted by APY, updated hourly.",
    disclaimer:
      "Indicative yields only. Check access requirements and regulation on each platform.",
    stats: {
      bestApy: "Best yield",
      totalTvl: "Combined TVL",
      products: "Products compared",
      protocols: (n) => `${n} protocol${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: { all: "All", treasury: "Treasury", credit: "Credit" },
    table: {
      protocol: "Protocol",
      product: "Product",
      apy: "APY",
      tvl: "TVL",
      chain: "Chain",
      view: "View",
      viewPlatform: "View platform",
      search: "Search…",
      sortBy: "Sort by",
      topBadge: "Best yield",
      manual: "manual",
      manualHint: "Not indexed on DeFiLlama",
      noResults: "No products match your search.",
      productsCount: (n) => `${n} product${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `View ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Tokenizing your own assets?",
      subtitle: "Prepare your RWA dossier in minutes.",
      button: "Prepare my dossier with Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama, hourly updates. Indicative yields — not investment advice. Check terms on each platform.",
  },
  immobilier: {
    tool: "real estate",
    eyebrow: "Comparator · Platform data",
    title: "Tokenized real estate",
    subtitle:
      "Indicative rental yields and assets under management — RWA property platforms, sorted by yield.",
    disclaimer:
      "Indicative gross yields, before tax and fees. Check geographic eligibility and liquidity on each platform.",
    stats: {
      bestApy: "Best yield",
      totalTvl: "Assets under management",
      products: "Products compared",
      protocols: (n) => `${n} platform${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Platforms · ${date}`,
    },
    filters: {
      all: "All",
      residential: "Residential",
      commercial: "Commercial",
      land: "Land",
    },
    table: {
      protocol: "Platform",
      product: "Product",
      apy: "Yield",
      tvl: "AUM",
      chain: "Chain",
      view: "View",
      viewPlatform: "View platform",
      search: "Search…",
      sortBy: "Sort by",
      topBadge: "Best yield",
      manual: "manual",
      manualHint: "Not indexed on DeFiLlama",
      noResults: "No products match your search.",
      productsCount: (n) => `${n} product${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `View ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Tokenizing real estate?",
      subtitle: "Prepare your RWA dossier in minutes.",
      button: "Prepare my dossier with Auros",
    },
    footerDisclaimer:
      "Indicative yields from public platform data. Not investment advice — check tax, liquidity and regulation.",
  },
  obligations: {
    tool: "bonds",
    eyebrow: "Comparator · Live data",
    title: "Tokenized bonds",
    subtitle:
      "Yields on tokenized bond products and treasury funds — T-Bills, bond ETFs and structured credit, sorted by APY.",
    disclaimer:
      "Indicative yields only. Check duration, rating and investor eligibility on each platform.",
    stats: {
      bestApy: "Best yield",
      totalTvl: "Combined TVL",
      products: "Products compared",
      protocols: (n) => `${n} protocol${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "All",
      sovereign: "Sovereign",
      corporate: "Corporate",
      structured: "Structured",
    },
    table: {
      protocol: "Protocol",
      product: "Product",
      apy: "APY",
      tvl: "TVL",
      chain: "Chain",
      view: "View",
      viewPlatform: "View platform",
      search: "Search…",
      sortBy: "Sort by",
      topBadge: "Best yield",
      manual: "manual",
      manualHint: "Not indexed on DeFiLlama",
      noResults: "No products match your search.",
      productsCount: (n) => `${n} product${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `View ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Tokenizing bonds?",
      subtitle: "Prepare your RWA dossier in minutes.",
      button: "Prepare my dossier with Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama and public sources, hourly updates. Indicative yields — not investment advice.",
  },
  matieresPremieres: {
    tool: "commodities",
    eyebrow: "Comparator · Live data",
    title: "Tokenized commodities",
    subtitle:
      "LandX agricultural yields and tokenized precious metals — RWA commodities sorted by APY.",
    disclaimer:
      "Precious metals typically have no coupon yield. Check fees, custody and regulation.",
    stats: {
      bestApy: "Best yield",
      totalTvl: "Combined TVL",
      products: "Products compared",
      protocols: (n) => `${n} protocol${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "All",
      agricultural: "Agricultural",
      precious_metals: "Precious metals",
    },
    table: {
      protocol: "Protocol",
      product: "Product",
      apy: "APY",
      tvl: "TVL",
      chain: "Chain",
      view: "View",
      viewPlatform: "View platform",
      search: "Search…",
      sortBy: "Sort by",
      topBadge: "Best yield",
      manual: "manual",
      manualHint: "Not indexed on DeFiLlama",
      noResults: "No products match your search.",
      productsCount: (n) => `${n} product${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `View ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Tokenizing commodities?",
      subtitle: "Prepare your RWA dossier in minutes.",
      button: "Prepare my dossier with Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama and public sources. Indicative yields — not investment advice.",
  },
  privateCredit: {
    tool: "private credit",
    eyebrow: "Comparator · Live data",
    title: "Tokenized private credit",
    subtitle:
      "On-chain private credit pool yields — Maple, Goldfinch, Nest Credit and Centrifuge, sorted by APY.",
    disclaimer:
      "Private credit carries higher default risk. Indicative yields — verify each pool's due diligence.",
    stats: {
      bestApy: "Best yield",
      totalTvl: "Combined TVL",
      products: "Products compared",
      protocols: (n) => `${n} protocol${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "All",
      prime: "Institutional",
      emerging: "Emerging markets",
      alternative: "Alternative",
    },
    table: {
      protocol: "Protocol",
      product: "Product",
      apy: "APY",
      tvl: "TVL",
      chain: "Chain",
      view: "View",
      viewPlatform: "View platform",
      search: "Search…",
      sortBy: "Sort by",
      topBadge: "Best yield",
      manual: "manual",
      manualHint: "Not indexed on DeFiLlama",
      noResults: "No products match your search.",
      productsCount: (n) => `${n} product${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `View ${platform}`,
    },
    cta: {
      eyebrow: "Auros Dossier",
      title: "Structuring private credit?",
      subtitle: "Prepare your RWA dossier in minutes.",
      button: "Prepare my dossier with Auros",
    },
    footerDisclaimer:
      "APY via DeFiLlama, hourly updates. Private credit — high risk, not investment advice.",
  },
  footer: {
    dossier: "Dossier",
    legal: "Legal notice",
    disclaimer:
      "APY via DeFiLlama, hourly updates. Indicative yields — not investment advice. Check terms on each platform.",
  },
  error: {
    title: "Loading error",
    body: "The comparator is temporarily unavailable. Retry or return home.",
    retry: "Retry",
    home: "Home",
  },
  loading: "Loading data…",
};

const ES: ComparatorMessages = {
  languageAria: "Idioma",
  nav: {
    dossierCta: "Preparar mi expediente con Auros",
    dossierShort: "Mi expediente",
    comparatorsAria: "Comparadores Auros",
  },
  navDropdown: {
    label: "Otros comparadores",
    compareAll: "Ver todos los rendimientos →",
    jurisdictions: "Comparador jurisdicciones",
    current: "Actual",
  },
  risk: {
    conservative: "Tesorería",
    core: "Core",
    advanced: "Alternativo",
    badgeHint: "Perfil de riesgo indicativo — no es asesoramiento financiero",
  },
  crossLinks: {
    title: "También comparado en AUROS",
    explore: "Explorar comparador →",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "Hub · Todos los comparadores",
    title: "Rendimientos RWA por perfil de riesgo",
    subtitle:
      "Vista agregada de los cinco comparadores AUROS — el mejor rendimiento se muestra por nivel de riesgo, no en un único ranking global.",
    disclaimer:
      "Perfiles indicativos. Cada producto tiene sus propias condiciones de acceso, liquidez y regulación.",
    tiers: {
      conservative: {
        label: "Conservador",
        description: "Tesorería, soberano, metales — prioridad preservación del capital.",
      },
      core: {
        label: "Core",
        description: "Inmobiliario residencial, crédito prime, bonos corporativos.",
      },
      advanced: {
        label: "Alternativo",
        description: "Crédito estructurado, terrenos, agrícola — mayor rendimiento, mayor riesgo.",
      },
    },
    tierBest: "Mejor rendimiento",
    tierProducts: (n) => `${n} producto${n === 1 ? "" : "s"} en este perfil`,
    viewComparator: "Ver comparador",
    viewPlatform: "Ver plataforma",
    updated: (date) => `Actualizado · ${date}`,
    totalProducts: (n) => `${n} producto${n === 1 ? "" : "s"} único${n === 1 ? "" : "s"}`,
    dossierBanner: {
      title: "¿Estructura un activo RWA?",
      subtitle: "Prepare su expediente de admisión en minutos — score, data room, cumplimiento.",
      cta: "Preparar mi expediente",
    },
    filters: {
      label: "Filtrar por mínimo",
      all: "Todos",
      under500: "Mínimo < 500 $",
      under5000: "Mínimo < 5 000 $",
    },
    sort: {
      label: "Ordenar por",
      apy: "Rendimiento",
      liquidity: "Liquidez",
    },
    liquidity: {
      instant: "< 1 día",
      days: (n) => `${n} d`,
    },
    table: {
      protocol: "Protocolo",
      product: "Producto",
      apy: "APY",
      minInvestment: "Mínimo",
      liquidity: "Liquidez",
      fees: "Comisiones",
      risk: "Perfil",
      assetType: "Tipo de activo",
      view: "Ver",
    },
    noResults: "Ningún producto coincide con estos filtros.",
    metaDisclaimer:
      "Mínimo, liquidez y comisiones indicativos — verifique las condiciones exactas en cada plataforma antes de invertir.",
    footerDisclaimer:
      "Rendimientos indicativos agregados de los comparadores AUROS. No es asesoramiento financiero — verifique cada plataforma.",
    selection: {
      barLabel: "Selección comparador",
      count: (n) =>
        `${n} producto${n > 1 ? "s" : ""} seleccionado${n > 1 ? "s" : ""} · máx. 4`,
      compare: "Comparar",
      compareHint: "Seleccione al menos 2 productos para comparar.",
      clear: "Borrar",
      maxReached: "Máximo 4 productos — retire uno para añadir otro.",
      selectProduct: "Seleccionar para comparar",
      copyLink: "Copiar enlace",
      linkCopied: "Enlace copiado",
    },
    comparePanel: {
      eyebrow: "Comparación lado a lado",
      title: "Comparar productos",
      close: "Cerrar",
      yes: "Sí",
      no: "No",
      notAvailable: "—",
      viewFiche: "Ver ficha",
      rows: {
        criterion: "Criterio",
        product: "Producto",
        apy: "APY",
        minInvestment: "Mínimo",
        liquidity: "Liquidez",
        fees: "Comisiones",
        jurisdiction: "Jurisdicción",
        accredited: "Acreditado",
        chain: "Cadena",
        fiche: "Ficha AUROS",
      },
    },
    ecosystem: {
      title: "Ecosistema AUROS",
      dossier: "Preparar expediente",
      dashboard: "Mis expedientes",
      score: "Score de admisión",
      partners: "Socios y recursos",
      jurisdictions: "Comparador jurisdicciones",
    },
  },
  productBadges: {
    accredited: "Acreditado",
    accreditedHint:
      "Puede requerirse inversor cualificado — verifique elegibilidad antes del KYC.",
    new: "Nuevo",
    popular: "Popular",
  },
  assetTypes: {
    stablecoins: "Stablecoins",
    immobilier: "Inmobiliario",
    obligations: "Bonos",
    matieresPremieres: "Materias primas",
    privateCredit: "Crédito privado",
  },
  tabs: {
    stablecoins: "Stablecoins",
    immobilier: "Inmobiliario",
    obligations: "Bonos",
    matieresPremieres: "Materias primas",
    privateCredit: "Crédito privado",
    soon: "Pronto",
  },
  stablecoins: {
    tool: "stablecoins",
    eyebrow: "Comparador · Datos en vivo",
    title: "Stablecoins RWA",
    subtitle:
      "Rendimientos y liquidez de los principales protocolos — ordenados por APY, actualizados cada hora.",
    disclaimer:
      "Rendimientos indicativos. Verifique requisitos de acceso y regulación en cada plataforma.",
    stats: {
      bestApy: "Mejor rendimiento",
      totalTvl: "TVL combinado",
      products: "Productos comparados",
      protocols: (n) => `${n} protocolo${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: { all: "Todos", treasury: "Tesorería", credit: "Crédito" },
    table: {
      protocol: "Protocolo",
      product: "Producto",
      apy: "APY",
      tvl: "TVL",
      chain: "Cadena",
      view: "Ver",
      viewPlatform: "Ver plataforma",
      search: "Buscar…",
      sortBy: "Ordenar por",
      topBadge: "Mejor rendimiento",
      manual: "manual",
      manualHint: "No indexado en DeFiLlama",
      noResults: "Ningún producto coincide con su búsqueda.",
      productsCount: (n) => `${n} producto${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `Ver ${platform}`,
    },
    cta: {
      eyebrow: "Auros Expediente",
      title: "¿Tokeniza sus propios activos?",
      subtitle: "Prepare su expediente RWA en minutos.",
      button: "Preparar mi expediente con Auros",
    },
    footerDisclaimer:
      "APY vía DeFiLlama, actualización horaria. Rendimientos indicativos — no es asesoramiento financiero. Verifique condiciones en cada plataforma.",
  },
  immobilier: {
    tool: "inmobiliario",
    eyebrow: "Comparador · Datos de plataformas",
    title: "Inmobiliario tokenizado",
    subtitle:
      "Rendimientos de alquiler indicativos y activos bajo gestión — plataformas RWA inmobiliarias, ordenadas por rendimiento.",
    disclaimer:
      "Rendimientos brutos indicativos, sin impuestos ni comisiones. Verifique elegibilidad geográfica y liquidez en cada plataforma.",
    stats: {
      bestApy: "Mejor rendimiento",
      totalTvl: "Activos bajo gestión",
      products: "Productos comparados",
      protocols: (n) => `${n} plataforma${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Plataformas · ${date}`,
    },
    filters: {
      all: "Todos",
      residential: "Residencial",
      commercial: "Comercial",
      land: "Terrenos",
    },
    table: {
      protocol: "Plataforma",
      product: "Producto",
      apy: "Rendimiento",
      tvl: "AUM",
      chain: "Cadena",
      view: "Ver",
      viewPlatform: "Ver plataforma",
      search: "Buscar…",
      sortBy: "Ordenar por",
      topBadge: "Mejor rendimiento",
      manual: "manual",
      manualHint: "No indexado en DeFiLlama",
      noResults: "Ningún producto coincide con su búsqueda.",
      productsCount: (n) => `${n} producto${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `Ver ${platform}`,
    },
    cta: {
      eyebrow: "Auros Expediente",
      title: "¿Tokeniza inmuebles?",
      subtitle: "Prepare su expediente RWA en minutos.",
      button: "Preparar mi expediente con Auros",
    },
    footerDisclaimer:
      "Rendimientos indicativos de datos públicos de plataformas. No es asesoramiento financiero — verifique fiscalidad, liquidez y regulación.",
  },
  obligations: {
    tool: "bonds",
    eyebrow: "Comparador · Datos en vivo",
    title: "Bonos tokenizados",
    subtitle:
      "Rendimientos de productos obligacionarios y fondos de tesorería — T-Bills, ETF de bonos y crédito estructurado, ordenados por APY.",
    disclaimer:
      "Rendimientos indicativos. Verifique duración, calificación y elegibilidad del inversor en cada plataforma.",
    stats: {
      bestApy: "Mejor rendimiento",
      totalTvl: "TVL combinado",
      products: "Productos comparados",
      protocols: (n) => `${n} protocolo${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "Todos",
      sovereign: "Soberano",
      corporate: "Corporativo",
      structured: "Estructurado",
    },
    table: {
      protocol: "Protocolo",
      product: "Producto",
      apy: "APY",
      tvl: "TVL",
      chain: "Cadena",
      view: "Ver",
      viewPlatform: "Ver plataforma",
      search: "Buscar…",
      sortBy: "Ordenar por",
      topBadge: "Mejor rendimiento",
      manual: "manual",
      manualHint: "No indexado en DeFiLlama",
      noResults: "Ningún producto coincide con su búsqueda.",
      productsCount: (n) => `${n} producto${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `Ver ${platform}`,
    },
    cta: {
      eyebrow: "Auros Expediente",
      title: "¿Tokeniza bonos?",
      subtitle: "Prepare su expediente RWA en minutos.",
      button: "Preparar mi expediente con Auros",
    },
    footerDisclaimer:
      "APY vía DeFiLlama y fuentes públicas, actualización horaria. Rendimientos indicativos — no es asesoramiento financiero.",
  },
  matieresPremieres: {
    tool: "materias primas",
    eyebrow: "Comparador · Datos en vivo",
    title: "Materias primas tokenizadas",
    subtitle:
      "Rendimientos agrícolas LandX y metales preciosos tokenizados — materias primas RWA ordenadas por APY.",
    disclaimer:
      "Los metales preciosos no tienen cupón. Verifique comisiones, custodia y regulación.",
    stats: {
      bestApy: "Mejor rendimiento",
      totalTvl: "TVL combinado",
      products: "Productos comparados",
      protocols: (n) => `${n} protocolo${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "Todos",
      agricultural: "Agrícola",
      precious_metals: "Metales preciosos",
    },
    table: {
      protocol: "Protocolo",
      product: "Producto",
      apy: "APY",
      tvl: "TVL",
      chain: "Cadena",
      view: "Ver",
      viewPlatform: "Ver plataforma",
      search: "Buscar…",
      sortBy: "Ordenar por",
      topBadge: "Mejor rendimiento",
      manual: "manual",
      manualHint: "No indexado en DeFiLlama",
      noResults: "Ningún producto coincide con su búsqueda.",
      productsCount: (n) => `${n} producto${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `Ver ${platform}`,
    },
    cta: {
      eyebrow: "Auros Expediente",
      title: "¿Tokeniza materias primas?",
      subtitle: "Prepare su expediente RWA en minutos.",
      button: "Preparar mi expediente con Auros",
    },
    footerDisclaimer:
      "APY vía DeFiLlama y fuentes públicas. Rendimientos indicativos — no es asesoramiento financiero.",
  },
  privateCredit: {
    tool: "crédito privado",
    eyebrow: "Comparador · Datos en vivo",
    title: "Crédito privado tokenizado",
    subtitle:
      "Rendimientos de pools de crédito privado on-chain — Maple, Goldfinch, Nest Credit y Centrifuge, ordenados por APY.",
    disclaimer:
      "Crédito privado = mayor riesgo de impago. Rendimientos indicativos — verifique la due diligence de cada pool.",
    stats: {
      bestApy: "Mejor rendimiento",
      totalTvl: "TVL combinado",
      products: "Productos comparados",
      protocols: (n) => `${n} protocolo${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Cache · ${date}`,
    },
    filters: {
      all: "Todos",
      prime: "Institucional",
      emerging: "Mercados emergentes",
      alternative: "Alternativo",
    },
    table: {
      protocol: "Protocolo",
      product: "Producto",
      apy: "APY",
      tvl: "TVL",
      chain: "Cadena",
      view: "Ver",
      viewPlatform: "Ver plataforma",
      search: "Buscar…",
      sortBy: "Ordenar por",
      topBadge: "Mejor rendimiento",
      manual: "manual",
      manualHint: "No indexado en DeFiLlama",
      noResults: "Ningún producto coincide con su búsqueda.",
      productsCount: (n) => `${n} producto${n === 1 ? "" : "s"}`,
      viewPlatformAria: (platform) => `Ver ${platform}`,
    },
    cta: {
      eyebrow: "Auros Expediente",
      title: "¿Estructura crédito privado?",
      subtitle: "Prepare su expediente RWA en minutos.",
      button: "Preparar mi expediente con Auros",
    },
    footerDisclaimer:
      "APY vía DeFiLlama, actualización horaria. Crédito privado — alto riesgo, no es asesoramiento financiero.",
  },
  footer: {
    dossier: "Expediente",
    legal: "Aviso legal",
    disclaimer:
      "APY vía DeFiLlama, actualización horaria. Rendimientos indicativos — no es asesoramiento financiero. Verifique condiciones en cada plataforma.",
  },
  error: {
    title: "Error de carga",
    body: "El comparador no está disponible temporalmente. Reintente o vuelva al inicio.",
    retry: "Reintentar",
    home: "Inicio",
  },
  loading: "Cargando datos…",
};

const CATALOG: Record<Locale, ComparatorMessages> = { fr: FR, en: EN, es: ES };

export function getComparatorMessages(locale: Locale): ComparatorMessages {
  return CATALOG[locale] ?? FR;
}

export function formatComparatorDate(iso: string, locale: Locale): string {
  const tag = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-GB";
  return new Date(iso).toLocaleString(tag, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function assetTypeForId(
  m: ComparatorMessages,
  id: string
): string {
  switch (id) {
    case "stablecoins":
      return m.assetTypes.stablecoins;
    case "immobilier":
      return m.assetTypes.immobilier;
    case "obligations":
      return m.assetTypes.obligations;
    case "matieres-premieres":
      return m.assetTypes.matieresPremieres;
    case "private-credit":
      return m.assetTypes.privateCredit;
    default:
      return id;
  }
}

export function tabLabelForId(m: ComparatorMessages, id: string): string {
  switch (id) {
    case "stablecoins":
      return m.tabs.stablecoins;
    case "immobilier":
      return m.tabs.immobilier;
    case "obligations":
      return m.tabs.obligations;
    case "matieres-premieres":
      return m.tabs.matieresPremieres;
    case "private-credit":
      return m.tabs.privateCredit;
    default:
      return id;
  }
}
