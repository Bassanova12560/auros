import { fromCatalog, type CatalogMap, type Locale } from "@/lib/i18n";

export type NextLink = {
  href: string;
  label: string;
  hint?: string;
};

export type ArlUiCopy = {
  strip: {
    nextStepsAria: string;
    alsoNearby: string;
  };
  wallet: {
    eyebrow: string;
    title: string;
    body: string;
    copyId: string;
    copied: string;
    refresh: string;
    tipEur: string;
    tipAkWh: string;
    tipWatt: string;
    tipH2o: string;
    tipFlop: string;
    steps: {
      produce: { label: string; hint: string };
      convert: { label: string; hint: string };
      sell: { label: string; hint: string };
    };
    journeyAria: string;
  };
  disclaimer: string;
  homeSolutions: {
    eyebrow: string;
    title: string;
    intro: string;
    dossierHint: string;
    dossierCta: string;
    doors: Array<{ who: string; plain: string; cta: string; href: string }>;
  };
  hero: {
    or: string;
    talk: string;
    pickPath: string;
    dossier: string;
    footnote: string;
  };
  banner: {
    eyebrow: string;
    title: string;
    bodyBefore: string;
    bodyAfter: string;
    links: Array<{ href: string; label: string }>;
  };
  preview: {
    eyebrow: string;
    badge: string;
    steps: Array<{ n: string; title: string; hint: string }>;
    cta: string;
  };
  neighbors: {
    afterLab: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    afterProducer: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    afterTrade: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    afterAgent: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    company: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
    vision: { primary: NextLink; secondary: NextLink[]; neighbors: NextLink[] };
  };
};

