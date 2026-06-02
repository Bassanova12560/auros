/**
 * Apply green_registry migration (0012).
 * Usage: npm run db:bootstrap:green-registry
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

  console.log("Management API: green_registry migration applied");
}

async function runViaPostgres(sql: string): Promise<void> {
  const dbUrl =
    process.env.DATABASE_URL?.trim() ?? process.env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) throw new Error("DATABASE_URL or SUPABASE_DB_URL required");

  const postgres = (await import("postgres")).default;
  const sqlClient = postgres(dbUrl, { ssl: "require", max: 1 });
  try {
    await sqlClient.unsafe(sql);
    console.log("Postgres: green_registry migration applied");
  } finally {
    await sqlClient.end({ timeout: 5 });
  }
}

async function main() {
  loadEnvLocal();

  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/0012_green_registry.sql"),
    "utf8"
  );

  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    await runViaManagementApi(sql);
    return;
  }

  if (process.env.DATABASE_URL?.trim() || process.env.SUPABASE_DB_URL?.trim()) {
    await runViaPostgres(sql);
    return;
  }

  console.error(
    "Missing SUPABASE_ACCESS_TOKEN or DATABASE_URL — cannot apply migration."
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
