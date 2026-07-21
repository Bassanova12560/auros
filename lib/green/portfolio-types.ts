/** Shared Portfolio Console types — safe for client imports. */

export type PortfolioAssetRow = {
  assetDnaId: string;
  displayName: string;
  assetClass: string;
  country: string;
  source: "registry" | "market" | "dna_only";
  sourceId?: string;
  labelTier?: string;
  listingTier?: string;
  lastAction?: string;
  lastEventAt?: string;
  eventCount: number;
  recentEvents: {
    id: string;
    assetDnaId: string;
    action: string;
    contentHash?: string;
    meta?: Record<string, unknown>;
    createdAt: string;
  }[];
};

export type GreenPortfolioSnapshot = {
  generatedAt: string;
  totalDna: number;
  withRecentEvents: number;
  bySource: { registry: number; market: number; dnaOnly: number };
  byLastAction: Record<string, number>;
  assets: PortfolioAssetRow[];
};
