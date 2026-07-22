/**
 * In-memory EnergyFutures simulation for agent-api mock mode.
 * Mirrors protocol/contracts/EnergyFutures.sol economics at a high level.
 */
import { randomBytes } from "node:crypto";
import { keccak256 } from "ethers";

export type PerpSide = "long" | "short";

export type PerpPosition = {
  agentId: string;
  side: PerpSide;
  margin: number;
  leverage: number;
  size: number;
  entryPrice: number;
  openedAt: number;
};

export type PerpMarketState = {
  indexId: string;
  markPrice: number;
  longOi: number;
  shortOi: number;
  lpLiquidity: number;
  fundingIndex: number;
  lastFundingAt: number;
  protocolFees: number;
  positions: Map<string, PerpPosition>;
};

const FEE_BPS = 10;
const FUNDING_INTERVAL_MS = 8 * 60 * 60 * 1000;
export const MAX_LEVERAGE = 10;
export const MAX_MARGIN = 1_000_000;
export const MAX_OPEN_INTEREST = 50_000_000;
const MAX_MARK_JUMP = 0.5; // 50% circuit breaker

const markets = new Map<string, PerpMarketState>();

function assertPositiveFinite(n: number, label: string) {
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} must be positive`);
}

function market(indexId: string): PerpMarketState {
  let m = markets.get(indexId);
  if (!m) {
    m = {
      indexId,
      markPrice: indexId.includes("flop") ? 1.25 : 0.12,
      longOi: 0,
      shortOi: 0,
      lpLiquidity: 500_000,
      fundingIndex: 0,
      lastFundingAt: Date.now(),
      protocolFees: 0,
      positions: new Map(),
    };
    markets.set(indexId, m);
  }
  return m;
}

function feeOn(size: number): number {
  return (size * FEE_BPS) / 10_000;
}

export function setMarkPrice(indexId: string, price: number) {
  assertPositiveFinite(price, "price");
  const m = market(indexId);
  const old = m.markPrice;
  if (old > 0) {
    const jump = Math.abs(price - old) / old;
    if (jump > MAX_MARK_JUMP) throw new Error("circuit breaker");
  }
  m.markPrice = price;
  return { indexId, markPrice: price };
}

export function setMarkPriceForced(indexId: string, price: number) {
  assertPositiveFinite(price, "price");
  const m = market(indexId);
  m.markPrice = price;
  return { indexId, markPrice: price };
}

export function addLiquidity(indexId: string, amount: number) {
  assertPositiveFinite(amount, "amount");
  if (amount > MAX_MARGIN * 10) throw new Error("amount too large");
  const m = market(indexId);
  m.lpLiquidity += amount;
  return {
    txHash: keccak256(randomBytes(32)),
    indexId,
    amount,
    lpLiquidity: m.lpLiquidity,
  };
}

export function openPerp(input: {
  indexId: string;
  agentId: string;
  side: PerpSide;
  margin: number;
  leverage: number;
}) {
  assertPositiveFinite(input.margin, "margin");
  if (input.margin > MAX_MARGIN) throw new Error("margin cap");
  if (!Number.isInteger(input.leverage) || input.leverage < 1 || input.leverage > MAX_LEVERAGE) {
    throw new Error("leverage must be 1..10");
  }
  if (!input.agentId?.trim()) throw new Error("agentId required");
  if (input.side !== "long" && input.side !== "short") throw new Error("bad side");

  const m = market(input.indexId);
  if (m.markPrice <= 0) throw new Error("invalid mark");
  if (m.positions.has(input.agentId)) {
    throw new Error("position already open");
  }
  settleFunding(input.indexId);
  const size = input.margin * input.leverage;
  const oi = input.side === "long" ? m.longOi : m.shortOi;
  if (oi + size > MAX_OPEN_INTEREST) throw new Error("max open interest");

  const fee = feeOn(size);
  m.protocolFees += fee;
  const pos: PerpPosition = {
    agentId: input.agentId,
    side: input.side,
    margin: input.margin,
    leverage: input.leverage,
    size,
    entryPrice: m.markPrice,
    openedAt: Date.now(),
  };
  m.positions.set(input.agentId, pos);
  if (input.side === "long") m.longOi += size;
  else m.shortOi += size;

  return {
    txHash: keccak256(randomBytes(32)),
    mode: "mock" as const,
    position: pos,
    fee,
    markPrice: m.markPrice,
    protocolFees: m.protocolFees,
  };
}

export function closePerp(indexId: string, agentId: string) {
  const m = market(indexId);
  settleFunding(indexId);
  const pos = m.positions.get(agentId);
  if (!pos) throw new Error("no position");
  if (pos.entryPrice <= 0) throw new Error("corrupt entry");

  const priceDiff = m.markPrice - pos.entryPrice;
  const raw = (pos.size * priceDiff) / pos.entryPrice;
  const pnl = pos.side === "long" ? raw : -raw;
  const fee = feeOn(pos.size);
  m.protocolFees += fee;

  if (pos.side === "long") m.longOi = Math.max(0, m.longOi - pos.size);
  else m.shortOi = Math.max(0, m.shortOi - pos.size);

  if (pnl > 0) m.lpLiquidity -= Math.min(m.lpLiquidity, pnl);
  else m.lpLiquidity += -pnl;

  const payout = Math.max(0, pos.margin + pnl - fee);
  m.positions.delete(agentId);

  return {
    txHash: keccak256(randomBytes(32)),
    mode: "mock" as const,
    pnl,
    fee,
    payout,
    markPrice: m.markPrice,
    protocolFees: m.protocolFees,
  };
}

export function settleFunding(indexId: string) {
  const m = market(indexId);
  const elapsed = Date.now() - m.lastFundingAt;
  if (elapsed < FUNDING_INTERVAL_MS) {
    return { settled: false, fundingIndex: m.fundingIndex };
  }
  const periods = Math.floor(elapsed / FUNDING_INTERVAL_MS);
  m.lastFundingAt += periods * FUNDING_INTERVAL_MS;
  const total = m.longOi + m.shortOi;
  if (total > 0) {
    const skew = (m.longOi - m.shortOi) / total;
    m.fundingIndex += skew * 0.001 * periods;
  }
  return { settled: true, fundingIndex: m.fundingIndex, periods };
}

export function getPerpMarket(indexId: string) {
  const m = market(indexId);
  return {
    indexId: m.indexId,
    markPrice: m.markPrice,
    longOi: m.longOi,
    shortOi: m.shortOi,
    lpLiquidity: m.lpLiquidity,
    fundingIndex: m.fundingIndex,
    protocolFees: m.protocolFees,
    openPositions: m.positions.size,
  };
}

export function getPerpPosition(indexId: string, agentId: string) {
  const m = market(indexId);
  const pos = m.positions.get(agentId);
  if (!pos) return null;
  if (pos.entryPrice <= 0) {
    return { ...pos, upnl: 0, equity: pos.margin, markPrice: m.markPrice };
  }
  const priceDiff = m.markPrice - pos.entryPrice;
  const raw = (pos.size * priceDiff) / pos.entryPrice;
  const upnl = pos.side === "long" ? raw : -raw;
  return { ...pos, upnl, equity: pos.margin + upnl, markPrice: m.markPrice };
}
