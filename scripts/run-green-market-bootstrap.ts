/**

 * Apply green marketplace migrations (0014–0019) and seed mock data.

 * Usage: npm run db:bootstrap:green-market  |  npm run green:sync

 *

 * Env (from shell or .env.local): SUPABASE_ACCESS_TOKEN + NEXT_PUBLIC_SUPABASE_URL,

 * or DATABASE_URL / SUPABASE_DB_URL, plus SUPABASE_SECRET_KEY for seed.

 */



import { readFileSync } from "node:fs";

import { join } from "node:path";



import { seedGreenMarketData } from "../lib/green/market/seed";



/** Keep in sync with app/api/admin/bootstrap-green-market/route.ts */

const GREEN_MARKET_MIGRATIONS = [

  "0014_green_market.sql",

  "0015_green_market_mvp.sql",

  "0016_green_market_listings.sql",

  "0017_green_market_owners_alerts.sql",

  "0018_green_market_country.sql",

  "0019_green_label_document.sql",

  "0020_green_label_preferred_locale.sql",

] as const;



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



async function runSqlViaManagementApi(sql: string): Promise<void> {

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

}



async function runSqlViaPostgres(sql: string): Promise<void> {

  const dbUrl =

    process.env.DATABASE_URL?.trim() ?? process.env.SUPABASE_DB_URL?.trim();

  if (!dbUrl) throw new Error("DATABASE_URL or SUPABASE_DB_URL required");



  const postgres = (await import("postgres")).default;

  const sqlClient = postgres(dbUrl, { ssl: "require", max: 1 });

  try {

    await sqlClient.unsafe(sql);

  } finally {

    await sqlClient.end({ timeout: 5 });

  }

}



async function runMigrationBatch(

  run: (sql: string) => Promise<void>

): Promise<void> {

  for (const file of GREEN_MARKET_MIGRATIONS) {

    const sql = readFileSync(

      join(process.cwd(), "supabase/migrations", file),

      "utf8"

    );

    try {

      await run(sql);

      console.log(`Applied ${file}`);

    } catch (err) {

      const msg = err instanceof Error ? err.message : String(err);

      if (!msg.includes("already exists")) throw err;

      console.warn(`Skipped ${file} (already applied):`, msg.slice(0, 120));

    }

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



  await seedGreenMarketData(supabase);

  console.log("Green marketplace seed complete");

}



function printEnvHelp(): void {

  console.error(

    [

      "Missing database credentials for green marketplace bootstrap.",

      "",

      "Set one of (in .env.local or the shell):",

      "  • SUPABASE_ACCESS_TOKEN + NEXT_PUBLIC_SUPABASE_URL (+ SUPABASE_SECRET_KEY for seed)",

      "  • DATABASE_URL or SUPABASE_DB_URL (+ SUPABASE_SECRET_KEY for seed)",

      "  • NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY (seed only; tables must exist)",

      "",

      "Prod HTTP fallback: POST /api/admin/bootstrap-green-market with Bearer CRON_SECRET",

    ].join("\n")

  );

}



async function main() {

  loadEnvLocal();



  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {

    await runMigrationBatch(runSqlViaManagementApi);

    await runViaSupabaseSeed();

    return;

  }



  if (process.env.DATABASE_URL?.trim() || process.env.SUPABASE_DB_URL?.trim()) {

    await runMigrationBatch(runSqlViaPostgres);

    await runViaSupabaseSeed();

    return;

  }



  if (

    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&

    process.env.SUPABASE_SECRET_KEY?.trim()

  ) {

    console.log("No SQL credentials — seeding via service role (tables must exist)");

    await runViaSupabaseSeed();

    return;

  }



  printEnvHelp();

  process.exit(1);

}



main().catch((err) => {

  console.error(err);

  process.exit(1);

});

