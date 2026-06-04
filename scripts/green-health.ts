/**
 * HTTP smoke — key Green pages on production.
 *
 * npm run green:health
 * AUROS_PROD_URL=https://auros-delta.vercel.app npm run green:health
 */

import { readFileSync } from "node:fs";

import {
  runGreenHealthChecks,
  type GreenHealthResult,
} from "../lib/green/green-health";

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

function printReport(result: GreenHealthResult) {
  console.log(`Green health — ${result.checkedAt}`);
  console.log(`Base: ${result.base}\n`);
  for (const c of result.checks) {
    const level = c.ok ? "OK" : "FAIL";
    const detail = c.error ? ` — ${c.error}` : "";
    console.log(`[${level}] GET ${c.path} → ${c.status || "—"}${detail}`);
  }
  console.log(
    result.ok
      ? "\n→ All Green routes healthy."
      : "\n→ One or more routes failed."
  );
}

async function main() {
  loadEnvLocal();
  const prodFlag = process.argv.includes("--prod");
  if (prodFlag && !process.env.AUROS_PROD_URL?.trim()) {
    process.env.AUROS_PROD_URL =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      "https://auros-delta.vercel.app";
  }

  const result = await runGreenHealthChecks();
  printReport(result);
  process.exit(result.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
