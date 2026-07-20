import type { Locale } from "@/lib/i18n";

export type NavHubItem = {
  href: string;
  title: string;
  description: string;
};

export type NavHubGroup = {
  id: "dossier" | "energy" | "protocol" | "ecosystem";
  label: string;
  blurb: string;
  items: NavHubItem[];
};

type HubCopy = {
  groups: NavHubGroup[];
  exploreAll: string;
  close: string;
  openMenu: string;
  primaryCta: string;
  secondaryCta: string;
};

const FR: HubCopy = {
  exploreAll: "Voir tout le hub",
  close: "Fermer",
  openMenu: "Menu AUROS",
  primaryCta: "Créer mon dossier",
  secondaryCta: "Essayer Shield",
  groups: [
    {
      id: "dossier",
      label: "Dossier RWA",
      blurb: "Préparer un actif sans être expert",
      items: [
        {
          href: "/start",
          title: "Commencer en 4 min",
          description: "Express, score ou Shield — une porte",
        },
        {
          href: "/wizard",
          title: "Wizard tokenisation",
          description: "Data room, admission, studio",
        },
        {
          href: "/estimate",
          title: "Score rapide",
          description: "Une phrase · résultat immédiat",
        },
        {
          href: "/dashboard",
          title: "Mes dossiers",
          description: "Reprise, PDF, suivi",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "Juridictions",
          description: "Cadre indicatif MiCA / UK / US",
        },
      ],
    },
    {
      id: "energy",
      label: "Énergie",
      blurb: "Green Verified · Power · eau · flottes",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "Énergie locale & label Verified",
        },
        {
          href: "/power",
          title: "Power (bas-carbone)",
          description: "Nucléaire & low-carbon — hors Green Verified",
        },
        {
          href: "/eau",
          title: "Eau / H₂O",
          description: "Infrastructure eau & passeport",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "Unités E/W/F + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt, CQS, Premium data",
        },
      ],
    },
    {
      id: "protocol",
      label: "Protocol & preuves",
      blurb: "Banques, API, contreparties",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "Collez → preuve · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "Institutions",
          description: "Export CFU, Monitor, Watts",
        },
        {
          href: "/developers",
          title: "Hub développeurs",
          description: "OpenAPI, clés, Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "Assistant dossier / conformité",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "Spécification Protocol",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "Écosystème",
      blurb: "Plateformes, formation, ressources",
      items: [
        {
          href: "/partners",
          title: "Plateformes & partenaires",
          description: "Issuer pipeline · dashboard",
        },
        {
          href: "/pilots",
          title: "Pilotes 30 jours",
          description: "Flotte · banque · plateforme",
        },
        {
          href: "/academy",
          title: "Academy",
          description: "Formation tokenisation",
        },
        {
          href: "/pricing",
          title: "Tarifs",
          description: "Green API · Monitor · packs",
        },
        {
          href: "/discover",
          title: "Découvrir",
          description: "Cartographie produit",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "Liste d’attente (après issuer)",
        },
      ],
    },
  ],
};

const EN: HubCopy = {
  exploreAll: "Browse full hub",
  close: "Close",
  openMenu: "AUROS menu",
  primaryCta: "Create my dossier",
  secondaryCta: "Try Shield",
  groups: [
    {
      id: "dossier",
      label: "RWA dossier",
      blurb: "Prepare an asset without being an expert",
      items: [
        {
          href: "/start",
          title: "Start in 4 min",
          description: "Express, score or Shield — one door",
        },
        {
          href: "/wizard",
          title: "Tokenization wizard",
          description: "Data room, admission, studio",
        },
        {
          href: "/estimate",
          title: "Quick score",
          description: "One sentence · instant result",
        },
        {
          href: "/dashboard",
          title: "My dossiers",
          description: "Resume, PDF, tracking",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "Jurisdictions",
          description: "Indicative MiCA / UK / US frame",
        },
      ],
    },
    {
      id: "energy",
      label: "Energy",
      blurb: "Green Verified · Power · water · fleets",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "Local energy & Verified label",
        },
        {
          href: "/power",
          title: "Power (low-carbon)",
          description: "Nuclear & low-carbon — not Green Verified",
        },
        {
          href: "/eau",
          title: "Water / H₂O",
          description: "Water infrastructure & passport",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "E/W/F units + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt, CQS, Premium data",
        },
      ],
    },
    {
      id: "protocol",
      label: "Protocol & proofs",
      blurb: "Banks, APIs, counterparties",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "Paste → proof · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "Institutions",
          description: "CFU export, Monitor, Watts",
        },
        {
          href: "/developers",
          title: "Developers hub",
          description: "OpenAPI, keys, Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "Dossier / compliance assistant",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "Protocol specification",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "Ecosystem",
      blurb: "Platforms, training, resources",
      items: [
        {
          href: "/partners",
          title: "Platforms & partners",
          description: "Issuer pipeline · dashboard",
        },
        {
          href: "/pilots",
          title: "30-day pilots",
          description: "Fleet · bank · platform",
        },
        {
          href: "/academy",
          title: "Academy",
          description: "Tokenization training",
        },
        {
          href: "/pricing",
          title: "Pricing",
          description: "Green API · Monitor · packs",
        },
        {
          href: "/discover",
          title: "Discover",
          description: "Product map",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "Waitlist (after issuer)",
        },
      ],
    },
  ],
};

