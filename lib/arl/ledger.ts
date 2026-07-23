/**
 * ARL lab ledger — shared mint / WATT / spot settlement for producer, trade, lab.
 * Persistence order: Upstash → .data/arl-ledger.json → process memory.
 * Mirrors WattCoin 1:1 collateral: wrap akWh → WATT, redeem WATT → akWh.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { isUpstashConfigured, upstashCommand } from "@/lib/upstash";
import { SPOT_MARKETS, type MarketId, type SpotSide } from "@/lib/arl/trade-engine";

export const ARL_LEDGER_KEY = "auros:arl:ledger:v1";
export const MAX_MINT_PER_TX = 50_000;
export const MAX_MINT_PER_ACCOUNT = 500_000;
export const MAX_SPOT_AMOUNT = 100_000;
export const SPOT_FEE_BPS = 10;
export const SEED_EUR = 10_000;

const DATA_DIR = join(process.cwd(), ".data");
const LEDGER_FILE = join(DATA_DIR, "arl-ledger.json");

export type ArlBackend = "upstash" | "file" | "memory";

export type ArlAsset = "akWh" | "WATT" | "H2O" | "FLOP" | "EUR";

export type ArlBalances = Record<ArlAsset, number>;

export type ArlEvent = {
  id: string;
  at: string;
  accountId: string;
  kind: "mint_akwh" | "mint_watt" | "redeem_watt" | "spot" | "seed";
  detail: string;
  amounts?: Partial<ArlBalances>;
};

export type ArlAccount = {
  id: string;
  balances: ArlBalances;
  mintedAkWhTotal: number;
  wattOutstanding: number;
  updatedAt: string;
};

export type ArlLedgerState = {
  version: 1;
  accounts: Record<string, ArlAccount>;
  /** akWh locked as WATT collateral (protocol vault). */
  vaultAkWh: number;
  wattSupply: number;
  protocolFeesEur: number;
  events: ArlEvent[];
};

type GlobalLedger = {
  state: ArlLedgerState;
  chain: Promise<unknown>;
  hydrated: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __aurosArlLedger: GlobalLedger | undefined;
}

function emptyBalances(): ArlBalances {
  return { akWh: 0, WATT: 0, H2O: 0, FLOP: 0, EUR: 0 };
}

function freshState(): ArlLedgerState {
  return {
    version: 1,
    accounts: {},
    vaultAkWh: 0,
    wattSupply: 0,
    protocolFeesEur: 0,
    events: [],
  };
}

function memoryStore(): GlobalLedger {
  if (!globalThis.__aurosArlLedger) {
    globalThis.__aurosArlLedger = {
      state: freshState(),
      chain: Promise.resolve(),
      hydrated: false,
    };
  }
  return globalThis.__aurosArlLedger;
}

function parseLedgerState(raw: string): ArlLedgerState | null {
  try {
    const parsed = JSON.parse(raw) as ArlLedgerState;
    if (parsed?.version === 1 && parsed.accounts) {
      return parsed;
    }
  } catch {
    /* fall through */
  }
  return null;
}

function readFileState(): ArlLedgerState | null {
  if (!existsSync(LEDGER_FILE)) return null;
  try {
    const raw = readFileSync(LEDGER_FILE, "utf8");
    return parseLedgerState(raw);
  } catch {
    return null;
  }
}

function saveFileState(state: ArlLedgerState): boolean {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(LEDGER_FILE, JSON.stringify(state), "utf8");
    return true;
  } catch {
    return false;
  }
}

function assertPositive(n: number, label: string) {
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} must be a positive number`);
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function nowIso() {
  return new Date().toISOString();
}

function eventId() {
  return `ev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function pushEvent(state: ArlLedgerState, ev: Omit<ArlEvent, "id" | "at">) {
  state.events.unshift({ id: eventId(), at: nowIso(), ...ev });
  state.events = state.events.slice(0, 80);
}

function ensureAccount(state: ArlLedgerState, accountId: string): ArlAccount {
  const id = accountId.trim().slice(0, 64);
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error("invalid account id");
  }
  let acc = state.accounts[id];
  if (!acc) {
    acc = {
      id,
      balances: { ...emptyBalances(), EUR: SEED_EUR },
      mintedAkWhTotal: 0,
      wattOutstanding: 0,
      updatedAt: nowIso(),
    };
    state.accounts[id] = acc;
    pushEvent(state, {
      accountId: id,
      kind: "seed",
      detail: `Seeded ${SEED_EUR} EUR lab cash`,
      amounts: { EUR: SEED_EUR },
    });
  }
  return acc;
}

