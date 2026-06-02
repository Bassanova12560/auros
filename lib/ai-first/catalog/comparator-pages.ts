import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";

import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";

type ComparatorDef = {
  id: string;
  path: string;
  title: string;
  description: string;
  summary: string;
  keywords: string[];
  intents: string[];
  assetClass: string;
};

const COMPARATOR_DEFS: ComparatorDef[] = [
  {
    id: "comparator-compare",
    path: COMPARATOR_ROUTES.compare,
    title: "RWA Yields by Risk Profile | AUROS Compare",
    description:
      "Compare tokenized RWA yields across stablecoins, real estate, bonds, commodities and private credit — grouped by risk tier.",
    summary:
      "Hub comparatif agrégé : rendements RWA tokenisés par profil de risque (conservateur → dynamique). Point d'entrée vers les comparateurs spécialisés AUROS.",
    keywords: ["RWA yields", "compare tokenized assets", "risk profile"],
    intents: ["Quels rendements RWA par niveau de risque ?"],
    assetClass: "multi",
  },
  {
    id: "comparator-stablecoins",
    path: COMPARATOR_ROUTES.stablecoins,
    title: "Tokenized Stablecoins Comparator | AUROS",
    description:
      "Compare tokenized stablecoin and treasury products — live APY and TVL. Updated hourly.",
    summary:
      "Comparateur stablecoins et trésorerie tokenisée : APY et TVL en direct (DeFiLlama + données manuelles). Mis à jour toutes les heures.",
    keywords: ["tokenized stablecoins", "T-Bills tokenized", "USDC yield", "treasury tokens"],
    intents: ["Meilleur rendement stablecoin tokenisé ?", "Comparer T-Bills on-chain"],
    assetClass: "stablecoins",
  },
  {
    id: "comparator-real-estate",
    path: COMPARATOR_ROUTES.realEstate,
    title: "Tokenized Real Estate Comparator | AUROS",
    description:
      "Compare tokenized real estate platforms — yields, TVL and minimum investment.",
    summary:
      "Comparateur immobilier tokenisé : plateformes RWA immo, rendements indicatifs, ticket minimum. Données live + références marché.",
    keywords: ["tokenized real estate", "RWA immobilier", "Brickken", "RealT"],
    intents: ["Quelles plateformes immobilier tokenisé ?", "Rendement immo RWA"],
    assetClass: "real_estate",
  },
  {
    id: "comparator-bonds",
    path: COMPARATOR_ROUTES.bonds,
    title: "Tokenized Bonds Comparator | AUROS",
    description:
      "Compare tokenized bond products and treasury funds — live APY and TVL via DeFiLlama.",
    summary:
      "Comparateur obligations tokenisées : OUSG, mini-bonds, produits trésorerie — APY/TVL live.",
    keywords: ["tokenized bonds", "OUSG", "ondo", "treasury token"],
    intents: ["Comparer obligations tokenisées", "Rendement bonds RWA"],
    assetClass: "bonds",
  },
  {
    id: "comparator-commodities",
    path: COMPARATOR_ROUTES.commodities,
    title: "Tokenized Commodities Comparator | AUROS",
    description:
      "Compare tokenized commodities — gold, agricultural and precious metals RWA.",
    summary:
      "Comparateur matières premières tokenisées : or, métaux, produits agricoles on-chain.",
    keywords: ["tokenized gold", "commodities RWA", "LandX"],
    intents: ["Tokenisation or ou matières premières ?"],
    assetClass: "commodities",
  },
  {
    id: "comparator-private-credit",
    path: COMPARATOR_ROUTES.privateCredit,
    title: "Tokenized Private Credit Comparator | AUROS",
    description:
      "Compare tokenized private credit pools — APY, TVL and protocol risk.",
    summary:
      "Comparateur crédit privé tokenisé : Maple, Centrifuge, Goldfinch et pools DeFi RWA.",
    keywords: ["tokenized private credit", "RWA lending", "Maple Finance"],
    intents: ["Rendement crédit privé tokenisé ?"],
    assetClass: "private_credit",
  },
];

export function buildComparatorPages(): AiFirstPage[] {
  return COMPARATOR_DEFS.map((c) =>
    enrichPage({
      id: c.id,
      path: c.path,
      title: c.title,
      description: c.description,
      summary: c.summary,
      contentType: "comparator",
      language: "en",
      indexable: true,
      lastUpdated: "2026-05-29",
      keywords: c.keywords,
      intents: c.intents,
      audience: ["investisseurs", "analystes RWA", "family office", "trésorerie"],
      facts: [
        { key: "Classe d'actif", value: c.assetClass },
        { key: "Refresh", value: "Horaire (revalidate 3600s)" },
        { key: "Source données", value: "DeFiLlama + catalogue AUROS" },
      ],
      liveDataUrl: `/ai-first/comparators/${c.id.replace("comparator-", "")}`,
      relatedPaths: [COMPARATOR_ROUTES.compare, "/jurisdictions", "/wizard"],
    })
  );
}

export const compareHubPage = buildComparatorPages()[0];
