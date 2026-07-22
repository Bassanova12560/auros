/**
 * In-browser ARL trade engine — mirrors agent-api perps/phase3 economics.
 * Demo / HITL only: no wallet, no chain settlement.
 */

export const MAX_LEVERAGE = 10;
export const MAX_MARGIN = 1_000_000;
export const MAX_OPEN_INTEREST = 50_000_000;
export const MAX_OPTION_SIZE = 1_000_000;
export const MAX_OPTION_PREMIUM = 1_000_000;
export const FEE_BPS = 10; // 0.1%
export const OPTION_FEE_BPS = 20; // 0.2%

export type PerpSide = "long" | "short";
export type SpotSide = "buy" | "sell";
export type OptionKind = "call" | "put";

export type MarketId = "kwh-france" | "kwh-texas" | "h2o-ca" | "flop";

export type SpotRow = {
  id: MarketId;
  symbol: string;
  resourceType: "kwh" | "water" | "compute";
  last: number;
  changeBps: number;
  volLabel: string;
};

export const SPOT_MARKETS: SpotRow[] = [
  { id: "kwh-france", symbol: "akWh-FR", resourceType: "kwh", last: 0.121, changeBps: 12, volLabel: "120k" },
  { id: "kwh-texas", symbol: "akWh-TX", resourceType: "kwh", last: 0.082, changeBps: -4, volLabel: "340k" },
  { id: "h2o-ca", symbol: "H2O-CA", resourceType: "water", last: 0.0021, changeBps: 8, volLabel: "55k" },
  { id: "flop", symbol: "FLOP", resourceType: "compute", last: 1.27, changeBps: 31, volLabel: "88k" },
];

type PerpPosition = {
  side: PerpSide;
  margin: number;
  leverage: number;
  size: number;
  entryPrice: number;
  openedAt: number;
};

type PerpBook = {
  markPrice: number;
  longOi: number;
  shortOi: number;
  lpLiquidity: number;
  protocolFees: number;
  position: PerpPosition | null;
};

type OptionListing = {
  id: string;
  kind: OptionKind;
  strike: number;
  expiry: number;
  premium: number;
  margin: number;
  size: number;
  seller: string;
  buyer?: string;
};

