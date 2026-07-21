import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

import type {
  GreenMarketActorType,
  GreenMarketEnergyType,
  GreenMarketOfferSide,
  GreenMarketStatus,
} from "./market/types";

export type GreenMarketMessages = {
  market: {
    eyebrow: string;
    title: string;
    intro: string;
    mapTitle: string;
    mapActorsCountries: (actors: number, countries: number) => string;
    popupViewSheet: string;
    filters: {
      actorType: string;
      allActors: string;
      radius: string;
      radiusKm: (km: number) => string;
      energyType: string;
      allEnergy: string;
      side: string;
      allSides: string;
      listingTier: string;
      allTiers: string;
      search: string;
      searchPlaceholder: string;
      country: string;
      allCountries: string;
    };
    pagination: {
      prev: string;
      next: string;
      page: (page: number, totalPages: number) => string;
    };
    actorTypes: Record<GreenMarketActorType | "all", string>;
    energyTypes: Record<GreenMarketEnergyType | "all", string>;
    sides: Record<GreenMarketOfferSide | "all", string>;
    status: Record<GreenMarketStatus, string>;
    listingsTitle: string;
    listingsEmpty: string;
    pilotBadge: string;
    pilotDataNote: string;
    mapActorsEmpty: string;
    mapEmptyHint: string;
    mapEmptyWiden: string;
    mapEmptyRegister: string;
    actorsListEmpty: string;
    countriesLegend: (count: number) => string;
    liveBadge: string;
    demoBanner: string;
    listingTier: { demo: string; referenced: string; verified: string };
    formTitle: string;
    formNote: string;
    formNoteDb: string;
    form: {
      actorName: string;
      side: string;
      energyType: string;
      volumeKwh: string;
      pricePerKwh: string;
      city: string;
      country: string;
      contactEmail: string;
      submit: string;
      submitting: string;
      success: string;
      successPending: string;
      errorInvalid: string;
      errorRateLimit: string;
    };
    table: {
      actor: string;
      side: string;
      volume: string;
      price: string;
      location: string;
      date: string;
      status: string;
    };
    verifiedBadge: string;
    contact: string;
    backLink: string;
    rtmsAssistantCta: string;
    actorPagesTitle: string;
    shareLink: string;
    shareCopied: string;
    savedSearchesTitle: string;
    savedSearchName: string;
    savedSearchSave: string;
    savedSearchApply: string;
    savedSearchRemove: string;
    savedSearchEmpty: string;
    viewOffer: string;
    viewActorProfile: string;
  };
  offerDetail: {
    eyebrow: string;
    mapTitle: string;
    descriptionTitle: string;
    actorTitle: string;
    viewActorOnMap: string;
    viewActorProfile: string;
    contactTitle: string;
    contactEmailCta: string;
    datesTitle: string;
    publishedAt: string;
    validFrom: string;
    validUntil: string;
    noEndDate: string;
    shareOffer: string;
    shareCopied: string;
    addToCompare: string;
    addedToCompare: string;
    alreadyInCompare: string;
    compareFull: string;
    openCompare: string;
    backToMarket: string;
    notFoundTitle: string;
    notFoundBody: string;
    indicativeNote: string;
    defaultDescription: (
      side: string,
      energy: string,
      city: string,
      country: string,
      volumeKwh: number,
      pricePerKwh: number
    ) => string;
  };
  offerInterest: {
    title: string;
    intro: string;
    name: string;
    email: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    errorInvalid: string;
    errorRateLimit: string;
  };
  actorDetail: {
    eyebrow: string;
    mapTitle: string;
    descriptionTitle: string;
    offersTitle: string;
    offersEmpty: string;
    viewOffer: string;
    shareProfile: string;
    shareCopied: string;
    backToMarket: string;
    contactTitle: string;
    notFoundTitle: string;
    notFoundBody: string;
  };
  actors: Record<
    GreenMarketActorType,
    {
      eyebrow: string;
      title: string;
      intro: string;
      capacity: string;
      price: string;
      energy: string;
      status: string;
      contact: string;
      backLink: string;
    }
  >;
};

