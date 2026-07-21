/** Fictional but realistic data-center case study — marketing / education only. */

export const DC_100MW_DEMO_ROUTE = "/demos/data-center-100mw";

export const DC_100MW_DISCLAIMER =
  "Étude de cas fictive AUROS — chiffres indicatifs pour illustration commerciale. Pas un audit, une promesse de performance ni un conseil d’investissement. Hypothèses documentées ; counsel et ingénierie requis.";

export type DcDemoMetric = {
  label: string;
  before: string;
  after: string;
  note?: string;
};

export const DC_100MW_PROFILE = {
  name: "Campus IA 100 MW (fictif · « Meridian North »)",
  region: "Corridor US Midwest — stress hydrique medium (WELHR proxy)",
  cod: "2028",
  cooling_baseline: "Tour wet — ~1,8 L/kWh IT load (hypothèse littérature DC)",
  cooling_target: "Boucle fermée + réutilisation eau grise — ~0,5 L/kWh (cible ingénierie)",
} as const;

export const DC_100MW_METRICS: DcDemoMetric[] = [
  {
    label: "Eau potable refroidissement (est.)",
    before: "~158 M L/an",
    after: "~44 M L/an",
    note: "−72 % volume potable si boucle fermée + récupération (hypothèse scénario AUROS).",
  },
  {
    label: "Coût eau + traitement (fourchette)",
    before: "4,2–5,8 M€/an",
    after: "1,6–2,4 M€/an",
    note: "Tarifs utility indicatifs ; contrats long terme non modélisés.",
  },
  {
    label: "Bande WELHR (indicatif)",
    before: "Grade C · risque moderate",
    after: "Grade B · risque contained",
    note: "Après contrats refroidissement sourcés + disclosure stress zone.",
  },
  {
    label: "Trust Score WETS (démo)",
    before: "D · social_litigation_risk faible",
    after: "B · preuves interconnexion + PQC checklist",
    note: "Projet démo wets-demo-microgrid — rapport public partageable.",
  },
];

export const DC_100MW_AUROS_STEPS = [
  {
    step: "01",
    title: "WELHR + risk events",
    body: "Screen moratorium / litige local avant levée — alimente le critère hydrique WETS.",
    href: "/eau/risk",
  },
  {
    step: "02",
    title: "Playbook continuité",
    body: "3 scénarios chiffrés (bascule source, boucle fermée, délestage IT) — décision prête à valider.",
    href: "/eau/continuity",
  },
  {
    step: "03",
    title: "WETS + verify",
    body: "Rapport public grade B, lien Shield — 5ᵉ porte admit-on-verify pour LPs.",
    href: "/eau/trust",
  },
] as const;

export const DC_100MW_ASSUMPTIONS = [
  "100 MW IT load, PUE 1,25, 8 760 h/an — eau tour wet ~1,8 L/kWh (fourchette industry, non site-specific).",
  "Boucle fermée cible ~0,5 L/kWh makeup — nécessite CAPEX refroidissement + permis eau non potable.",
  "Coûts € indicatifs FX approximatif ; pas de PPA énergie ni GO/REC.",
  "Scores WETS/WELHR sur projet démo catalogue — pas Meridian North réel.",
] as const;
