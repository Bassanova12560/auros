/**
 * Sync Stripe env vars from .env.local to Vercel production.
 * Usage: npx tsx scripts/sync-stripe-vercel.ts
 * Requires: vercel CLI logged in, .env.local with STRIPE_* keys.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const KEYS = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

function loadEnvLocal(): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

function upsertVercelEnv(name: string, value: string) {
  try {
    execSync(`npx vercel env rm ${name} production --yes`, {
      stdio: "pipe",
      encoding: "utf8",
    });
  } catch {
    /* may not exist */
  }
  execSync(`npx vercel env add ${name} production`, {
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    encoding: "utf8",
  });
  console.log(`✓ ${name} → Vercel production`);
}

function main() {
  const env = loadEnvLocal();
  const missing = KEYS.filter((k) => !env[k]?.trim());
  if (missing.length) {
    console.error("Missing in .env.local:", missing.join(", "));
    process.exit(1);
  }

  for (const key of KEYS) {
    upsertVercelEnv(key, env[key]!.trim());
  }

  const mode = env.STRIPE_SECRET_KEY!.startsWith("sk_live") ? "live" : "test";
  console.log(`\nStripe ${mode} keys synced. Redeploy: npm run green:deploy`);
  console.log("Webhook endpoint: https://getauros.com/api/webhooks/stripe");
  console.log("Events: checkout.session.completed, customer.subscription.deleted");
}

main();
