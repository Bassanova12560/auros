/**
 * Apply jurisdiction_leads bootstrap SQL to Supabase.
 *
 * Usage (pick one):
 *   SUPABASE_ACCESS_TOKEN=... npm run db:bootstrap:jurisdiction
 *   DATABASE_URL=postgresql://... npm run db:bootstrap:jurisdiction
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

  console.log("Management API: migration applied");
}

async function runViaPostgres(sql: string): Promise<void> {
  const dbUrl =
    process.env.DATABASE_URL?.trim() ??
    process.env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) throw new Error("DATABASE_URL or SUPABASE_DB_URL required");

  const postgres = (await import("postgres")).default;
  const sqlClient = postgres(dbUrl, { ssl: "require", max: 1 });
  try {
    await sqlClient.unsafe(sql);
    console.log("Postgres: migration applied");
  } finally {
    await sqlClient.end({ timeout: 5 });
  }
}

async function main() {
  loadEnvLocal();

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

  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    await runViaManagementApi(sql);
    return;
  }

  if (process.env.DATABASE_URL?.trim() || process.env.SUPABASE_DB_URL?.trim()) {
    await runViaPostgres(sql);
    return;
  }

  console.error(
    [
      "Missing credentials to run SQL remotely.",
      "",
      "Option A — Supabase CLI token (recommended):",
      "  1. https://supabase.com/dashboard/account/tokens → Generate token",
      "  2. set SUPABASE_ACCESS_TOKEN=sbp_...",
      "  3. npm run db:bootstrap:jurisdiction",
      "",
      "Option B — Direct Postgres URL:",
      "  Supabase → Project Settings → Database → Connection string (URI)",
      "  set DATABASE_URL=postgresql://postgres.[ref]:[password]@...",
      "  npm run db:bootstrap:jurisdiction",
    ].join("\n")
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
