/** Public narrative + sourced stats for /resilience (marketing / SEO). */

export const RESILIENCE_ROUTE = "/resilience";

export const RESILIENCE_STATS = [
  {
    id: "dc_energy",
    label: "Demande énergie data centers (projection)",
    value: "945 TWh d’ici 2030 (ordre de grandeur sectoriel)",
    source_label: "IEA / analyses sectorielles — indicatif",
    source_url: "https://www.iea.org/energy-system/electricity/data-centres-and-data-transmission-networks",
  },
  {
    id: "water_stress",
    label: "Sites en stress hydrique",
    value: "~40 % des DC dans des zones à stress (ordre de grandeur)",
    source_label: "WRI Aqueduct / littérature eau–DC — indicatif",
    source_url: "https://www.wri.org/aqueduct",
  },
  {
    id: "auros_chain",
    label: "Chaîne AUROS",
    value: "Détecter (WELHR) → Décider (playbook) → Prouver (WETS / verify)",
    source_label: "getauros.com",
    source_url: "https://getauros.com/resilience",
  },
] as const;

export const RESILIENCE_DISCLAIMER =
  "Chiffres macro indicatifs — pas une prévision AUROS. Diligence projet via WELHR/WETS ; counsel requis.";
