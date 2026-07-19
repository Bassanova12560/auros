/**
 * Sync Clerk env vars from .env.local to Vercel production (+ preview).
 * Usage: npx tsx scripts/sync-clerk-vercel.ts
 * Requires: vercel CLI logged in, .env.local with CLERK_* keys.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const KEYS = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL",
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

function upsertVercelEnv(name: string, value: string, target: "production" | "preview") {
  try {
    execSync(`npx vercel env rm ${name} ${target} --yes`, {
      stdio: "pipe",
      encoding: "utf8",
    });
  } catch {
    /* may not exist */
  }
  execSync(`npx vercel env add ${name} ${target}`, {
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    encoding: "utf8",
  });
  console.log(`✓ ${name} → Vercel ${target}`);
}

function main() {
  const env = loadEnvLocal();
  const required = ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"] as const;
  const missing = required.filter((k) => !env[k]?.trim());
  if (missing.length) {
    console.error("Missing in .env.local:", missing.join(", "));
    process.exit(1);
  }

  const pk = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!.trim();
  const sk = env.CLERK_SECRET_KEY!.trim();
  const mode = pk.startsWith("pk_live_") ? "live" : "test";
  const forceTest = process.env.FORCE_CLERK_TEST_SYNC === "1";

  if (mode === "test" && !forceTest) {
    console.error(`
Refusing to sync pk_test_ keys to Vercel production.

Create a Clerk Production instance, then put in .env.local:
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_…
  CLERK_SECRET_KEY=sk_live_…

Dashboard: https://dashboard.clerk.com → switch to Production → API Keys
Also add domains: getauros.com, www.getauros.com
Redirects: /sign-in, /sign-up, /dashboard

Then re-run: npm run green:sync-clerk
(Emergency override: FORCE_CLERK_TEST_SYNC=1)
`);
    process.exit(1);
  }

  if (mode === "live" && !sk.startsWith("sk_live_")) {
    console.error("pk_live_ publishable key but CLERK_SECRET_KEY is not sk_live_ — aborting.");
    process.exit(1);
  }

  for (const key of KEYS) {
    const value = env[key]?.trim();
    if (!value) continue;
    upsertVercelEnv(key, value, "production");
    if (key.startsWith("NEXT_PUBLIC_")) {
      upsertVercelEnv(key, value, "preview");
    }
  }

  console.log(`\nClerk ${mode} keys synced to Vercel.`);
  if (mode === "test") {
    console.warn(
      "⚠ FORCE_CLERK_TEST_SYNC=1 — production still on pk_test_. Replace with pk_live_ ASAP."
    );
  }
  console.log("Redeploy: npx vercel --prod");
}

main();