const ES: HubCopy = {
  exploreAll: "Ver todo el hub",
  close: "Cerrar",
  openMenu: "Menú AUROS",
  primaryCta: "Crear mi expediente",
  secondaryCta: "Probar Shield",
  groups: [
    {
      id: "dossier",
      label: "Expediente RWA",
      blurb: "Preparar un activo sin ser experto",
      items: [
        {
          href: "/start",
          title: "Empezar en 4 min",
          description: "Express, score o Shield — una puerta",
        },
        {
          href: "/wizard",
          title: "Wizard de tokenización",
          description: "Data room, admisión, estudio",
        },
        {
          href: "/estimate",
          title: "Score rápido",
          description: "Una frase · resultado al instante",
        },
        {
          href: "/dashboard",
          title: "Mis expedientes",
          description: "Reanudación, PDF, seguimiento",
        },
        {
          href: "/jurisdictions?from=nav",
          title: "Jurisdicciones",
          description: "Marco indicativo MiCA / UK / US",
        },
      ],
    },
    {
      id: "energy",
      label: "Energía",
      blurb: "Green Verified · Power · agua · flotas",
      items: [
        {
          href: "/green",
          title: "AUROS Green",
          description: "Energía local y label Verified",
        },
        {
          href: "/power",
          title: "Power (bajo carbono)",
          description: "Nuclear y low-carbon — fuera de Green Verified",
        },
        {
          href: "/eau",
          title: "Agua / H₂O",
          description: "Infraestructura agua y pasaporte",
        },
        {
          href: "/green/chargeflow/console",
          title: "ChargeFlow CFU",
          description: "Unidades E/W/F + Shield",
        },
        {
          href: "/green/api",
          title: "Green API",
          description: "Watt, CQS, datos Premium",
        },
      ],
    },
    {
      id: "protocol",
      label: "Protocol y pruebas",
      blurb: "Bancos, API, contrapartes",
      items: [
        {
          href: "/developers/shield",
          title: "AUROS Shield",
          description: "Pegar → prueba · Evidence Pack",
        },
        {
          href: "/developers/institutions",
          title: "Instituciones",
          description: "Export CFU, Monitor, Watts",
        },
        {
          href: "/developers",
          title: "Hub desarrolladores",
          description: "OpenAPI, claves, Monitor",
        },
        {
          href: "/copilot",
          title: "Copilot",
          description: "Asistente expediente / compliance",
        },
        {
          href: "/auros-openapi.yaml",
          title: "OpenAPI",
          description: "Especificación Protocol",
        },
      ],
    },
    {
      id: "ecosystem",
      label: "Ecosistema",
      blurb: "Plataformas, formación, recursos",
      items: [
        {
          href: "/partners",
          title: "Plataformas y partners",
          description: "Issuer pipeline · dashboard",
        },
        {
          href: "/pilots",
          title: "Pilotos 30 días",
          description: "Flota · banco · plataforma",
        },
        {
          href: "/academy",
          title: "Academy",
          description: "Formación tokenización",
        },
        {
          href: "/pricing",
          title: "Precios",
          description: "Green API · Monitor · packs",
        },
        {
          href: "/discover",
          title: "Descubrir",
          description: "Mapa de producto",
        },
        {
          href: "/liquidity",
          title: "Liquidity Bridge",
          description: "Lista de espera (después issuer)",
        },
      ],
    },
  ],
};

export function getNavHub(locale: Locale): HubCopy {
  if (locale === "en") return EN;
  if (locale === "es") return ES;
  return FR;
}
