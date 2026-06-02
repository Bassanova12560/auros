/**
 * Test du parcours d'achat Starter Kit 5 000 € — génération, portail, PDF.
 *
 * npm run test:purchase              # logique locale (sans DB)
 * npm run test:purchase -- --db        # + insert Supabase simulé
 * npm run test:purchase -- --db --http # + smoke HTTP portail
 * npm run test:purchase -- --prod      # HTTP sur auros-delta.vercel.app
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  formatPurchaseReport,
  runStarterKitPurchaseTest,
} from "../lib/jurisdictions/purchase-test-run";

const REPORT = join(__dirname, "purchase-test-report.txt");
const PROD = "https://auros-delta.vercel.app";

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
    // optional for local-only mode
  }
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

async function main() {
  loadEnvLocal();
  process.env.AUROS_SIMULATION = "true";

  const withDb = hasFlag("--db");
  const withHttp = hasFlag("--http") || hasFlag("--prod");
  const cleanup = !hasFlag("--keep-lead");
  const baseUrl = hasFlag("--prod")
    ? PROD
    : process.env.BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  let supabase: import("@supabase/supabase-js").SupabaseClient | undefined;

  if (withDb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SECRET_KEY?.trim();
    if (!url || !key) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY (.env.local)");
      process.exitCode = 1;
      return;
    }
    const { createClient } = await import("@supabase/supabase-js");
    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  const report = await runStarterKitPurchaseTest({
    baseUrl,
    withDb,
    withHttp,
    cleanup,
    supabase,
  });

  const text = formatPurchaseReport(report, baseUrl);
  console.log(text);
  writeFileSync(REPORT, text + "\n", "utf8");
  console.log(`\nRapport: ${REPORT}`);

  if (report.portalUrl) {
    console.log(`\nOuvrir le portail: ${report.portalUrl}`);
  }

  if (!report.ok) process.exitCode = 1;
}

main();
