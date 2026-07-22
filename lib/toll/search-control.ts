/**
 * AUROS Search Control Plane v0 — audience-aware ranking + indicative ACL + audit.
 * Not enterprise IAM. HITL. Monetizes sensitive search via search credits.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import {
  searchAurosAssets,
  type TollSearchHit,
  type TollSearchResult,
} from "./search";
export type SearchAudience =
  | "bank"
  | "ai"
  | "audit"
  | "trading"
  | "regulator";
export type SearchVisibility = "public" | "private" | "partial";
/** Indicative ACL ladder — not enterprise IAM. */
export type SearchPermissionLevel = "open" | "restricted" | "confidential";
export const SEARCH_AUDIENCES: SearchAudience[] = [
  "bank",
  "ai",
  "audit",
  "trading",
  "regulator",
];
export const SEARCH_VISIBILITIES: SearchVisibility[] = [
  "public",
  "partial",
  "private",
];
export const SEARCH_CONTROL_DISCLAIMER =
  "Indicative Search Control Plane — not enterprise IAM. HITL. Audit log is operational, not legal evidence.";
const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "toll-search-audit.json");
const CAP = 2_000;
/** Higher = more privileged. */
const PERMISSION_RANK: Record<SearchPermissionLevel, number> = {
  open: 0,
  restricted: 1,
  confidential: 2,
};
/** Audience → max visibility the actor may request / see. */
const AUDIENCE_PERMISSION: Record<SearchAudience, SearchPermissionLevel> = {
  ai: "open",
  bank: "restricted",
  trading: "confidential",
  audit: "confidential",
  regulator: "confidential",
};
/** Default visibility filter when caller omits visibility. */
const AUDIENCE_DEFAULT_VISIBILITY: Record<SearchAudience, SearchVisibility> = {
  ai: "public",
  bank: "partial",
  trading: "private",
  audit: "private",
  regulator: "private",
};
/** Kind boosts by audience (ranking weights). */
const AUDIENCE_KIND_WEIGHT: Record<
  SearchAudience,
  Record<TollSearchHit["kind"], number>
> = {
  bank: { dna: 1.2, market_actor: 0.7, market_offer: 0.4 },
  ai: { dna: 1.0, market_actor: 0.9, market_offer: 0.8 },
  audit: { dna: 1.3, market_actor: 0.5, market_offer: 0.2 },
  trading: { dna: 0.7, market_actor: 1.0, market_offer: 1.3 },
  regulator: { dna: 1.4, market_actor: 0.4, market_offer: 0.15 },
};
const VISIBILITY_PERMISSION: Record<SearchVisibility, SearchPermissionLevel> = {
  public: "open",
  partial: "restricted",
  private: "confidential",
};
export type SearchAuditEntry = {
  id: string;
  q: string;
  audience: SearchAudience;
  visibility: SearchVisibility;
  permissionLevel: SearchPermissionLevel;
  actorId?: string;
  hitCount: number;
  filteredOut: number;
  createdAt: string;
};
export type ControlledSearchHit = TollSearchHit & {
  score: number;
  visibility: SearchVisibility;
  permissionRequired: SearchPermissionLevel;
};
export type ControlledSearchResult = {
  query: string;
  audience: SearchAudience;
  visibility: SearchVisibility;
  permissionLevel: SearchPermissionLevel;
  totalRaw: number;
  total: number;
  hits: ControlledSearchHit[];
  auditId: string;
  disclaimer: string;
};
function loadAudit(): SearchAuditEntry[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as SearchAuditEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveAudit(rows: SearchAuditEntry[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-CAP), null, 2), "utf8");
  } catch {
    // ignore
  }
}
export function isSearchAudience(v: unknown): v is SearchAudience {
  return typeof v === "string" && SEARCH_AUDIENCES.includes(v as SearchAudience);
}
export function isSearchVisibility(v: unknown): v is SearchVisibility {
  return (
    typeof v === "string" &&
    SEARCH_VISIBILITIES.includes(v as SearchVisibility)
  );
}
export function permissionForAudience(
  audience: SearchAudience
): SearchPermissionLevel {
  return AUDIENCE_PERMISSION[audience];
}
export function defaultVisibilityForAudience(
  audience: SearchAudience
): SearchVisibility {
  return AUDIENCE_DEFAULT_VISIBILITY[audience];
}
/** Indicative tag: offers = private, actors = partial, DNA = public. */
export function assignHitVisibility(hit: TollSearchHit): SearchVisibility {
  if (hit.kind === "market_offer") return "private";
  if (hit.kind === "market_actor") return "partial";
  return "public";
}
export function canAudienceSeeVisibility(
  audience: SearchAudience,
  visibility: SearchVisibility
): boolean {
  const actorLevel = AUDIENCE_PERMISSION[audience];
  const needed = VISIBILITY_PERMISSION[visibility];
  return PERMISSION_RANK[actorLevel] >= PERMISSION_RANK[needed];
}
/**
 * Cap requested visibility to what the audience may access.
 * e.g. ai requesting private → clamped to public.
 */
