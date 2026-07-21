/** AUROS Compass — 3 KPI modes, max 3 visible priorities each (UX psychology). */

export const COMPASS_WELCOME_ROUTE = "/compass";
export const COMPASS_DASHBOARD_ROUTE = "/compass/dashboard";

export type CompassMode = "water" | "carbon" | "budget";

export type CompassTile = {
  id: string;
  title: string;
  body: string;
  href: string;
  metric?: string;
};

export type CompassModeConfig = {
  id: CompassMode;
  label: string;
  kicker: string;
  summary: string;
  tiles: CompassTile[];
};

export const COMPASS_MODES: Record<CompassMode, CompassModeConfig> = {
  water: {
    id: "water",
    label: "Eau & refroidissement",
    kicker: "KPI · approvisionnement",
    summary:
      "Stress zone, droits d’eau, refroidissement — prioriser avant COD et avant token.",
    tiles: [
      {
        id: "welhr",
        title: "Score WELHR",
        body: "Filtre legal & hydrique — moratorium, litige, social license.",
        href: "/eau/risk/score",
        metric: "Screen ~2 min",
      },
      {
        id: "continuity",
        title: "Playbook continuité",
        body: "Scénarios chiffrés bascule source / boucle fermée / délestage.",
        href: "/eau/continuity/playbook",
        metric: "3 scénarios",
      },
      {
        id: "wets",
        title: "Trust Score WETS",
        body: "Critère social_litigation_risk + preuves refroidissement.",
        href: "/eau/trust/console",
        metric: "Grade A–D",
      },
    ],
  },
  carbon: {
    id: "carbon",
    label: "Empreinte & bas-carbone",
    kicker: "KPI · énergie",
    summary:
      "Watts, ChargeFlow, Power — preuves indicatives, pas GO/REC. Aligner token et reporting RSE.",
    tiles: [
      {
        id: "green",
        title: "Hub Green",
        body: "Marketplace, registre, label — énergie locale tokenisable.",
        href: "/green/hub",
        metric: "Acteurs référencés",
      },
      {
        id: "power",
        title: "Power low-carbon",
        body: "Réserve Watts nuclear / bas-carbone hors Green Verified.",
        href: "/power/hub",
        metric: "CFU-E",
      },
      {
        id: "capacity",
        title: "Capacity rights",
        body: "MW, interconnexion, cooling — droits de capacité RWA.",
        href: "/trust/capacity",
        metric: "Pack 6 Q",
      },
    ],
  },
  budget: {
    id: "budget",
    label: "Budget & ROI indicatif",
    kicker: "KPI · economics",
    summary:
      "Fourchettes CAPEX/OPEX et simulateurs — toujours indicatif, counsel requis.",
    tiles: [
      {
        id: "demo",
        title: "Cas 100 MW (démo)",
        body: "Avant/après eau & coûts — storytelling data center fictif.",
        href: "/demos/data-center-100mw",
        metric: "−72 % eau pot. (hyp.)",
      },
      {
        id: "compare",
        title: "Compare RWA",
        body: "Hub rendements & produits — diligence avant allocation.",
        href: "/compare",
        metric: "120+ produits",
      },
      {
        id: "wizard",
        title: "Wizard dossier",
        body: "Structurer levée / token — 4 parties, ~15 min.",
        href: "/wizard",
        metric: "~4 min / partie",
      },
    ],
  },
};

export const COMPASS_MODE_ORDER: CompassMode[] = ["water", "carbon", "budget"];

export function compassModeFromParam(raw: string | null | undefined): CompassMode {
  if (raw === "carbon" || raw === "budget" || raw === "water") return raw;
  return "water";
}
