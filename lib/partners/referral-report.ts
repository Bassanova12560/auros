import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type PartnerReferralRow = {
  recordType: "lead" | "dossier";
  id: string;
  partnerCode: string;
  email: string | null;
  assetType: string | null;
  score: number | null;
  status: string | null;
  source: string | null;
  createdAt: string;
};

export type PartnerReferralSummary = {
  partnerCode: string;
  leads: number;
  dossiers: number;
  total: number;
};

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Leads and dossiers with referred_by set — for partner ops export. */
export async function listPartnerReferrals(
  partnerCode?: string | null,
): Promise<PartnerReferralRow[]> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const code = partnerCode?.trim().toUpperCase() || null;
  const rows: PartnerReferralRow[] = [];

  let leadsQuery = supabase
    .from("leads")
    .select("id,email,asset_type,score,source,referred_by,created_at")
    .not("referred_by", "is", null)
    .order("created_at", { ascending: false });

  if (code) leadsQuery = leadsQuery.eq("referred_by", code);

  const { data: leads, error: leadsError } = await leadsQuery;
  if (leadsError) console.error("[listPartnerReferrals/leads]", leadsError);

  for (const row of leads ?? []) {
    rows.push({
      recordType: "lead",
      id: String(row.id),
      partnerCode: String(row.referred_by),
      email: row.email ? String(row.email) : null,
      assetType: row.asset_type ? String(row.asset_type) : null,
      score: typeof row.score === "number" ? row.score : null,
      status: null,
      source: row.source ? String(row.source) : null,
      createdAt: String(row.created_at),
    });
  }

  let dossiersQuery = supabase
    .from("dossiers")
    .select("id,asset_type,score,status,referred_by,created_at")
    .not("referred_by", "is", null)
    .order("created_at", { ascending: false });

  if (code) dossiersQuery = dossiersQuery.eq("referred_by", code);

  const { data: dossiers, error: dossiersError } = await dossiersQuery;
  if (dossiersError) console.error("[listPartnerReferrals/dossiers]", dossiersError);

  for (const row of dossiers ?? []) {
    rows.push({
      recordType: "dossier",
      id: String(row.id),
      partnerCode: String(row.referred_by),
      email: null,
      assetType: row.asset_type ? String(row.asset_type) : null,
      score: typeof row.score === "number" ? row.score : null,
      status: row.status ? String(row.status) : null,
      source: null,
      createdAt: String(row.created_at),
    });
  }

  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function summarizePartnerReferrals(rows: PartnerReferralRow[]): PartnerReferralSummary[] {
  const map = new Map<string, PartnerReferralSummary>();

  for (const row of rows) {
    const existing = map.get(row.partnerCode) ?? {
      partnerCode: row.partnerCode,
      leads: 0,
      dossiers: 0,
      total: 0,
    };
    if (row.recordType === "lead") existing.leads += 1;
    else existing.dossiers += 1;
    existing.total += 1;
    map.set(row.partnerCode, existing);
  }

  return [...map.values()].sort((a, b) => b.total - a.total);
}

export function partnerReferralsToCsv(rows: PartnerReferralRow[]): string {
  const header = [
    "record_type",
    "id",
    "partner_code",
    "email",
    "asset_type",
    "score",
    "status",
    "source",
    "created_at",
  ];
  const lines = rows.map((row) =>
    [
      row.recordType,
      row.id,
      row.partnerCode,
      row.email ?? "",
      row.assetType ?? "",
      row.score ?? "",
      row.status ?? "",
      row.source ?? "",
      row.createdAt,
    ]
      .map((v) => escapeCsv(String(v)))
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function partnerReferralSummaryToCsv(rows: PartnerReferralSummary[]): string {
  const header = ["partner_code", "leads", "dossiers", "total"];
  const lines = rows.map((row) =>
    [row.partnerCode, row.leads, row.dossiers, row.total].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function suggestedPartnerReferralFilename(partnerCode?: string | null): string {
  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = partnerCode?.trim() ? `-${partnerCode.trim().toUpperCase()}` : "";
  return `auros-partner-referrals${suffix}-${stamp}.csv`;
}
