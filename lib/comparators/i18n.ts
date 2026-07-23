import { localeCatalog, type Locale } from "@/lib/i18n";
import { AR } from "./locales/ar";
import { ZH } from "./locales/zh";

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
  /** Soft next steps on compare surfaces — max 3 CTAs with primary dossier. */
  nextSteps: {
    phasesHint: string;
    green: string;
    csrd: string;
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
      greenLink: string;
    };
    /** Strip CTA when on /compare (maps to ComparatorPageCopy.cta shape). */
    dossierCta: {
      eyebrow: string;
      title: string;
      subtitle: string;
      button: string;
    };
    micaCheckerLink: string;
    askCopilot: string;
    aiAssist: {
      ariaLabel: string;
      eyebrow: string;
      explain: string;
      suggest: string;
      openCopilot: string;
      hint: string;
      add: string;
      applyViaUrl: string;
      promptSuggestWithSelection: string;
      promptSuggestEmpty: string;
      promptExplainSelection: (ids: string) => string;
      promptExplainEmpty: string;
      errorStatus: (status: number) => string;
      networkError: string;
    };
    filters: {
      label: string;
      all: string;
      under500: string;
      under5000: string;
      class: string;
      risk: string;
      source: string;
      sourceLive: string;
      sourceManual: string;
      chain: string;
      apy: string;
      apyAny: string;
      apyPositive: string;
      apyOver5: string;
      apyOver10: string;
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
      tvl: string;
      source: string;
      chain: string;
      view: string;
    };
    selectionPrompt: string;
    faqTitle: string;
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
      copilot: string;
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
        tvl: string;
        source: string;
        risk: string;
        fiche: string;
      };
    };
    /** Monetization chrome — max 3 primary CTAs in panel. */
    monetization: {
      eyebrow: string;
      subtitle: string;
      reportCta: string;
      dossierCta: string;
      deskCta: string;
      csvCta: string;
      csvDone: string;
      csvLicenceHint: string;
      greenUpsell: string;
    };
    sponsored: {
      badgeSponsored: string;
      badgePartenariat: string;
      hint: string;
      stripTitle: string;
      stripSubtitle: string;
    };
    alerts: {
      eyebrow: string;
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      errorRateLimit: string;
      errorEmail: string;
      errorGeneric: string;
    };
    report: {
      eyebrow: string;
      title: string;
      subtitle: string;
      print: string;
      downloadPdf: string;
      dossierCta: string;
      deskCta: string;
      back: string;
      empty: string;
      indicative: string;
      asOf: (date: string) => string;
    };
    ecosystem: {
      title: string;
      dossier: string;
      green: string;
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
    privateEquity: string;
    artCollectibles: string;
  };
  tabs: {
    stablecoins: string;
    immobilier: string;
    obligations: string;
    matieresPremieres: string;
    privateCredit: string;
    privateEquity: string;
    artCollectibles: string;
    soon: string;
  };
  stablecoins: ComparatorPageCopy;
  immobilier: ComparatorPageCopy;
  obligations: ComparatorPageCopy;
  matieresPremieres: ComparatorPageCopy;
  privateCredit: ComparatorPageCopy;
  privateEquity: ComparatorPageCopy;
  artCollectibles: ComparatorPageCopy;
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
    dossierCta: "Démarrer mon dossier",
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
  nextSteps: {
    phasesHint:
      "4 parties · ~4 min · indicatif — Actif → Stratégie → Conformité → Récap. Pas un audit.",
    green: "Voie Green · eau & énergie →",
    csrd: "Check CSRD indicatif →",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "Hub · Tous les comparateurs",
    title: "Rendements RWA par profil de risque",
    subtitle:
      "Vue agrégée des comparateurs AUROS — equity, crédit, immo, bonds, commodities, art. Meilleur rendement affiché par niveau de risque, pas en un seul classement global.",
    disclaimer:
      "Profils indicatifs. Live = DeFiLlama ; manuel = catalogue curaté. Chaque produit a ses propres conditions d'accès, liquidité et régulation.",
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
      subtitle:
        "Après le marché : démarrez un dossier indicatif en ~4 min — score, data room plus tard, sans promesse de rendement.",
      cta: "Démarrer mon dossier",
      greenLink:
        "Carbone, eau ou énergie dans la shortlist ? Green + CSRD check indicatif →",
    },
    dossierCta: {
      eyebrow: "Après le marché",
      title: "Passez du comparateur au dossier",
      subtitle:
        "4 parties · ~4 min · indicatif. Vous complétez ensuite avec votre conseil.",
      button: "Démarrer mon dossier",
    },
    micaCheckerLink: "Test MiCA indicatif →",
    askCopilot: "Poser une question au Copilot →",
    aiAssist: {
      ariaLabel: "Assistant comparateur",
      eyebrow: "Copilot · sélection",
      explain: "Expliquer",
      suggest: "Proposer des RWA",
      openCopilot: "Ouvrir Copilot →",
      hint: "Expliquez la sélection ou demandez des RWA à ajouter (max 4).",
      add: "Ajouter",
      applyViaUrl: "Tout appliquer via URL →",
      promptSuggestWithSelection:
        "Propose 1 à 2 RWA à ajouter à ma sélection de comparaison (IDs hub).",
      promptSuggestEmpty:
        "Propose 2 à 3 RWA intéressants à comparer sur le hub AUROS.",
      promptExplainSelection: (ids) =>
        `Explique brièvement ma sélection (${ids}) — APY, TVL, liquidité, risques indicatifs.`,
      promptExplainEmpty:
        "Explique comment utiliser le comparateur RWA AUROS en 3 phrases.",
      errorStatus: (status) => `Erreur ${status}`,
      networkError: "Erreur réseau",
    },
    filters: {
      label: "Filtrer",
      all: "Tous",
      under500: "Minimum < 500 $",
      under5000: "Minimum < 5 000 $",
      class: "Classe",
      risk: "Risque",
      source: "Source",
      sourceLive: "Live DeFiLlama",
      sourceManual: "Manuel",
      chain: "Chaîne",
      apy: "APY",
      apyAny: "Tous APY",
      apyPositive: "APY > 0",
      apyOver5: "APY ≥ 5 %",
      apyOver10: "APY ≥ 10 %",
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
      tvl: "TVL",
      source: "Source",
      chain: "Chaîne",
      view: "Voir",
    },
    selectionPrompt:
      "Sélectionnez 2 à 4 produits pour une comparaison côte à côte (APY, TVL, risque, source).",
    faqTitle: "Questions fréquentes",
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
      copilot: "Copilot",
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
        tvl: "TVL",
        source: "Source",
        risk: "Risque",
        fiche: "Fiche AUROS",
      },
    },
    monetization: {
      eyebrow: "Après la comparaison",
      subtitle:
        "Rapport indicatif partageable, dossier payant, ou intro desk — sans classement payant.",
      reportCta: "Rapport compare",
      dossierCta: "Dossier / data room",
      deskCta: "Parler au desk",
      csvCta: "Exporter CSV",
      csvDone: "CSV téléchargé",
      csvLicenceHint: "Export gratuit limité — licence données via Premium / API",
      greenUpsell: "Lignes carbone / ressource → voie Green + CSRD ←",
    },
    sponsored: {
      badgeSponsored: "Sponsored",
      badgePartenariat: "Partenariat",
      hint: "Emplacement partenariat — n’achète pas le rang APY ni le badge Verified",
      stripTitle: "Partenariats (affichage)",
      stripSubtitle:
        "Slots explicites — le tri APY live/manuel reste inchangé.",
    },
    alerts: {
      eyebrow: "Alertes shortlist",
      title: "Surveiller cette sélection",
      subtitle:
        "Liste d’attente — on vous prévient quand les alertes APY / webhooks seront prêts.",
      emailLabel: "Email",
      emailPlaceholder: "vous@entreprise.com",
      submit: "Me prévenir",
      submitting: "Envoi…",
      success: "Inscrit — confirmation best-effort.",
      errorRateLimit: "Trop de tentatives — réessayez plus tard.",
      errorEmail: "Email invalide.",
      errorGeneric: "Échec — réessayez.",
    },
    report: {
      eyebrow: "Rapport compare · indicatif",
      title: "Compare Report",
      subtitle:
        "Snapshot partageable / imprimable — pas un conseil, APY non inventé.",
      print: "Imprimer",
      downloadPdf: "PDF signé",
      dossierCta: "Continuer vers le dossier",
      deskCta: "Intro desk",
      back: "Retour au hub",
      empty: "Sélectionnez 2 à 4 produits sur /compare pour générer un rapport.",
      indicative: "Données indicatives — vérifiez chaque plateforme avant toute décision.",
      asOf: (date) => `As of ${date}`,
    },
    ecosystem: {
      title: "Écosystème AUROS",
      dossier: "Démarrer un dossier",
      green: "AUROS Green",
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
    privateEquity: "Equity / PE",
    artCollectibles: "Art & collectibles",
  },
  tabs: {
    stablecoins: "Stablecoins",
    immobilier: "Immobilier",
    obligations: "Obligations",
    matieresPremieres: "Matières premières",
    privateCredit: "Crédit privé",
    privateEquity: "Equity / PE",
    artCollectibles: "Art",
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
      eyebrow: "Après le marché",
      title: "Vous tokenisez vos propres actifs ?",
      subtitle:
        "4 parties · ~4 min · indicatif — démarrez le dossier, complétez plus tard.",
      button: "Démarrer mon dossier",
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
      eyebrow: "Après le marché",
      title: "Vous tokenisez de l'immobilier ?",
      subtitle:
        "4 parties · ~4 min · indicatif — démarrez le dossier, complétez plus tard.",
      button: "Démarrer mon dossier",
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
      eyebrow: "Après le marché",
      title: "Vous tokenisez des obligations ?",
      subtitle:
        "4 parties · ~4 min · indicatif — démarrez le dossier, complétez plus tard.",
      button: "Démarrer mon dossier",
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
      eyebrow: "Après le marché",
      title: "Vous tokenisez des matières premières ?",
      subtitle:
        "4 parties · ~4 min · indicatif — démarrez le dossier, complétez plus tard.",
      button: "Démarrer mon dossier",
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
      eyebrow: "Après le marché",
      title: "Vous structurez du crédit privé ?",
      subtitle:
        "4 parties · ~4 min · indicatif — démarrez le dossier, complétez plus tard.",
      button: "Démarrer mon dossier",
    },
    footerDisclaimer:
      "APY via DeFiLlama, mise à jour horaire. Crédit privé — risque élevé, pas un conseil en investissement.",
  },
  privateEquity: {
    tool: "private equity",
    eyebrow: "Comparateur · Fonds & actions",
    title: "Equity & private equity tokenisés",
    subtitle:
      "Fonds PE / alt et actions tokenisées — Securitize, Ondo Global Markets, Backed, Swarm. APY 0 si aucun coupon public honnête.",
    disclaimer:
      "Beaucoup de produits equity n'ont pas de rendement fixe. Sources manuelles vs live clairement étiquetées.",
    stats: {
      bestApy: "Meilleur rendement",
      totalTvl: "TVL / AUM",
      products: "Produits comparés",
      protocols: (n) => `${n} protocole${n > 1 ? "s" : ""}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Catalogue · ${date}`,
    },
    filters: {
      all: "Tous",
      funds: "Fonds PE",
      public_equity: "Actions",
      infrastructure: "Infrastructure",
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
      eyebrow: "Après le marché",
      title: "Vous tokenisez des fonds ou des actions ?",
      subtitle:
        "4 parties · ~4 min · indicatif — démarrez le dossier, complétez plus tard.",
      button: "Démarrer mon dossier",
    },
    footerDisclaimer:
      "Données live DeFiLlama + catalogue manuel. Pas un conseil en investissement — vérifiez chaque émetteur.",
  },
  artCollectibles: {
    tool: "art",
    eyebrow: "Comparateur · Art & collectibles",
    title: "Art & collectibles tokenisés",
    subtitle:
      "Plateformes d'art fractionné et collectibles on-chain — Masterworks, Particle, Artory. Pas de rendements inventés.",
    disclaimer:
      "L'art RWA n'offre souvent pas de coupon. Comparez accès, conservation et liquidité — chiffres indicatifs.",
    stats: {
      bestApy: "Meilleur rendement",
      totalTvl: "Références",
      products: "Produits comparés",
      protocols: (n) => `${n} plateforme${n > 1 ? "s" : ""}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Catalogue · ${date}`,
    },
    filters: {
      all: "Tous",
      fine_art: "Beaux-arts",
      collectibles: "Collectibles",
    },
    table: {
      protocol: "Plateforme",
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
      eyebrow: "Après le marché",
      title: "Vous tokenisez de l'art ou des collectibles ?",
      subtitle:
        "4 parties · ~4 min · indicatif — démarrez le dossier, complétez plus tard.",
      button: "Démarrer mon dossier",
    },
    footerDisclaimer:
      "Catalogue curaté, APY 0 si aucun coupon public. Pas un conseil en investissement.",
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
    dossierCta: "Start my dossier",
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
  nextSteps: {
    phasesHint:
      "4 parts · ~4 min · indicative — Asset → Strategy → Compliance → Recap. Not an audit.",
    green: "Green path · water & energy →",
    csrd: "Indicative CSRD check →",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "Hub · All comparators",
    title: "RWA yields by risk profile",
    subtitle:
      "Aggregated view across AUROS comparators — equity, credit, real estate, bonds, commodities, art. Best yield per risk tier, not one global ranking.",
    disclaimer:
      "Indicative profiles. Live = DeFiLlama; manual = curated catalog. Each product has its own access terms, liquidity and regulation.",
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
      subtitle:
        "After the market: start an indicative dossier in ~4 min — score now, data room later, no yield promise.",
      cta: "Start my dossier",
      greenLink:
        "Carbon, water or energy in the shortlist? Green + indicative CSRD check →",
    },
    dossierCta: {
      eyebrow: "After the market",
      title: "From comparator to dossier",
      subtitle:
        "4 parts · ~4 min · indicative. You complete later with your advisor.",
      button: "Start my dossier",
    },
    micaCheckerLink: "Indicative MiCA check →",
    askCopilot: "Ask Copilot a question →",
    aiAssist: {
      ariaLabel: "Comparator assistant",
      eyebrow: "Copilot · selection",
      explain: "Explain",
      suggest: "Suggest RWAs",
      openCopilot: "Open Copilot →",
      hint: "Explain the selection or ask for RWAs to add (max 4).",
      add: "Add",
      applyViaUrl: "Apply all via URL →",
      promptSuggestWithSelection:
        "Suggest 1–2 RWAs to add to my comparison selection (hub IDs).",
      promptSuggestEmpty:
        "Suggest 2–3 interesting RWAs to compare on the AUROS hub.",
      promptExplainSelection: (ids) =>
        `Briefly explain my selection (${ids}) — APY, TVL, liquidity, indicative risks.`,
      promptExplainEmpty:
        "Explain how to use the AUROS RWA comparator in 3 sentences.",
      errorStatus: (status) => `Error ${status}`,
      networkError: "Network error",
    },
    filters: {
      label: "Filters",
      all: "All",
      under500: "Minimum < $500",
      under5000: "Minimum < $5,000",
      class: "Class",
      risk: "Risk",
      source: "Source",
      sourceLive: "Live DeFiLlama",
      sourceManual: "Manual",
      chain: "Chain",
      apy: "APY",
      apyAny: "Any APY",
      apyPositive: "APY > 0",
      apyOver5: "APY ≥ 5%",
      apyOver10: "APY ≥ 10%",
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
      tvl: "TVL",
      source: "Source",
      chain: "Chain",
      view: "View",
    },
    selectionPrompt:
      "Select 2–4 products for side-by-side compare (APY, TVL, risk, source).",
    faqTitle: "FAQ",
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
      copilot: "Copilot",
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
        tvl: "TVL",
        source: "Source",
        risk: "Risk",
        fiche: "AUROS sheet",
      },
    },
    monetization: {
      eyebrow: "After compare",
      subtitle:
        "Shareable indicative report, paid dossier, or desk intro — no pay-to-rank.",
      reportCta: "Compare report",
      dossierCta: "Dossier / data room",
      deskCta: "Talk to desk",
      csvCta: "Export CSV",
      csvDone: "CSV downloaded",
      csvLicenceHint: "Free limited export — data licence via Premium / API",
      greenUpsell: "Carbon / resource rows → Green + CSRD path ←",
    },
    sponsored: {
      badgeSponsored: "Sponsored",
      badgePartenariat: "Partnership",
      hint: "Partnership slot — does not buy APY rank or Verified badge",
      stripTitle: "Partnerships (display)",
      stripSubtitle: "Explicit slots — live/manual APY sort is unchanged.",
    },
    alerts: {
      eyebrow: "Shortlist alerts",
      title: "Watch this selection",
      subtitle:
        "Waitlist — we’ll notify you when APY alerts / webhooks are ready.",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      submit: "Notify me",
      submitting: "Sending…",
      success: "Joined — best-effort confirmation.",
      errorRateLimit: "Too many attempts — try again later.",
      errorEmail: "Invalid email.",
      errorGeneric: "Failed — try again.",
    },
    report: {
      eyebrow: "Compare report · indicative",
      title: "Compare Report",
      subtitle: "Shareable / printable snapshot — not advice, APY never invented.",
      print: "Print",
      downloadPdf: "Signed PDF",
      dossierCta: "Continue to dossier",
      deskCta: "Desk intro",
      back: "Back to hub",
      empty: "Select 2–4 products on /compare to generate a report.",
      indicative: "Indicative data — verify each platform before any decision.",
      asOf: (date) => `As of ${date}`,
    },
    ecosystem: {
      title: "AUROS ecosystem",
      dossier: "Start a dossier",
      green: "AUROS Green",
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
    privateEquity: "Equity / PE",
    artCollectibles: "Art & collectibles",
  },
  tabs: {
    stablecoins: "Stablecoins",
    immobilier: "Real estate",
    obligations: "Bonds",
    matieresPremieres: "Commodities",
    privateCredit: "Private credit",
    privateEquity: "Equity / PE",
    artCollectibles: "Art",
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
      eyebrow: "After the market",
      title: "Tokenizing your own assets?",
      subtitle:
        "4 parts · ~4 min · indicative — start the dossier, complete later.",
      button: "Start my dossier",
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
      eyebrow: "After the market",
      title: "Tokenizing real estate?",
      subtitle:
        "4 parts · ~4 min · indicative — start the dossier, complete later.",
      button: "Start my dossier",
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
      eyebrow: "After the market",
      title: "Tokenizing bonds?",
      subtitle:
        "4 parts · ~4 min · indicative — start the dossier, complete later.",
      button: "Start my dossier",
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
      eyebrow: "After the market",
      title: "Tokenizing commodities?",
      subtitle:
        "4 parts · ~4 min · indicative — start the dossier, complete later.",
      button: "Start my dossier",
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
      eyebrow: "After the market",
      title: "Structuring private credit?",
      subtitle:
        "4 parts · ~4 min · indicative — start the dossier, complete later.",
      button: "Start my dossier",
    },
    footerDisclaimer:
      "APY via DeFiLlama, hourly updates. Private credit — high risk, not investment advice.",
  },
  privateEquity: {
    tool: "private equity",
    eyebrow: "Comparator · Funds & stocks",
    title: "Tokenized equity & private equity",
    subtitle:
      "PE / alt funds and tokenized stocks — Securitize, Ondo Global Markets, Backed, Swarm. APY 0 when no honest public coupon exists.",
    disclaimer:
      "Many equity products have no fixed yield. Manual vs live sources are clearly labeled.",
    stats: {
      bestApy: "Best yield",
      totalTvl: "TVL / AUM",
      products: "Products compared",
      protocols: (n) => `${n} protocol${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Catalog · ${date}`,
    },
    filters: {
      all: "All",
      funds: "PE funds",
      public_equity: "Public equity",
      infrastructure: "Infrastructure",
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
      eyebrow: "After the market",
      title: "Tokenizing funds or equities?",
      subtitle:
        "4 parts · ~4 min · indicative — start the dossier, complete later.",
      button: "Start my dossier",
    },
    footerDisclaimer:
      "Live DeFiLlama + manual catalog. Not investment advice — verify each issuer.",
  },
  artCollectibles: {
    tool: "art",
    eyebrow: "Comparator · Art & collectibles",
    title: "Tokenized art & collectibles",
    subtitle:
      "Fractional art and on-chain collectibles — Masterworks, Particle, Artory. No invented yields.",
    disclaimer:
      "Art RWAs usually have no coupon. Compare access, custody and liquidity — figures are indicative.",
    stats: {
      bestApy: "Best yield",
      totalTvl: "References",
      products: "Products compared",
      protocols: (n) => `${n} platform${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Catalog · ${date}`,
    },
    filters: {
      all: "All",
      fine_art: "Fine art",
      collectibles: "Collectibles",
    },
    table: {
      protocol: "Platform",
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
      eyebrow: "After the market",
      title: "Tokenizing art or collectibles?",
      subtitle:
        "4 parts · ~4 min · indicative — start the dossier, complete later.",
      button: "Start my dossier",
    },
    footerDisclaimer:
      "Curated catalog; APY 0 when no public coupon. Not investment advice.",
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
    dossierCta: "Empezar mi expediente",
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
  nextSteps: {
    phasesHint:
      "4 partes · ~4 min · indicativo — Activo → Estrategia → Cumplimiento → Resumen. No es una auditoría.",
    green: "Vía Green · agua y energía →",
    csrd: "Check CSRD indicativo →",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "Hub · Todos los comparadores",
    title: "Rendimientos RWA por perfil de riesgo",
    subtitle:
      "Vista agregada de los comparadores AUROS — equity, crédito, inmobiliario, bonos, commodities, arte. Mejor rendimiento por nivel de riesgo.",
    disclaimer:
      "Perfiles indicativos. Live = DeFiLlama; manual = catálogo curado. Cada producto tiene sus propias condiciones de acceso, liquidez y regulación.",
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
      subtitle:
        "Tras el mercado: inicie un expediente indicativo en ~4 min — score ahora, data room después, sin promesa de rendimiento.",
      cta: "Empezar mi expediente",
      greenLink:
        "¿Carbono, agua o energía en la shortlist? Green + CSRD indicativo →",
    },
    dossierCta: {
      eyebrow: "Tras el mercado",
      title: "Del comparador al expediente",
      subtitle:
        "4 partes · ~4 min · indicativo. Completa después con su asesor.",
      button: "Empezar mi expediente",
    },
    micaCheckerLink: "Test MiCA indicativo →",
    askCopilot: "Hacer una pregunta al Copilot →",
    aiAssist: {
      ariaLabel: "Asistente del comparador",
      eyebrow: "Copilot · selección",
      explain: "Explicar",
      suggest: "Proponer RWA",
      openCopilot: "Abrir Copilot →",
      hint: "Explique la selección o pida RWA para añadir (máx. 4).",
      add: "Añadir",
      applyViaUrl: "Aplicar todo vía URL →",
      promptSuggestWithSelection:
        "Propón 1 o 2 RWA para añadir a mi selección de comparación (IDs hub).",
      promptSuggestEmpty:
        "Propón 2 o 3 RWA interesantes para comparar en el hub AUROS.",
      promptExplainSelection: (ids) =>
        `Explica brevemente mi selección (${ids}) — APY, TVL, liquidez, riesgos indicativos.`,
      promptExplainEmpty:
        "Explica cómo usar el comparador RWA AUROS en 3 frases.",
      errorStatus: (status) => `Error ${status}`,
      networkError: "Error de red",
    },
    filters: {
      label: "Filtros",
      all: "Todos",
      under500: "Mínimo < 500 $",
      under5000: "Mínimo < 5 000 $",
      class: "Clase",
      risk: "Riesgo",
      source: "Fuente",
      sourceLive: "Live DeFiLlama",
      sourceManual: "Manual",
      chain: "Cadena",
      apy: "APY",
      apyAny: "Cualquier APY",
      apyPositive: "APY > 0",
      apyOver5: "APY ≥ 5 %",
      apyOver10: "APY ≥ 10 %",
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
      tvl: "TVL",
      source: "Fuente",
      chain: "Cadena",
      view: "Ver",
    },
    selectionPrompt:
      "Seleccione 2–4 productos para comparar lado a lado (APY, TVL, riesgo, fuente).",
    faqTitle: "Preguntas frecuentes",
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
      copilot: "Copilot",
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
        tvl: "TVL",
        source: "Fuente",
        risk: "Riesgo",
        fiche: "Ficha AUROS",
      },
    },
    monetization: {
      eyebrow: "Tras comparar",
      subtitle:
        "Informe indicativo compartible, expediente de pago o intro desk — sin ranking de pago.",
      reportCta: "Informe compare",
      dossierCta: "Expediente / data room",
      deskCta: "Hablar con desk",
      csvCta: "Exportar CSV",
      csvDone: "CSV descargado",
      csvLicenceHint: "Exportación gratuita limitada — licencia vía Premium / API",
      greenUpsell: "Filas carbono / recurso → vía Green + CSRD ←",
    },
    sponsored: {
      badgeSponsored: "Sponsored",
      badgePartenariat: "Partenariado",
      hint: "Espacio de partenariado — no compra el rango APY ni el badge Verified",
      stripTitle: "Partenariados (display)",
      stripSubtitle: "Slots explícitos — el orden APY live/manual no cambia.",
    },
    alerts: {
      eyebrow: "Alertas shortlist",
      title: "Vigilar esta selección",
      subtitle:
        "Lista de espera — le avisamos cuando las alertas APY / webhooks estén listas.",
      emailLabel: "Email",
      emailPlaceholder: "usted@empresa.com",
      submit: "Avisarme",
      submitting: "Enviando…",
      success: "Inscrito — confirmación best-effort.",
      errorRateLimit: "Demasiados intentos — pruebe más tarde.",
      errorEmail: "Email inválido.",
      errorGeneric: "Error — reintente.",
    },
    report: {
      eyebrow: "Informe compare · indicativo",
      title: "Compare Report",
      subtitle:
        "Snapshot compartible / imprimible — no es consejo; APY nunca inventado.",
      print: "Imprimir",
      downloadPdf: "PDF firmado",
      dossierCta: "Continuar al expediente",
      deskCta: "Intro desk",
      back: "Volver al hub",
      empty: "Seleccione 2–4 productos en /compare para generar un informe.",
      indicative: "Datos indicativos — verifique cada plataforma antes de decidir.",
      asOf: (date) => `As of ${date}`,
    },
    ecosystem: {
      title: "Ecosistema AUROS",
      dossier: "Empezar expediente",
      green: "AUROS Green",
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
    privateEquity: "Equity / PE",
    artCollectibles: "Arte y coleccionables",
  },
  tabs: {
    stablecoins: "Stablecoins",
    immobilier: "Inmobiliario",
    obligations: "Bonos",
    matieresPremieres: "Materias primas",
    privateCredit: "Crédito privado",
    privateEquity: "Equity / PE",
    artCollectibles: "Arte",
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
      eyebrow: "Tras el mercado",
      title: "¿Tokeniza sus propios activos?",
      subtitle:
        "4 partes · ~4 min · indicativo — empiece el expediente, complete después.",
      button: "Empezar mi expediente",
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
      eyebrow: "Tras el mercado",
      title: "¿Tokeniza inmuebles?",
      subtitle:
        "4 partes · ~4 min · indicativo — empiece el expediente, complete después.",
      button: "Empezar mi expediente",
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
      eyebrow: "Tras el mercado",
      title: "¿Tokeniza bonos?",
      subtitle:
        "4 partes · ~4 min · indicativo — empiece el expediente, complete después.",
      button: "Empezar mi expediente",
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
      eyebrow: "Tras el mercado",
      title: "¿Tokeniza materias primas?",
      subtitle:
        "4 partes · ~4 min · indicativo — empiece el expediente, complete después.",
      button: "Empezar mi expediente",
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
      eyebrow: "Tras el mercado",
      title: "¿Estructura crédito privado?",
      subtitle:
        "4 partes · ~4 min · indicativo — empiece el expediente, complete después.",
      button: "Empezar mi expediente",
    },
    footerDisclaimer:
      "APY vía DeFiLlama, actualización horaria. Crédito privado — alto riesgo, no es asesoramiento financiero.",
  },
  privateEquity: {
    tool: "private equity",
    eyebrow: "Comparador · Fondos y acciones",
    title: "Equity y private equity tokenizados",
    subtitle:
      "Fondos PE / alt y acciones tokenizadas — Securitize, Ondo, Backed, Swarm. APY 0 si no hay cupón público honesto.",
    disclaimer:
      "Muchos productos equity no tienen rendimiento fijo. Fuentes manuales vs live etiquetadas.",
    stats: {
      bestApy: "Mejor rendimiento",
      totalTvl: "TVL / AUM",
      products: "Productos comparados",
      protocols: (n) => `${n} protocolo${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Catálogo · ${date}`,
    },
    filters: {
      all: "Todos",
      funds: "Fondos PE",
      public_equity: "Acciones",
      infrastructure: "Infraestructura",
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
      eyebrow: "Tras el mercado",
      title: "¿Tokeniza fondos o acciones?",
      subtitle:
        "4 partes · ~4 min · indicativo — empiece el expediente, complete después.",
      button: "Empezar mi expediente",
    },
    footerDisclaimer:
      "Live DeFiLlama + catálogo manual. No es asesoramiento financiero.",
  },
  artCollectibles: {
    tool: "art",
    eyebrow: "Comparador · Arte y coleccionables",
    title: "Arte y coleccionables tokenizados",
    subtitle:
      "Arte fraccionado y coleccionables on-chain — Masterworks, Particle, Artory. Sin rendimientos inventados.",
    disclaimer:
      "El arte RWA suele no tener cupón. Compare acceso, custodia y liquidez — cifras indicativas.",
    stats: {
      bestApy: "Mejor rendimiento",
      totalTvl: "Referencias",
      products: "Productos comparados",
      protocols: (n) => `${n} plataforma${n === 1 ? "" : "s"}`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `Catálogo · ${date}`,
    },
    filters: {
      all: "Todos",
      fine_art: "Bellas artes",
      collectibles: "Coleccionables",
    },
    table: {
      protocol: "Plataforma",
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
      eyebrow: "Tras el mercado",
      title: "¿Tokeniza arte o coleccionables?",
      subtitle:
        "4 partes · ~4 min · indicativo — empiece el expediente, complete después.",
      button: "Empezar mi expediente",
    },
    footerDisclaimer:
      "Catálogo curado; APY 0 si no hay cupón público. No es asesoramiento financiero.",
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

const CATALOG = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getComparatorMessages(locale: Locale): ComparatorMessages {
  return CATALOG[locale] ?? FR;
}

export function formatComparatorDate(iso: string, locale: Locale): string {
  const tag =
    locale === "fr"
      ? "fr-FR"
      : locale === "es"
        ? "es-ES"
        : locale === "ar"
          ? "ar"
          : locale === "zh"
            ? "zh-CN"
            : "en-GB";
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
    case "private-equity":
      return m.assetTypes.privateEquity;
    case "art-collectibles":
      return m.assetTypes.artCollectibles;
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
    case "private-equity":
      return m.tabs.privateEquity;
    case "art-collectibles":
      return m.tabs.artCollectibles;
    default:
      return id;
  }
}