async function loadState(): Promise<{ state: ArlLedgerState; backend: ArlBackend }> {
  if (isUpstashConfigured()) {
    const res = await upstashCommand(["GET", ARL_LEDGER_KEY]);
    if (res?.result != null && typeof res.result === "string" && res.result.length > 0) {
      const parsed = parseLedgerState(res.result);
      if (parsed) {
        return { state: parsed, backend: "upstash" };
      }
    }
    return { state: freshState(), backend: "upstash" };
  }

  const store = memoryStore();
  if (!store.hydrated) {
    const fromFile = readFileState();
    if (fromFile) {
      store.state = structuredClone(fromFile);
    }
    store.hydrated = true;
  }

  const fileExists = existsSync(LEDGER_FILE);
  const hasAccounts = Object.keys(store.state.accounts).length > 0;
  const backend: ArlBackend = fileExists || hasAccounts ? "file" : "memory";
  return { state: structuredClone(store.state), backend };
}

async function saveState(state: ArlLedgerState, backend: ArlBackend): Promise<ArlBackend> {
  if (backend === "upstash" && isUpstashConfigured()) {
    const payload = JSON.stringify(state);
    const res = await upstashCommand(["SET", ARL_LEDGER_KEY, payload]);
    if (res != null) return "upstash";
  }
  memoryStore().state = structuredClone(state);
  if (saveFileState(state)) {
    return "file";
  }
  return "memory";
}

