/**
 * AUROS Wallet Attribution v1 — persisted entity links + behavioral flags.
 * Indicative — not regulated AML/KYT.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export type WalletEntityRole = "issuer" | "investor" | "operator" | "unknown";

export type WalletAttributionRecord = {
  id: string;
  wallet: string;
  entityLabel: string;
  beneficialOwner?: string;
  role: WalletEntityRole;
  confidence: number;
  createdAt: string;
  updatedAt: string;
};

export type BehavioralRiskFlag =
  | "unattributed_wallet"
  | "self_dealing_suspected"
  | "circular_funding_suspected"
  | "reassignment_risk"
  | "low_confidence_link"
  | "multi_entity_conflict";

export type WalletEntityLink = {
  wallet: string;
  entityLabel?: string;
  role?: WalletEntityRole;
  confidence: number;
  beneficialOwner?: string;
  attributionId?: string;
};

export type WalletRiskSnapshot = {
  wallet: string;
  score: number;
  band: "low" | "medium" | "high";
  flags: BehavioralRiskFlag[];
  links: WalletEntityLink[];
  summary: string;
  disclaimer: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "toll-wallet-attributions.json");
const CAP = 2_000;
const DISCLAIMER =
  "Indicative only — not a regulated AML/KYT decision. Integrator remains accountable. HITL.";

function normalizeWallet(raw: string): string {
  return raw.trim();
}

function load(): WalletAttributionRecord[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(
      readFileSync(FILE, "utf8")
    ) as WalletAttributionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: WalletAttributionRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-CAP), null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function listWalletAttributions(wallet?: string): WalletAttributionRecord[] {
  const w = wallet ? normalizeWallet(wallet) : "";
  return load()
    .filter((r) => (!w ? true : r.wallet === w))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function upsertWalletAttribution(input: {
  wallet: string;
  entityLabel: string;
  beneficialOwner?: string;
  role?: WalletEntityRole;
  confidence?: number;
}): WalletAttributionRecord | { error: string } {
  const wallet = normalizeWallet(input.wallet);
  const entityLabel = input.entityLabel.trim().slice(0, 160);
  if (wallet.length < 8 || !entityLabel) {
    return { error: "invalid_input" };
  }
  const now = new Date().toISOString();
  const all = load();
  const existing = all.find(
    (r) =>
      r.wallet === wallet &&
      r.entityLabel.toLowerCase() === entityLabel.toLowerCase()
  );
  if (existing) {
    existing.beneficialOwner =
      input.beneficialOwner?.trim().slice(0, 160) || existing.beneficialOwner;
    existing.role = input.role ?? existing.role;
    existing.confidence = Math.max(
      0,
      Math.min(100, input.confidence ?? existing.confidence)
    );
    existing.updatedAt = now;
    save(all);
    return existing;
  }
  const row: WalletAttributionRecord = {
    id: `wa_${randomBytes(8).toString("hex")}`,
    wallet,
    entityLabel,
    beneficialOwner: input.beneficialOwner?.trim().slice(0, 160),
    role: input.role ?? "unknown",
    confidence: Math.max(0, Math.min(100, input.confidence ?? 65)),
    createdAt: now,
    updatedAt: now,
  };
  all.push(row);
  save(all);
  return row;
}

export function assessWalletBehavioralRisk(input: {
  wallet: string;
  entityLabel?: string;
  role?: WalletEntityRole;
  /** Counterparty wallet for transfer screening */
  counterpartyWallet?: string;
}): WalletRiskSnapshot {
  const wallet = normalizeWallet(input.wallet);
  const flags: BehavioralRiskFlag[] = [];
  const stored = listWalletAttributions(wallet);
  const links: WalletEntityLink[] = stored.map((r) => ({
    wallet: r.wallet,
    entityLabel: r.entityLabel,
    role: r.role,
    confidence: r.confidence,
    beneficialOwner: r.beneficialOwner,
    attributionId: r.id,
  }));

  let score = 40;

  if (!wallet || wallet.length < 8) {
    flags.push("unattributed_wallet");
    score = 15;
  } else if (links.length === 0 && !input.entityLabel) {
    flags.push("unattributed_wallet");
    score = 25;
  } else if (links.length === 0 && input.entityLabel) {
    links.push({
      wallet,
      entityLabel: input.entityLabel,
      role: input.role ?? "unknown",
      confidence: 55,
    });
    score = 55;
  } else {
    const best = Math.max(...links.map((l) => l.confidence));
    score = Math.min(85, 40 + Math.round(best * 0.4));
  }

  const distinctEntities = new Set(
    links.map((l) => (l.entityLabel ?? "").toLowerCase()).filter(Boolean)
  );
  if (distinctEntities.size > 1) {
    flags.push("multi_entity_conflict");
    flags.push("reassignment_risk");
    score = Math.min(score, 30);
  }

  if (links.some((l) => (l.confidence ?? 0) < 60)) {
    flags.push("low_confidence_link");
  }

  const cp = input.counterpartyWallet
    ? normalizeWallet(input.counterpartyWallet)
    : "";
  if (cp && cp.length >= 8) {
    const cpLinks = listWalletAttributions(cp);
    const aOwners = new Set(
      [
        ...links.map((l) => l.beneficialOwner ?? l.entityLabel ?? ""),
        input.entityLabel ?? "",
      ]
        .map((s) => s.toLowerCase())
        .filter(Boolean)
    );
    const bOwners = new Set(
      cpLinks
        .map((l) => l.beneficialOwner ?? l.entityLabel)
        .map((s) => s.toLowerCase())
        .filter(Boolean)
    );
    for (const o of aOwners) {
      if (bOwners.has(o)) {
        flags.push("self_dealing_suspected");
        score = Math.min(score, 28);
        break;
      }
    }
    if (wallet === cp) {
      flags.push("circular_funding_suspected");
      score = Math.min(score, 20);
    }
  }

  const band: WalletRiskSnapshot["band"] =
    score >= 60 ? "low" : score >= 35 ? "medium" : "high";

  return {
    wallet,
    score,
    band,
    flags: [...new Set(flags)],
    links,
    summary:
      band === "high"
        ? "Elevated behavioral / attribution risk — HITL review before institutional use."
        : links.length
          ? "Persisted attribution available — indicative only."
          : "Indicative wallet attribution — not AML certification.",
    disclaimer: DISCLAIMER,
  };
}