function assertFinitePositive(n: number, label: string) {
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} must be a positive number`);
}

function feeOn(notional: number, bps = FEE_BPS): number {
  return (notional * bps) / 10_000;
}

function defaultMark(id: MarketId): number {
  return SPOT_MARKETS.find((m) => m.id === id)?.last ?? 0.12;
}

class TradeEngine {
  private perps = new Map<MarketId, PerpBook>();
  private options = new Map<string, OptionListing>();
  private optSeq = 1;
  private spotFees = 0;

  private book(id: MarketId): PerpBook {
    let b = this.perps.get(id);
    if (!b) {
      b = {
        markPrice: defaultMark(id),
        longOi: 0,
        shortOi: 0,
        lpLiquidity: 500_000,
        protocolFees: 0,
        position: null,
      };
      this.perps.set(id, b);
    }
    return b;
  }

  getMarket(id: MarketId) {
    const b = this.book(id);
    const spot = SPOT_MARKETS.find((m) => m.id === id)!;
    return {
      ...spot,
      markPrice: b.markPrice,
      longOi: b.longOi,
      shortOi: b.shortOi,
      lpLiquidity: b.lpLiquidity,
      protocolFees: b.protocolFees,
      hasPosition: Boolean(b.position),
    };
  }

  getPosition(id: MarketId) {
    const b = this.book(id);
    const pos = b.position;
    if (!pos) return null;
    if (pos.entryPrice <= 0) return { ...pos, upnl: 0, equity: pos.margin, markPrice: b.markPrice };
    const raw = (pos.size * (b.markPrice - pos.entryPrice)) / pos.entryPrice;
    const upnl = pos.side === "long" ? raw : -raw;
    return { ...pos, upnl, equity: pos.margin + upnl, markPrice: b.markPrice };
  }

  setMarkPrice(id: MarketId, price: number) {
    assertFinitePositive(price, "mark price");
    const b = this.book(id);
    const old = b.markPrice;
    const diff = Math.abs(price - old) / old;
    if (old > 0 && diff > 0.5) {
      throw new Error("circuit breaker: mark move >50% rejected");
    }
    b.markPrice = price;
    return b.markPrice;
  }

  /** Force mark (lab) — still requires positive finite. */
  setMarkForced(id: MarketId, price: number) {
    assertFinitePositive(price, "mark price");
    this.book(id).markPrice = price;
    return price;
  }

  openPerp(input: { marketId: MarketId; side: PerpSide; margin: number; leverage: number }) {
    assertFinitePositive(input.margin, "margin");
    if (input.margin > MAX_MARGIN) throw new Error(`margin exceeds ${MAX_MARGIN}`);
    if (!Number.isInteger(input.leverage) || input.leverage < 1 || input.leverage > MAX_LEVERAGE) {
      throw new Error(`leverage must be integer 1..${MAX_LEVERAGE}`);
    }
    const b = this.book(input.marketId);
    if (b.position) throw new Error("position already open — close first");
    if (b.markPrice <= 0) throw new Error("invalid mark");

    const size = input.margin * input.leverage;
    const oi = input.side === "long" ? b.longOi : b.shortOi;
    if (oi + size > MAX_OPEN_INTEREST) throw new Error("max open interest");

    const fee = feeOn(size);
    b.protocolFees += fee;
    b.position = {
      side: input.side,
      margin: input.margin,
      leverage: input.leverage,
      size,
      entryPrice: b.markPrice,
      openedAt: Date.now(),
    };
    if (input.side === "long") b.longOi += size;
    else b.shortOi += size;

    return {
      mode: "demo" as const,
      fee,
      markPrice: b.markPrice,
      position: { ...b.position },
      protocolFees: b.protocolFees,
    };
  }

  closePerp(marketId: MarketId) {
    const b = this.book(marketId);
    const pos = b.position;
    if (!pos) throw new Error("no open position");
    if (pos.entryPrice <= 0) throw new Error("corrupt entry price");

    const raw = (pos.size * (b.markPrice - pos.entryPrice)) / pos.entryPrice;
    const pnl = pos.side === "long" ? raw : -raw;
    const fee = feeOn(pos.size);
    b.protocolFees += fee;

    if (pos.side === "long") b.longOi = Math.max(0, b.longOi - pos.size);
    else b.shortOi = Math.max(0, b.shortOi - pos.size);

    if (pnl > 0) b.lpLiquidity -= Math.min(b.lpLiquidity, pnl);
    else b.lpLiquidity += -pnl;

    const payout = Math.max(0, pos.margin + pnl - fee);
    b.position = null;

    return {
      mode: "demo" as const,
      pnl,
      fee,
      payout,
      markPrice: b.markPrice,
      protocolFees: b.protocolFees,
    };
  }

  executeSpot(input: { marketId: MarketId; side: SpotSide; amount: number }) {
    assertFinitePositive(input.amount, "amount");
    if (input.amount > MAX_MARGIN) throw new Error("amount too large");
    const b = this.book(input.marketId);
    const notional = input.amount * b.markPrice;
    const fee = feeOn(notional);
    this.spotFees += fee;
    const slip = input.side === "buy" ? 1.0005 : 0.9995;
    const executionPrice = b.markPrice * slip;
    return {
      mode: "demo" as const,
      side: input.side,
      amount: input.amount,
      executionPrice,
      notional: input.amount * executionPrice,
      fee,
      spotFees: this.spotFees,
    };
  }

  writeOption(input: {
    kind: OptionKind;
    strike: number;
    expiry: number;
    premium: number;
    margin: number;
    size: number;
    seller: string;
  }) {
    assertFinitePositive(input.strike, "strike");
    assertFinitePositive(input.premium, "premium");
    assertFinitePositive(input.margin, "margin");
    assertFinitePositive(input.size, "size");
    if (input.premium > MAX_OPTION_PREMIUM) throw new Error("premium cap");
    if (input.size > MAX_OPTION_SIZE) throw new Error("size cap");
    const now = Math.floor(Date.now() / 1000);
    if (input.expiry <= now || input.expiry > now + 365 * 24 * 3600) {
      throw new Error("expiry out of range (now..1y)");
    }
    if (!input.seller.trim()) throw new Error("seller required");
    const id = `opt_${this.optSeq++}`;
    const listing: OptionListing = { id, ...input, seller: input.seller.trim() };
    this.options.set(id, listing);
    return { mode: "demo" as const, id, listing };
  }

  buyOption(id: string, buyer: string) {
    const o = this.options.get(id);
    if (!o || o.buyer) throw new Error("unavailable");
    if (!buyer.trim()) throw new Error("buyer required");
    if (o.seller === buyer.trim()) throw new Error("self-trade");
    if (Math.floor(Date.now() / 1000) >= o.expiry) throw new Error("expired");
    const fee = feeOn(o.premium, OPTION_FEE_BPS);
    o.buyer = buyer.trim();
    return { mode: "demo" as const, id, fee, premium: o.premium };
  }

  listOptions() {
    return [...this.options.values()].filter((o) => !o.buyer);
  }

  sparkline(marketId: MarketId, points = 24): number[] {
    const base = this.book(marketId).markPrice;
    return Array.from({ length: points }, (_, i) =>
      Math.max(base * 0.2, base * (1 + Math.sin(i / 3) * 0.06 + ((i * 17) % 7) * 0.003)),
    );
  }
}

/** Singleton demo engine for the browser session. */
export const tradeEngine = new TradeEngine();
