import { COST_ESTIMATOR_ROUTE } from "@/lib/cost-estimator/types";
import { JURISDICTION_PICKER_ROUTE } from "@/lib/jurisdiction-picker/types";
import { MICA_CHECKER_ROUTE } from "@/lib/mica-checker/types";
import { RWA_INDEX_ROUTE } from "@/lib/rwa-index/types";
import { YIELD_CALCULATOR_ROUTE } from "@/lib/yield-calculator/types";

export type ToolsHubEntry = {
  href: string;
  title: string;
  description: string;
  cta: string;
  duration?: string;
};

export const TOOLS_HUB_ENTRIES: ToolsHubEntry[] = [
  {
    href: MICA_CHECKER_ROUTE,
    title: "Test MiCA",
    description:
      "Cinq questions sur structure, actif, lien UE et investisseurs — score indicatif de maturité MiCA, sans compte.",
    cta: "Lancer le test",
    duration: "~2 min",
  },
  {
    href: YIELD_CALCULATOR_ROUTE,
    title: "Calculateur rendement RWA",
    description:
      "Fourchette APY indicative par classe d'actif tokenisé, benchmark inflation UE — données hub /compare (120+ produits).",
    cta: "Estimer le rendement",
    duration: "~1 min",
  },
  {
    href: JURISDICTION_PICKER_ROUTE,
    title: "Sélecteur de juridiction",
    description:
      "Curseurs délai, coût et fiscalité → top 3 indicatif parmi 8 juridictions AUROS (Luxembourg, DIFC, Singapour…).",
    cta: "Comparer les juridictions",
    duration: "~2 min",
  },
  {
    href: COST_ESTIMATOR_ROUTE,
    title: "Estimateur coût tokenisation",
    description:
      "Fourchette EUR indicative — setup juridique, licence, audit et frais annuels selon actif, AUM et juridiction.",
    cta: "Estimer le budget",
    duration: "~2 min",
  },
];

export const TOOLS_HUB_RELATED = [
  { href: RWA_INDEX_ROUTE, label: "AUROS RWA Index", desc: "Indice mensuel — APY par classe, export CSV." },
  { href: "/compare", label: "Comparateur RWA", desc: "120+ produits live — rendements multi-classes." },
  { href: "/glossary", label: "Glossaire RWA", desc: "80+ définitions MiCA, standards et structures." },
  { href: "/wizard", label: "Wizard tokenisation", desc: "Parcours gratuit — score et data room." },
] as const;
