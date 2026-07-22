/**
 * Phase 3 mock engines for agent-api (options, lending, insurance, compute).
 */
import { randomBytes } from "node:crypto";
import { keccak256 } from "ethers";

const tx = () => keccak256(randomBytes(32));

// --- Options ---
type Option = {
  id: string;
  side: "call" | "put";
  strike: number;
  expiry: number;
  premium: number;
  margin: number;
  size: number;
  seller: string;
  buyer?: string;
  settled?: boolean;
};

const options = new Map<string, Option>();
let optSeq = 1;

export function writeOption(input: Omit<Option, "id">) {
  const id = `opt_${optSeq++}`;
  options.set(id, { ...input, id });
  return { txHash: tx(), id, mode: "mock" as const };
}

export function buyOption(id: string, buyer: string) {
  const o = options.get(id);
  if (!o || o.buyer) throw new Error("unavailable");
  if (o.seller === buyer) throw new Error("self-trade");
  const fee = o.premium * 0.002;
  o.buyer = buyer;
  return { txHash: tx(), id, fee, premium: o.premium, mode: "mock" as const };
}

export function listOptions() {
  return [...options.values()];
}

// --- Lending ---
type LendingAccount = { resourceDeposit: number; quoteDeposit: number; quoteDebt: number; resourceDebt: number };
const lending = new Map<string, LendingAccount>();
let quotePool = 100_000;
let protocolInterestFees = 0;

function lendAcc(id: string): LendingAccount {
  let a = lending.get(id);
  if (!a) {
    a = { resourceDeposit: 0, quoteDeposit: 0, quoteDebt: 0, resourceDebt: 0 };
    lending.set(id, a);
  }
  return a;
}

export function lendDeposit(agentId: string, side: "resource" | "quote", amount: number) {
  const a = lendAcc(agentId);
  if (side === "resource") a.resourceDeposit += amount;
  else {
    a.quoteDeposit += amount;
    quotePool += amount;
  }
  return { txHash: tx(), ...a, quotePool, mode: "mock" as const };
}

export function lendBorrowQuote(agentId: string, amount: number) {
  const a = lendAcc(agentId);
  if (a.resourceDeposit / 2 < a.quoteDebt + amount) throw new Error("LTV");
  if (quotePool < amount) throw new Error("liquidity");
  a.quoteDebt += amount;
  quotePool -= amount;
  return { txHash: tx(), borrowed: amount, debt: a.quoteDebt, mode: "mock" as const };
}

export function lendRepayQuote(agentId: string, principal: number) {
  const a = lendAcc(agentId);
  if (a.quoteDebt < principal) throw new Error("debt");
  const interest = principal * 0.02;
  const protocolFee = interest * 0.1;
  protocolInterestFees += protocolFee;
  a.quoteDebt -= principal;
  quotePool += principal + (interest - protocolFee);
  return { txHash: tx(), principal, interest, protocolFee, protocolInterestFees, mode: "mock" as const };
}

export function lendingStatus() {
  return { quotePool, protocolInterestFees, accounts: lending.size };
}

// --- Insurance ---
type Policy = {
  id: string;
  insured: string;
  threshold: number;
  coverage: number;
  premium: number;
  reported: number;
  periodEnd: number;
  claimed?: boolean;
};
const policies = new Map<string, Policy>();
let insPool = 50_000;
let insCommission = 0;
let polSeq = 1;

export function buyInsurance(input: {
  insured: string;
  threshold: number;
  coverage: number;
  premium: number;
  durationSec: number;
}) {
  if (insPool < input.coverage) throw new Error("pool");
  const commission = input.premium * 0.15;
  insCommission += commission;
  insPool += input.premium - commission;
  const id = `pol_${polSeq++}`;
  policies.set(id, {
    id,
    insured: input.insured,
    threshold: input.threshold,
    coverage: input.coverage,
    premium: input.premium,
    reported: 0,
    periodEnd: Date.now() + input.durationSec * 1000,
  });
  return { txHash: tx(), id, commission, mode: "mock" as const };
}

export function reportInsuranceProduction(id: string, production: number) {
  const p = policies.get(id);
  if (!p) throw new Error("unknown");
  p.reported = production;
  return { id, production };
}

export function settleInsurance(id: string) {
  const p = policies.get(id);
  if (!p || p.claimed) throw new Error("closed");
  p.claimed = true;
  let payout = 0;
  if (p.reported < p.threshold) {
    payout = p.coverage;
    insPool -= payout;
  }
  return { txHash: tx(), id, payout, insPool, insCommission, mode: "mock" as const };
}

export function insuranceStatus() {
  return { insPool, insCommission, policies: policies.size };
}

// --- Compute ---
const flopBalances = new Map<string, number>();
let flopMinted = 0;

export function mintFlop(agentId: string, amount: number, jobId: string) {
  flopBalances.set(agentId, (flopBalances.get(agentId) ?? 0) + amount);
  flopMinted += amount;
  return { txHash: tx(), agentId, amount, jobId, balance: flopBalances.get(agentId), mode: "mock" as const };
}

export function flopBalance(agentId: string) {
  return flopBalances.get(agentId) ?? 0;
}

export function computeStats() {
  return { flopMinted, holders: flopBalances.size };
}