const FR: ArlUiCopy = {
  strip: {
    nextStepsAria: "Étapes suivantes",
    alsoNearby: "Aussi à proximité",
  },
  wallet: {
    eyebrow: "Lab wallet · pas MetaMask · pas mainnet",
    title: "Ton compte ressource",
    body: "Même portefeuille sur Lab, Producer et Trade. Mint akWh → wrap WATT optionnel → vente spot (vend akWh ; WATT auto-redeem 1:1).",
    copyId: "Copier ID",
    copied: "Copié",
    refresh: "Actualiser",
    tipEur: "Cash lab pour trader",
    tipAkWh: "Énergie mintée",
    tipWatt: "Wrap 1:1 vs vault",
    tipH2o: "Eau",
    tipFlop: "Compute",
    steps: {
      produce: { label: "Produire", hint: "Mint akWh" },
      convert: { label: "Convertir", hint: "Wrap → WATT 1:1" },
      sell: { label: "Vendre", hint: "Spot (akWh · auto-redeem)" },
    },
    journeyAria: "Parcours lab",
  },
  disclaimer:
    "Lab ledger live (mint akWh, wrap WATT 1:1, spot avec auto-redeem). Pas mainnet, pas d’offre publique — retraits et settlement prod restent HITL.",
  homeSolutions: {
    eyebrow: "Choisis ton chemin",
    title: "Tu es là pour quoi ?",
    intro: "Un moteur de liquidité. Trois portes. Pas de jargon — le chemin qui match ton métier.",
    dossierHint: "Tu prépares un dossier RWA classique (immo, art, créances) ?",
    dossierCta: "Démarrer la readiness (~4 min)",
    doors: [
      {
        who: "Exchanges & actifs digitaux",
        plain:
          "Liquidité profonde, discipline de risque 24/7, APIs venue-ready pour les tokens qui ont besoin de vrais marchés.",
        cta: "Ouvrir le marketplace",
        href: "/market",
      },
      {
        who: "Producteurs énergie & eau",
        plain:
          "Transforme la production mesurée en unités vendables — chemins buyers plus courts, démos labellisées d’abord.",
        cta: "Ouvrir Energy Lab",
        href: "/lab",
      },
      {
        who: "Développeurs & agents IA",
        plain:
          "Build sur le Resource Layer : surfaces protocole, agent API, et un lab wallet partagé.",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "Ou",
    talk: "parler à l’équipe",
    pickPath: "choisir mon profil",
    dossier: "dossier RWA",
    footnote:
      "Un moteur : liquidité institutionnelle pour actifs numériques, et règlement pour l’énergie, l’eau et le compute tokenisés. Lab wallet partagé — pas de MetaMask.",
  },
  banner: {
    eyebrow: "Même moteur · prochaine frontière",
    title: "Énergie, eau et compute tokenisés suivent la même discipline de liquidité.",
    bodyBefore: "Production mesurée → lab wallet → spot. Propulsé par",
    bodyAfter: "(preview — pas d’offre publique). Démos labellisées ; settlement HITL.",
    links: [
      { href: "/resource-layer", label: "Pourquoi les ressources" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "Lab wallet · aperçu",
    badge: "Sans MetaMask",
    steps: [
      { n: "1", title: "Produire", hint: "Mint akWh · /lab" },
      { n: "2", title: "Convertir", hint: "Wrap → WATT · /producer" },
      { n: "3", title: "Vendre", hint: "Spot · /trade" },
    ],
    cta: "Commencer dans Energy Lab →",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "Suite · Wrap sur Producer" },
      secondary: [{ href: "/resource-layer", label: "Vision", hint: "pourquoi ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "Suite · Vendre sur Trade" },
      secondary: [{ href: "/watt", label: "Unité WATT" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "Option · Hedge agent" },
      secondary: [{ href: "/earn", label: "Aperçu Earn" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "Retour Trade" },
      secondary: [{ href: "/builders", label: "Chemin Agent API" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "Investisseurs" },
      ],
    },
    company: {
      primary: { href: "/lab", label: "Lancer la boucle lab" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "Nous écrire",
        },
      ],
      neighbors: [
        { href: "/investors", label: "Investisseurs" },
        { href: "/press", label: "Press" },
        { href: "/careers", label: "Carrières" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "Pourquoi" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "Ouvrir Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "Pourquoi" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "Investisseurs" },
      ],
    },
  },
};

const EN: ArlUiCopy = {
  strip: {
    nextStepsAria: "Next steps",
    alsoNearby: "Also nearby",
  },
  wallet: {
    eyebrow: "Lab wallet · not MetaMask · not mainnet",
    title: "Your resource account",
    body: "Same wallet on Lab, Producer, and Trade. Mint akWh → optional wrap to WATT → spot sell (sells akWh; wrapped WATT auto-redeems 1:1).",
    copyId: "Copy ID",
    copied: "Copied",
    refresh: "Refresh",
    tipEur: "Lab cash for spot",
    tipAkWh: "Minted energy",
    tipWatt: "1:1 vault wrap",
    tipH2o: "Water",
    tipFlop: "Compute",
    steps: {
      produce: { label: "Produce", hint: "Mint akWh" },
      convert: { label: "Convert", hint: "Wrap → WATT 1:1" },
      sell: { label: "Sell", hint: "Spot (akWh · auto-redeem)" },
    },
    journeyAria: "Lab journey",
  },
  disclaimer:
    "Lab ledger is live (mint akWh, wrap WATT 1:1, spot sell with auto-redeem). Not mainnet, not a public sale — withdrawals and production settlement still require human approval (HITL).",
  homeSolutions: {
    eyebrow: "Pick your path",
    title: "Who are you here for?",
    intro: "One liquidity engine. Three doors. No jargon maze — choose the path that matches your job.",
    dossierHint: "Preparing a classic RWA dossier (real estate, art, receivables)?",
    dossierCta: "Start readiness in ~4 min",
    doors: [
      {
        who: "Exchanges & digital assets",
        plain:
          "Deep liquidity, 24/7 risk discipline, and venue-ready APIs for tokens that need real markets.",
        cta: "Open marketplace",
        href: "/market",
      },
      {
        who: "Energy & water producers",
        plain:
          "Turn metered production into units you can sell — faster paths to buyers, labeled demos first.",
        cta: "Open Energy Lab",
        href: "/lab",
      },
      {
        who: "Developers & AI agents",
        plain: "Build on the Resource Layer: protocol surfaces, agent API, and a shared lab wallet.",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "Or",
    talk: "talk to the team",
    pickPath: "pick your path",
    dossier: "RWA dossier",
    footnote:
      "One engine: institutional liquidity for digital assets, and settlement for tokenized energy, water, and compute. Shared lab wallet — no MetaMask.",
  },
  banner: {
    eyebrow: "Same engine · next frontier",
    title: "Tokenized energy, water, and compute use the same liquidity discipline.",
    bodyBefore: "Metered production → lab wallet → spot. Powered by",
    bodyAfter: "(preview — not a public sale). Demos labeled; settlement stays HITL.",
    links: [
      { href: "/resource-layer", label: "Why resources" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "Lab wallet · preview",
    badge: "No MetaMask",
    steps: [
      { n: "1", title: "Produce", hint: "Mint akWh · /lab" },
      { n: "2", title: "Convert", hint: "Wrap → WATT · /producer" },
      { n: "3", title: "Sell", hint: "Spot settle · /trade" },
    ],
    cta: "Start in Energy Lab →",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "Next · Wrap on Producer" },
      secondary: [{ href: "/resource-layer", label: "Vision", hint: "why ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "Next · Sell on Trade" },
      secondary: [{ href: "/watt", label: "WATT unit" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "Optional · Agent hedge" },
      secondary: [{ href: "/earn", label: "Earn preview" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "Back to Trade" },
      secondary: [{ href: "/builders", label: "Agent API path" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "Investors" },
      ],
    },
    company: {
      primary: { href: "/lab", label: "Run the lab loop" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "Talk to us",
        },
      ],
      neighbors: [
        { href: "/investors", label: "Investors" },
        { href: "/press", label: "Press" },
        { href: "/careers", label: "Careers" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "Why" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "Open Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "Why" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "Investors" },
      ],
    },
  },
};

const ES: ArlUiCopy = {
  strip: {
    nextStepsAria: "Siguientes pasos",
    alsoNearby: "También cerca",
  },
  wallet: {
    eyebrow: "Lab wallet · no MetaMask · no mainnet",
    title: "Tu cuenta de recursos",
    body: "Misma cartera en Lab, Producer y Trade. Mint akWh → wrap WATT opcional → venta spot (vende akWh; WATT se canjea 1:1).",
    copyId: "Copiar ID",
    copied: "Copiado",
    refresh: "Actualizar",
    tipEur: "Cash lab para spot",
    tipAkWh: "Energía minteada",
    tipWatt: "Wrap 1:1 vault",
    tipH2o: "Agua",
    tipFlop: "Compute",
    steps: {
      produce: { label: "Producir", hint: "Mint akWh" },
      convert: { label: "Convertir", hint: "Wrap → WATT 1:1" },
      sell: { label: "Vender", hint: "Spot (akWh · auto-redeem)" },
    },
    journeyAria: "Recorrido lab",
  },
  disclaimer:
    "Lab ledger en vivo (mint akWh, wrap WATT 1:1, spot con auto-redeem). No mainnet, no oferta pública — retiros y settlement de producción siguen siendo HITL.",
  homeSolutions: {
    eyebrow: "Elige tu camino",
    title: "¿Para quién estás aquí?",
    intro: "Un motor de liquidez. Tres puertas. Sin jerga — elige el camino de tu rol.",
    dossierHint: "¿Preparas un dossier RWA clásico (inmueble, arte, créditos)?",
    dossierCta: "Empezar readiness (~4 min)",
    doors: [
      {
        who: "Exchanges y activos digitales",
        plain:
          "Liquidez profunda, disciplina de riesgo 24/7 y APIs listas para venues que necesitan mercados reales.",
        cta: "Abrir marketplace",
        href: "/market",
      },
      {
        who: "Productores de energía y agua",
        plain:
          "Convierte producción medida en unidades vendibles — caminos más cortos a compradores, demos etiquetadas primero.",
        cta: "Abrir Energy Lab",
        href: "/lab",
      },
      {
        who: "Developers y agentes IA",
        plain:
          "Construye sobre Resource Layer: protocolo, agent API y lab wallet compartido.",
        cta: "Builders / testnet",
        href: "/builders",
      },
    ],
  },
  hero: {
    or: "O",
    talk: "hablar con el equipo",
    pickPath: "elegir mi perfil",
    dossier: "dossier RWA",
    footnote:
      "Un motor: liquidez institucional para activos digitales, y settlement para energía, agua y compute tokenizados. Lab wallet compartido — sin MetaMask.",
  },
  banner: {
    eyebrow: "Mismo motor · siguiente frontera",
    title: "Energía, agua y compute tokenizados siguen la misma disciplina de liquidez.",
    bodyBefore: "Producción medida → lab wallet → spot. Impulsado por",
    bodyAfter: "(preview — no oferta pública). Demos etiquetadas; settlement HITL.",
    links: [
      { href: "/resource-layer", label: "Por qué recursos" },
      { href: "/watt", label: "WATT" },
      { href: "/lab", label: "Lab" },
      { href: "/trade", label: "Trade" },
    ],
  },
  preview: {
    eyebrow: "Lab wallet · vista previa",
    badge: "Sin MetaMask",
    steps: [
      { n: "1", title: "Producir", hint: "Mint akWh · /lab" },
      { n: "2", title: "Convertir", hint: "Wrap → WATT · /producer" },
      { n: "3", title: "Vender", hint: "Spot · /trade" },
    ],
    cta: "Empezar en Energy Lab →",
  },
  neighbors: {
    afterLab: {
      primary: { href: "/producer", label: "Siguiente · Wrap en Producer" },
      secondary: [{ href: "/resource-layer", label: "Visión", hint: "por qué ARL" }],
      neighbors: [
        { href: "/watt", label: "WATT" },
        { href: "/builders", label: "Builders" },
        { href: "/trade", label: "Trade" },
      ],
    },
    afterProducer: {
      primary: { href: "/trade?market=kwh-france&side=sell", label: "Siguiente · Vender en Trade" },
      secondary: [{ href: "/watt", label: "Unidad WATT" }],
      neighbors: [
        { href: "/lab", label: "Lab" },
        { href: "/earn", label: "Earn" },
        { href: "/market", label: "Market" },
      ],
    },
    afterTrade: {
      primary: { href: "/agent", label: "Opcional · Hedge agent" },
      secondary: [{ href: "/earn", label: "Vista Earn" }],
      neighbors: [
        { href: "/market", label: "Market" },
        { href: "/builders", label: "Builders" },
        { href: "/status", label: "Status" },
      ],
    },
    afterAgent: {
      primary: { href: "/trade", label: "Volver a Trade" },
      secondary: [{ href: "/builders", label: "Ruta Agent API" }],
      neighbors: [
        { href: "/producer", label: "Producer" },
        { href: "/market", label: "Market" },
        { href: "/investors", label: "Inversores" },
      ],
    },
    company: {
      primary: { href: "/lab", label: "Lanzar el loop lab" },
      secondary: [
        {
          href: "mailto:resources@getauros.com?subject=AUROS%20diligence",
          label: "Escríbenos",
        },
      ],
      neighbors: [
        { href: "/investors", label: "Inversores" },
        { href: "/press", label: "Press" },
        { href: "/careers", label: "Carreras" },
        { href: "/status", label: "Status" },
        { href: "/why", label: "Por qué" },
      ],
    },
    vision: {
      primary: { href: "/lab", label: "Abrir Energy Lab" },
      secondary: [{ href: "/builders", label: "Builders" }],
      neighbors: [
        { href: "/why", label: "Por qué" },
        { href: "/watt", label: "WATT" },
        { href: "/investors", label: "Inversores" },
      ],
    },
  },
};

const CATALOG: CatalogMap<ArlUiCopy> = { fr: FR, en: EN, es: ES };

export function getArlUi(locale: Locale): ArlUiCopy {
  return fromCatalog(CATALOG, locale);
}

export type EcosystemPreset = keyof ArlUiCopy["neighbors"];

export function getEcosystemPreset(locale: Locale, key: EcosystemPreset) {
  return getArlUi(locale).neighbors[key];
}