/** Serialize mutations so concurrent lab calls don't clobber memory state. */
export async function withArlLedger<T>(
  fn: (state: ArlLedgerState) => T | Promise<T>,
): Promise<{ result: T; backend: ArlBackend; state: ArlLedgerState }> {
  const store = memoryStore();
  const run = store.chain.then(async () => {
    const { state, backend } = await loadState();
    const result = await fn(state);
    const saved = await saveState(state, backend);
    return { result, backend: saved, state };
  });
  store.chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export type ArlPublicSnapshot = {
  mode: "lab";
  backend: ArlBackend;
  account: ArlAccount;
  vaultAkWh: number;
  wattSupply: number;
  protocolFeesEur: number;
  recent: ArlEvent[];
  disclaimer: string;
};

function snapshot(state: ArlLedgerState, accountId: string, backend: ArlBackend): ArlPublicSnapshot {
  const account = ensureAccount(state, accountId);
  return {
    mode: "lab",
    backend,
    account: structuredClone(account),
    vaultAkWh: state.vaultAkWh,
    wattSupply: state.wattSupply,
    protocolFeesEur: state.protocolFeesEur,
    recent: state.events.filter((e) => e.accountId === account.id).slice(0, 12),
    disclaimer:
      "ARL lab ledger — shared mint/WATT/spot. Not mainnet, not a public sale, HITL for real settlement.",
  };
}

export async function getArlAccount(accountId: string): Promise<ArlPublicSnapshot> {
  return withArlLedger((state) => {
    ensureAccount(state, accountId);
    return null;
  }).then(({ state, backend }) => snapshot(state, accountId, backend));
}

export async function mintAkWh(input: {
  accountId: string;
  amount: number;
  deviceId?: string;
}): Promise<ArlPublicSnapshot> {
  assertPositive(input.amount, "amount");
  if (input.amount > MAX_MINT_PER_TX) throw new Error(`mint exceeds ${MAX_MINT_PER_TX} per tx`);

  const { state, backend } = await withArlLedger((state) => {
    const acc = ensureAccount(state, input.accountId);
    if (acc.mintedAkWhTotal + input.amount > MAX_MINT_PER_ACCOUNT) {
      throw new Error(`account mint cap ${MAX_MINT_PER_ACCOUNT}`);
    }
    const amt = round6(input.amount);
    acc.balances.akWh = round6(acc.balances.akWh + amt);
    acc.mintedAkWhTotal = round6(acc.mintedAkWhTotal + amt);
    acc.updatedAt = nowIso();
    const device = input.deviceId?.trim() || "lab-meter";
    pushEvent(state, {
      accountId: acc.id,
      kind: "mint_akwh",
      detail: `Minted ${amt} akWh from ${device}`,
      amounts: { akWh: amt },
    });
  });
  return snapshot(state, input.accountId, backend);
}

export async function mintWatt(input: {
  accountId: string;
  amount: number;
}): Promise<ArlPublicSnapshot> {
  assertPositive(input.amount, "amount");
  const { state, backend } = await withArlLedger((state) => {
    const acc = ensureAccount(state, input.accountId);
    const amt = round6(input.amount);
    if (acc.balances.akWh < amt) throw new Error("insufficient akWh collateral");
    acc.balances.akWh = round6(acc.balances.akWh - amt);
    acc.balances.WATT = round6(acc.balances.WATT + amt);
    acc.wattOutstanding = round6(acc.wattOutstanding + amt);
    state.vaultAkWh = round6(state.vaultAkWh + amt);
    state.wattSupply = round6(state.wattSupply + amt);
    acc.updatedAt = nowIso();
    pushEvent(state, {
      accountId: acc.id,
      kind: "mint_watt",
      detail: `Wrapped ${amt} akWh → ${amt} WATT (1:1 vault)`,
      amounts: { akWh: -amt, WATT: amt },
    });
  });
  return snapshot(state, input.accountId, backend);
}

export async function redeemWatt(input: {
  accountId: string;
  amount: number;
}): Promise<ArlPublicSnapshot> {
  assertPositive(input.amount, "amount");
  const { state, backend } = await withArlLedger((state) => {
    const acc = ensureAccount(state, input.accountId);
    const amt = round6(input.amount);
    if (acc.balances.WATT < amt) throw new Error("insufficient WATT");
    if (state.vaultAkWh < amt) throw new Error("vault insolvent");
    acc.balances.WATT = round6(acc.balances.WATT - amt);
    acc.balances.akWh = round6(acc.balances.akWh + amt);
    acc.wattOutstanding = round6(Math.max(0, acc.wattOutstanding - amt));
    state.vaultAkWh = round6(state.vaultAkWh - amt);
    state.wattSupply = round6(Math.max(0, state.wattSupply - amt));
    acc.updatedAt = nowIso();
    pushEvent(state, {
      accountId: acc.id,
      kind: "redeem_watt",
      detail: `Redeemed ${amt} WATT → ${amt} akWh`,
      amounts: { WATT: -amt, akWh: amt },
    });
  });
  return snapshot(state, input.accountId, backend);
}

function resourceAsset(marketId: MarketId): ArlAsset {
  const row = SPOT_MARKETS.find((m) => m.id === marketId);
  if (!row) throw new Error("unknown market");
  if (row.resourceType === "water") return "H2O";
  if (row.resourceType === "compute") return "FLOP";
  return "akWh";
}

function markPrice(marketId: MarketId): number {
  return SPOT_MARKETS.find((m) => m.id === marketId)?.last ?? 0.12;
}

export async function settleSpot(input: {
  accountId: string;
  marketId: MarketId;
  side: SpotSide;
  amount: number;
  markOverride?: number;
}): Promise<ArlPublicSnapshot & { fill: { executionPrice: number; fee: number; notional: number } }> {
  assertPositive(input.amount, "amount");
  if (input.amount > MAX_SPOT_AMOUNT) throw new Error("amount too large");

  let fill = { executionPrice: 0, fee: 0, notional: 0 };

  const { state, backend } = await withArlLedger((state) => {
    const acc = ensureAccount(state, input.accountId);
    const asset = resourceAsset(input.marketId);
    const mark = input.markOverride ?? markPrice(input.marketId);
    assertPositive(mark, "mark");
    const slip = input.side === "buy" ? 1.0005 : 0.9995;
    const executionPrice = round6(mark * slip);
    const notional = round6(input.amount * executionPrice);
    const fee = round6((notional * SPOT_FEE_BPS) / 10_000);
    const amt = round6(input.amount);

    if (input.side === "buy") {
      const cost = round6(notional + fee);
      if (acc.balances.EUR < cost) throw new Error("insufficient EUR");
      acc.balances.EUR = round6(acc.balances.EUR - cost);
      acc.balances[asset] = round6(acc.balances[asset] + amt);
    } else {
      if (acc.balances[asset] < amt) throw new Error(`insufficient ${asset}`);
      const credit = round6(notional - fee);
      if (credit < 0) throw new Error("fee exceeds notional");
      acc.balances[asset] = round6(acc.balances[asset] - amt);
      acc.balances.EUR = round6(acc.balances.EUR + credit);
    }

    state.protocolFeesEur = round6(state.protocolFeesEur + fee);
    acc.updatedAt = nowIso();
    fill = { executionPrice, fee, notional };
    pushEvent(state, {
      accountId: acc.id,
      kind: "spot",
      detail: `Spot ${input.side} ${amt} ${asset} @ ${executionPrice} (fee ${fee} EUR)`,
      amounts:
        input.side === "buy"
          ? { [asset]: amt, EUR: -(notional + fee) }
          : { [asset]: -amt, EUR: notional - fee },
    });
  });

  return { ...snapshot(state, input.accountId, backend), fill };
}

/** Test helper — wipe memory ledger and local file (no-op for Upstash). */
export function resetArlLedgerMemory() {
  const state = freshState();
  globalThis.__aurosArlLedger = { state, chain: Promise.resolve(), hydrated: true };
  saveFileState(state);
}
