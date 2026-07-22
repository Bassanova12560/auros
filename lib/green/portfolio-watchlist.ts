/**
 * Portfolio watchlist storage — local file + optional Supabase.
 * Server-only.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

import type { Locale } from "@/lib/i18n";

export type PortfolioWatchlist = {
  id: string;
  email: string;
  /** Empty = watch all DNA in portfolio snapshot */
  assetDnaIds: string[];
  locale: Locale;
  active: boolean;
  lastDigestAt?: string;
  lastDigestFingerprint?: string;
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "portfolio-watchlists.json");

function load(): PortfolioWatchlist[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as PortfolioWatchlist[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: PortfolioWatchlist[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-2_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalizeLocale(raw?: string): Locale {
  if (raw === "en" || raw === "es" || raw === "ar" || raw === "zh") return raw;
  return "fr";
}

export async function upsertPortfolioWatchlist(input: {
  email: string;
  assetDnaIds?: string[];
  locale?: string;
}): Promise<PortfolioWatchlist> {
  const email = input.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const assetDnaIds = (input.assetDnaIds ?? [])
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 100);
  const locale = normalizeLocale(input.locale);

  const all = load();
  const idx = all.findIndex((w) => w.email === email);
  let row: PortfolioWatchlist;
  if (idx >= 0) {
    row = {
      ...all[idx]!,
      assetDnaIds,
      locale,
      active: true,
      updatedAt: now,
    };
    all[idx] = row;
  } else {
    row = {
      id: `pw_${randomBytes(8).toString("hex")}`,
      email,
      assetDnaIds,
      locale,
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    all.push(row);
  }
  save(all);

  const supabase = getAdminClient();
  if (supabase) {
    await supabase.from("green_portfolio_watchlists").upsert(
      {
        email,
        asset_dna_ids: assetDnaIds,
        locale,
        active: true,
        updated_at: now,
      },
      { onConflict: "email" }
    );
  }

  return row;
}

export async function listActivePortfolioWatchlists(): Promise<
  PortfolioWatchlist[]
> {
  const local = load().filter((w) => w.active);
  const supabase = getAdminClient();
  if (!supabase) return local;

  const { data, error } = await supabase
    .from("green_portfolio_watchlists")
    .select("*")
    .eq("active", true)
    .limit(500);

  if (error || !data?.length) return local;

  const remote: PortfolioWatchlist[] = data.map((row) => ({
    id: String(row.id),
    email: String(row.email).toLowerCase(),
    assetDnaIds: Array.isArray(row.asset_dna_ids)
      ? (row.asset_dna_ids as string[])
      : [],
    locale: normalizeLocale(String(row.locale ?? "fr")),
    active: Boolean(row.active),
    lastDigestAt: row.last_digest_at
      ? String(row.last_digest_at)
      : undefined,
    lastDigestFingerprint: row.last_digest_fingerprint
      ? String(row.last_digest_fingerprint)
      : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }));

  const byEmail = new Map<string, PortfolioWatchlist>();
  for (const w of [...local, ...remote]) byEmail.set(w.email, w);
  return [...byEmail.values()];
}

export async function markWatchlistDigestSent(input: {
  email: string;
  fingerprint: string;
}): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const all = load();
  const idx = all.findIndex((w) => w.email === email);
  if (idx >= 0) {
    all[idx] = {
      ...all[idx]!,
      lastDigestAt: now,
      lastDigestFingerprint: input.fingerprint,
      updatedAt: now,
    };
    save(all);
  }

  const supabase = getAdminClient();
  if (!supabase) return;
  await supabase
    .from("green_portfolio_watchlists")
    .update({
      last_digest_at: now,
      last_digest_fingerprint: input.fingerprint,
      updated_at: now,
    })
    .eq("email", email);
}

export function fingerprintAlerts(alertIds: string[]): string {
  return [...alertIds].sort().join("|").slice(0, 500);
}
