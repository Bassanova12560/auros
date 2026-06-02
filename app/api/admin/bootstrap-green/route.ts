import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function runViaPostgres(sql: string): Promise<void> {
  const dbUrl =
    process.env.DATABASE_URL?.trim() ?? process.env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) {
    throw new Error("DATABASE_URL or SUPABASE_DB_URL is not configured");
  }

  const postgres = (await import("postgres")).default;
  const client = postgres(dbUrl, { ssl: "require", max: 1 });
  try {
    await client.unsafe(sql);
  } finally {
    await client.end({ timeout: 5 });
  }
}

async function runViaManagementApi(sql: string): Promise<void> {
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!token || !url) {
    throw new Error("SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL required");
  }
  const ref = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
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
      body.message ?? body.error ?? `Management API ${res.status}`
    );
  }
}

async function seedVerifiedProject(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return;

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await supabase.from("green_registry_projects").upsert(
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
}

/** One-shot bootstrap for Green Phase 3 — POST with Authorization: Bearer CRON_SECRET */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const migrationPath = join(
    process.cwd(),
    "supabase/migrations/0013_green_phase3.sql"
  );
  const sql = readFileSync(migrationPath, "utf8");

  try {
    if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
      await runViaManagementApi(sql);
    } else if (
      process.env.DATABASE_URL?.trim() ||
      process.env.SUPABASE_DB_URL?.trim()
    ) {
      await runViaPostgres(sql);
    } else {
      await seedVerifiedProject();
      return NextResponse.json({
        ok: true,
        partial: true,
        message: "verified project seeded — no SQL credentials for DDL",
      });
    }

    await seedVerifiedProject();
    return NextResponse.json({ ok: true, message: "green phase 3 bootstrap applied" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "bootstrap failed";
    console.error("[bootstrap-green]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
