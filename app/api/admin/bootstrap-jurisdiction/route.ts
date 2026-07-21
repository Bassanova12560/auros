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
    process.env.DATABASE_URL?.trim() ??
    process.env.SUPABASE_DB_URL?.trim();
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

/** One-shot bootstrap for jurisdiction_leads — POST with Requires authenticated ops access */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const migrationPath = join(
    process.cwd(),
    "supabase/migrations/0007_jurisdiction_leads_bootstrap.sql"
  );
  const migration8 = join(
    process.cwd(),
    "supabase/migrations/0008_starter_kit_delivery.sql"
  );
  const sql =
    readFileSync(migrationPath, "utf8") + "\n" + readFileSync(migration8, "utf8");

  try {
    if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
      await runViaManagementApi(sql);
    } else {
      await runViaPostgres(sql);
    }

    return NextResponse.json({ ok: true, message: "jurisdiction_leads bootstrap applied" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "bootstrap failed";
    console.error("[bootstrap-jurisdiction]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
