/**
 * Indicative resource / commodity signals for resilience narrative.
 * Not a live trading feed — curated bands with public source hints.
 */

export const RESOURCE_SIGNALS_ROUTE = "/data/resource-signals";

export type ResourceSignal = {
  id: string;
  label: string;
  band: string;
  unit: string;
  note: string;
  source_label: string;
  source_url: string;
  relevance: string;
};

/** Snapshot — update note when refreshing; not real-time market data. */
export const RESOURCE_SIGNALS_AS_OF = "2026-07-21";

export const RESOURCE_SIGNALS: ResourceSignal[] = [
  {
    id: "eu_power_spot_band",
    label: "Électricité EU — bande spot (indicatif)",
    band: "40–120",
    unit: "€/MWh",
    note: "Fourchette pédagogique pour stress-test CAPEX/OPEX — pas un prix live EPEX.",
    source_label: "Marchés day-ahead EU (ordre de grandeur)",
    source_url: "https://www.entsoe.eu/",
    relevance: "Watts Reserve · Power hub · playbook énergie",
  },
  {
    id: "lithium_carbonate",
    label: "Lithium carbonate — bande indicative",
    band: "10–25",
    unit: "k USD/t",
    note: "Volatilité batterie / storage — signal de risque chaîne, pas un prix exécutable.",
    source_label: "Indices commodities (ordre de grandeur)",
    source_url: "https://www.fastmarkets.com/",
    relevance: "Capacity / storage RWA · supplier screen minerais",
  },
  {
    id: "cobalt",
    label: "Cobalt — bande indicative",
    band: "20–40",
    unit: "k USD/t",
    note: "Diligence conflict minerals — croiser supplier ESG screen.",
    source_label: "Indices métaux (ordre de grandeur)",
    source_url: "https://www.lme.com/",
    relevance: "Supplier ESG · packs capacity",
  },
  {
    id: "water_stress_proxy",
    label: "Stress hydrique (proxy WELHR)",
    band: "low → extreme",
    unit: "bande",
    note: "Pas un ratio WUE live — utiliser POST /api/green/eau/legal-risk par région.",
    source_label: "WRI Aqueduct (méthode)",
    source_url: "https://www.wri.org/aqueduct",
    relevance: "WELHR · continuity · DC demo",
  },
];

export const RESOURCE_SIGNALS_DISCLAIMER =
  "Signaux indicatifs AUROS — pas un feed de trading, ni un conseil d’investissement. Rafraîchissement manuel / snapshot ; counsel et sources primaires requis.";
