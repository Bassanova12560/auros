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
    title: "RWA Comparator — Yields by Risk, Class & Source | AUROS",
    description:
      "Compare tokenized RWA products across treasuries, real estate, private credit, equity, commodities and art. Live DeFiLlama vs curated manual rows — educational only.",
    summary:
      "Hub comparatif agrégé : rendements RWA tokenisés par profil de risque, classe d'actif et source (live vs manuel). Point d'entrée vers les comparateurs spécialisés AUROS.",
    keywords: [
      "RWA comparator",
      "RWA yields",
      "compare tokenized assets",
      "risk profile",
      "DeFiLlama RWA",
    ],
    intents: [
      "Quels rendements RWA par niveau de risque ?",
      "Comparer des produits RWA tokenisés",
    ],
    assetClass: "multi",
  },
  {
    id: "comparator-stablecoins",
    path: COMPARATOR_ROUTES.stablecoins,
    title: "RWA Stablecoins & Treasury Comparator | AUROS",
    description:
      "Compare RWA-backed stablecoins and treasury tokens — live APY and TVL via DeFiLlama, manual rows labeled. Updated hourly.",
    summary:
      "Comparateur stablecoins et trésorerie tokenisée : APY et TVL en direct (DeFiLlama + données manuelles). Mis à jour toutes les heures.",
    keywords: ["tokenized stablecoins", "T-Bills tokenized", "BUIDL", "USYC", "treasury tokens"],
    intents: ["Meilleur rendement stablecoin tokenisé ?", "Comparer T-Bills on-chain"],
    assetClass: "stablecoins",
  },
  {
    id: "comparator-real-estate",
    path: COMPARATOR_ROUTES.realEstate,
    title: "Tokenized Real Estate Comparator | AUROS",
    description:
      "Compare tokenized real estate platforms — indicative yields, AUM, chains and access. Educational RWA comparison.",
    summary:
      "Comparateur immobilier tokenisé : plateformes RWA immo, rendements indicatifs, ticket minimum. Données live + références marché.",
    keywords: ["tokenized real estate", "RWA immobilier", "RealT", "Lofty"],
    intents: ["Quelles plateformes immobilier tokenisé ?", "Rendement immo RWA"],
    assetClass: "real_estate",
  },
  {
    id: "comparator-bonds",
    path: COMPARATOR_ROUTES.bonds,
    title: "Tokenized Bonds & T-Bill Comparator | AUROS",
    description:
      "Compare tokenized bonds, T-Bills and treasury funds — OUSG, BUIDL, carbon-linked structured rows with Green links. Live APY via DeFiLlama.",
    summary:
      "Comparateur obligations tokenisées : OUSG, T-Bills, BUIDL et liens carbone Green — APY/TVL live + catalogue manuel.",
    keywords: ["tokenized bonds", "OUSG", "BUIDL", "treasury token", "RWA bonds"],
    intents: ["Comparer obligations tokenisées", "Rendement bonds RWA"],
    assetClass: "bonds",
  },
  {
    id: "comparator-commodities",
    path: COMPARATOR_ROUTES.commodities,
    title: "Tokenized Commodities Comparator | AUROS",
    description:
      "Compare tokenized gold and agricultural RWAs — PAXG, XAUT, LandX. Honest APY 0 when no coupon.",
    summary:
      "Comparateur matières premières tokenisées : or, métaux, produits agricoles on-chain.",
    keywords: ["tokenized gold", "commodities RWA", "PAXG", "LandX"],
    intents: ["Tokenisation or ou matières premières ?"],
    assetClass: "commodities",
  },
  {
    id: "comparator-private-credit",
    path: COMPARATOR_ROUTES.privateCredit,
    title: "Tokenized Private Credit Comparator | AUROS",
    description:
      "Compare on-chain private credit — Maple, Centrifuge, Apollo ACRED, Hamilton Lane HLSCOPE. Live DeFiLlama APY.",
    summary:
      "Comparateur crédit privé tokenisé : Maple, Centrifuge, Goldfinch et fonds Securitize indexés DeFiLlama.",
    keywords: ["tokenized private credit", "RWA lending", "Maple Finance", "ACRED"],
    intents: ["Rendement crédit privé tokenisé ?"],
    assetClass: "private_credit",
  },
  {
    id: "comparator-private-equity",
    path: COMPARATOR_ROUTES.privateEquity,
    title: "Tokenized Private Equity & Stocks Comparator | AUROS",
    description:
      "Compare tokenized PE funds and public equity RWAs — Securitize funds, Ondo stocks, Backed ETFs. Manual vs live labeled.",
    summary:
      "Comparateur equity / PE tokenisé : fonds Securitize, actions Ondo/Backed/Swarm. APY 0 si aucun coupon public.",
    keywords: ["tokenized equity", "private equity RWA", "Ondo Global Markets", "Securitize"],
    intents: ["Comparer equity tokenisé", "Fonds PE on-chain"],
    assetClass: "private_equity",
  },
  {
    id: "comparator-art",
    path: COMPARATOR_ROUTES.art,
    title: "Tokenized Art & Collectibles Comparator | AUROS",
    description:
      "Compare tokenized art and collectibles platforms — Masterworks, Particle, Artory. No invented yields.",
    summary:
      "Comparateur art & collectibles tokenisés : plateformes fractionnées, sans rendements inventés.",
    keywords: ["tokenized art", "fractional art", "RWA collectibles", "Masterworks"],
    intents: ["Comparer art tokenisé"],
    assetClass: "art",
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
      lastUpdated: "2026-07-23",
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
