/**
 * Apply green Phase 3 migration (0013).
 * Usage: npm run db:bootstrap:green-phase3
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

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

function projectRefFromUrl(url: string): string | null {
  return url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? null;
}

async function runViaManagementApi(sql: string): Promise<void> {
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!token || !url) {
    throw new Error("SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL required");
  }
  const ref = projectRefFromUrl(url);
  if (!ref) throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${ref}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const body = (await res.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(
      `Management API ${res.status}: ${body.message ?? body.error ?? JSON.stringify(body)}`
    );
  }

  console.log("Management API: green Phase 3 migration applied");
}

async function runViaPostgres(sql: string): Promise<void> {
  const dbUrl =
    process.env.DATABASE_URL?.trim() ?? process.env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) throw new Error("DATABASE_URL or SUPABASE_DB_URL required");

  const postgres = (await import("postgres")).default;
  const sqlClient = postgres(dbUrl, { ssl: "require", max: 1 });
  try {
    await sqlClient.unsafe(sql);
    console.log("Postgres: green Phase 3 migration applied");
  } finally {
    await sqlClient.end({ timeout: 5 });
  }
}

async function runViaSupabaseSeed(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY required");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("green_registry_projects").upsert(
    {
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
    },
    { onConflict: "id" }
  );

  if (error) throw new Error(`Supabase seed: ${error.message}`);
  console.log("Supabase service role: verified project seeded");
}

async function main() {
  loadEnvLocal();

  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/0013_green_phase3.sql"),
    "utf8"
  );

  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    await runViaManagementApi(sql);
    await runViaSupabaseSeed();
    return;
  }

  if (process.env.DATABASE_URL?.trim() || process.env.SUPABASE_DB_URL?.trim()) {
    await runViaPostgres(sql);
    await runViaSupabaseSeed();
    return;
  }

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SECRET_KEY?.trim()
  ) {
    console.log("No SQL credentials — seeding data via Supabase service role");
    await runViaSupabaseSeed();
    return;
  }

  console.error(
    "Missing SUPABASE_ACCESS_TOKEN, DATABASE_URL, or SUPABASE_SECRET_KEY — cannot bootstrap."
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