const FR: GreenMarketMessages = {
  market: {
    eyebrow: "Place de marché mondiale",
    title: "Énergie verte tokenisée",
    intro:
      "Cartographie mondiale des producteurs, stockeurs, rechargeurs et consommateurs — données indicatives, sans conseil ni garantie de transaction. Version produit en consolidation.",
    mapTitle: "Carte des acteurs",
    mapActorsCountries: (actors, countries) =>
      `${actors} acteurs · ${countries} pays`,
    popupViewSheet: "Voir la fiche acteur",
    filters: {
      actorType: "Type d'acteur",
      allActors: "Tous",
      radius: "Rayon (centre carte)",
      radiusKm: (km) => `${km} km autour du centre`,
      energyType: "Énergie",
      allEnergy: "Toutes",
      side: "Transaction",
      allSides: "Toutes",
      listingTier: "Preuve",
      allTiers: "Tous les tiers",
      search: "Recherche",
      searchPlaceholder: "Ville, pays ou nom d'acteur…",
      country: "Pays",
      allCountries: "Tous les pays",
    },
    pagination: {
      prev: "Précédent",
      next: "Suivant",
      page: (page, totalPages) => `Page ${page} / ${totalPages}`,
    },
    actorTypes: {
      all: "Tous",
      producer: "Producteurs",
      storer: "Stockeurs",
      charger: "Rechargeurs",
      consumer: "Consommateurs",
    },
    energyTypes: {
      all: "Toutes",
      solar: "Solaire",
      wind: "Éolien",
      hydro: "Hydro",
      battery: "Batterie",
      mixed: "Mixte",
    },
    sides: {
      all: "Toutes",
      sell: "Vente",
      buy: "Achat",
    },
    status: {
      available: "Disponible",
      pending: "En attente",
    },
    listingsTitle: "Offres & demandes",
    listingsEmpty: "Aucune annonce ne correspond aux filtres.",
    pilotBadge: "Exemple pilote",
    pilotDataNote: "Données pilotes — publiez une annonce pour apparaître ici.",
    mapActorsEmpty: "Aucun acteur ne correspond aux filtres actuels.",
    mapEmptyHint:
      "Élargissez le rayon, réinitialisez la recherche ou référencez votre structure.",
    mapEmptyWiden: "Réinitialiser les filtres",
    mapEmptyRegister: "Référencer mon acteur",
    actorsListEmpty: "Aucun acteur de ce type pour l'instant — consultez la carte mondiale.",
    countriesLegend: (count) =>
      count === 1 ? "1 pays sur la carte" : `${count} pays représentés (données indicatives)`,
    liveBadge: "Données registre actives",
    demoBanner:
      "Mode démonstration — acteurs fictifs à titre pédagogique. Référenciez votre structure pour apparaître en données réelles.",
    listingTier: {
      demo: "Illustration",
      referenced: "Pilote",
      verified: "Verified",
    },
    formTitle: "Publier une annonce",
    formNote: "Hors-ligne — stockée localement (navigateur) en mode démo.",
    formNoteDb: "Soumis au registre — publication après revue AUROS (48 h ouvrées).",
    form: {
      actorName: "Nom de l'acteur",
      side: "Type",
      energyType: "Énergie",
      volumeKwh: "Volume (kWh)",
      pricePerKwh: "Prix (€/kWh)",
      city: "Ville",
      country: "Pays",
      contactEmail: "E-mail de contact",
      submit: "Soumettre l'annonce",
      submitting: "Envoi…",
      success: "Annonce publiée.",
      successPending: "Annonce reçue — publication après validation AUROS.",
      errorInvalid: "Vérifiez les champs saisis.",
      errorRateLimit: "Trop de tentatives — réessayez dans une heure.",
    },
    table: {
      actor: "Acteur",
      side: "Type",
      volume: "Volume",
      price: "Prix",
      location: "Lieu",
      date: "Date",
      status: "Statut",
    },
    verifiedBadge: "Auros Green Verified",
    contact: "Contacter",
    backLink: "← Retour au hub Green",
    rtmsAssistantCta: "Pré-diagnostic RTMS avant listing",
    actorPagesTitle: "Explorer par type d'acteur",
    shareLink: "Copier le lien filtré",
    shareCopied: "Lien copié",
    savedSearchesTitle: "Recherches enregistrées",
    savedSearchName: "Nom de la recherche",
    savedSearchSave: "Enregistrer",
    savedSearchApply: "Appliquer",
    savedSearchRemove: "Supprimer",
    savedSearchEmpty: "Aucune recherche enregistrée sur cet appareil.",
    viewOffer: "Voir l'annonce",
    viewActorProfile: "Voir la fiche acteur",
  },
  offerDetail: {
    eyebrow: "Annonce marketplace",
    mapTitle: "Localisation",
    descriptionTitle: "Description",
    actorTitle: "Acteur",
    viewActorOnMap: "Voir sur la carte",
    viewActorProfile: "Voir la fiche acteur",
    contactTitle: "Contacter l'acteur",
    contactEmailCta: "Envoyer un e-mail",
    datesTitle: "Dates",
    publishedAt: "Publiée le",
    validFrom: "Début",
    validUntil: "Fin",
    noEndDate: "Non précisée",
    shareOffer: "Copier le lien de l'annonce",
    shareCopied: "Lien copié",
    addToCompare: "Ajouter au comparateur",
    addedToCompare: "Ajoutée au comparateur",
    alreadyInCompare: "Déjà dans le comparateur",
    compareFull: "Comparateur plein (4 max)",
    openCompare: "Ouvrir le comparateur",
    backToMarket: "← Retour à la place de marché",
    notFoundTitle: "Annonce introuvable",
    notFoundBody:
      "Cette annonce n'existe pas ou n'est plus disponible. Consultez la place de marché pour les offres actuelles.",
    indicativeNote:
      "Données indicatives — sans engagement ni conseil. Contactez l'acteur pour toute transaction.",
    defaultDescription: (side, energy, city, country, volumeKwh, pricePerKwh) =>
      `Annonce ${side.toLowerCase()} — ${energy.toLowerCase()} à ${city}, ${country}. Volume indicatif ${volumeKwh.toLocaleString("fr-FR")} kWh · ${pricePerKwh.toFixed(3)} €/kWh.`,
  },
  offerInterest: {
    title: "Manifester un intérêt",
    intro:
      "Signalez votre intérêt pour cette annonce — l'acteur ou AUROS vous recontactera si un e-mail est disponible. Données indicatives, sans engagement.",
    name: "Votre nom",
    email: "Votre e-mail",
    message: "Message (optionnel)",
    messagePlaceholder: "Volume souhaité, calendrier, questions…",
    submit: "Envoyer",
    submitting: "Envoi…",
    success: "Intérêt enregistré — nous vous recontacterons si possible.",
    errorInvalid: "Vérifiez votre e-mail.",
    errorRateLimit: "Trop de tentatives — réessayez dans une heure.",
  },
  actorDetail: {
    eyebrow: "Fiche acteur",
    mapTitle: "Localisation",
    descriptionTitle: "Présentation",
    offersTitle: "Annonces de cet acteur",
    offersEmpty: "Aucune annonce publiée pour cet acteur.",
    viewOffer: "Voir l'annonce",
    shareProfile: "Copier le lien de la fiche",
    shareCopied: "Lien copié",
    backToMarket: "← Retour à la place de marché",
    contactTitle: "Contacter",
    notFoundTitle: "Acteur introuvable",
    notFoundBody:
      "Cette fiche n'existe pas ou n'est plus disponible. Consultez la place de marché.",
  },
  actors: {
    producer: {
      eyebrow: "Producteurs",
      title: "Producteurs d'énergie",
      intro: "Solaire, éolien, hydro — production mesurable et surplus disponibles.",
      capacity: "Capacité",
      price: "Prix indicatif",
      energy: "Énergie",
      status: "Statut",
      contact: "Contacter",
      backLink: "← Place de marché",
    },
    storer: {
      eyebrow: "Stockeurs",
      title: "Stockage & batteries",
      intro: "Capacité BESS et flexibilité — arbitrage et services système.",
      capacity: "Capacité",
      price: "Tarif stockage",
      energy: "Type",
      status: "Statut",
      contact: "Contacter",
      backLink: "← Place de marché",
    },
    charger: {
      eyebrow: "Rechargeurs",
      title: "Bornes & recharge VE",
      intro: "Infrastructures de recharge — sourcing vert contractuel.",
      capacity: "Capacité",
      price: "Tarif recharge",
      energy: "Mix énergétique",
      status: "Statut",
      contact: "Contacter",
      backLink: "← Place de marché",
    },
    consumer: {
      eyebrow: "Consommateurs",
      title: "Consommateurs & acheteurs",
      intro: "Sites industriels, campus, coopératives — demande d'énergie locale.",
      capacity: "Besoin annuel",
      price: "Budget cible",
      energy: "Énergie recherchée",
      status: "Statut",
      contact: "Contacter",
      backLink: "← Place de marché",
    },
  },
};

