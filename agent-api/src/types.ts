export type ResourceType = "kwh" | "water" | "compute" | "carbon";

export interface ResourceToken {
  symbol: string;
  resourceType: ResourceType;
  address: string;
}

export interface Market extends ResourceToken {
  priceUsd: number;
  liquidityUsd: number;
  source: "simulated" | "uniswap";
}

export interface Order {
  resourceType: ResourceType;
  side: "buy" | "sell";
  amount: number;
  maxSlippageBps?: number;
  consumerId?: string;
}

export interface HedgerConsumer {
  id: string;
  resourceType: ResourceType;
  forecastAmount: number;
  hedgeRatio: number;
}

export interface ForwardOrder extends Order {
  executeAt: string;
}
