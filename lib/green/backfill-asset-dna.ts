/**
 * Backfill Asset DNA on registry / market rows missing asset_dna_id.
 * Server-only — do not import from lib/green/index.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  assetDnaClassFromGreenProject,
  mintAssetDna,
} from "@/lib/asset-dna";
import { appendProofStreamEvent } from "@/lib/proof-stream";

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function countryCode(raw: string): string {
  const t = raw.trim();
  if (t.length === 2) return t.toUpperCase();
  const map: Record<string, string> = {
    portugal: "PT",
    france: "FR",
    spain: "ES",
    germany: "DE",
    italy: "IT",
    "united kingdom": "GB",
    uk: "GB",
  };
  return map[t.toLowerCase()] ?? t.slice(0, 2).toUpperCase();
}

export type BackfillAssetDnaResult = {
  registryUpdated: number;
  marketUpdated: number;
  skipped: number;
  errors: string[];
};

export async function backfillGreenAssetDna(
  supabaseClient?: SupabaseClient
): Promise<BackfillAssetDnaResult> {
  const supabase = supabaseClient ?? getAdminClient();
  const result: BackfillAssetDnaResult = {
    registryUpdated: 0,
    marketUpdated: 0,
    skipped: 0,
    errors: [],
  };
  if (!supabase) {
    result.errors.push("database_unavailable");
    return result;
  }

  const { data: projects, error: projErr } = await supabase
    .from("green_registry_projects")
    .select("id,name,project_type,country,label_tier,asset_dna_id")
    .is("asset_dna_id", null)
    .limit(200);

  if (projErr) {
    result.errors.push(`registry: ${projErr.message}`);
  } else {
    for (const row of projects ?? []) {
      try {
        const seedKey = `registry:${row.id}`;
        const dna = await mintAssetDna({
          assetClass: assetDnaClassFromGreenProject(String(row.project_type)),
          displayName: String(row.name),
          jurisdiction: { country: countryCode(String(row.country)) },
          compliance: {
            labelTier:
              row.label_tier === "pilot" || row.label_tier === "verified"
                ? row.label_tier
                : "none",
          },
          links: { registryProjectId: String(row.id) },
          seedKey,
        });
        const { error } = await supabase
          .from("green_registry_projects")
          .update({ asset_dna_id: dna.id })
          .eq("id", row.id);
        if (error) {
          result.errors.push(`registry ${row.id}: ${error.message}`);
          continue;
        }
        appendProofStreamEvent({
          assetDnaId: dna.id,
          action: "dna.minted",
          meta: { backfill: true, registryProjectId: row.id },
        });
        result.registryUpdated += 1;
      } catch (err) {
        result.errors.push(
          `registry ${row.id}: ${err instanceof Error ? err.message : "fail"}`
        );
      }
    }
  }

  const { data: assets, error: assetErr } = await supabase
    .from("green_market_assets")
    .select(
      "id,external_id,name,country,city,lat,lon,listing_tier,asset_dna_id,status"
    )
    .is("asset_dna_id", null)
    .limit(200);

  if (assetErr) {
    result.errors.push(`market: ${assetErr.message}`);
  } else {
    for (const row of assets ?? []) {
      try {
        const seedKey = `market:${row.external_id ?? row.id}`;
        const dna = await mintAssetDna({
          assetClass: "green_energy",
          displayName: String(row.name),
          jurisdiction: { country: countryCode(String(row.country ?? "FR")) },
          origin: {
            operatorName: String(row.name),
            siteName: row.city
              ? `${row.city}, ${row.country ?? ""}`
              : undefined,
            coordinates:
              row.lat != null && row.lon != null
                ? { lat: Number(row.lat), lon: Number(row.lon) }
                : undefined,
          },
          compliance: {
            listingTier:
              row.listing_tier === "demo" ||
              row.listing_tier === "referenced" ||
              row.listing_tier === "verified"
                ? row.listing_tier
                : "referenced",
          },
          links: { marketActorId: String(row.external_id ?? row.id) },
          seedKey,
        });
        const { error } = await supabase
          .from("green_market_assets")
          .update({ asset_dna_id: dna.id })
          .eq("id", row.id);
        if (error) {
          result.errors.push(`market ${row.id}: ${error.message}`);
          continue;
        }
        appendProofStreamEvent({
          assetDnaId: dna.id,
          action: "dna.minted",
          meta: {
            backfill: true,
            marketActorId: row.external_id ?? row.id,
            status: row.status,
          },
        });
        result.marketUpdated += 1;
      } catch (err) {
        result.errors.push(
          `market ${row.id}: ${err instanceof Error ? err.message : "fail"}`
        );
      }
    }
  }

  return result;
}