export function clampVisibilityForAudience(
  audience: SearchAudience,
  requested: SearchVisibility
): SearchVisibility {
  if (canAudienceSeeVisibility(audience, requested)) return requested;
  const actorLevel = AUDIENCE_PERMISSION[audience];
  if (actorLevel === "open") return "public";
  if (actorLevel === "restricted") return "partial";
  return "private";
}
/** Visibility ladder: public ⊂ partial ⊂ private (inclusive filter ceiling). */
function visibilityAllowedUnderCeiling(
  hitVis: SearchVisibility,
  ceiling: SearchVisibility
): boolean {
  const order: SearchVisibility[] = ["public", "partial", "private"];
  return order.indexOf(hitVis) <= order.indexOf(ceiling);
}
export function scoreHitForAudience(
  hit: TollSearchHit,
  audience: SearchAudience,
  rawIndex: number
): number {
  const kindW = AUDIENCE_KIND_WEIGHT[audience][hit.kind] ?? 0.5;
  const positionBoost = Math.max(0, 1 - rawIndex * 0.02);
  return Number((kindW * (1 + positionBoost)).toFixed(4));
}
export function appendSearchAudit(entry: Omit<SearchAuditEntry, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
}): SearchAuditEntry {
  const row: SearchAuditEntry = {
    id: entry.id ?? `sca_${randomBytes(8).toString("hex")}`,
    q: entry.q.trim().slice(0, 200),
    audience: entry.audience,
    visibility: entry.visibility,
    permissionLevel: entry.permissionLevel,
    actorId: entry.actorId?.trim().slice(0, 120) || undefined,
    hitCount: entry.hitCount,
    filteredOut: entry.filteredOut,
    createdAt: entry.createdAt ?? new Date().toISOString(),
  };
  const all = loadAudit();
  all.push(row);
  saveAudit(all);
  return row;
}
export function listSearchAudit(opts?: {
  actorId?: string;
  limit?: number;
}): SearchAuditEntry[] {
  const limit = Math.min(200, Math.max(1, opts?.limit ?? 50));
  const actor = opts?.actorId?.trim();
  let rows = loadAudit().slice().reverse();
  if (actor) {
    rows = rows.filter((r) => r.actorId === actor);
  }
  return rows.slice(0, limit);
}
/**
 * Rank + filter search hits for an audience / visibility ceiling.
 * Pure helper (no I/O) — used by searchWithControlPlane and tests.
 */
export function applyControlPlaneRanking(
  raw: TollSearchResult,
  input: {
    audience: SearchAudience;
    visibility: SearchVisibility;
  }
): { hits: ControlledSearchHit[]; filteredOut: number } {
  const controlled: ControlledSearchHit[] = [];
  let filteredOut = 0;
  raw.hits.forEach((hit, idx) => {
    const visibility = assignHitVisibility(hit);
    const permissionRequired = VISIBILITY_PERMISSION[visibility];
    if (!canAudienceSeeVisibility(input.audience, visibility)) {
      filteredOut += 1;
      return;
    }
    if (!visibilityAllowedUnderCeiling(visibility, input.visibility)) {
      filteredOut += 1;
      return;
    }
    controlled.push({
      ...hit,
      score: scoreHitForAudience(hit, input.audience, idx),
      visibility,
      permissionRequired,
    });
  });
  controlled.sort((a, b) => b.score - a.score);
  return { hits: controlled, filteredOut };
}
export async function searchWithControlPlane(input: {
  q: string;
  audience: SearchAudience;
  visibility?: SearchVisibility;
  actorId?: string;
  limit?: number;
}): Promise<ControlledSearchResult> {
  const audience = input.audience;
  const permissionLevel = permissionForAudience(audience);
  const requested =
    input.visibility ?? defaultVisibilityForAudience(audience);
  const visibility = clampVisibilityForAudience(audience, requested);
  const limit = Math.min(50, Math.max(1, input.limit ?? 20));
  // Over-fetch then filter/rank so audience weights still have room.
  const raw = await searchAurosAssets({
    q: input.q,
    limit: Math.min(50, limit * 2),
  });
  const { hits: ranked, filteredOut } = applyControlPlaneRanking(raw, {
    audience,
    visibility,
  });
  const hits = ranked.slice(0, limit);
  const audit = appendSearchAudit({
    q: input.q,
    audience,
    visibility,
    permissionLevel,
    actorId: input.actorId,
    hitCount: hits.length,
    filteredOut,
  });
  return {
    query: raw.query,
    audience,
    visibility,
    permissionLevel,
    totalRaw: raw.total,
    total: hits.length,
    hits,
    auditId: audit.id,
    disclaimer: SEARCH_CONTROL_DISCLAIMER,
  };
}
