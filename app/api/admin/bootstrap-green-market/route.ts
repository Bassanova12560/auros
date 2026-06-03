import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { seedGreenMarketData } from "@/lib/green/market/seed";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

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
    }
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
  files: string[]
): Promise<void> {
  for (const file of files) {
    const sql = readFileSync(join(process.cwd(), "supabase/migrations", file), "utf8");
    try {
      await run(sql);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("already exists")) throw err;
      console.warn(`[bootstrap-green-market] ${file} skipped:`, msg.slice(0, 120));
    }
  }
}

/** Bootstrap green marketplace — POST/GET Authorization: Bearer CRON_SECRET (GET for Vercel cron) */
export async function GET(req: NextRequest) {
  return POST(req);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const migrationFiles = [
    "0014_green_market.sql",
    "0015_green_market_mvp.sql",
    "0016_green_market_listings.sql",
    "0017_green_market_owners_alerts.sql",
    "0018_green_market_country.sql",
    "0019_green_label_document.sql",
    "0020_green_label_preferred_locale.sql",
  ];

  try {
    if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
      await runMigrationBatch(runViaManagementApi, migrationFiles);
    } else if (
      process.env.DATABASE_URL?.trim() ||
      process.env.SUPABASE_DB_URL?.trim()
    ) {
      await runMigrationBatch(runViaPostgres, migrationFiles);
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SECRET_KEY?.trim();
    if (url && key) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false,
        },
      });
      await seedGreenMarketData(supabase);
    }

    return NextResponse.json({ ok: true, message: "green marketplace bootstrap applied" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "bootstrap failed";
    console.error("[bootstrap-green-market]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
