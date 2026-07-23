/** Browser helpers for ARL lab ledger account + API. */

export const ARL_ACCOUNT_STORAGE_KEY = "auros_arl_account_id";
export const ARL_LEDGER_EVENT = "auros-arl-ledger";

export function getOrCreateArlAccountId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.localStorage.getItem(ARL_ACCOUNT_STORAGE_KEY);
    if (existing && /^[a-zA-Z0-9_-]+$/.test(existing)) return existing;
    const id = `lab_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
    window.localStorage.setItem(ARL_ACCOUNT_STORAGE_KEY, id);
    return id;
  } catch {
    return `lab_ephemeral_${Date.now().toString(36)}`;
  }
}

/** Notify shared Lab wallet UIs to refresh balances. */
export function notifyArlLedgerUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ARL_LEDGER_EVENT));
}

export type ArlClientSnapshot = {
  mode: "lab";
  backend: "upstash" | "file" | "memory";
  account: {
    id: string;
    balances: { akWh: number; WATT: number; H2O: number; FLOP: number; EUR: number };
    mintedAkWhTotal: number;
    wattOutstanding: number;
    updatedAt: string;
  };
  vaultAkWh: number;
  wattSupply: number;
  protocolFeesEur: number;
  recent: Array<{ id: string; at: string; kind: string; detail: string }>;
  disclaimer: string;
  fill?: { executionPrice: number; fee: number; notional: number };
};

async function parseJson(res: Response): Promise<ArlClientSnapshot> {
  const text = await res.text();
  let body: { error?: string; message?: string } & Partial<ArlClientSnapshot> = {};
  try {
    body = text ? (JSON.parse(text) as typeof body) : {};
  } catch {
    throw new Error(
      res.ok
        ? "ARL API returned non-JSON"
        : `ARL API ${res.status} — service unavailable`,
    );
  }
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error(body.message || body.error || "Rate limited — retry in a minute");
    }
    throw new Error(body.message || body.error || `ARL API ${res.status}`);
  }
  return body as ArlClientSnapshot;
}

export async function fetchArlAccount(accountId: string): Promise<ArlClientSnapshot> {
  const res = await fetch(`/api/arl/account?account=${encodeURIComponent(accountId)}`, {
    cache: "no-store",
  });
  return parseJson(res);
}

export async function postArlMint(input: {
  accountId: string;
  amount: number;
  deviceId?: string;
}): Promise<ArlClientSnapshot> {
  const res = await fetch("/api/arl/mint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const snap = await parseJson(res);
  notifyArlLedgerUpdated();
  return snap;
}

export async function postArlWatt(input: {
  accountId: string;
  amount: number;
  action: "mint" | "redeem";
}): Promise<ArlClientSnapshot> {
  const res = await fetch("/api/arl/watt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const snap = await parseJson(res);
  notifyArlLedgerUpdated();
  return snap;
}

export async function postArlSpot(input: {
  accountId: string;
  marketId: string;
  side: "buy" | "sell";
  amount: number;
  markOverride?: number;
}): Promise<ArlClientSnapshot> {
  const res = await fetch("/api/arl/spot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const snap = await parseJson(res);
  notifyArlLedgerUpdated();
  return snap;
}
