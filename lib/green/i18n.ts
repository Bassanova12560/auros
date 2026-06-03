import type { Locale } from "@/lib/i18n";

import type { GreenLabelStatus, GreenProjectType } from "./constants";

export type GreenMessages = {
  header: {
    backToApp: string;
    languageAria: string;
    nav: {
      ariaLabel: string;
      market: string;
      standards: string;
      registry: string;
      label: string;
    };
  };
  disclaimer: string;
  hub: {
    tagline: string;
    hero: {
      valueProp: string;
      primaryCta: string;
      secondaryRegisterCta: string;
      producerSurplusCta: string;
      tertiaryCta: string;
    };
    latestOffers: {
      title: string;
      viewAll: string;
    };
    quote: {
      text: string;
      attribution: string;
      disclaimerLabel: string;
      registryCta: string;
    };
    moreSections: {
      toggle: string;
    };
    onboarding: {
      toggle: string;
      intro: string;
      stepLabel: (current: number, total: number) => string;
      steps: readonly { title: string; body: string; cta: string }[];
      wizardHint: string;
    };
    whyRwa: {
      title: string;
      rtmsBadge: string;
      items: readonly { title: string; body: string }[];
    };
    rtmsSection: {
      title: string;
      intro: string;
      statusNote: string;
      cta: string;
      assistantCta: string;
    };
    eligibleAssets: {
      title: string;
      intro: string;
      items: readonly { id: string; title: string; body: string }[];
      compareCta: string;
      guideCta: string;
    };
    marketKpis: {
      title: string;
      actorsLabel: string;
      countriesLabel: string;
      offersLabel: string;
      demoNote: string;
    };
    mapTeaser: {
      title: string;
      ariaLabel: string;
      statsLine: (actors: number, countries: number) => string;
      cta: string;
    };
    participate: {
      title: string;
      intro: string;
      items: readonly { title: string; body: string; href: string; cta: string }[];
    };
    seo: {
      toggleLabel: string;
      sections: readonly {
        heading: string;
        body?: string;
        subsections?: readonly { heading: string; body: string }[];
      }[];
    };
    manifesto: string;
    manifestoSign: string;
    find: {
      title: string;
      intro: string;
      countLabel: (count: number) => string;
      countriesLabel: (count: number) => string;
    };
    actors: readonly {
      id: "producer" | "storer" | "charger" | "consumer";
      title: string;
      description: string;
      href: string;
    }[];
    map: {
      title: string;
      intro: string;
      scope: string;
      cta: string;
      legend: (visible: number, total: number) => string;
      filters: {
        all: string;
        producer: string;
        storer: string;
        charger: string;
        consumer: string;
      };
    };
    metrics: {
      title: string;
      subtitle: string;
      carbon: string;
      carbonUnit: string;
      mwh: string;
      mwhUnit: string;
      note: string;
      noteDemo: string;
    };
    secondary: {
      title: string;
      links: readonly { title: string; description: string; href: string }[];
    };
    wizardCta: string;
    aboutCta: string;
    registerCta: string;
    widgets: {
      registry: {
        label: string;
        live: string;
        verified: string;
        pilots: string;
        experts: string;
        latestVerified: string;
        noneVerified: string;
        cta: string;
      };
      rtms: {
        label: string;
        subtitle: string;
        cta: string;
        assistantCta: string;
      };
    };
  };
  register: {
    eyebrow: string;
    title: string;
    intro: string;
    form: {
      type: string;
      name: string;
      city: string;
      country: string;
      region: string;
      description: string;
      contactEmail: string;
      capacityKwh: string;
      pricePerKwh: string;
      energyType: string;
      submit: string;
      submitting: string;
      success: string;
      successBody: string;
      stepOf: (current: number, total: number) => string;
      errorInvalid: string;
      errorRateLimit: string;
    };
    successMy: string;
    successMarket: string;
    backLink: string;
  };
  about: {
    eyebrow: string;
    title: string;
    intro: string;
    promise: { title: string; body: string };
    values: {
      title: string;
      items: readonly { title: string; body: string }[];
    };
    blocksTitle: string;
    blocks: readonly { title: string; body: string; href: string; cta: string }[];
    profilesTitle: string;
    profiles: readonly { id: "investor" | "owner" | "individual"; title: string; body: string; cta: string; href: string }[];
    ecosystemTitle: string;
    ecosystemLinks: readonly { title: string; href: string }[];
    wizardTitle: string;
    wizardBody: string;
    wizardCta: string;
    backLink: string;
  };
  standards: {
    eyebrow: string;
    title: string;
    intro: string;
    methodologyTitle: string;
    methodologyIntro: string;
    methodologySteps: readonly { step: string; detail: string }[];
    pillars: Record<"real" | "transparent" | "measurable" | "sound", { name: string; tagline: string; bullets: readonly string[] }>;
    quickNavAria: string;
    quickNav: {
      market: string;
      registry: string;
      compare: string;
      label: string;
      assistant: string;
    };
    checklistTitle: string;
    checklistIntro: string;
    exportChecklist: string;
    checklistFilename: string;
    checklistTable: {
      pillar: string;
      criterion: string;
      status: string;
      notes: string;
    };
    backLink: string;
  };
  compare: {
    eyebrow: string;
    title: string;
    intro: string;
    disclaimer: string;
    table: {
      project: string;
      type: string;
      token: string;
      yield: string;
      impact: string;
      label: string;
      source: string;
      reviewed: string;
    };
    labelStatus: Record<GreenLabelStatus, string>;
    projectTypes: Record<GreenProjectType, string>;
    emptyNote: string;
    aurosCompareCta: string;
    registryCta: string;
    registrySectionTitle: string;
    registrySectionIntro: string;
    exportCsv: string;
    exportPdf: string;
    exportPdfGenerating: string;
    exportPdfRetry: string;
    backLink: string;
    marketOffersSectionTitle: string;
    marketOffersSectionIntro: string;
    marketOffersEmpty: string;
    marketOffersBrowse: string;
    marketOffersCount: (n: number) => string;
    marketOffersActions: string;
    removeFromCompare: string;
    copyCompareLink: string;
    shareCopied: string;
    saveSnapshotLink: string;
    snapshotSaving: string;
    snapshotCopied: string;
    snapshotError: string;
    snapshotLoaded: (id: string) => string;
    snapshotExpiredTitle: string;
    snapshotExpiredBody: string;
    snapshotNotFoundTitle: string;
    snapshotNotFoundBody: string;
    snapshotExpiredCta: string;
    snapshotRenewCta: string;
    snapshotRenewing: string;
    snapshotRenewError: string;
    snapshotRenewed: string;
    snapshotExpiresAt: (date: string) => string;
    countryFilterLabel: string;
    countryFilterClear: string;
    countryFilterEmpty: string;
    rwaRowInclude: string;
    rwaRowSelectAll: string;
    rwaRowSelectClear: string;
    marketExport: {
      sectionTitle: string;
      energy: string;
      tier: string;
    };
  };
  label: {
    eyebrow: string;
    title: string;
    intro: string;
    scopeTitle: string;
    scopeMeasures: readonly string[];
    scopeDoesNot: readonly string[];
    form: {
      projectName: string;
      projectType: string;
      contactName: string;
      email: string;
      website: string;
      websitePlaceholder: string;
      country: string;
      description: string;
      stepOf: (current: number, total: number) => string;
      step1Title: string;
      step2Title: string;
      next: string;
      back: string;
      submit: string;
      submitting: string;
      success: string;
      successHint: string;
      successMy: string;
      successStandards: string;
      successRegistry: string;
      successMarket: string;
      successStatus: string;
      applicationId: (id: string) => string;
      document: string;
      documentHint: string;
      documentErrorType: string;
      documentErrorSize: string;
      documentErrorUpload: string;
      errorInvalid: string;
      errorRateLimit: string;
      projectTypes: Record<GreenProjectType, string>;
    };
    applicationStatus: Record<
      "pending" | "in_review" | "approved" | "rejected",
      string
    >;
    backLink: string;
  };
  certification: {
    eyebrow: string;
    title: string;
    intro: string;
    modulesTitle: string;
    modules: readonly string[];
    academyCta: string;
    greenExpertNote: string;
    notifyCta: string;
    praticienCta: string;
    backLink: string;
  };
  praticien: {
    eyebrow: string;
    title: string;
    intro: string;
    prerequisitesTitle: string;
    prerequisites: readonly string[];
    curriculumTitle: string;
    curriculum: readonly string[];
    waitlistTitle: string;
    examCta: string;
    examNote: string;
    form: {
      fullName: string;
      email: string;
      organization: string;
      certId: string;
      certIdHint: string;
      message: string;
      submit: string;
      submitting: string;
      success: string;
    };
    backLink: string;
  };
  verify: {
    eyebrow: string;
    title: string;
    notFound: string;
    projectLabel: string;
    expertLabel: string;
    tierVerified: string;
    tierPilot: string;
    certifiedAt: string;
    country: string;
    type: string;
    summary: string;
    pilotDisclaimer: string;
    backLink: string;
  };
  registry: {
    eyebrow: string;
    title: string;
    intro: string;
    statsUnavailable: string;
    projectsTitle: string;
    projectsEmpty: string;
    expertsTitle: string;
    expertsEmpty: string;
    tierVerified: string;
    tierPilot: string;
    verifyLink: string;
    verifyNote: string;
    pilotNote: string;
    statsProjects: (n: number) => string;
    statsExperts: (n: number) => string;
    statsVerified: (n: number) => string;
    statsPilots: (n: number) => string;
    searchPlaceholder: string;
    searchEmpty: string;
    tierFilterAll: string;
    tierFilterVerified: string;
    tierFilterPilot: string;
    tierFilterEmpty: string;
    exportCsv: string;
    exportPdf: string;
    exportPdfGenerating: string;
    exportPdfRetry: string;
    exportOpsNote: string;
    exportVerify: {
      title: string;
      intro: string;
      hashLabel: string;
      hashPlaceholder: string;
      sigLabel: string;
      sigPlaceholder: string;
      pasteLabel: string;
      pastePlaceholder: string;
      submit: string;
      checking: string;
      resultValid: string;
      resultInvalid: string;
      resultNoKey: string;
      resultError: string;
      hint: string;
    };
    backLink: string;
    viewProject: string;
    projectDetail: {
      eyebrow: string;
      intro: string;
      locationTitle: string;
      statusTitle: string;
      rtmsTierTitle: string;
      rtmsTierBody: (tier: "verified" | "pilot") => string;
      certifiedAtTitle: string;
      descriptionTitle: string;
      websiteTitle: string;
      verifyCta: string;
      backLink: string;
      notFoundTitle: string;
      notFoundBody: string;
    };
  };
  admin: {
    exportFilterLabel: string;
    exportFilterAll: string;
    exportFilterPending: string;
    exportFilterInReview: string;
    exportFilterApproved: string;
    exportFilterRejected: string;
    exportFilterIncomplete: string;
    exportFilterReminded1: string;
    exportFilterReminded2: string;
    exportCsv: string;
    exportCsvAll: string;
  };
  guide: {
    eyebrow: string;
    title: string;
    intro: string;
    sections: readonly { title: string; body: string }[];
    wizardCta: string;
    backLink: string;
  };
  mailto: {
    greenExpertSubject: string;
  };
  exam: {
    eyebrow: string;
    title: string;
    intro: (quizLen: number, passScore: number) => string;
    displayName: string;
    email: string;
    start: string;
    starting: string;
    question: (current: number, total: number) => string;
    next: string;
    submit: string;
    successTitle: (name: string) => string;
    successScore: (score: number, total: number) => string;
    verifyCta: string;
    validUntil: (iso: string) => string;
    failTitle: string;
    failBelowPass: (score: number, required: number) => string;
    failTooFast: string;
    failGeneric: string;
    retry: string;
    backLink: string;
    errors: { startFailed: string };
  };
};

