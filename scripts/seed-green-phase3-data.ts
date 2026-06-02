/**
 * Seed Phase 3 green registry data via Supabase service role (no DDL).
 * Usage: npm run db:seed:green-phase3
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // optional
  }
}

const VERIFIED_PROJECT = {
  id: "verified-solar-aggregation-pt",
  name: "Auros Green Verified — Agrégation solaire (Portugal)",
  project_type: "solar",
  country: "Portugal",
  label_tier: "verified",
  certified_at: "2026-05-31T12:00:00Z",
  verify_token: "ag-verified-solar-pt-2026",
  summary_fr:
    "Premier label Verified AUROS Green — revue RTMS complète sur dossier agrégation solaire anonymisé (PPA + traçabilité MWh). Audit documentaire validé ; pas de promesse de rendement.",
  summary_en:
    "First Auros Green Verified label — full RTMS review on anonymized solar aggregation dossier (PPA + MWh traceability). Document audit passed; no return promise.",
  summary_es:
    "Primer label Verified AUROS Green — revisión RTMS completa sobre dossier anonimizado de agregación solar (PPA + trazabilidad MWh). Auditoría documental validada; sin promesa de rendimiento.",
  website: null,
};

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: before, error: listErr } = await supabase
    .from("green_registry_projects")
    .select("id, label_tier");

  if (listErr) {
    console.error("Cannot read green_registry_projects:", listErr.message);
    process.exit(1);
  }

  console.log(`Before: ${before?.length ?? 0} project(s)`);

  const { error: upsertErr } = await supabase
    .from("green_registry_projects")
    .upsert(VERIFIED_PROJECT, { onConflict: "id" });

  if (upsertErr) {
    console.error("Upsert failed:", upsertErr.message);
    process.exit(1);
  }

  const { data: after } = await supabase
    .from("green_registry_projects")
    .select("id, label_tier")
    .order("certified_at", { ascending: false });

  console.log("Upsert OK — verified-solar-aggregation-pt");
  console.log(`After: ${after?.length ?? 0} project(s)`);
  for (const row of after ?? []) {
    console.log(`  ${row.id} (${row.label_tier})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
