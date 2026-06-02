import type { Locale } from "@/lib/i18n";

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
    };
    actorTypes: Record<GreenMarketActorType | "all", string>;
    energyTypes: Record<GreenMarketEnergyType | "all", string>;
    sides: Record<GreenMarketOfferSide | "all", string>;
    status: Record<GreenMarketStatus, string>;
    listingsTitle: string;
    listingsEmpty: string;
    mapActorsEmpty: string;
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
    actorPagesTitle: string;
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
      "Cartographie mondiale des producteurs, stockeurs, rechargeurs et consommateurs — données indicatives MVP, sans conseil ni garantie de transaction.",
    mapTitle: "Carte des acteurs",
    mapActorsCountries: (actors, countries) =>
      `${actors} acteurs · ${countries} pays`,
    popupViewSheet: "Voir la fiche",
    filters: {
      actorType: "Type d'acteur",
      allActors: "Tous",
      radius: "Rayon (centre carte)",
      radiusKm: (km) => `${km} km autour du centre`,
      energyType: "Énergie",
      allEnergy: "Toutes",
      side: "Transaction",
      allSides: "Toutes",
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
    mapActorsEmpty:
      "Aucun acteur dans ce rayon — élargissez le filtre ou réinitialisez le rayon.",
    actorsListEmpty: "Aucun acteur de ce type pour l'instant — consultez la carte mondiale.",
    countriesLegend: (count) =>
      count === 1 ? "1 pays sur la carte" : `${count} pays représentés (données indicatives)`,
    liveBadge: "Données registre actives",
    demoBanner:
      "Mode démonstration — acteurs fictifs à titre pédagogique. Référenciez votre structure pour apparaître en données réelles.",
    listingTier: {
      demo: "Démo",
      referenced: "Référencé",
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
    actorPagesTitle: "Explorer par type d'acteur",
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
      "Worldwide map of producers, storers, chargers and consumers — indicative MVP data, not investment or transaction advice.",
    mapTitle: "Actor map",
    mapActorsCountries: (actors, countries) =>
      `${actors} actors · ${countries} countries`,
    popupViewSheet: "View listing",
    filters: {
      actorType: "Actor type",
      allActors: "All",
      radius: "Radius (map centre)",
      radiusKm: (km) => `${km} km from centre`,
      energyType: "Energy",
      allEnergy: "All",
      side: "Transaction",
      allSides: "All",
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
    mapActorsEmpty:
      "No actors in this radius — widen filters or reset the radius.",
    actorsListEmpty: "No actors of this type yet — see the worldwide map.",
    countriesLegend: (count) =>
      count === 1 ? "1 country on map" : `${count} countries represented (indicative data)`,
    liveBadge: "Live registry data",
    demoBanner:
      "Demo mode — fictional actors for illustration. Register your organisation to appear as real data.",
    listingTier: {
      demo: "Demo",
      referenced: "Referenced",
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
    actorPagesTitle: "Browse by actor type",
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
      "Mapa mundial de productores, almacenadores, cargadores y consumidores — datos indicativos MVP, sin consejo ni garantía de transacción.",
    mapTitle: "Mapa de actores",
    mapActorsCountries: (actors, countries) =>
      `${actors} actores · ${countries} países`,
    popupViewSheet: "Ver ficha",
    filters: {
      actorType: "Tipo de actor",
      allActors: "Todos",
      radius: "Radio (centro del mapa)",
      radiusKm: (km) => `${km} km desde el centro`,
      energyType: "Energía",
      allEnergy: "Todas",
      side: "Transacción",
      allSides: "Todas",
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
    mapActorsEmpty:
      "Ningún actor en este radio — amplíe los filtros o restablezca el radio.",
    actorsListEmpty: "Ningún actor de este tipo por ahora — consulte el mapa mundial.",
    countriesLegend: (count) =>
      count === 1 ? "1 país en el mapa" : `${count} países representados (datos indicativos)`,
    liveBadge: "Datos de registro activos",
    demoBanner:
      "Modo demo — actores ficticios con fines pedagógicos. Registre su estructura para aparecer como dato real.",
    listingTier: {
      demo: "Demo",
      referenced: "Referenciado",
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
    actorPagesTitle: "Explorar por tipo de actor",
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

const MAP: Record<Locale, GreenMarketMessages> = { fr: FR, en: EN, es: ES };

export function getGreenMarketMessages(locale: Locale): GreenMarketMessages {
  return MAP[locale] ?? FR;
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