const FR: GreenMessages = {
  header: {
    backToApp: "auros.app →",
    languageAria: "Langue",
    nav: {
      ariaLabel: "Navigation AUROS Green",
      market: "Marché",
      standards: "Standards",
      registry: "Registre",
      label: "Label",
    },
  },
  disclaimer:
    "AUROS Green est un cadre méthodologique et éducatif — pas un agrément régulateur, pas un conseil en investissement, pas une garantie de performance. Chaque décision exige vos propres vérifications juridiques, fiscales et de due diligence.",
  hub: {
    tagline:
      "L'écosystème AUROS Green — place de marché mondiale, standard RTMS, registre public et label Verified pour l'énergie renouvelable tokenisée.",
    hero: {
      valueProp:
        "Producteurs, stockeurs, rechargeurs — trouvez des acteurs, comparez des références, vérifiez des statuts. RTMS, registre et label au centre ; structuration dossier disponible si besoin.",
      primaryCta: "Explorer la place de marché",
      secondaryRegisterCta: "Référencer mon acteur",
      producerSurplusCta: "Je vends mon surplus solaire",
      tertiaryCta: "Registre public",
    },
    latestOffers: {
      title: "Dernières opportunités",
      viewAll: "Voir toutes les annonces",
    },
    quote: {
      text:
        "La traçabilité kWh compte plus qu'un storytelling vert — retour issu d'un cas pilote RTMS publié au registre.",
      attribution: "— Retour pilote RTMS (anonymisé)",
      disclaimerLabel: "Témoignage indicatif · démo pédagogique",
      registryCta: "Voir les cas pilote au registre",
    },
    moreSections: {
      toggle: "Méthodologie, actifs & registre",
    },
    onboarding: {
      toggle: "Par où commencer ? (3 étapes)",
      intro:
        "RTMS pour cadrer un dossier, la place de marché pour trouver des acteurs, l'inscription pour référencer le vôtre — le reste du hub reste accessible ci-dessous.",
      stepLabel: (current, total) => `Étape ${current} / ${total}`,
      steps: [
        {
          title: "Standards RTMS",
          body: "Grille Réel · Transparent · Mesurable · Sain — critères publiés, revue documentaire sur dossier fourni.",
          cta: "Voir RTMS",
        },
        {
          title: "Place de marché",
          body: "Carte mondiale, filtres par type d'acteur et annonces vente/achat — données indicatives, pas un conseil.",
          cta: "Ouvrir le marché",
        },
        {
          title: "Référencer un acteur",
          body: "Producteur, stockeur, rechargeur ou consommateur — revue AUROS sous 48 h ouvrées avant publication.",
          cta: "S'inscrire",
        },
      ],
      wizardHint: "Structurer un dossier RWA vert (wizard AUROS)",
    },
    whyRwa: {
      title: "Pourquoi un RWA vert ?",
      rtmsBadge: "Grille RTMS · label Verified",
      items: [
        {
          title: "Actif mesurable, pas une promesse",
          body: "Production kWh, certificats d'origine, contrats PPA — le token pointe vers une source vérifiable, avec statuts honnêtes (indicatif, pilote, registre).",
        },
        {
          title: "Transparence opposable",
          body: "Grille RTMS, comparateur sourcé et registre public — un tiers peut voir ce qui a été revu et dans quelles limites.",
        },
        {
          title: "Écosystème cohérent",
          body: "Place de marché, standards RTMS, registre public et label Verified — une suite verticale autonome, pas une étape vers le wizard AUROS général.",
        },
      ],
    },
    rtmsSection: {
      title: "Méthodologie RTMS",
      intro:
        "Réel · Transparent · Mesurable · Sain — cadre interne AUROS Green pour évaluer un dossier avant label ou listing. Pas un audit tiers (KPMG, EY) ni un agrément régulateur.",
      statusNote: "Statut : cadre méthodologique pilote — critères publiés, revue documentaire sur dossier fourni.",
      cta: "Voir les standards RTMS",
      assistantCta: "Pré-diagnostic RTMS (bêta)",
    },
    eligibleAssets: {
      title: "Actifs éligibles",
      intro:
        "Exemples concrets — chaque dossier reste soumis à revue RTMS ; présence ici n'implique pas de certification automatique.",
      items: [
        {
          id: "solar",
          title: "Solaire & agrivoltaïque",
          body: "Surplus injection, PPA corporates, toitures et parcs au sol — production horaire mesurée.",
        },
        {
          id: "wind",
          title: "Éolien terrestre & offshore",
          body: "Parcs mesurés SCADA, garanties d'origine, blocs d'export pour offtakers.",
        },
        {
          id: "storage",
          title: "Stockage & batteries",
          body: "BESS container, arbitrage intraday, effacement — capacité et cycles traçables.",
        },
        {
          id: "efficiency",
          title: "Efficacité & certificats",
          body: "CEE-style, REC, crédits carbone liés à un flux mesurable — pas de token « green » sans source.",
        },
      ],
      compareCta: "Comparer des références marché",
      guideCta: "Guide tokenisation surplus",
    },
    marketKpis: {
      title: "Place de marché — aperçu",
      actorsLabel: "Acteurs sur la carte",
      countriesLabel: "Pays représentés",
      offersLabel: "Annonces actives",
      demoNote: "Données démo / pilote — chiffres indicatifs, pas une statistique marché certifiée.",
    },
    mapTeaser: {
      title: "Carte mondiale",
      ariaLabel: "Carte interactive des acteurs énergie verte AUROS Green",
      statsLine: (actors, countries) =>
        `${actors} acteurs · ${countries} pays (données indicatives)`,
      cta: "Voir la carte mondiale",
    },
    participate: {
      title: "Comment participer",
      intro: "Trois entrées prioritaires dans l'écosystème — le reste reste accessible depuis le hub.",
      items: [
        {
          title: "Explorer la place de marché",
          body: "Carte mondiale, annonces vente/achat, filtres par type d'acteur — l'écosystème au centre.",
          href: "/green/market",
          cta: "Ouvrir la place de marché",
        },
        {
          title: "Référencer un acteur",
          body: "Producteur, stockeur, rechargeur ou consommateur — fiche soumise à revue avant publication sur la carte.",
          href: "/green/register",
          cta: "Soumettre une fiche",
        },
        {
          title: "Candidater au label",
          body: "Revue documentaire RTMS — badge Verified uniquement après validation, pas à la soumission.",
          href: "/green/label",
          cta: "Demander le label",
        },
      ],
    },
    seo: {
      toggleLabel: "En savoir plus — tokenisation verte & énergie locale",
      sections: [
        {
          heading: "Tokenisation verte et énergie locale",
          body:
            "AUROS Green est la verticale dédiée aux actifs réels verts tokenisés : production solaire, éolien, hydro, stockage batterie et certificats liés à un flux mesurable. L'objectif est de structurer la traçabilité documentaire avant toute représentation on-chain — pas de promesse de rendement, pas de greenwashing.",
        },
        {
          heading: "Place de marché mondiale en pilote",
          body:
            "La carte interactive recense producteurs, stockeurs, rechargeurs et consommateurs sur plusieurs continents. Les fiches démo et pilotes sont clairement étiquetées ; les acteurs référencés passent une revue AUROS avant publication.",
          subsections: [
            {
              heading: "Couverture géographique",
              body:
                "France, Europe, Amériques, Afrique, Moyen-Orient et Asie-Pacifique — géolocalisation ville + pays, filtres par type et annonces vente/achat.",
            },
            {
              heading: "Statuts honnêtes",
              body:
                "Démo, référencé, verified — chaque tier est nommé. Aucun badge automatique sur la seule base d'une inscription.",
            },
          ],
        },
        {
          heading: "Grille RTMS et registre public",
          body:
            "RTMS (Réel, Transparent, Mesurable, Sain) est le socle méthodologique AUROS Green. Le registre public liste cas pilotes RTMS, projets Verified après revue, et experts certifiés — chaque entrée vérifiable par token public.",
        },
      ],
    },
    manifesto:
      "La nature n’est pas une slide de présentation. C’est le sol sous nos pieds, le vent qui tourne, la lumière qui devient énergie — et la raison pour laquelle nous existons.",
    manifestoSign: "— AUROS",
    find: {
      title: "Que cherchez-vous ?",
      intro:
        "Quatre profils d'acteurs, une carte mondiale. Choisissez votre besoin — la liste filtrée et les annonces vous attendent.",
      countLabel: (count) =>
        count === 0 ? "Aucun sur la carte" : count === 1 ? "1 acteur sur la carte" : `${count} acteurs sur la carte`,
      countriesLabel: (n) =>
        n === 1 ? "1 pays sur la carte" : `${n} pays représentés (données indicatives)`,
    },
    actors: [
      {
        id: "producer",
        title: "Producteurs",
        description: "Solaire, éolien, hydro — surplus, PPA et production mesurée.",
        href: "/green/producers",
      },
      {
        id: "storer",
        title: "Stockeurs",
        description: "Batteries et réservoirs — capacité disponible, déstockage horaire.",
        href: "/green/storers",
      },
      {
        id: "charger",
        title: "Rechargeurs",
        description: "Bornes et hubs DC — sites ouverts ou contractuels.",
        href: "/green/chargers",
      },
      {
        id: "consumer",
        title: "Consommateurs",
        description: "Sites qui achètent de l'énergie verte — industriels, collectivités.",
        href: "/green/consumers",
      },
    ],
    map: {
      title: "Carte mondiale",
      intro:
        "Acteurs référencés en France, en Europe et sur d'autres continents. Filtrez par type, zoomez, puis ouvrez la place de marché pour publier ou contacter.",
      scope: "Couverture mondiale (données indicatives)",
      cta: "Place de marché complète",
      legend: (visible, total) =>
        visible === total
          ? `${total} acteurs affichés sur la carte`
          : `${visible} affichés sur ${total} acteurs référencés`,
      filters: {
        all: "Tous",
        producer: "Producteurs",
        storer: "Stockeurs",
        charger: "Rechargeurs",
        consumer: "Consommateurs",
      },
    },
    metrics: {
      title: "Impact traçé",
      subtitle: "Volumes indicatifs sur les dossiers RTMS publiés — pas une statistique marché.",
      carbon: "Carbone évité",
      carbonUnit: "tCO₂ eq.",
      mwh: "Énergie tracée",
      mwhUnit: "MWh",
      note: "Méthodologie RTMS · cas publiés au registre · chiffres évolutifs.",
      noteDemo: "Chiffres indicatifs tant qu'aucun cas registre n'est agrégé.",
    },
    secondary: {
      title: "Standard & conformité",
      links: [
        {
          title: "Standards RTMS",
          description: "Réel, transparent, mesurable, sain — la grille de référence.",
          href: "/green/standards",
        },
        {
          title: "Comparateur",
          description: "Projets tokenisés sourcés, statuts honnêtes, liens vérifiés.",
          href: "/green/compare",
        },
        {
          title: "Label Verified",
          description: "Demander le label AUROS Green Verified pour votre projet.",
          href: "/green/label",
        },
        {
          title: "Registre public",
          description: "Projets Verified, cas pilote, experts certifiés — vérifiables.",
          href: "/green/registry",
        },
      ],
    },
    wizardCta: "Parcours structuration actif",
    aboutCta: "Le standard en détail",
    registerCta: "Référencer mon acteur sur la carte",
    widgets: {
      registry: {
        label: "Registre public",
        live: "En direct",
        verified: "Verified",
        pilots: "Cas pilote",
        experts: "Experts",
        latestVerified: "Dernier Verified",
        noneVerified: "Premier dossier Verified publié — parcourez le registre.",
        cta: "Ouvrir le registre",
      },
      rtms: {
        label: "Grille RTMS",
        subtitle: "Réel · Transparent · Mesurable · Sain — le socle de tout dossier Green.",
        cta: "Voir les standards",
        assistantCta: "Pré-diagnostic RTMS",
      },
    },
  },
  register: {
    eyebrow: "Place de marché",
    title: "Référencer votre acteur",
    intro:
      "Producteurs, stockeurs, rechargeurs ou consommateurs — fiche soumise à revue AUROS avant publication sur la carte mondiale et les listes.",
    form: {
      type: "Type d'acteur",
      name: "Nom de la structure",
      city: "Ville",
      country: "Pays",
      region: "Région / État (optionnel)",
      description: "Description de l'activité (min. 20 caractères)",
      contactEmail: "E-mail professionnel",
      capacityKwh: "Capacité (kWh)",
      pricePerKwh: "Tarif indicatif (€/kWh, optionnel)",
      energyType: "Type d'énergie",
      submit: "Soumettre ma fiche",
      submitting: "Envoi…",
      success: "Fiche reçue",
      successBody: "Revue AUROS sous 48 h ouvrées — vous serez contacté à l'e-mail indiqué.",
      stepOf: (current, total) => `Étape ${current} sur ${total}`,
      errorInvalid: "Vérifiez les champs obligatoires.",
      errorRateLimit: "Trop de tentatives — réessayez dans une heure.",
    },
    successMy: "Mes fiches",
    successMarket: "Place de marché",
    backLink: "← Retour au hub Green",
  },
  about: {
    eyebrow: "Standard vert RWA",
    title: "AUROS Green en détail",
    intro:
      "Le référentiel RTMS pour structurer, comparer et labelliser des actifs réels verts tokenisés — solaire, REC, carbone, PPA. Exigence documentaire, registre vérifiable, parcours label transparent. Pour les acteurs qui ont besoin de sérieux, pas de slogans.",
    promise: {
      title: "Ce que le standard garantit — et ce qu'il exclut",
      body:
        "Un langage commun, des statuts explicites et des preuves publiques. Le badge Verified atteste une revue documentaire RTMS complète sur dossier fourni — pas une promesse de rendement, pas un substitut à votre due diligence investisseur, pas un agrément AMF, ESMA ou équivalent.",
    },
    values: {
      title: "Trois raisons d'ancrer votre dossier ici",
      items: [
        {
          title: "Crédibilité sans greenwashing",
          body: "Référence marché, cas pilote RTMS ou Verified : chaque statut est nommé. Aucun badge automatique sur la seule base d'une présence au comparateur.",
        },
        {
          title: "Traçabilité opposable",
          body: "Registre public, token de vérification, synthèse RTMS — un tiers peut contrôler ce qui a été revu, quand, et dans quelles limites.",
        },
        {
          title: "Fil conducteur opérationnel",
          body: "De la place de marché au comparateur sourcé, en passant par le label et la certification expert — une suite cohérente, pas des pages isolées.",
        },
      ],
    },
    blocksTitle: "Parcours du standard",
    blocks: [
      {
        title: "Standards RTMS",
        body: "Grille Réel · Transparent · Mesurable · Sain — critères opposables pour qualifier un actif vert avant toute tokenisation ou levée.",
        href: "/green/standards",
        cta: "Lire la grille",
      },
      {
        title: "Comparateur vert",
        body: "Références marché documentées, statuts label explicites, sources cliquables. Outil de cadrage — jamais une recommandation d'achat.",
        href: "/green/compare",
        cta: "Analyser le marché",
      },
      {
        title: "Label Auros Green Verified",
        body: "Revue documentaire RTMS sur votre dossier : traçabilité off-chain, risques assumés, cohérence token ↔ actif. Badge public uniquement après validation.",
        href: "/green/label",
        cta: "Déposer une candidature",
      },
      {
        title: "Registre public",
        body: "Projets Verified, cas pilotes RTMS et experts certifiés — chaque entrée vérifiable par URL, sans compte requis.",
        href: "/green/registry",
        cta: "Consulter le registre",
      },
    ],
    profilesTitle: "Par où commencer",
    profiles: [
      {
        id: "investor",
        title: "Investisseur / family office",
        body: "Cartographier le marché avec des statuts honnêtes, puis croiser avec AUROS Compare pour la structuration juridique et fiscale.",
        cta: "Ouvrir le comparateur vert",
        href: "/green/compare",
      },
      {
        id: "owner",
        title: "Porteur de projet / SPV",
        body: "Préparer un dossier RTMS-ready : production mesurable, contrats, limites déclarées — puis candidater au label Verified.",
        cta: "Préparer ma candidature",
        href: "/green/label",
      },
      {
        id: "individual",
        title: "Consultant / auditeur",
        body: "Certification Fondamentaux RWA, maîtrise RTMS, examen Praticien — badge expert inscrit au registre public 365 jours.",
        cta: "Parcours certification",
        href: "/green/certification",
      },
    ],
    ecosystemTitle: "L'écosystème AUROS Green",
    ecosystemLinks: [
      { title: "Place de marché", href: "/green/market" },
      { title: "Standards RTMS", href: "/green/standards" },
      { title: "Registre public", href: "/green/registry" },
      { title: "Label Verified", href: "/green/label" },
      { title: "Comparateur", href: "/green/compare" },
      { title: "Certification", href: "/green/certification" },
      { title: "Praticien", href: "/green/praticien" },
      { title: "Mes fiches", href: "/green/my" },
    ],
    wizardTitle: "Structurer un actif renouvelable",
    wizardBody:
      "Wizard AUROS préconfiguré — solaire, REC, PPA ou surplus énergétique. Première version de dossier indicatif en ~12 min, complétable ensuite avec votre conseil.",
    wizardCta: "Parcours structuration actif renouvelable",
    backLink: "Retour au hub",
  },
  standards: {
    eyebrow: "RTMS",
    title: "Standards AUROS Green",
    intro:
      "RTMS encode ce qu'un acteur institutionnel attend avant d'ouvrir un data room vert : impact réel mesurable, transparence des sources, métriques reproductibles, structure juridique et risques assumés — sans prétendre remplacer un audit sur site.",
    methodologyTitle: "Comment appliquer RTMS",
    methodologyIntro:
      "La grille n'est pas une checklist marketing. Elle sert à qualifier un dossier avant tokenisation, due diligence ou candidature label.",
    methodologySteps: [
      {
        step: "01 · Qualifier l'actif off-chain",
        detail: "Production, registre carbone, REC ou PPA — période, périmètre, contreparties, preuves primaires.",
      },
      {
        step: "02 · Cartographier token ↔ actif",
        detail: "Qui mint, qui détient, quelles limites de revendication, risques de double comptage.",
      },
      {
        step: "03 · Exposer les limites",
        detail: "Ce que le token ne garantit pas : rendement, liquidité, conformité MiCA automatique.",
      },
      {
        step: "04 · Décider du statut",
        detail: "Référence marché, cas pilote interne ou candidature Verified — jamais de badge implicite.",
      },
    ],
    pillars: {
      real: {
        name: "Réel",
        tagline: "L'impact existe hors blockchain",
        bullets: [
          "Production ou retrait mesurable (MWh, tCO₂, hectares)",
          "Contrats ou registres officiels vérifiables",
          "Pas de double comptage entre on-chain et off-chain",
        ],
      },
      transparent: {
        name: "Transparent",
        tagline: "Sources et limites visibles",
        bullets: [
          "Documentation publique ou data room accessible",
          "Traçabilité des tokens vers l'actif sous-jacent",
          "Limites et exclusions clairement déclarées",
        ],
      },
      measurable: {
        name: "Mesurable",
        tagline: "Indicateurs reproductibles",
        bullets: [
          "Métriques d'impact avec période et périmètre",
          "Audit ou attestation tierce quand applicable",
          "Historique consultable, pas un snapshot marketing",
        ],
      },
      sound: {
        name: "Sain",
        tagline: "Structure juridique et risques assumés",
        bullets: [
          "Cadre légal du token et du projet identifié",
          "Risques opérationnels, de marché et réglementaires exposés",
          "Pas de promesse de rendement garanti",
        ],
      },
    },
    quickNavAria: "Navigation écosystème Green",
    quickNav: {
      market: "Place de marché",
      registry: "Registre public",
      compare: "Comparateur",
      label: "Candidature label",
      assistant: "Assistant RTMS (bêta)",
    },
    checklistTitle: "Checklist RTMS interactive",
    checklistIntro:
      "Téléchargez une grille CSV à compléter dossier par dossier — critères par pilier Réel · Transparent · Mesurable · Sain.",
    exportChecklist: "Télécharger la checklist (.csv)",
    checklistFilename: "auros-green-rtms-checklist.csv",
    checklistTable: {
      pillar: "Pilier RTMS",
      criterion: "Critère",
      status: "Statut (à remplir)",
      notes: "Notes / preuves",
    },
    backLink: "← Retour AUROS Green",
  },
  compare: {
    eyebrow: "Références marché",
    title: "Comparateur projets verts tokenisés",
    intro:
      "Lignes éducatives sourcées — statut label AUROS honnête. Aucune ligne « certifiée » sans audit AUROS complet.",
    disclaimer:
      "Rendements et impacts indicatifs — pas un conseil en investissement. Vérifiez l'état actuel du protocole sur la source primaire.",
    table: {
      project: "Projet",
      type: "Type",
      token: "Token / instrument",
      yield: "Rendement (indicatif)",
      impact: "Impact (indicatif)",
      label: "Statut label",
      source: "Source",
      reviewed: "Revu le",
    },
    labelStatus: {
      certified: "Auros Green Verified",
      in_review: "Revue AUROS en cours",
      reference: "Référence marché",
      not_labeled: "Non labellisé",
    },
    projectTypes: {
      solar: "Solaire",
      wind: "Éolien",
      rec: "Certificats verts (REC)",
      carbon: "Crédits carbone",
      ppa: "PPA / énergie",
      other: "Autre",
    },
    emptyNote: "Aucune ligne pour le moment.",
    aurosCompareCta: "Comparateur RWA général →",
    registryCta: "Consulter le registre public",
    registrySectionTitle: "Registre AUROS Green",
    registrySectionIntro:
      "Projets passés revue RTMS — cas pilotes pédagogiques clairement identifiés, distincts des références marché ci-dessous.",
    exportCsv: "Exporter CSV",
    exportPdf: "Exporter PDF",
    exportPdfGenerating: "PDF…",
    exportPdfRetry: "Réessayer PDF",
    backLink: "← Retour AUROS Green",
    marketOffersSectionTitle: "Annonces marketplace sélectionnées",
    marketOffersSectionIntro:
      "Comparez côte à côte des annonces de la place de marché — données indicatives MVP, pas un conseil.",
    marketOffersEmpty:
      "Aucune annonce sélectionnée — ouvrez une fiche annonce et cliquez « Ajouter au comparateur ».",
    marketOffersBrowse: "Parcourir la place de marché",
    marketOffersCount: (n) => `${n} annonce${n > 1 ? "s" : ""} sélectionnée${n > 1 ? "s" : ""} (max 4)`,
    marketOffersActions: "Actions",
    removeFromCompare: "Retirer",
    copyCompareLink: "Copier le lien de comparaison",
    shareCopied: "Lien copié",
    saveSnapshotLink: "Lien snapshot (30 j)",
    snapshotSaving: "Snapshot…",
    snapshotCopied: "Lien snapshot copié",
    snapshotError: "Snapshot indisponible — utilisez le lien URL",
    snapshotLoaded: (id) => `Comparaison partagée · snapshot ${id}`,
    snapshotExpiredTitle: "Lien de comparaison expiré",
    snapshotExpiredBody:
      "Ce snapshot partagé a dépassé sa durée de validité (30 jours). Créez une nouvelle comparaison ou copiez un lien URL depuis le comparateur.",
    snapshotNotFoundTitle: "Comparaison introuvable",
    snapshotNotFoundBody:
      "Ce lien snapshot n'existe pas ou a été supprimé. Retournez au comparateur pour en créer un nouveau.",
    snapshotExpiredCta: "Retour au comparateur",
    snapshotRenewCta: "Renouveler 30 j",
    snapshotRenewing: "Renouvellement…",
    snapshotRenewError: "Échec — réessayer",
    snapshotRenewed: "Snapshot prolongé de 30 jours",
    snapshotExpiresAt: (date) => `Expire le ${date}`,
    countryFilterLabel: "Filtrer par pays",
    countryFilterClear: "Tous les pays",
    countryFilterEmpty: "Aucun projet pour ces pays.",
    rwaRowInclude: "Inclure",
    rwaRowSelectAll: "Toutes les références",
    rwaRowSelectClear: "Aucune référence",
    marketExport: {
      sectionTitle: "Annonces marketplace sélectionnées",
      energy: "Énergie",
      tier: "Niveau listing",
    },
  },
  label: {
    eyebrow: "Candidature",
    title: "Label Auros Green Verified",
    intro:
      "Soumettez votre projet pour une revue documentaire. Le label public n'est accordé qu'après validation RTMS — pas de badge automatique.",
    scopeTitle: "Ce que la candidature couvre",
    scopeMeasures: [
      "Revue documentaire RTMS (Réel, Transparent, Mesurable, Sain)",
      "Retour écrit avec points forts et écarts",
      "Inscription registre public si label accordé",
    ],
    scopeDoesNot: [
      "Audit sur site ou due diligence investisseur",
      "Garantie de rendement ou agrément régulateur",
      "Listing automatique sur AUROS Compare",
    ],
    form: {
      projectName: "Nom du projet",
      projectType: "Type d'actif",
      contactName: "Contact",
      email: "E-mail professionnel",
      website: "Site ou documentation",
      websitePlaceholder: "https://exemple.com",
      country: "Pays / juridiction",
      description: "Description courte (impact, token, stade)",
      stepOf: (current, total) => `Étape ${current} sur ${total}`,
      step1Title: "Identité du projet",
      step2Title: "Description & pièce jointe",
      next: "Continuer",
      back: "Retour",
      submit: "Envoyer la candidature",
      submitting: "Envoi…",
      success: "Candidature reçue — nous revenons vers vous sous 5 jours ouvrés.",
      successHint:
        "Consultez les standards RTMS pendant la revue documentaire (5 jours ouvrés).",
      successMy: "Mes fiches",
      successStandards: "Standards RTMS",
      successRegistry: "Registre public",
      successMarket: "Place de marché",
      successStatus:
        "Suivez l'avancement dans Espace acteur (/green/my) avec le même e-mail professionnel.",
      applicationId: (id) => `Référence dossier : ${id.slice(0, 8)}…`,
      document: "PDF justificatif (optionnel)",
      documentHint: "PDF uniquement, 5 Mo max — dossier technique ou synthèse RTMS.",
      documentErrorType: "Format non accepté — PDF uniquement.",
      documentErrorSize: "Fichier trop volumineux (max. 5 Mo).",
      documentErrorUpload:
        "Candidature enregistrée, mais le PDF n'a pas pu être joint — réessayez par e-mail.",
      errorInvalid: "Vérifiez les champs obligatoires.",
      errorRateLimit: "Trop de tentatives — réessayez dans une heure.",
      projectTypes: {
        solar: "Solaire",
        wind: "Éolien",
        rec: "REC / certificats verts",
        carbon: "Crédits carbone",
        ppa: "PPA / surplus énergie",
        other: "Autre vert RWA",
      },
    },
    applicationStatus: {
      pending: "En attente de revue",
      in_review: "Revue documentaire",
      approved: "Label publié au registre",
      rejected: "Non retenu — contactez-nous",
    },
    backLink: "← Retour AUROS Green",
  },
  certification: {
    eyebrow: "Experts & professionnels",
    title: "Certification individuelle Green",
    intro:
      "Validez d'abord les bases RWA — la spécialisation Green approfondie arrive avec le parcours Praticien Academy.",
    modulesTitle: "Parcours recommandé (Phase 1)",
    modules: [
      "Fondamentaux RWA Academy — gratuit, attestation 90 j vérifiable",
      "Standards RTMS — lecture obligatoire avant tout audit projet",
      "Spécialisation Green Praticien — liste d'attente (contenu à venir)",
    ],
    academyCta: "Commencer Fondamentaux Academy",
    greenExpertNote:
      "Le badge « expert Green » est disponible via l'examen RTMS — pas un agrément régulateur.",
    notifyCta: "Me prévenir — parcours Green",
    praticienCta: "Parcours Praticien Green",
    backLink: "← Retour AUROS Green",
  },
  praticien: {
    eyebrow: "Parcours avancé",
    title: "Praticien Green",
    intro:
      "Spécialisation pour auditeurs et consultants RWA verts — prérequis Fondamentaux Academy + maîtrise RTMS. Examen RTMS ouvert (beta).",
    prerequisitesTitle: "Prérequis",
    prerequisites: [
      "Certification Fondamentaux RWA valide (90 j)",
      "Lecture complète des standards RTMS",
      "Expérience professionnelle en énergie, ESG ou structuration RWA",
    ],
    curriculumTitle: "Programme prévu",
    curriculum: [
      "Audit documentaire RTMS sur dossiers anonymisés",
      "Cas solaire / REC / carbone — pièges de double comptage",
      "Rédaction de fiche label et communication investisseur",
      "Badge expert + inscription registre public",
    ],
    waitlistTitle: "Liste d'attente (parcours avancé)",
    examCta: "Passer l'examen RTMS (beta)",
    examNote: "Badge expert vérifiable 365 jours — inscription registre public.",
    form: {
      fullName: "Nom complet",
      email: "E-mail professionnel",
      organization: "Organisation (optionnel)",
      certId: "ID attestation Fondamentaux (optionnel)",
      certIdHint: "Visible sur votre page /academy/verify — accélère la priorisation.",
      message: "Message (optionnel)",
      submit: "Rejoindre la liste d'attente",
      submitting: "Envoi…",
      success: "Inscription reçue — nous vous contactons à l'ouverture du parcours.",
    },
    backLink: "← Retour certification Green",
  },
  verify: {
    eyebrow: "Vérification",
    title: "Label AUROS Green",
    notFound: "Entrée introuvable — vérifiez le lien ou contactez le porteur du projet.",
    projectLabel: "Projet labellisé",
    expertLabel: "Expert certifié",
    tierVerified: "Auros Green Verified",
    tierPilot: "Cas pilote RTMS",
    certifiedAt: "Labellisé le",
    country: "Pays / juridiction",
    type: "Type d'actif",
    summary: "Synthèse RTMS",
    pilotDisclaimer:
      "Cas pilote pédagogique — démonstration méthodologique AUROS Green, pas une recommandation d'investissement ni une certification de tiers.",
    backLink: "← Registre AUROS Green",
  },
  registry: {
    eyebrow: "Transparence",
    title: "Registre AUROS Green",
    intro:
      "Projets et experts labellisés publiquement — cas pilotes RTMS publiés pour illustrer la méthode, candidatures label ouvertes.",
    statsUnavailable: "Registre en mode local — données complètes après synchronisation.",
    projectsTitle: "Projets labellisés",
    projectsEmpty: "Aucun projet labellisé pour le moment — candidatures ouvertes.",
    expertsTitle: "Experts certifiés",
    expertsEmpty: "Aucun expert Green listé — parcours Praticien à venir.",
    tierVerified: "Verified",
    tierPilot: "Cas pilote",
    verifyLink: "Vérifier",
    verifyNote: "Chaque entrée inclut un lien de vérification public.",
    pilotNote:
      "Les cas pilotes RTMS sont des démonstrations méthodologiques anonymisées — distincts des projets « Verified » après audit complet.",
    statsProjects: (n) => `${n} projet${n > 1 ? "s" : ""} listé${n > 1 ? "s" : ""}`,
    statsExperts: (n) => `${n} expert${n > 1 ? "s" : ""}`,
    statsVerified: (n) => `${n} Verified`,
    statsPilots: (n) => `${n} cas pilote${n > 1 ? "s" : ""}`,
    searchPlaceholder: "Rechercher un projet (nom, pays)…",
    searchEmpty: "Aucun projet ne correspond à cette recherche.",
    tierFilterAll: "Tous",
    tierFilterVerified: "Verified",
    tierFilterPilot: "Cas pilote",
    tierFilterEmpty: "Aucun projet ne correspond à ce filtre.",
    exportCsv: "Exporter CSV",
    exportPdf: "Exporter PDF",
    exportPdfGenerating: "PDF…",
    exportPdfRetry: "Réessayer PDF",
    exportOpsNote:
      "Export registre AUROS Green certifié — horodatage UTC, empreinte SHA256 et signature HMAC serveur des lignes exportées (intégrité indicative, non signature électronique qualifiée). Sans clé serveur : SHA256 seul.",
    exportVerify: {
      title: "Vérifier un export PDF",
      intro:
        "Collez l'empreinte SHA256 et la signature HMAC du pied de page PDF, ou la ligne d'intégrité complète, pour valider l'export auprès du serveur AUROS.",
      hashLabel: "Empreinte SHA256",
      hashPlaceholder: "64 caractères hexadécimaux",
      sigLabel: "Signature HMAC (sig=)",
      sigPlaceholder: "64 caractères hexadécimaux",
      pasteLabel: "Coller la ligne d'intégrité du PDF",
      pastePlaceholder: "Intégrité SHA256 : … · sig=…",
      submit: "Vérifier l'export",
      checking: "Vérification…",
      resultValid: "Signature valide — l'export correspond aux lignes signées par le serveur AUROS.",
      resultInvalid: "Signature invalide — vérifiez hash et sig, ou l'export a été modifié.",
      resultNoKey:
        "Clé de signature serveur absente — vérification HMAC indisponible (SHA256 seul sur le PDF).",
      resultError: "Vérification impossible — vérifiez le format hash/sig.",
      hint: "API : GET /api/green/verify-registry-export?hash=&sig=",
    },
    backLink: "← Retour AUROS Green",
    viewProject: "Voir la fiche projet",
    projectDetail: {
      eyebrow: "Registre public",
      intro: "Fiche projet labellisé AUROS Green — statut RTMS explicite, sans promesse de rendement.",
      locationTitle: "Localisation",
      statusTitle: "Statut label",
      rtmsTierTitle: "Niveau RTMS",
      rtmsTierBody: (tier) =>
        tier === "verified"
          ? "Label Auros Green Verified — revue documentaire RTMS complète validée par AUROS."
          : "Cas pilote RTMS — démonstration méthodologique anonymisée, distinct d'un audit investisseur.",
      certifiedAtTitle: "Date d'inscription",
      descriptionTitle: "Description",
      websiteTitle: "Site web",
      verifyCta: "Page de vérification",
      backLink: "← Retour au registre",
      notFoundTitle: "Projet introuvable",
      notFoundBody:
        "Ce projet n'existe pas dans le registre public ou n'est plus disponible.",
    },
  },
  admin: {
    exportFilterLabel: "Filtrer l'export CSV",
    exportFilterAll: "Toutes",
    exportFilterPending: "En attente",
    exportFilterInReview: "En revue",
    exportFilterApproved: "Approuvées",
    exportFilterRejected: "Rejetées",
    exportFilterIncomplete: "Dossier incomplet",
    exportFilterReminded1: "Relance 1",
    exportFilterReminded2: "Relance 2",
    exportCsv: "Exporter CSV",
    exportCsvAll: "Exporter CSV (toutes)",
  },
  guide: {
    eyebrow: "Guide éducatif",
    title: "Tokeniser un surplus énergétique",
    intro:
      "Vue d'ensemble honnête — étapes, risques et liens vers le wizard AUROS. Pas un modèle juridique clé en main.",
    sections: [
      {
        title: "1. Qualifier le surplus",
        body: "Mesurez la production excédentaire (kWh/MWh), les contrats réseau et le cadre local (autoconsommation, injection, PPA).",
      },
      {
        title: "2. Structurer l'actif",
        body: "Séparez droits économiques, flux de cash et représentation token — juridiction et MiCA selon le cas.",
      },
      {
        title: "3. Traçabilité on-chain",
        body: "Attestations, oracles ou registres — le token doit pointer vers une source mesurable, pas une promesse marketing.",
      },
      {
        title: "4. Conformité & divulgation",
        body: "Document public : périmètre, risques, pas de rendement garanti. Candidature label si vous visez Auros Green Verified.",
      },
    ],
    wizardCta: "Ouvrir le wizard — actif renouvelable",
    backLink: "← Retour AUROS Green",
  },
  exam: {
    eyebrow: "Examen RTMS",
    title: "Quiz Praticien Green",
    intro: (quizLen, passScore) =>
      `${quizLen} questions RTMS — score minimum ${passScore}/${quizLen}. Badge expert vérifiable 365 jours.`,
    displayName: "Nom affiché (registre public)",
    email: "E-mail professionnel",
    start: "Commencer l'examen",
    starting: "Préparation…",
    question: (current, total) => `Question ${current} / ${total}`,
    next: "Question suivante",
    submit: "Valider l'examen",
    successTitle: (name) => `Félicitations ${name} — badge expert Green`,
    successScore: (score, total) => `Score : ${score}/${total}`,
    verifyCta: "Page de vérification publique",
    validUntil: (iso) => `Valide jusqu'au ${iso.slice(0, 10)}`,
    failTitle: "Examen non validé",
    failBelowPass: (score, required) =>
      `Score ${score}/${required} requis — relisez les standards RTMS et réessayez.`,
    failTooFast: "Réponses soumises trop rapidement — relisez les questions.",
    failGeneric: "Session invalide ou expirée — recommencez l'examen.",
    retry: "Réessayer",
    backLink: "← Retour Praticien Green",
    errors: { startFailed: "Impossible de démarrer — vérifiez vos informations." },
  },
  mailto: {
    greenExpertSubject: "AUROS Green — parcours expert (liste d'attente)",
  },
};