const EN: GreenMarketMessages = {
  market: {
    eyebrow: "Global marketplace",
    title: "Tokenized green energy",
    intro:
      "Worldwide map of producers, storers, chargers and consumers — indicative data, not investment or transaction advice. Product version consolidating.",
    mapTitle: "Actor map",
    mapActorsCountries: (actors, countries) =>
      `${actors} actors · ${countries} countries`,
    popupViewSheet: "View actor profile",
    filters: {
      actorType: "Actor type",
      allActors: "All",
      radius: "Radius (map centre)",
      radiusKm: (km) => `${km} km from centre`,
      energyType: "Energy",
      allEnergy: "All",
      side: "Transaction",
      allSides: "All",
      listingTier: "Proof",
      allTiers: "All tiers",
      search: "Search",
      searchPlaceholder: "City, country or actor name…",
      country: "Country",
      allCountries: "All countries",
    },
    pagination: {
      prev: "Previous",
      next: "Next",
      page: (page, totalPages) => `Page ${page} / ${totalPages}`,
    },
    actorTypes: {
      all: "All",
      producer: "Producers",
      storer: "Storers",
      charger: "Chargers",
      consumer: "Consumers",
    },
    energyTypes: {
      all: "All",
      solar: "Solar",
      wind: "Wind",
      hydro: "Hydro",
      battery: "Battery",
      mixed: "Mixed",
    },
    sides: {
      all: "All",
      sell: "Sell",
      buy: "Buy",
    },
    status: {
      available: "Available",
      pending: "Pending",
    },
    listingsTitle: "Offers & requests",
    listingsEmpty: "No listings match your filters.",
    pilotBadge: "Pilot example",
    pilotDataNote: "Pilot data — publish a listing to appear here.",
    mapActorsEmpty: "No actors match your current filters.",
    mapEmptyHint: "Widen the radius, clear search, or register your organisation.",
    mapEmptyWiden: "Reset filters",
    mapEmptyRegister: "Register my actor",
    actorsListEmpty: "No actors of this type yet — see the worldwide map.",
    countriesLegend: (count) =>
      count === 1 ? "1 country on map" : `${count} countries represented (indicative data)`,
    liveBadge: "Live registry data",
    demoBanner:
      "Demo mode — fictional actors for illustration. Register your organisation to appear as real data.",
    listingTier: {
      demo: "Illustration",
      referenced: "Pilot",
      verified: "Verified",
    },
    formTitle: "Post a listing",
    formNote: "Offline — saved in browser in demo mode.",
    formNoteDb: "Submitted to registry — published after AUROS review (48 business hours).",
    form: {
      actorName: "Actor name",
      side: "Type",
      energyType: "Energy",
      volumeKwh: "Volume (kWh)",
      pricePerKwh: "Price (€/kWh)",
      city: "City",
      country: "Country",
      contactEmail: "Contact email",
      submit: "Submit listing",
      submitting: "Sending…",
      success: "Listing published.",
      successPending: "Listing received — published after AUROS validation.",
      errorInvalid: "Check the fields entered.",
      errorRateLimit: "Too many attempts — try again in one hour.",
    },
    table: {
      actor: "Actor",
      side: "Type",
      volume: "Volume",
      price: "Price",
      location: "Location",
      date: "Date",
      status: "Status",
    },
    verifiedBadge: "Auros Green Verified",
    contact: "Contact",
    backLink: "← Back to Green hub",
    rtmsAssistantCta: "Preliminary RTMS check before listing",
    actorPagesTitle: "Browse by actor type",
    shareLink: "Copy filtered link",
    shareCopied: "Link copied",
    savedSearchesTitle: "Saved searches",
    savedSearchName: "Search name",
    savedSearchSave: "Save",
    savedSearchApply: "Apply",
    savedSearchRemove: "Remove",
    savedSearchEmpty: "No saved searches on this device.",
    viewOffer: "View listing",
    viewActorProfile: "View actor profile",
  },
  offerDetail: {
    eyebrow: "Marketplace listing",
    mapTitle: "Location",
    descriptionTitle: "Description",
    actorTitle: "Actor",
    viewActorOnMap: "View on map",
    viewActorProfile: "View actor profile",
    contactTitle: "Contact actor",
    contactEmailCta: "Send email",
    datesTitle: "Dates",
    publishedAt: "Published",
    validFrom: "Start",
    validUntil: "End",
    noEndDate: "Not specified",
    shareOffer: "Copy listing link",
    shareCopied: "Link copied",
    addToCompare: "Add to comparator",
    addedToCompare: "Added to comparator",
    alreadyInCompare: "Already in comparator",
    compareFull: "Comparator full (4 max)",
    openCompare: "Open comparator",
    backToMarket: "← Back to marketplace",
    notFoundTitle: "Listing not found",
    notFoundBody:
      "This listing does not exist or is no longer available. Browse the marketplace for current offers.",
    indicativeNote:
      "Indicative data — not advice or commitment. Contact the actor for any transaction.",
    defaultDescription: (side, energy, city, country, volumeKwh, pricePerKwh) =>
      `${side} listing — ${energy.toLowerCase()} in ${city}, ${country}. Indicative volume ${volumeKwh.toLocaleString("en-GB")} kWh · ${pricePerKwh.toFixed(3)} €/kWh.`,
  },
  offerInterest: {
    title: "Express interest",
    intro:
      "Signal interest in this listing — the actor or AUROS may follow up if an email is available. Indicative data, not a commitment.",
    name: "Your name",
    email: "Your email",
    message: "Message (optional)",
    messagePlaceholder: "Desired volume, timeline, questions…",
    submit: "Send",
    submitting: "Sending…",
    success: "Interest recorded — we will follow up when possible.",
    errorInvalid: "Check your email address.",
    errorRateLimit: "Too many attempts — try again in one hour.",
  },
  actorDetail: {
    eyebrow: "Actor profile",
    mapTitle: "Location",
    descriptionTitle: "Overview",
    offersTitle: "Listings from this actor",
    offersEmpty: "No listings published for this actor.",
    viewOffer: "View listing",
    shareProfile: "Copy profile link",
    shareCopied: "Link copied",
    backToMarket: "← Back to marketplace",
    contactTitle: "Contact",
    notFoundTitle: "Actor not found",
    notFoundBody:
      "This profile does not exist or is no longer available. Browse the marketplace.",
  },
  actors: {
    producer: {
      eyebrow: "Producers",
      title: "Energy producers",
      intro: "Solar, wind, hydro — measurable production and available surplus.",
      capacity: "Capacity",
      price: "Indicative price",
      energy: "Energy",
      status: "Status",
      contact: "Contact",
      backLink: "← Marketplace",
    },
    storer: {
      eyebrow: "Storers",
      title: "Storage & batteries",
      intro: "BESS capacity and flexibility — arbitrage and grid services.",
      capacity: "Capacity",
      price: "Storage rate",
      energy: "Type",
      status: "Status",
      contact: "Contact",
      backLink: "← Marketplace",
    },
    charger: {
      eyebrow: "Chargers",
      title: "EV charging",
      intro: "Charging infrastructure — contracted green sourcing.",
      capacity: "Capacity",
      price: "Charging rate",
      energy: "Energy mix",
      status: "Status",
      contact: "Contact",
      backLink: "← Marketplace",
    },
    consumer: {
      eyebrow: "Consumers",
      title: "Consumers & buyers",
      intro: "Industrial sites, campuses, co-ops — local energy demand.",
      capacity: "Annual need",
      price: "Target budget",
      energy: "Energy sought",
      status: "Status",
      contact: "Contact",
      backLink: "← Marketplace",
    },
  },
};

