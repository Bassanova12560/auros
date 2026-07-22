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
  /** Market actor status when source is market */
  marketStatus?: string;
  /** Doc titles past expiresAt (from DNA record) */
  expiredDocuments?: string[];
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

export type PortfolioAlertSeverity = "info" | "warn" | "critical";

export type PortfolioAlertKind =
  | "proof_stream_silent"
  | "proof_stream_stale"
  | "document_expired"
  | "listing_pending"
  | "demo_tier";

export type PortfolioAlert = {
  id: string;
  kind: PortfolioAlertKind;
  severity: PortfolioAlertSeverity;
  assetDnaId: string;
  displayName: string;
  message: string;
  evidence?: string;
};

export type GreenPortfolioSnapshot = {
  generatedAt: string;
  totalDna: number;
  withRecentEvents: number;
  bySource: { registry: number; market: number; dnaOnly: number };
  byLastAction: Record<string, number>;
  assets: PortfolioAssetRow[];
  alerts: PortfolioAlert[];
  alertCount: number;
};
