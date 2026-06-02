/**
 * Simulation écosystème AUROS — agents locaux + intégrations + HTTP optionnel.
 * Run: npm run simulate
 * Report: scripts/simulate-report.txt
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  formatEcosystemReport,
  runEcosystemSimulation,
} from "../lib/simulation/ecosystem";

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

loadEnvLocal();

const REPORT = join(__dirname, "simulate-report.txt");

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

const PROD_DEFAULT = "https://auros-delta.vercel.app";
const BASE =
  process.env.BASE_URL?.replace(/\/$/, "") ??
  (hasFlag("--prod") ? PROD_DEFAULT : "http://localhost:3000");

async function main() {
  const withHttp = hasFlag("--http") || process.env.SIMULATE_HTTP === "1";
  const noIntegrations =
    hasFlag("--no-integrations") || process.env.SIMULATE_NO_INTEGRATIONS === "1";

  const report = await runEcosystemSimulation({
    baseUrl: BASE,
    withHttp,
    withIntegrations: !noIntegrations,
  });

  const text = formatEcosystemReport(report);
  console.log(text);

  writeFileSync(REPORT, text + "\n", "utf8");
  console.log(`\nRapport: ${REPORT}`);
  console.log(`Démo wizard: ${BASE}/wizard?demo=1`);
  console.log(`API rapport: ${BASE}/api/simulate?http=1`);

  if (!report.ok) process.exitCode = 1;
}

main();