const ES: GreenMarketMessages = {
  market: {
    eyebrow: "Mercado mundial",
    title: "Energía verde tokenizada",
    intro:
      "Mapa mundial de productores, almacenadores, cargadores y consumidores — datos indicativos, sin consejo ni garantía de transacción. Versión de producto en consolidación.",
    mapTitle: "Mapa de actores",
    mapActorsCountries: (actors, countries) =>
      `${actors} actores · ${countries} países`,
    popupViewSheet: "Ver ficha actor",
    filters: {
      actorType: "Tipo de actor",
      allActors: "Todos",
      radius: "Radio (centro del mapa)",
      radiusKm: (km) => `${km} km desde el centro`,
      energyType: "Energía",
      allEnergy: "Todas",
      side: "Transacción",
      allSides: "Todas",
      listingTier: "Prueba",
      allTiers: "Todos los niveles",
      search: "Búsqueda",
      searchPlaceholder: "Ciudad, país o nombre del actor…",
      country: "País",
      allCountries: "Todos los países",
    },
    pagination: {
      prev: "Anterior",
      next: "Siguiente",
      page: (page, totalPages) => `Página ${page} / ${totalPages}`,
    },
    actorTypes: {
      all: "Todos",
      producer: "Productores",
      storer: "Almacenadores",
      charger: "Cargadores",
      consumer: "Consumidores",
    },
    energyTypes: {
      all: "Todas",
      solar: "Solar",
      wind: "Eólico",
      hydro: "Hidro",
      battery: "Batería",
      mixed: "Mixto",
    },
    sides: {
      all: "Todas",
      sell: "Venta",
      buy: "Compra",
    },
    status: {
      available: "Disponible",
      pending: "En espera",
    },
    listingsTitle: "Ofertas y demandas",
    listingsEmpty: "Ningún anuncio coincide con los filtros.",
    pilotBadge: "Ejemplo piloto",
    pilotDataNote: "Datos piloto — publique un anuncio para aparecer aquí.",
    mapActorsEmpty: "Ningún actor coincide con los filtros actuales.",
    mapEmptyHint:
      "Amplíe el radio, borre la búsqueda o registre su estructura.",
    mapEmptyWiden: "Restablecer filtros",
    mapEmptyRegister: "Registrar mi actor",
    actorsListEmpty: "Ningún actor de este tipo por ahora — consulte el mapa mundial.",
    countriesLegend: (count) =>
      count === 1 ? "1 país en el mapa" : `${count} países representados (datos indicativos)`,
    liveBadge: "Datos de registro activos",
    demoBanner:
      "Modo demo — actores ficticios con fines pedagógicos. Registre su estructura para aparecer como dato real.",
    listingTier: {
      demo: "Ilustración",
      referenced: "Piloto",
      verified: "Verified",
    },
    formTitle: "Publicar anuncio",
    formNote: "Sin conexión — guardado en el navegador en modo demo.",
    formNoteDb: "Enviado al registro — publicación tras revisión AUROS (48 h laborables).",
    form: {
      actorName: "Nombre del actor",
      side: "Tipo",
      energyType: "Energía",
      volumeKwh: "Volumen (kWh)",
      pricePerKwh: "Precio (€/kWh)",
      city: "Ciudad",
      country: "País",
      contactEmail: "E-mail de contacto",
      submit: "Enviar anuncio",
      submitting: "Enviando…",
      success: "Anuncio publicado.",
      successPending: "Anuncio recibido — publicación tras validación AUROS.",
      errorInvalid: "Revise los campos introducidos.",
      errorRateLimit: "Demasiados intentos — inténtelo de nuevo en una hora.",
    },
    table: {
      actor: "Actor",
      side: "Tipo",
      volume: "Volumen",
      price: "Precio",
      location: "Lugar",
      date: "Fecha",
      status: "Estado",
    },
    verifiedBadge: "Auros Green Verified",
    contact: "Contactar",
    backLink: "← Volver al hub Green",
    rtmsAssistantCta: "Pre-diagnóstico RTMS antes del listing",
    actorPagesTitle: "Explorar por tipo de actor",
    shareLink: "Copiar enlace filtrado",
    shareCopied: "Enlace copiado",
    savedSearchesTitle: "Búsquedas guardadas",
    savedSearchName: "Nombre de búsqueda",
    savedSearchSave: "Guardar",
    savedSearchApply: "Aplicar",
    savedSearchRemove: "Eliminar",
    savedSearchEmpty: "No hay búsquedas guardadas en este dispositivo.",
    viewOffer: "Ver anuncio",
    viewActorProfile: "Ver ficha actor",
  },
  offerDetail: {
    eyebrow: "Anuncio marketplace",
    mapTitle: "Ubicación",
    descriptionTitle: "Descripción",
    actorTitle: "Actor",
    viewActorOnMap: "Ver en el mapa",
    viewActorProfile: "Ver ficha actor",
    contactTitle: "Contactar actor",
    contactEmailCta: "Enviar e-mail",
    datesTitle: "Fechas",
    publishedAt: "Publicado",
    validFrom: "Inicio",
    validUntil: "Fin",
    noEndDate: "No especificada",
    shareOffer: "Copiar enlace del anuncio",
    shareCopied: "Enlace copiado",
    addToCompare: "Añadir al comparador",
    addedToCompare: "Añadida al comparador",
    alreadyInCompare: "Ya en el comparador",
    compareFull: "Comparador lleno (máx. 4)",
    openCompare: "Abrir comparador",
    backToMarket: "← Volver al mercado",
    notFoundTitle: "Anuncio no encontrado",
    notFoundBody:
      "Este anuncio no existe o ya no está disponible. Consulte el mercado para ofertas actuales.",
    indicativeNote:
      "Datos indicativos — sin compromiso ni consejo. Contacte al actor para cualquier transacción.",
    defaultDescription: (side, energy, city, country, volumeKwh, pricePerKwh) =>
      `Anuncio ${side.toLowerCase()} — ${energy.toLowerCase()} en ${city}, ${country}. Volumen indicativo ${volumeKwh.toLocaleString("es-ES")} kWh · ${pricePerKwh.toFixed(3)} €/kWh.`,
  },
  offerInterest: {
    title: "Manifestar interés",
    intro:
      "Indique su interés por este anuncio — el actor o AUROS le contactará si hay e-mail disponible. Datos indicativos, sin compromiso.",
    name: "Su nombre",
    email: "Su e-mail",
    message: "Mensaje (opcional)",
    messagePlaceholder: "Volumen deseado, calendario, preguntas…",
    submit: "Enviar",
    submitting: "Enviando…",
    success: "Interés registrado — le contactaremos si es posible.",
    errorInvalid: "Revise su e-mail.",
    errorRateLimit: "Demasiados intentos — inténtelo de nuevo en una hora.",
  },
  actorDetail: {
    eyebrow: "Ficha actor",
    mapTitle: "Ubicación",
    descriptionTitle: "Presentación",
    offersTitle: "Anuncios de este actor",
    offersEmpty: "Ningún anuncio publicado para este actor.",
    viewOffer: "Ver anuncio",
    shareProfile: "Copiar enlace de la ficha",
    shareCopied: "Enlace copiado",
    backToMarket: "← Volver al mercado",
    contactTitle: "Contactar",
    notFoundTitle: "Actor no encontrado",
    notFoundBody:
      "Esta ficha no existe o ya no está disponible. Consulte el mercado.",
  },
  actors: {
    producer: {
      eyebrow: "Productores",
      title: "Productores de energía",
      intro: "Solar, eólico, hidro — producción medible y excedente disponible.",
      capacity: "Capacidad",
      price: "Precio indicativo",
      energy: "Energía",
      status: "Estado",
      contact: "Contactar",
      backLink: "← Mercado",
    },
    storer: {
      eyebrow: "Almacenadores",
      title: "Almacenamiento y baterías",
      intro: "Capacidad BESS y flexibilidad — arbitraje y servicios de red.",
      capacity: "Capacidad",
      price: "Tarifa almacenamiento",
      energy: "Tipo",
      status: "Estado",
      contact: "Contactar",
      backLink: "← Mercado",
    },
    charger: {
      eyebrow: "Cargadores",
      title: "Recarga VE",
      intro: "Infraestructura de recarga — abastecimiento verde contractual.",
      capacity: "Capacidad",
      price: "Tarifa recarga",
      energy: "Mix energético",
      status: "Estado",
      contact: "Contactar",
      backLink: "← Mercado",
    },
    consumer: {
      eyebrow: "Consumidores",
      title: "Consumidores y compradores",
      intro: "Sitios industriales, campus, cooperativas — demanda de energía local.",
      capacity: "Necesidad anual",
      price: "Presupuesto objetivo",
      energy: "Energía buscada",
      status: "Estado",
      contact: "Contactar",
      backLink: "← Mercado",
    },
  },
};

const MAP: CatalogMap< GreenMarketMessages> = { fr: FR, en: EN, es: ES };

export function getGreenMarketMessages(locale: Locale): GreenMarketMessages {
  return MAP[resolveCatalogLocale(locale)] ?? FR;
}

export function formatMarketNumber(value: number, locale: Locale): string {
  const loc = locale === "es" ? "es-ES" : locale === "en" ? "en-GB" : "fr-FR";
  return new Intl.NumberFormat(loc).format(value);
}

export function formatMarketDate(iso: string, locale: Locale): string {
  const loc = locale === "es" ? "es-ES" : locale === "en" ? "en-GB" : "fr-FR";
  return new Intl.DateTimeFormat(loc, { dateStyle: "medium" }).format(new Date(iso));
}

export function formatGreenMarketLocation(city: string, country: string): string {
  const c = city.trim();
  const co = country.trim();
  if (c && co) return `${c}, ${co}`;
  return c || co;
}
