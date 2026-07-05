import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";

export const runtime = "nodejs";

const ECOSYSTEM_MIGRATIONS = [
  "0021_green_label_reminder_sent_at.sql",
  "0022_green_label_second_reminder_sent_at.sql",
  "0023_green_compare_snapshots.sql",
  "0024_wizard_purchases.sql",
  "0025_wizard_purchases_reminders.sql",
  "0026_protocol_score_history.sql",
  "0027_protocol_webhook_deliveries.sql",
  "0028_green_impact_report_purchases.sql",
  "0029_partner_referred_by.sql",
  "0030_core_ops_missing.sql",
  "0031_green_label_payment.sql",
  "0032_leads_nurture.sql",
  "0033_green_water_infrastructure.sql",
  "0034_ecosystem_functional.sql",
];

async function runViaPostgres(sql: string): Promise<void> {
  const dbUrl =
    process.env.DATABASE_URL?.trim() ?? process.env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) throw new Error("DATABASE_URL or SUPABASE_DB_URL is not configured");

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
    },
  );

  const body = (await res.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(body.message ?? body.error ?? `Management API ${res.status}`);
  }
}

async function runMigrationBatch(
  run: (sql: string) => Promise<void>,
  files: string[],
): Promise<string[]> {
  const applied: string[] = [];
  for (const file of files) {
    const sql = readFileSync(join(process.cwd(), "supabase/migrations", file), "utf8");
    try {
      await run(sql);
      applied.push(file);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("already exists")) throw err;
      console.warn(`[bootstrap-ecosystem] ${file} skipped:`, msg.slice(0, 120));
      applied.push(`${file} (skipped)`);
    }
  }
  return applied;
}

/** Apply ecosystem migrations 0021–0034 — Bearer CRON_SECRET */
export async function GET(req: NextRequest) {
  return POST(req);
}

export async function POST(req: NextRequest) {
  if (!isCronAuthorized(req, { allowDevWithoutSecret: false })) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    let applied: string[] = [];
    if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
      applied = await runMigrationBatch(runViaManagementApi, ECOSYSTEM_MIGRATIONS);
    } else if (
      process.env.DATABASE_URL?.trim() ||
      process.env.SUPABASE_DB_URL?.trim()
    ) {
      applied = await runMigrationBatch(runViaPostgres, ECOSYSTEM_MIGRATIONS);
    } else {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No SQL credentials (SUPABASE_ACCESS_TOKEN or DATABASE_URL). Apply migrations manually in Supabase SQL editor.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      applied,
      message: "Ecosystem migrations applied",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "bootstrap failed";
    console.error("[bootstrap-ecosystem]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