const EN: GreenMessages = {
  header: {
    backToApp: "auros.app →",
    languageAria: "Language",
    nav: {
      ariaLabel: "AUROS Green navigation",
      market: "Market",
      standards: "Standards",
      registry: "Registry",
      label: "Label",
    },
  },
  disclaimer:
    "AUROS Green is a methodological and educational framework — not a regulatory licence, investment advice, or performance guarantee. Every decision requires your own legal, tax and due diligence review.",
  hub: {
    tagline:
      "The AUROS Green ecosystem — worldwide marketplace, RTMS standard, public registry and Verified label for tokenized renewable energy.",
    hero: {
      valueProp:
        "Producers, storers, chargers — find actors, compare references, verify statuses. RTMS, registry and label at the centre; dossier structuring available when needed.",
      primaryCta: "Explore the marketplace",
      secondaryRegisterCta: "Register my actor",
      producerSurplusCta: "I sell my solar surplus",
      tertiaryCta: "Public registry",
    },
    latestOffers: {
      title: "Latest opportunities",
      viewAll: "View all listings",
    },
    quote: {
      text:
        "kWh traceability matters more than green storytelling — feedback from an RTMS pilot case on the registry.",
      attribution: "— RTMS pilot feedback (anonymized)",
      disclaimerLabel: "Indicative testimonial · educational demo",
      registryCta: "View pilot cases in the registry",
    },
    moreSections: {
      toggle: "Methodology, assets & registry",
    },
    onboarding: {
      toggle: "Where to start (3 steps)",
      intro:
        "RTMS to frame a dossier, marketplace to find actors, registration to list yours — the rest of the hub stays below.",
      stepLabel: (current, total) => `Step ${current} / ${total}`,
      steps: [
        {
          title: "RTMS standards",
          body: "Real · Transparent · Measurable · Sound — published criteria, document review on submitted dossier.",
          cta: "View RTMS",
        },
        {
          title: "Marketplace",
          body: "World map, actor-type filters and buy/sell listings — indicative data, not advice.",
          cta: "Open market",
        },
        {
          title: "Register an actor",
          body: "Producer, storer, charger or consumer — AUROS review within 48 business hours before publication.",
          cta: "Register",
        },
      ],
      wizardHint: "Structure a green RWA dossier (AUROS wizard)",
    },
    whyRwa: {
      title: "Why a green RWA?",
      rtmsBadge: "RTMS grid · Verified label",
      items: [
        {
          title: "Measurable asset, not a promise",
          body: "kWh output, origin certificates, PPA contracts — the token points to a verifiable source, with honest statuses (indicative, pilot, registry).",
        },
        {
          title: "Opposable transparency",
          body: "RTMS grid, sourced comparator and public registry — a third party can see what was reviewed and within which limits.",
        },
        {
          title: "Coherent ecosystem",
          body: "Marketplace, RTMS standards, public registry and Verified label — a standalone vertical suite, not a step into the general AUROS wizard.",
        },
      ],
    },
    rtmsSection: {
      title: "RTMS methodology",
      intro:
        "Real · Transparent · Measurable · Sound — AUROS Green internal framework to assess a dossier before label or listing. Not a third-party audit (KPMG, EY) nor a regulatory licence.",
      statusNote: "Status: pilot methodological framework — published criteria, documentary review on submitted dossier.",
      cta: "View RTMS standards",
      assistantCta: "Preliminary RTMS check (beta)",
    },
    eligibleAssets: {
      title: "Eligible assets",
      intro:
        "Concrete examples — each dossier remains subject to RTMS review; presence here does not imply automatic certification.",
      items: [
        {
          id: "solar",
          title: "Solar & agrivoltaics",
          body: "Grid surplus, corporate PPAs, rooftops and ground-mount — hourly measured output.",
        },
        {
          id: "wind",
          title: "Onshore & offshore wind",
          body: "SCADA-measured parks, guarantees of origin, export blocks for offtakers.",
        },
        {
          id: "storage",
          title: "Storage & batteries",
          body: "Container BESS, intraday arbitrage, demand response — traceable capacity and cycles.",
        },
        {
          id: "efficiency",
          title: "Efficiency & certificates",
          body: "REC-style, carbon credits tied to measurable flow — no « green » token without a source.",
        },
      ],
      compareCta: "Compare market references",
      guideCta: "Surplus tokenisation guide",
    },
    marketKpis: {
      title: "Marketplace snapshot",
      actorsLabel: "Actors on map",
      countriesLabel: "Countries represented",
      offersLabel: "Active listings",
      demoNote: "Demo / pilot data — indicative figures, not a certified market statistic.",
    },
    mapTeaser: {
      title: "World map",
      ariaLabel: "Interactive map of AUROS Green energy actors",
      statsLine: (actors, countries) =>
        `${actors} actors · ${countries} countries (indicative data)`,
      cta: "Open full marketplace",
    },
    participate: {
      title: "How to participate",
      intro: "Three priority entry points in the ecosystem — the rest stays accessible from the hub.",
      items: [
        {
          title: "Explore the marketplace",
          body: "World map, buy/sell listings, filters by actor type — the ecosystem at the centre.",
          href: "/green/market",
          cta: "Open marketplace",
        },
        {
          title: "Register an actor",
          body: "Producer, storer, charger or consumer — listing reviewed before map publication.",
          href: "/green/register",
          cta: "Submit a listing",
        },
        {
          title: "Apply for label",
          body: "RTMS documentary review — Verified badge only after validation, not on submission.",
          href: "/green/label",
          cta: "Request label",
        },
      ],
    },
    seo: {
      toggleLabel: "Learn more — green tokenisation & local energy",
      sections: [
        {
          heading: "Green tokenisation and local energy",
          body:
            "AUROS Green is the vertical for tokenised green real-world assets: solar, wind, hydro output, battery storage and certificates tied to measurable flow. The goal is documentary traceability before any on-chain representation — no yield promise, no greenwashing.",
        },
        {
          heading: "Worldwide marketplace in pilot",
          body:
            "The interactive map lists producers, storers, chargers and consumers across continents. Demo and pilot listings are clearly labelled; referenced actors pass AUROS review before publication.",
          subsections: [
            {
              heading: "Geographic coverage",
              body:
                "France, Europe, Americas, Africa, Middle East and Asia-Pacific — city + country geolocation, type filters and buy/sell listings.",
            },
            {
              heading: "Honest statuses",
              body:
                "Demo, referenced, verified — each tier is named. No automatic badge on registration alone.",
            },
          ],
        },
        {
          heading: "RTMS grid and public registry",
          body:
            "RTMS (Real, Transparent, Measurable, Sound) is the AUROS Green methodological backbone. The public registry lists RTMS pilot cases, Verified projects after review, and certified experts — each entry verifiable by public token.",
        },
      ],
    },
    manifesto:
      "Nature is not a slide in a deck. It is the ground beneath us, the wind that turns, the light that becomes energy — and the reason we exist.",
    manifestoSign: "— AUROS",
    find: {
      title: "What are you looking for?",
      intro:
        "Four actor profiles, one worldwide map. Pick your need — the filtered list and listings are one click away.",
      countLabel: (count) =>
        count === 0 ? "None on map" : count === 1 ? "1 actor on map" : `${count} actors on map`,
      countriesLabel: (n) =>
        n === 1 ? "1 country on map" : `${n} countries represented (indicative data)`,
    },
    actors: [
      {
        id: "producer",
        title: "Producers",
        description: "Solar, wind, hydro — surplus, PPA and metered output.",
        href: "/green/producers",
      },
      {
        id: "storer",
        title: "Storers",
        description: "Batteries and reservoirs — available capacity, hourly discharge.",
        href: "/green/storers",
      },
      {
        id: "charger",
        title: "Chargers",
        description: "DC hubs and charge points — public or contractual sites.",
        href: "/green/chargers",
      },
      {
        id: "consumer",
        title: "Consumers",
        description: "Sites buying green energy — industrial and public sector.",
        href: "/green/consumers",
      },
    ],
    map: {
      title: "World map",
      intro:
        "Referenced actors across France, Europe and other regions. Filter by type, zoom in, then open the marketplace to publish or connect.",
      scope: "Worldwide coverage (indicative data)",
      cta: "Full marketplace",
      legend: (visible, total) =>
        visible === total
          ? `${total} actors on map`
          : `${visible} shown of ${total} referenced actors`,
      filters: {
        all: "All",
        producer: "Producers",
        storer: "Storers",
        charger: "Chargers",
        consumer: "Consumers",
      },
    },
    metrics: {
      title: "Traced impact",
      subtitle: "Indicative volumes on published RTMS dossiers — not a market statistic.",
      carbon: "Carbon avoided",
      carbonUnit: "tCO₂ eq.",
      mwh: "Energy traced",
      mwhUnit: "MWh",
      note: "RTMS methodology · cases on public registry · figures evolve.",
      noteDemo: "Indicative figures until registry cases are aggregated.",
    },
    secondary: {
      title: "Standard & compliance",
      links: [
        {
          title: "RTMS standards",
          description: "Real, transparent, measurable, sound — the reference grid.",
          href: "/green/standards",
        },
        {
          title: "Comparator",
          description: "Sourced tokenized projects, honest statuses, verified links.",
          href: "/green/compare",
        },
        {
          title: "Verified label",
          description: "Apply for AUROS Green Verified on your project.",
          href: "/green/label",
        },
        {
          title: "Public registry",
          description: "Verified projects, pilots, certified experts — verifiable.",
          href: "/green/registry",
        },
      ],
    },
    wizardCta: "Asset structuring path",
    aboutCta: "About the standard",
    registerCta: "Register my actor on the map",
    widgets: {
      registry: {
        label: "Public registry",
        live: "Live",
        verified: "Verified",
        pilots: "Pilot cases",
        experts: "Experts",
        latestVerified: "Latest Verified",
        noneVerified: "First Verified dossier published — browse the registry.",
        cta: "Open registry",
      },
      rtms: {
        label: "RTMS grid",
        subtitle: "Real · Transparent · Measurable · Sound — the foundation of every Green dossier.",
        cta: "View standards",
        assistantCta: "Preliminary RTMS check",
      },
    },
  },
  register: {
    eyebrow: "Marketplace",
    title: "Register your actor",
    intro:
      "Producers, storers, chargers or consumers worldwide — profile reviewed by AUROS before publication on the map and lists.",
    form: {
      type: "Actor type",
      name: "Organisation name",
      city: "City",
      country: "Country",
      region: "Region / state (optional)",
      description: "Activity description (min. 20 characters)",
      contactEmail: "Professional email",
      capacityKwh: "Capacity (kWh)",
      pricePerKwh: "Indicative tariff (€/kWh, optional)",
      energyType: "Energy type",
      submit: "Submit profile",
      submitting: "Sending…",
      success: "Profile received",
      successBody: "AUROS review within 48 business hours — we will contact you at the email provided.",
      stepOf: (current, total) => `Step ${current} of ${total}`,
      errorInvalid: "Check required fields.",
      errorRateLimit: "Too many attempts — try again in one hour.",
    },
    successMy: "My listings",
    successMarket: "Marketplace",
    backLink: "← Back to Green hub",
  },
  about: {
    eyebrow: "Green RWA standard",
    title: "About AUROS Green",
    intro:
      "The RTMS reference for structuring, comparing and labelling tokenized green real-world assets — solar, REC, carbon, PPA. Documentary rigour, verifiable registry, transparent label path. Built for actors who need substance, not slogans.",
    promise: {
      title: "What the standard guarantees — and what it excludes",
      body:
        "A common language, explicit statuses and public evidence. The Verified badge attests a full RTMS document review on submitted dossier — not a return promise, not a substitute for investor due diligence, not an AMF, ESMA or equivalent licence.",
    },
    values: {
      title: "Three reasons to anchor your dossier here",
      items: [
        {
          title: "Credibility without greenwashing",
          body: "Market reference, RTMS pilot case or Verified: every status is named. No automatic badge from comparator presence alone.",
        },
        {
          title: "Opposable traceability",
          body: "Public registry, verification token, RTMS summary — a third party can check what was reviewed, when, and within which limits.",
        },
        {
          title: "Operational thread",
          body: "From marketplace to sourced comparator, through label and expert certification — one coherent suite, not isolated pages.",
        },
      ],
    },
    blocksTitle: "Standard journey",
    blocks: [
      {
        title: "RTMS standards",
        body: "Real · Transparent · Measurable · Sound — opposable criteria to qualify a green asset before tokenization or fundraising.",
        href: "/green/standards",
        cta: "Read the grid",
      },
      {
        title: "Green comparator",
        body: "Documented market references, explicit label statuses, clickable sources. A framing tool — never a buy recommendation.",
        href: "/green/compare",
        cta: "Analyse the market",
      },
      {
        title: "Auros Green Verified label",
        body: "RTMS document review on your dossier: off-chain traceability, stated risks, token ↔ asset coherence. Public badge only after validation.",
        href: "/green/label",
        cta: "Submit application",
      },
      {
        title: "Public registry",
        body: "Verified projects, RTMS pilot cases and certified experts — each entry verifiable by URL, no account required.",
        href: "/green/registry",
        cta: "Browse registry",
      },
    ],
    profilesTitle: "Where to start",
    profiles: [
      {
        id: "investor",
        title: "Investor / family office",
        body: "Map the market with honest statuses, then cross-check with AUROS Compare for legal and tax structuring.",
        cta: "Open green comparator",
        href: "/green/compare",
      },
      {
        id: "owner",
        title: "Project owner / SPV",
        body: "Prepare an RTMS-ready dossier: measurable production, contracts, stated limits — then apply for Verified label.",
        cta: "Prepare application",
        href: "/green/label",
      },
      {
        id: "individual",
        title: "Consultant / auditor",
        body: "RWA Fundamentals certification, RTMS mastery, Praticien exam — expert badge on public registry for 365 days.",
        cta: "Certification path",
        href: "/green/certification",
      },
    ],
    ecosystemTitle: "The AUROS Green ecosystem",
    ecosystemLinks: [
      { title: "Marketplace", href: "/green/market" },
      { title: "RTMS standards", href: "/green/standards" },
      { title: "Public registry", href: "/green/registry" },
      { title: "Verified label", href: "/green/label" },
      { title: "Comparator", href: "/green/compare" },
      { title: "Certification", href: "/green/certification" },
      { title: "Praticien", href: "/green/praticien" },
      { title: "My listings", href: "/green/my" },
    ],
    wizardTitle: "Structure a renewable asset",
    wizardBody:
      "AUROS wizard preconfigured — solar, REC, PPA or energy surplus. First indicative dossier in ~12 min, completable with your advisor.",
    wizardCta: "Renewable asset structuring path",
    backLink: "Back to hub",
  },
  standards: {
    eyebrow: "RTMS",
    title: "AUROS Green standards",
    intro:
      "RTMS encodes what an institutional actor expects before opening a green data room: measurable real impact, source transparency, reproducible metrics, legal structure and stated risks — without claiming to replace on-site audit.",
    methodologyTitle: "How to apply RTMS",
    methodologyIntro:
      "The grid is not a marketing checklist. It qualifies a dossier before tokenization, due diligence or label application.",
    methodologySteps: [
      {
        step: "01 · Qualify the off-chain asset",
        detail: "Production, carbon registry, REC or PPA — period, scope, counterparties, primary evidence.",
      },
      {
        step: "02 · Map token ↔ asset",
        detail: "Who mints, who holds, claim limits, double-counting risks.",
      },
      {
        step: "03 · State the limits",
        detail: "What the token does not guarantee: yield, liquidity, automatic MiCA compliance.",
      },
      {
        step: "04 · Decide the status",
        detail: "Market reference, internal pilot or Verified application — never an implicit badge.",
      },
    ],
    pillars: {
      real: {
        name: "Real",
        tagline: "Impact exists off-chain",
        bullets: [
          "Measurable production or retirement (MWh, tCO₂, hectares)",
          "Verifiable contracts or official registries",
          "No double counting between on-chain and off-chain",
        ],
      },
      transparent: {
        name: "Transparent",
        tagline: "Sources and limits visible",
        bullets: [
          "Public documentation or accessible data room",
          "Token traceability to underlying asset",
          "Limits and exclusions clearly stated",
        ],
      },
      measurable: {
        name: "Measurable",
        tagline: "Reproducible indicators",
        bullets: [
          "Impact metrics with period and scope",
          "Third-party audit or attestation when applicable",
          "Reviewable history, not a marketing snapshot",
        ],
      },
      sound: {
        name: "Sound",
        tagline: "Legal structure and acknowledged risks",
        bullets: [
          "Legal framework for token and project identified",
          "Operational, market and regulatory risks disclosed",
          "No guaranteed return promise",
        ],
      },
    },
    quickNavAria: "Green ecosystem navigation",
    quickNav: {
      market: "Marketplace",
      registry: "Public registry",
      compare: "Comparator",
      label: "Label application",
      assistant: "RTMS assistant (beta)",
    },
    checklistTitle: "Interactive RTMS checklist",
    checklistIntro:
      "Download a CSV grid to complete dossier by dossier — criteria per Real · Transparent · Measurable · Sound pillar.",
    exportChecklist: "Download checklist (.csv)",
    checklistFilename: "auros-green-rtms-checklist.csv",
    checklistTable: {
      pillar: "RTMS pillar",
      criterion: "Criterion",
      status: "Status (fill in)",
      notes: "Notes / evidence",
    },
    backLink: "← Back to AUROS Green",
  },
  compare: {
    eyebrow: "Market references",
    title: "Tokenized green projects comparator",
    intro:
      "Sourced educational rows — honest AUROS label status. No « certified » row without full AUROS audit.",
    disclaimer:
      "Yields and impact are indicative — not investment advice. Verify current protocol status on the primary source.",
    table: {
      project: "Project",
      type: "Type",
      token: "Token / instrument",
      yield: "Yield (indicative)",
      impact: "Impact (indicative)",
      label: "Label status",
      source: "Source",
      reviewed: "Reviewed",
    },
    labelStatus: {
      certified: "Auros Green Verified",
      in_review: "AUROS review in progress",
      reference: "Market reference",
      not_labeled: "Not labelled",
    },
    projectTypes: {
      solar: "Solar",
      wind: "Wind",
      rec: "Renewable certificates (REC)",
      carbon: "Carbon credits",
      ppa: "PPA / energy",
      other: "Other",
    },
    emptyNote: "No rows at this time.",
    aurosCompareCta: "General RWA comparator →",
    registryCta: "Browse public registry",
    registrySectionTitle: "AUROS Green registry",
    registrySectionIntro:
      "RTMS-reviewed projects — pedagogical pilot cases clearly marked, separate from market references below.",
    exportCsv: "Export CSV",
    exportPdf: "Export PDF",
    exportPdfGenerating: "PDF…",
    exportPdfRetry: "Retry PDF",
    backLink: "← Back to AUROS Green",
    marketOffersSectionTitle: "Selected marketplace listings",
    marketOffersSectionIntro:
      "Compare marketplace listings side by side — indicative MVP data, not advice.",
    marketOffersEmpty:
      "No listings selected — open a listing page and click « Add to comparator ».",
    marketOffersBrowse: "Browse marketplace",
    marketOffersCount: (n) => `${n} listing${n === 1 ? "" : "s"} selected (max 4)`,
    marketOffersActions: "Actions",
    removeFromCompare: "Remove",
    copyCompareLink: "Copy comparison link",
    shareCopied: "Link copied",
    saveSnapshotLink: "Snapshot link (30d)",
    snapshotSaving: "Saving snapshot…",
    snapshotCopied: "Snapshot link copied",
    snapshotError: "Snapshot unavailable — use URL link",
    snapshotLoaded: (id) => `Shared comparison · snapshot ${id}`,
    snapshotExpiredTitle: "Comparison link expired",
    snapshotExpiredBody:
      "This shared snapshot has passed its validity period (30 days). Start a new comparison or copy a URL link from the comparator.",
    snapshotNotFoundTitle: "Comparison not found",
    snapshotNotFoundBody:
      "This snapshot link does not exist or was removed. Return to the comparator to create a new one.",
    snapshotExpiredCta: "Back to comparator",
    snapshotRenewCta: "Renew 30 days",
    snapshotRenewing: "Renewing…",
    snapshotRenewError: "Failed — retry",
    snapshotRenewed: "Snapshot extended by 30 days",
    snapshotExpiresAt: (date) => `Expires ${date}`,
    countryFilterLabel: "Filter by country",
    countryFilterClear: "All countries",
    countryFilterEmpty: "No projects for these countries.",
    rwaRowInclude: "Include",
    rwaRowSelectAll: "All references",
    rwaRowSelectClear: "No references",
    marketExport: {
      sectionTitle: "Selected marketplace listings",
      energy: "Energy",
      tier: "Listing tier",
    },
  },
  label: {
    eyebrow: "Application",
    title: "Auros Green Verified label",
    intro:
      "Submit your project for document review. Public label is granted only after RTMS validation — no automatic badge.",
    scopeTitle: "What the application covers",
    scopeMeasures: [
      "RTMS document review (Real, Transparent, Measurable, Sound)",
      "Written feedback with strengths and gaps",
      "Public registry listing if label granted",
    ],
    scopeDoesNot: [
      "On-site audit or investor due diligence",
      "Return guarantee or regulatory approval",
      "Automatic listing on AUROS Compare",
    ],
    form: {
      projectName: "Project name",
      projectType: "Asset type",
      contactName: "Contact name",
      email: "Professional email",
      website: "Website or documentation",
      websitePlaceholder: "https://example.com",
      country: "Country / jurisdiction",
      description: "Short description (impact, token, stage)",
      stepOf: (current, total) => `Step ${current} of ${total}`,
      step1Title: "Project identity",
      step2Title: "Description & attachment",
      next: "Continue",
      back: "Back",
      submit: "Submit application",
      submitting: "Sending…",
      success: "Application received — we will respond within 5 business days.",
      successHint: "Review RTMS standards while we assess your dossier (5 business days).",
      successMy: "My listings",
      successStandards: "RTMS standards",
      successRegistry: "Public registry",
      successMarket: "Marketplace",
      successStatus:
        "Track progress in Actor space (/green/my) with the same professional email.",
      applicationId: (id) => `Dossier reference: ${id.slice(0, 8)}…`,
      document: "Supporting PDF (optional)",
      documentHint: "PDF only, 5 MB max — technical dossier or RTMS summary.",
      documentErrorType: "Unsupported format — PDF only.",
      documentErrorSize: "File too large (max 5 MB).",
      documentErrorUpload:
        "Application saved but PDF could not be attached — retry by email.",
      errorInvalid: "Check required fields.",
      errorRateLimit: "Too many attempts — try again in one hour.",
      projectTypes: {
        solar: "Solar",
        wind: "Wind",
        rec: "REC / green certificates",
        carbon: "Carbon credits",
        ppa: "PPA / energy surplus",
        other: "Other green RWA",
      },
    },
    applicationStatus: {
      pending: "Awaiting review",
      in_review: "Document review",
      approved: "Label published in registry",
      rejected: "Not retained — contact us",
    },
    backLink: "← Back to AUROS Green",
  },
  certification: {
    eyebrow: "Experts & professionals",
    title: "Individual Green certification",
    intro:
      "Validate RWA basics first — in-depth Green specialization comes with the Academy Praticien track.",
    modulesTitle: "Recommended path (Phase 1)",
    modules: [
      "RWA Academy Fundamentals — free, verifiable 90-day certificate",
      "RTMS standards — required reading before any project audit",
      "Green Praticien specialization — waitlist (content coming)",
    ],
    academyCta: "Start Academy Fundamentals",
    greenExpertNote:
      "The « Green expert » badge is available via RTMS exam — not a regulatory licence.",
    notifyCta: "Notify me — Green track",
    praticienCta: "Green Praticien track",
    backLink: "← Back to AUROS Green",
  },
  praticien: {
    eyebrow: "Advanced track",
    title: "Green Praticien",
    intro:
      "Specialization for green RWA auditors and consultants — Fundamentals Academy + RTMS mastery required. RTMS exam open (beta).",
    prerequisitesTitle: "Prerequisites",
    prerequisites: [
      "Valid RWA Fundamentals certificate (90 days)",
      "Full RTMS standards reading",
      "Professional experience in energy, ESG or RWA structuring",
    ],
    curriculumTitle: "Planned curriculum",
    curriculum: [
      "RTMS document audit on anonymized dossiers",
      "Solar / REC / carbon cases — double-counting traps",
      "Label sheet writing and investor communication",
      "Expert badge + public registry listing",
    ],
    waitlistTitle: "Waitlist (advanced track)",
    examCta: "Take RTMS exam (beta)",
    examNote: "Verifiable expert badge 365 days — public registry listing.",
    form: {
      fullName: "Full name",
      email: "Professional email",
      organization: "Organization (optional)",
      certId: "Fundamentals certificate ID (optional)",
      certIdHint: "Visible on your /academy/verify page — speeds prioritization.",
      message: "Message (optional)",
      submit: "Join waitlist",
      submitting: "Sending…",
      success: "Registration received — we will contact you when the track opens.",
    },
    backLink: "← Back to Green certification",
  },
  verify: {
    eyebrow: "Verification",
    title: "AUROS Green label",
    notFound: "Entry not found — check the link or contact the project owner.",
    projectLabel: "Labelled project",
    expertLabel: "Certified expert",
    tierVerified: "Auros Green Verified",
    tierPilot: "RTMS pilot case",
    certifiedAt: "Labelled on",
    country: "Country / jurisdiction",
    type: "Asset type",
    summary: "RTMS summary",
    pilotDisclaimer:
      "Pedagogical pilot case — AUROS Green methodology demo, not an investment recommendation or third-party certification.",
    backLink: "← AUROS Green registry",
  },
  registry: {
    eyebrow: "Transparency",
    title: "AUROS Green registry",
    intro:
      "Publicly labelled projects and experts — RTMS pilot cases published to illustrate the method, label applications open.",
    statsUnavailable: "Registry in local mode — full data after sync.",
    projectsTitle: "Labelled projects",
    projectsEmpty: "No labelled projects yet — applications open.",
    expertsTitle: "Certified experts",
    expertsEmpty: "No Green experts listed — Praticien track coming.",
    tierVerified: "Verified",
    tierPilot: "Pilot case",
    verifyLink: "Verify",
    verifyNote: "Each entry includes a public verification link.",
    pilotNote:
      "RTMS pilot cases are anonymized methodology demos — distinct from « Verified » projects after full audit.",
    statsProjects: (n) => `${n} listed project${n === 1 ? "" : "s"}`,
    statsExperts: (n) => `${n} expert${n === 1 ? "" : "s"}`,
    statsVerified: (n) => `${n} Verified`,
    statsPilots: (n) => `${n} pilot case${n === 1 ? "" : "s"}`,
    searchPlaceholder: "Search a project (name, country)…",
    searchEmpty: "No project matches this search.",
    tierFilterAll: "All",
    tierFilterVerified: "Verified",
    tierFilterPilot: "Pilot cases",
    tierFilterEmpty: "No project matches this filter.",
    exportCsv: "Export CSV",
    exportPdf: "Export PDF",
    exportPdfGenerating: "PDF…",
    exportPdfRetry: "Retry PDF",
    exportOpsNote:
      "AUROS Green registry certified export — UTC timestamp, SHA256 fingerprint and server HMAC signature of exported rows (indicative integrity, not a qualified e-signature). Without server key: SHA256 only.",
    exportVerify: {
      title: "Verify a PDF export",
      intro:
        "Paste the SHA256 fingerprint and HMAC signature from the PDF footer, or the full integrity line, to validate the export against the AUROS server.",
      hashLabel: "SHA256 fingerprint",
      hashPlaceholder: "64 hexadecimal characters",
      sigLabel: "HMAC signature (sig=)",
      sigPlaceholder: "64 hexadecimal characters",
      pasteLabel: "Paste PDF integrity line",
      pastePlaceholder: "Integrity SHA256: … · sig=…",
      submit: "Verify export",
      checking: "Checking…",
      resultValid: "Valid signature — export matches rows signed by the AUROS server.",
      resultInvalid: "Invalid signature — check hash and sig, or the export was altered.",
      resultNoKey:
        "No server signing key — HMAC verification unavailable (SHA256 only on PDF).",
      resultError: "Verification failed — check hash/sig format.",
      hint: "API: GET /api/green/verify-registry-export?hash=&sig=",
    },
    backLink: "← Back to AUROS Green",
    viewProject: "View project page",
    projectDetail: {
      eyebrow: "Public registry",
      intro: "AUROS Green labelled project — explicit RTMS status, no return promise.",
      locationTitle: "Location",
      statusTitle: "Label status",
      rtmsTierTitle: "RTMS tier",
      rtmsTierBody: (tier) =>
        tier === "verified"
          ? "Auros Green Verified label — full RTMS document review validated by AUROS."
          : "RTMS pilot case — anonymized methodology demo, distinct from investor audit.",
      certifiedAtTitle: "Listed on",
      descriptionTitle: "Description",
      websiteTitle: "Website",
      verifyCta: "Verification page",
      backLink: "← Back to registry",
      notFoundTitle: "Project not found",
      notFoundBody: "This project is not in the public registry or is no longer available.",
    },
  },
  admin: {
    exportFilterLabel: "Filter CSV export",
    exportFilterAll: "All",
    exportFilterPending: "Pending",
    exportFilterInReview: "In review",
    exportFilterApproved: "Approved",
    exportFilterRejected: "Rejected",
    exportFilterIncomplete: "Incomplete dossier",
    exportFilterReminded1: "Reminder 1",
    exportFilterReminded2: "Reminder 2",
    exportCsv: "Export CSV",
    exportCsvAll: "Export CSV (all)",
  },
  guide: {
    eyebrow: "Educational guide",
    title: "Tokenizing an energy surplus",
    intro:
      "Honest overview — steps, risks and links to the AUROS wizard. Not a turnkey legal template.",
    sections: [
      {
        title: "1. Qualify the surplus",
        body: "Measure excess production (kWh/MWh), grid contracts and local framework (self-consumption, feed-in, PPA).",
      },
      {
        title: "2. Structure the asset",
        body: "Separate economic rights, cash flows and token representation — jurisdiction and MiCA as applicable.",
      },
      {
        title: "3. On-chain traceability",
        body: "Attestations, oracles or registries — the token must point to measurable source, not marketing promise.",
      },
      {
        title: "4. Compliance & disclosure",
        body: "Public document: scope, risks, no guaranteed return. Label application if targeting Auros Green Verified.",
      },
    ],
    wizardCta: "Open wizard — renewable asset",
    backLink: "← Back to AUROS Green",
  },
  exam: {
    eyebrow: "RTMS exam",
    title: "Green Praticien quiz",
    intro: (quizLen, passScore) =>
      `${quizLen} RTMS questions — minimum score ${passScore}/${quizLen}. Verifiable expert badge 365 days.`,
    displayName: "Display name (public registry)",
    email: "Professional email",
    start: "Start exam",
    starting: "Preparing…",
    question: (current, total) => `Question ${current} / ${total}`,
    next: "Next question",
    submit: "Submit exam",
    successTitle: (name) => `Congratulations ${name} — Green expert badge`,
    successScore: (score, total) => `Score: ${score}/${total}`,
    verifyCta: "Public verification page",
    validUntil: (iso) => `Valid until ${iso.slice(0, 10)}`,
    failTitle: "Exam not passed",
    failBelowPass: (score, required) =>
      `Score ${score} — ${required} required. Review RTMS standards and retry.`,
    failTooFast: "Submitted too quickly — read each question carefully.",
    failGeneric: "Invalid or expired session — restart the exam.",
    retry: "Try again",
    backLink: "← Back to Green Praticien",
    errors: { startFailed: "Could not start — check your details." },
  },
  mailto: {
    greenExpertSubject: "AUROS Green — expert track (waitlist)",
  },
};

const ES: GreenMessages = {
  header: {
    backToApp: "auros.app →",
    languageAria: "Idioma",
    nav: {
      ariaLabel: "Navegación AUROS Green",
      market: "Mercado",
      standards: "Estándares",
      registry: "Registro",
      label: "Etiqueta",
    },
  },
  disclaimer:
    "AUROS Green es un marco metodológico y educativo — no una licencia regulatoria, asesoramiento de inversión ni garantía de rendimiento. Cada decisión requiere sus propias verificaciones jurídicas, fiscales y de due diligence.",
  hub: {
    tagline:
      "El ecosistema AUROS Green — mercado mundial, estándar RTMS, registro público y etiqueta Verified para energía renovable tokenizada.",
    hero: {
      valueProp:
        "Productores, almacenadores, recargadores — encuentre actores, compare referencias, verifique estados. RTMS, registro y etiqueta al centro; estructuración de dossier disponible si hace falta.",
      primaryCta: "Explorar el mercado",
      secondaryRegisterCta: "Registrar mi actor",
      producerSurplusCta: "Vendo mi excedente solar",
      tertiaryCta: "Registro público",
    },
    latestOffers: {
      title: "Últimas oportunidades",
      viewAll: "Ver todos los anuncios",
    },
    quote: {
      text:
        "La trazabilidad kWh importa más que un relato verde — comentario de un caso piloto RTMS en el registro.",
      attribution: "— Comentario piloto RTMS (anonimizado)",
      disclaimerLabel: "Testimonio indicativo · demo pedagógica",
      registryCta: "Ver casos piloto en el registro",
    },
    moreSections: {
      toggle: "Metodología, activos y registro",
    },
    onboarding: {
      toggle: "¿Por dónde empezar? (3 pasos)",
      intro:
        "RTMS para encuadrar un dossier, mercado para encontrar actores, registro para referenciar el suyo — el resto del hub sigue abajo.",
      stepLabel: (current, total) => `Paso ${current} / ${total}`,
      steps: [
        {
          title: "Estándares RTMS",
          body: "Real · Transparente · Medible · Sano — criterios publicados, revisión documental sobre dossier aportado.",
          cta: "Ver RTMS",
        },
        {
          title: "Mercado",
          body: "Mapa mundial, filtros por tipo de actor y anuncios compra/venta — datos indicativos, no consejo.",
          cta: "Abrir mercado",
        },
        {
          title: "Referenciar un actor",
          body: "Productor, almacenador, recargador o consumidor — revisión AUROS en 48 h laborables antes de publicación.",
          cta: "Registrarse",
        },
      ],
      wizardHint: "Estructurar un dossier RWA verde (wizard AUROS)",
    },
    whyRwa: {
      title: "¿Por qué un RWA verde?",
      rtmsBadge: "Rejilla RTMS · etiqueta Verified",
      items: [
        {
          title: "Activo medible, no una promesa",
          body: "Producción kWh, certificados de origen, contratos PPA — el token apunta a una fuente verificable, con estados honestos (indicativo, piloto, registro).",
        },
        {
          title: "Transparencia opugnable",
          body: "Rejilla RTMS, comparador con fuentes y registro público — un tercero puede ver qué se revisó y con qué límites.",
        },
        {
          title: "Ecosistema coherente",
          body: "Mercado, estándares RTMS, registro público y etiqueta Verified — una suite vertical autónoma, no un paso hacia el wizard AUROS general.",
        },
      ],
    },
    rtmsSection: {
      title: "Metodología RTMS",
      intro:
        "Real · Transparent · Measurable · Sound — marco interno AUROS Green para evaluar un dossier antes de etiqueta o listado. No una auditoría de terceros (KPMG, EY) ni una licencia regulatoria.",
      statusNote: "Estado: marco metodológico piloto — criterios publicados, revisión documental sobre dossier aportado.",
      cta: "Ver estándares RTMS",
      assistantCta: "Pre-diagnóstico RTMS (beta)",
    },
    eligibleAssets: {
      title: "Activos elegibles",
      intro:
        "Ejemplos concretos — cada dossier sigue sujeto a revisión RTMS; presencia aquí no implica certificación automática.",
      items: [
        {
          id: "solar",
          title: "Solar y agrivoltaica",
          body: "Excedente de inyección, PPA corporativos, cubiertas y parques — producción horaria medida.",
        },
        {
          id: "wind",
          title: "Eólico terrestre y offshore",
          body: "Parques medidos SCADA, garantías de origen, bloques de exportación.",
        },
        {
          id: "storage",
          title: "Almacenamiento y baterías",
          body: "BESS contenedor, arbitraje intradiario, respuesta a la demanda — capacidad y ciclos trazables.",
        },
        {
          id: "efficiency",
          title: "Eficiencia y certificados",
          body: "REC, créditos de carbono ligados a flujo medible — sin token « verde » sin fuente.",
        },
      ],
      compareCta: "Comparar referencias de mercado",
      guideCta: "Guía tokenización excedente",
    },
    marketKpis: {
      title: "Mercado — panorama",
      actorsLabel: "Actores en el mapa",
      countriesLabel: "Países representados",
      offersLabel: "Anuncios activos",
      demoNote: "Datos demo / piloto — cifras indicativas, no estadística de mercado certificada.",
    },
    mapTeaser: {
      title: "Mapa mundial",
      ariaLabel: "Mapa interactivo de actores de energía verde AUROS Green",
      statsLine: (actors, countries) =>
        `${actors} actores · ${countries} países (datos indicativos)`,
      cta: "Abrir mercado completo",
    },
    participate: {
      title: "Cómo participar",
      intro: "Tres entradas prioritarias en el ecosistema — el resto sigue accesible desde el hub.",
      items: [
        {
          title: "Explorar el mercado",
          body: "Mapa mundial, anuncios venta/compra, filtros por tipo de actor — el ecosistema al centro.",
          href: "/green/market",
          cta: "Abrir el mercado",
        },
        {
          title: "Registrar un actor",
          body: "Productor, almacenador, recargador o consumidor — ficha revisada antes de publicación en el mapa.",
          href: "/green/register",
          cta: "Enviar ficha",
        },
        {
          title: "Solicitar etiqueta",
          body: "Revisión documental RTMS — badge Verified solo tras validación, no al enviar.",
          href: "/green/label",
          cta: "Solicitar etiqueta",
        },
      ],
    },
    seo: {
      toggleLabel: "Saber más — tokenización verde y energía local",
      sections: [
        {
          heading: "Tokenización verde y energía local",
          body:
            "AUROS Green es la vertical dedicada a activos reales verdes tokenizados: producción solar, eólica, hidro, almacenamiento en batería y certificados ligados a un flujo medible. El objetivo es estructurar la trazabilidad documental antes de cualquier representación on-chain — sin promesa de rendimiento, sin greenwashing.",
        },
        {
          heading: "Mercado mundial en piloto",
          body:
            "El mapa interactivo recoge productores, almacenadores, recargadores y consumidores en varios continentes. Las fichas demo y piloto están claramente etiquetadas; los actores referenciados pasan revisión AUROS antes de publicación.",
          subsections: [
            {
              heading: "Cobertura geográfica",
              body:
                "Francia, Europa, Américas, África, Oriente Medio y Asia-Pacífico — geolocalización ciudad + país, filtros por tipo y anuncios compra/venta.",
            },
            {
              heading: "Estados honestos",
              body:
                "Demo, referenciado, verified — cada nivel está nombrado. Ningún badge automático solo por registrarse.",
            },
          ],
        },
        {
          heading: "Rejilla RTMS y registro público",
          body:
            "RTMS (Real, Transparent, Measurable, Sound) es el pilar metodológico AUROS Green. El registro público lista casos piloto RTMS, proyectos Verified tras revisión y expertos certificados — cada entrada verificable por token público.",
        },
      ],
    },
    manifesto:
      "La naturaleza no es una diapositiva. Es el suelo bajo nuestros pies, el viento que gira, la luz que se convierte en energía — y la razón por la que existimos.",
    manifestoSign: "— AUROS",
    find: {
      title: "¿Qué busca?",
      intro:
        "Cuatro perfiles de actores, un mapa mundial. Elija su necesidad — la lista filtrada y los anuncios le esperan.",
      countLabel: (count) =>
        count === 0
          ? "Ninguno en el mapa"
          : count === 1
            ? "1 actor en el mapa"
            : `${count} actores en el mapa`,
      countriesLabel: (n) =>
        n === 1 ? "1 país en el mapa" : `${n} países representados (datos indicativos)`,
    },
    actors: [
      {
        id: "producer",
        title: "Productores",
        description: "Solar, eólico, hidro — excedente, PPA y producción medida.",
        href: "/green/producers",
      },
      {
        id: "storer",
        title: "Almacenadores",
        description: "Baterías y reservas — capacidad disponible, descarga horaria.",
        href: "/green/storers",
      },
      {
        id: "charger",
        title: "Recargadores",
        description: "Puntos DC y hubs — sitios abiertos o contractuales.",
        href: "/green/chargers",
      },
      {
        id: "consumer",
        title: "Consumidores",
        description: "Sitios que compran energía verde — industrial y sector público.",
        href: "/green/consumers",
      },
    ],
    map: {
      title: "Mapa mundial",
      intro:
        "Actores referenciados en Francia, Europa y otros continentes. Filtre por tipo, acerque y abra el mercado para publicar o contactar.",
      scope: "Cobertura mundial (datos indicativos)",
      cta: "Mercado completo",
      legend: (visible, total) =>
        visible === total
          ? `${total} actores en el mapa`
          : `${visible} mostrados de ${total} actores referenciados`,
      filters: {
        all: "Todos",
        producer: "Productores",
        storer: "Almacenadores",
        charger: "Recargadores",
        consumer: "Consumidores",
      },
    },
    metrics: {
      title: "Impacto trazado",
      subtitle: "Volúmenes indicativos en dossiers RTMS publicados — no estadística de mercado.",
      carbon: "Carbono evitado",
      carbonUnit: "tCO₂ eq.",
      mwh: "Energía trazada",
      mwhUnit: "MWh",
      note: "Metodología RTMS · casos en registro público · cifras evolutivas.",
      noteDemo: "Cifras indicativas hasta agregar casos del registro.",
    },
    secondary: {
      title: "Estándar y conformidad",
      links: [
        {
          title: "Estándares RTMS",
          description: "Real, transparente, medible, sano — la cuadrícula de referencia.",
          href: "/green/standards",
        },
        {
          title: "Comparador",
          description: "Proyectos tokenizados con fuentes, estados honestos, enlaces verificados.",
          href: "/green/compare",
        },
        {
          title: "Etiqueta Verified",
          description: "Solicitar AUROS Green Verified para su proyecto.",
          href: "/green/label",
        },
        {
          title: "Registro público",
          description: "Proyectos Verified, pilotos, expertos certificados — verificables.",
          href: "/green/registry",
        },
      ],
    },
    wizardCta: "Recorrido estructuración activo",
    aboutCta: "El estándar en detalle",
    registerCta: "Referenciar mi actor en el mapa",
    widgets: {
      registry: {
        label: "Registro público",
        live: "En directo",
        verified: "Verified",
        pilots: "Casos piloto",
        experts: "Expertos",
        latestVerified: "Último Verified",
        noneVerified: "Primer dossier Verified publicado — explore el registro.",
        cta: "Abrir registro",
      },
      rtms: {
        label: "Cuadrícula RTMS",
        subtitle: "Real · Transparente · Medible · Sano — la base de todo dossier Green.",
        cta: "Ver estándares",
        assistantCta: "Pre-diagnóstico RTMS",
      },
    },
  },
  register: {
    eyebrow: "Mercado",
    title: "Referenciar su actor",
    intro:
      "Productores, almacenadores, recargadores o consumidores en todo el mundo — ficha revisada por AUROS antes de publicación en el mapa y listas.",
    form: {
      type: "Tipo de actor",
      name: "Nombre de la estructura",
      city: "Ciudad",
      country: "País",
      region: "Región / estado (opcional)",
      description: "Descripción de la actividad (mín. 20 caracteres)",
      contactEmail: "E-mail profesional",
      capacityKwh: "Capacidad (kWh)",
      pricePerKwh: "Tarifa indicativa (€/kWh, opcional)",
      energyType: "Tipo de energía",
      submit: "Enviar ficha",
      submitting: "Enviando…",
      success: "Ficha recibida",
      successBody: "Revisión AUROS en 48 h laborables — contacto al e-mail indicado.",
      stepOf: (current, total) => `Paso ${current} de ${total}`,
      errorInvalid: "Revise los campos obligatorios.",
      errorRateLimit: "Demasiados intentos — inténtelo de nuevo en una hora.",
    },
    successMy: "Mis fichas",
    successMarket: "Mercado",
    backLink: "← Volver al hub Green",
  },
  about: {
    eyebrow: "Estándar verde RWA",
    title: "AUROS Green en detalle",
    intro:
      "El referente RTMS para estructurar, comparar y etiquetar activos reales verdes tokenizados — solar, REC, carbono, PPA. Rigor documental, registro verificable, recorrido de etiqueta transparente. Para actores que necesitan seriedad, no eslóganes.",
    promise: {
      title: "Lo que el estándar garantiza — y lo que excluye",
      body:
        "Un lenguaje común, estados explícitos y pruebas públicas. El badge Verified acredita una revisión documental RTMS completa sobre dossier aportado — no una promesa de rendimiento, no un sustituto de su due diligence de inversor, no una licencia AMF, ESMA o equivalente.",
    },
    values: {
      title: "Tres razones para anclar su dossier aquí",
      items: [
        {
          title: "Credibilidad sin greenwashing",
          body: "Referencia de mercado, caso piloto RTMS o Verified: cada estado está nombrado. Ningún badge automático por sola presencia en el comparador.",
        },
        {
          title: "Trazabilidad opugnable",
          body: "Registro público, token de verificación, síntesis RTMS — un tercero puede comprobar qué se revisó, cuándo y con qué límites.",
        },
        {
          title: "Hilo operativo",
          body: "Del mercado al comparador documentado, pasando por la etiqueta y la certificación experta — una suite coherente, no páginas aisladas.",
        },
      ],
    },
    blocksTitle: "Recorrido del estándar",
    blocks: [
      {
        title: "Estándares RTMS",
        body: "Real · Transparente · Medible · Sano — criterios opugnables para calificar un activo verde antes de tokenización o captación.",
        href: "/green/standards",
        cta: "Leer la cuadrícula",
      },
      {
        title: "Comparador verde",
        body: "Referencias de mercado documentadas, estados de etiqueta explícitos, fuentes clicables. Herramienta de encuadre — nunca una recomendación de compra.",
        href: "/green/compare",
        cta: "Analizar el mercado",
      },
      {
        title: "Etiqueta Auros Green Verified",
        body: "Revisión documental RTMS sobre su dossier: trazabilidad off-chain, riesgos declarados, coherencia token ↔ activo. Badge público solo tras validación.",
        href: "/green/label",
        cta: "Enviar solicitud",
      },
      {
        title: "Registro público",
        body: "Proyectos Verified, casos piloto RTMS y expertos certificados — cada entrada verificable por URL, sin cuenta requerida.",
        href: "/green/registry",
        cta: "Consultar registro",
      },
    ],
    profilesTitle: "Por dónde empezar",
    profiles: [
      {
        id: "investor",
        title: "Inversor / family office",
        body: "Cartografíe el mercado con estados honestos, luego cruce con AUROS Compare para estructuración jurídica y fiscal.",
        cta: "Abrir comparador verde",
        href: "/green/compare",
      },
      {
        id: "owner",
        title: "Promotor / SPV",
        body: "Prepare un dossier RTMS-ready: producción medible, contratos, límites declarados — luego solicite la etiqueta Verified.",
        cta: "Preparar solicitud",
        href: "/green/label",
      },
      {
        id: "individual",
        title: "Consultor / auditor",
        body: "Certificación Fundamentos RWA, dominio RTMS, examen Praticien — badge experto en registro público 365 días.",
        cta: "Ruta de certificación",
        href: "/green/certification",
      },
    ],
    ecosystemTitle: "El ecosistema AUROS Green",
    ecosystemLinks: [
      { title: "Mercado", href: "/green/market" },
      { title: "Estándares RTMS", href: "/green/standards" },
      { title: "Registro público", href: "/green/registry" },
      { title: "Etiqueta Verified", href: "/green/label" },
      { title: "Comparador", href: "/green/compare" },
      { title: "Certificación", href: "/green/certification" },
      { title: "Praticien", href: "/green/praticien" },
      { title: "Mis fichas", href: "/green/my" },
    ],
    wizardTitle: "Estructurar un activo renovable",
    wizardBody:
      "Wizard AUROS preconfigurado — solar, REC, PPA o excedente energético. Primera versión de dossier indicativo en ~12 min, completable con su asesor.",
    wizardCta: "Recorrido estructuración activo renovable",
    backLink: "Volver al hub",
  },
  standards: {
    eyebrow: "RTMS",
    title: "Estándares AUROS Green",
    intro:
      "RTMS codifica lo que un actor institucional espera antes de abrir un data room verde: impacto real medible, transparencia de fuentes, métricas reproducibles, estructura jurídica y riesgos asumidos — sin pretender sustituir una auditoría in situ.",
    methodologyTitle: "Cómo aplicar RTMS",
    methodologyIntro:
      "La cuadrícula no es un checklist de marketing. Sirve para calificar un dossier antes de tokenización, due diligence o solicitud de etiqueta.",
    methodologySteps: [
      {
        step: "01 · Calificar el activo off-chain",
        detail: "Producción, registro de carbono, REC o PPA — periodo, perímetro, contrapartes, pruebas primarias.",
      },
      {
        step: "02 · Cartografiar token ↔ activo",
        detail: "Quién mintea, quién detenta, límites de reclamación, riesgos de doble conteo.",
      },
      {
        step: "03 · Exponer los límites",
        detail: "Lo que el token no garantiza: rendimiento, liquidez, conformidad MiCA automática.",
      },
      {
        step: "04 · Decidir el estado",
        detail: "Referencia de mercado, piloto interno o solicitud Verified — nunca un badge implícito.",
      },
    ],
    pillars: {
      real: {
        name: "Real",
        tagline: "El impacto existe fuera de la blockchain",
        bullets: [
          "Producción o retiro medible (MWh, tCO₂, hectáreas)",
          "Contratos o registros oficiales verificables",
          "Sin doble contabilidad entre on-chain y off-chain",
        ],
      },
      transparent: {
        name: "Transparente",
        tagline: "Fuentes y límites visibles",
        bullets: [
          "Documentación pública o data room accesible",
          "Trazabilidad del token al activo subyacente",
          "Límites y exclusiones claramente declarados",
        ],
      },
      measurable: {
        name: "Medible",
        tagline: "Indicadores reproducibles",
        bullets: [
          "Métricas de impacto con periodo y alcance",
          "Auditoría o attestation de terceros cuando aplique",
          "Historial consultable, no una instantánea de marketing",
        ],
      },
      sound: {
        name: "Sano",
        tagline: "Estructura jurídica y riesgos asumidos",
        bullets: [
          "Marco legal del token y del proyecto identificado",
          "Riesgos operativos, de mercado y regulatorios expuestos",
          "Sin promesa de rendimiento garantizado",
        ],
      },
    },
    quickNavAria: "Navegación ecosistema Green",
    quickNav: {
      market: "Mercado",
      registry: "Registro público",
      compare: "Comparador",
      label: "Solicitud etiqueta",
      assistant: "Asistente RTMS (beta)",
    },
    checklistTitle: "Checklist RTMS interactiva",
    checklistIntro:
      "Descargue una cuadrícula CSV para completar dossier a dossier — criterios por pilar Real · Transparente · Medible · Sano.",
    exportChecklist: "Descargar checklist (.csv)",
    checklistFilename: "auros-green-rtms-checklist.csv",
    checklistTable: {
      pillar: "Pilar RTMS",
      criterion: "Criterio",
      status: "Estado (a completar)",
      notes: "Notas / pruebas",
    },
    backLink: "← Volver a AUROS Green",
  },
  compare: {
    eyebrow: "Referencias de mercado",
    title: "Comparador de proyectos verdes tokenizados",
    intro:
      "Filas educativas con fuentes — estado de etiqueta AUROS honesto. Ninguna fila « certificada » sin auditoría AUROS completa.",
    disclaimer:
      "Rendimientos e impactos indicativos — no es asesoramiento de inversión. Verifique el estado actual del protocolo en la fuente primaria.",
    table: {
      project: "Proyecto",
      type: "Tipo",
      token: "Token / instrumento",
      yield: "Rendimiento (indicativo)",
      impact: "Impacto (indicativo)",
      label: "Estado etiqueta",
      source: "Fuente",
      reviewed: "Revisado",
    },
    labelStatus: {
      certified: "Auros Green Verified",
      in_review: "Revisión AUROS en curso",
      reference: "Referencia de mercado",
      not_labeled: "Sin etiqueta",
    },
    projectTypes: {
      solar: "Solar",
      wind: "Eólico",
      rec: "Certificados verdes (REC)",
      carbon: "Créditos de carbono",
      ppa: "PPA / energía",
      other: "Otro",
    },
    emptyNote: "Sin filas por el momento.",
    aurosCompareCta: "Comparador RWA general →",
    registryCta: "Consultar registro público",
    registrySectionTitle: "Registro AUROS Green",
    registrySectionIntro:
      "Proyectos revisados RTMS — casos piloto pedagógicos claramente identificados, distintos de las referencias de mercado abajo.",
    exportCsv: "Exportar CSV",
    exportPdf: "Exportar PDF",
    exportPdfGenerating: "PDF…",
    exportPdfRetry: "Reintentar PDF",
    backLink: "← Volver a AUROS Green",
    marketOffersSectionTitle: "Anuncios del marketplace seleccionados",
    marketOffersSectionIntro:
      "Compare anuncios del marketplace lado a lado — datos MVP indicativos, no asesoramiento.",
    marketOffersEmpty:
      "Ningún anuncio seleccionado — abra una ficha y pulse « Añadir al comparador ».",
    marketOffersBrowse: "Explorar marketplace",
    marketOffersCount: (n) => `${n} anuncio${n === 1 ? "" : "s"} seleccionado${n === 1 ? "" : "s"} (máx. 4)`,
    marketOffersActions: "Acciones",
    removeFromCompare: "Quitar",
    copyCompareLink: "Copiar enlace de comparación",
    shareCopied: "Enlace copiado",
    saveSnapshotLink: "Enlace snapshot (30 d)",
    snapshotSaving: "Snapshot…",
    snapshotCopied: "Enlace snapshot copiado",
    snapshotError: "Snapshot no disponible — use el enlace URL",
    snapshotLoaded: (id) => `Comparación compartida · snapshot ${id}`,
    snapshotExpiredTitle: "Enlace de comparación caducado",
    snapshotExpiredBody:
      "Este snapshot compartido superó su periodo de validez (30 días). Cree una nueva comparación o copie un enlace URL desde el comparador.",
    snapshotNotFoundTitle: "Comparación no encontrada",
    snapshotNotFoundBody:
      "Este enlace snapshot no existe o fue eliminado. Vuelva al comparador para crear uno nuevo.",
    snapshotExpiredCta: "Volver al comparador",
    snapshotRenewCta: "Renovar 30 d",
    snapshotRenewing: "Renovando…",
    snapshotRenewError: "Error — reintentar",
    snapshotRenewed: "Snapshot prolongado 30 días",
    snapshotExpiresAt: (date) => `Expira el ${date}`,
    countryFilterLabel: "Filtrar por país",
    countryFilterClear: "Todos los países",
    countryFilterEmpty: "Ningún proyecto para estos países.",
    rwaRowInclude: "Incluir",
    rwaRowSelectAll: "Todas las referencias",
    rwaRowSelectClear: "Ninguna referencia",
    marketExport: {
      sectionTitle: "Anuncios del marketplace seleccionados",
      energy: "Energía",
      tier: "Nivel listing",
    },
  },
  label: {
    eyebrow: "Solicitud",
    title: "Etiqueta Auros Green Verified",
    intro:
      "Envíe su proyecto para revisión documental. La etiqueta pública se concede solo tras validación RTMS — sin badge automático.",
    scopeTitle: "Qué cubre la solicitud",
    scopeMeasures: [
      "Revisión documental RTMS (Real, Transparente, Medible, Sano)",
      "Feedback escrito con fortalezas y brechas",
      "Inscripción en registro público si se concede la etiqueta",
    ],
    scopeDoesNot: [
      "Auditoría in situ o due diligence de inversor",
      "Garantía de rendimiento o aprobación regulatoria",
      "Listado automático en AUROS Compare",
    ],
    form: {
      projectName: "Nombre del proyecto",
      projectType: "Tipo de activo",
      contactName: "Contacto",
      email: "E-mail profesional",
      website: "Sitio o documentación",
      websitePlaceholder: "https://ejemplo.com",
      country: "País / jurisdicción",
      description: "Descripción breve (impacto, token, fase)",
      stepOf: (current, total) => `Paso ${current} de ${total}`,
      step1Title: "Identidad del proyecto",
      step2Title: "Descripción y adjunto",
      next: "Continuar",
      back: "Volver",
      submit: "Enviar solicitud",
      submitting: "Enviando…",
      success: "Solicitud recibida — respondemos en 5 días hábiles.",
      successHint:
        "Consulte los estándares RTMS durante la revisión (5 días hábiles).",
      successMy: "Mis fichas",
      successStandards: "Estándares RTMS",
      successRegistry: "Registro público",
      successMarket: "Mercado",
      successStatus:
        "Siga el avance en Espacio actor (/green/my) con el mismo e-mail profesional.",
      applicationId: (id) => `Referencia dossier: ${id.slice(0, 8)}…`,
      document: "PDF justificativo (opcional)",
      documentHint: "Solo PDF, 5 MB máx. — dossier técnico o síntesis RTMS.",
      documentErrorType: "Formato no aceptado — solo PDF.",
      documentErrorSize: "Archivo demasiado grande (máx. 5 MB).",
      documentErrorUpload:
        "Solicitud guardada pero el PDF no se adjuntó — reintente por e-mail.",
      errorInvalid: "Revise los campos obligatorios.",
      errorRateLimit: "Demasiados intentos — inténtelo de nuevo en una hora.",
      projectTypes: {
        solar: "Solar",
        wind: "Eólico",
        rec: "REC / certificados verdes",
        carbon: "Créditos de carbono",
        ppa: "PPA / excedente energético",
        other: "Otro RWA verde",
      },
    },
    applicationStatus: {
      pending: "En espera de revisión",
      in_review: "Revisión documental",
      approved: "Etiqueta publicada en registro",
      rejected: "No retenido — contáctenos",
    },
    backLink: "← Volver a AUROS Green",
  },
  certification: {
    eyebrow: "Expertos y profesionales",
    title: "Certificación individual Green",
    intro:
      "Valide primero las bases RWA — la especialización Green profunda llegará con el track Praticien Academy.",
    modulesTitle: "Ruta recomendada (Fase 1)",
    modules: [
      "Fundamentos RWA Academy — gratis, certificado verificable 90 días",
      "Estándares RTMS — lectura obligatoria antes de cualquier auditoría",
      "Especialización Green Praticien — lista de espera (contenido próximo)",
    ],
    academyCta: "Comenzar Fundamentos Academy",
    greenExpertNote:
      "El badge « experto Green » está disponible vía examen RTMS — no es una autorización regulatoria.",
    notifyCta: "Avísame — track Green",
    praticienCta: "Track Praticien Green",
    backLink: "← Volver a AUROS Green",
  },
  praticien: {
    eyebrow: "Track avanzado",
    title: "Praticien Green",
    intro:
      "Especialización para auditores y consultores RWA verdes — prerrequisitos Fundamentos Academy + dominio RTMS. Examen RTMS abierto (beta).",
    prerequisitesTitle: "Prerrequisitos",
    prerequisites: [
      "Certificado Fundamentos RWA válido (90 días)",
      "Lectura completa de estándares RTMS",
      "Experiencia profesional en energía, ESG o estructuración RWA",
    ],
    curriculumTitle: "Programa previsto",
    curriculum: [
      "Auditoría documental RTMS sobre dossiers anonimizados",
      "Casos solar / REC / carbono — trampas de doble conteo",
      "Redacción de ficha label y comunicación inversor",
      "Badge experto + inscripción registro público",
    ],
    waitlistTitle: "Lista de espera",
    examCta: "Iniciar examen RTMS (beta)",
    examNote:
      "8 preguntas, 7/8 para aprobar — badge experto en el registro público 365 días.",
    form: {
      fullName: "Nombre completo",
      email: "E-mail profesional",
      organization: "Organización (opcional)",
      certId: "ID certificado Fundamentos (opcional)",
      certIdHint: "Visible en su página /academy/verify — acelera la priorización.",
      message: "Mensaje (opcional)",
      submit: "Unirse a la lista de espera",
      submitting: "Enviando…",
      success: "Inscripción recibida — le contactamos a la apertura del track.",
    },
    backLink: "← Volver a certificación Green",
  },
  verify: {
    eyebrow: "Verificación",
    title: "Etiqueta AUROS Green",
    notFound: "Entrada no encontrada — verifique el enlace o contacte al promotor.",
    projectLabel: "Proyecto etiquetado",
    expertLabel: "Experto certificado",
    tierVerified: "Auros Green Verified",
    tierPilot: "Caso piloto RTMS",
    certifiedAt: "Etiquetado el",
    country: "País / jurisdicción",
    type: "Tipo de activo",
    summary: "Síntesis RTMS",
    pilotDisclaimer:
      "Caso piloto pedagógico — demostración metodológica AUROS Green, no recomendación de inversión ni certificación de terceros.",
    backLink: "← Registro AUROS Green",
  },
  registry: {
    eyebrow: "Transparencia",
    title: "Registro AUROS Green",
    intro:
      "Proyectos y expertos etiquetados públicamente — casos piloto RTMS publicados para ilustrar el método, solicitudes de etiqueta abiertas.",
    statsUnavailable: "Registro en modo local — datos completos tras sincronización.",
    projectsTitle: "Proyectos etiquetados",
    projectsEmpty: "Ningún proyecto etiquetado aún — solicitudes abiertas.",
    expertsTitle: "Expertos certificados",
    expertsEmpty: "Ningún experto Green listado — track Praticien próximo.",
    tierVerified: "Verified",
    tierPilot: "Caso piloto",
    verifyLink: "Verificar",
    verifyNote: "Cada entrada incluye un enlace de verificación público.",
    pilotNote:
      "Los casos piloto RTMS son demostraciones metodológicas anonimizadas — distintos de proyectos « Verified » tras auditoría completa.",
    statsProjects: (n) => `${n} proyecto${n === 1 ? "" : "s"} listado${n === 1 ? "" : "s"}`,
    statsExperts: (n) => `${n} experto${n === 1 ? "" : "s"}`,
    statsVerified: (n) => `${n} Verified`,
    statsPilots: (n) => `${n} caso${n === 1 ? "" : "s"} piloto`,
    searchPlaceholder: "Buscar un proyecto (nombre, país)…",
    searchEmpty: "Ningún proyecto coincide con esta búsqueda.",
    tierFilterAll: "Todos",
    tierFilterVerified: "Verified",
    tierFilterPilot: "Casos piloto",
    tierFilterEmpty: "Ningún proyecto coincide con este filtro.",
    exportCsv: "Exportar CSV",
    exportPdf: "Exportar PDF",
    exportPdfGenerating: "PDF…",
    exportPdfRetry: "Reintentar PDF",
    exportOpsNote:
      "Exportación certificada del registro AUROS Green — marca temporal UTC, huella SHA256 y firma HMAC servidor de las filas exportadas (integridad indicativa, sin firma electrónica cualificada). Sin clave servidor: solo SHA256.",
    exportVerify: {
      title: "Verificar una exportación PDF",
      intro:
        "Pegue la huella SHA256 y la firma HMAC del pie de página PDF, o la línea de integridad completa, para validar la exportación con el servidor AUROS.",
      hashLabel: "Huella SHA256",
      hashPlaceholder: "64 caracteres hexadecimales",
      sigLabel: "Firma HMAC (sig=)",
      sigPlaceholder: "64 caracteres hexadecimales",
      pasteLabel: "Pegar línea de integridad del PDF",
      pastePlaceholder: "Integridad SHA256: … · sig=…",
      submit: "Verificar exportación",
      checking: "Verificando…",
      resultValid: "Firma válida — la exportación coincide con las filas firmadas por el servidor AUROS.",
      resultInvalid: "Firma inválida — compruebe hash y sig, o la exportación fue alterada.",
      resultNoKey:
        "Sin clave de firma servidor — verificación HMAC no disponible (solo SHA256 en el PDF).",
      resultError: "Verificación imposible — compruebe el formato hash/sig.",
      hint: "API: GET /api/green/verify-registry-export?hash=&sig=",
    },
    backLink: "← Volver a AUROS Green",
    viewProject: "Ver ficha del proyecto",
    projectDetail: {
      eyebrow: "Registro público",
      intro: "Proyecto etiquetado AUROS Green — estado RTMS explícito, sin promesa de rendimiento.",
      locationTitle: "Ubicación",
      statusTitle: "Estado de etiqueta",
      rtmsTierTitle: "Nivel RTMS",
      rtmsTierBody: (tier) =>
        tier === "verified"
          ? "Etiqueta Auros Green Verified — revisión documental RTMS completa validada por AUROS."
          : "Caso piloto RTMS — demostración metodológica anonimizada, distinta de una auditoría inversor.",
      certifiedAtTitle: "Fecha de inscripción",
      descriptionTitle: "Descripción",
      websiteTitle: "Sitio web",
      verifyCta: "Página de verificación",
      backLink: "← Volver al registro",
      notFoundTitle: "Proyecto no encontrado",
      notFoundBody:
        "Este proyecto no figura en el registro público o ya no está disponible.",
    },
  },
  admin: {
    exportFilterLabel: "Filtrar exportación CSV",
    exportFilterAll: "Todas",
    exportFilterPending: "Pendientes",
    exportFilterInReview: "En revisión",
    exportFilterApproved: "Aprobadas",
    exportFilterRejected: "Rechazadas",
    exportFilterIncomplete: "Expediente incompleto",
    exportFilterReminded1: "Recordatorio 1",
    exportFilterReminded2: "Recordatorio 2",
    exportCsv: "Exportar CSV",
    exportCsvAll: "Exportar CSV (todas)",
  },
  guide: {
    eyebrow: "Guía educativa",
    title: "Tokenizar un excedente energético",
    intro:
      "Visión general honesta — pasos, riesgos y enlaces al wizard AUROS. No es una plantilla jurídica llave en mano.",
    sections: [
      {
        title: "1. Calificar el excedente",
        body: "Mida la producción excedente (kWh/MWh), contratos de red y marco local (autoconsumo, inyección, PPA).",
      },
      {
        title: "2. Estructurar el activo",
        body: "Separe derechos económicos, flujos de caja y representación token — jurisdicción y MiCA según el caso.",
      },
      {
        title: "3. Trazabilidad on-chain",
        body: "Attestations, oráculos o registros — el token debe apuntar a una fuente medible, no a una promesa de marketing.",
      },
      {
        title: "4. Cumplimiento y divulgación",
        body: "Documento público: alcance, riesgos, sin rendimiento garantizado. Solicitud de etiqueta si apunta a Auros Green Verified.",
      },
    ],
    wizardCta: "Abrir wizard — activo renovable",
    backLink: "← Volver a AUROS Green",
  },
  exam: {
    eyebrow: "Examen RTMS",
    title: "Quiz Praticien Green",
    intro: (quizLen, passScore) =>
      `${quizLen} preguntas RTMS — puntuación mínima ${passScore}/${quizLen}. Badge experto verificable 365 días.`,
    displayName: "Nombre público (registro)",
    email: "E-mail profesional",
    start: "Comenzar examen",
    starting: "Preparando…",
    question: (current, total) => `Pregunta ${current} / ${total}`,
    next: "Siguiente",
    submit: "Enviar examen",
    successTitle: (name) => `Enhorabuena ${name} — badge experto Green`,
    successScore: (score, total) => `Puntuación: ${score}/${total}`,
    verifyCta: "Página de verificación pública",
    validUntil: (iso) => `Válido hasta ${iso.slice(0, 10)}`,
    failTitle: "Examen no superado",
    failBelowPass: (score, required) =>
      `Puntuación ${score} — se requieren ${required}. Revise estándares RTMS.`,
    failTooFast: "Enviado demasiado rápido — lea cada pregunta.",
    failGeneric: "Sesión inválida o expirada — reinicie el examen.",
    retry: "Reintentar",
    backLink: "← Volver a Praticien Green",
    errors: { startFailed: "No se pudo iniciar — verifique sus datos." },
  },
  mailto: {
    greenExpertSubject: "AUROS Green — track experto (lista de espera)",
  },
};

const MESSAGES: Record<Locale, GreenMessages> = { fr: FR, en: EN, es: ES };

export function getGreenMessages(locale: Locale): GreenMessages {
  return MESSAGES[locale] ?? MESSAGES.fr;
}

export const GREEN_DISCLAIMER = FR.disclaimer;
