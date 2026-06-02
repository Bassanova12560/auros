/**
 * Achat test Stripe — Starter Kit 5 000 € (sk_test_ uniquement).
 *
 * npm run test:stripe-purchase
 * npm run test:stripe-purchase -- --email vous@example.com
 * npm run test:stripe-purchase -- --no-email
 * npm run test:stripe-purchase -- --session cs_test_xxx   # après paiement manuel
 *
 * Carte test : 4242 4242 4242 4242 · exp. 12/34 · CVC 123
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import Stripe from "stripe";

import {
  formatStripePurchaseReport,
  runStripeStarterPurchaseTest,
  STRIPE_TEST_CARD,
  verifyStripeStarterSession,
} from "../lib/jurisdictions/stripe-purchase-test";

const REPORT = join(__dirname, "stripe-purchase-test-report.txt");

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
    console.error("Missing .env.local");
    process.exit(1);
  }
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i < 0 || i + 1 >= process.argv.length) return undefined;
  return process.argv[i + 1];
}

async function main() {
  loadEnvLocal();

  const liveKey = process.env.STRIPE_SECRET_KEY?.trim();
  const testKey = process.env.STRIPE_TEST_SECRET_KEY?.trim();
  const secretKey = testKey ?? liveKey;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY or STRIPE_TEST_SECRET_KEY missing");
    process.exit(1);
  }
  if (!testKey && liveKey?.startsWith("sk_live_")) {
    console.warn(
      "Astuce : ajoute STRIPE_TEST_SECRET_KEY=sk_test_... dans .env.local pour les achats test sans toucher la clé live.\n"
    );
  }

  // Checkout API uses getStripe() fallback — align env for any code path still reading STRIPE_SECRET_KEY
  if (testKey) {
    process.env.STRIPE_SECRET_KEY = testKey;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase env missing");
    process.exit(1);
  }

  const email = argValue("--email");
  const sendEmails = !process.argv.includes("--no-email");
  const sessionId = argValue("--session");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  console.log("AUROS — achat test Stripe Starter Kit 5 000 €\n");
  if (siteUrl) console.log(`Site: ${siteUrl}`);
  console.log(`Emails: ${sendEmails ? "oui" : "non (--no-email)"}\n`);

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const stripe = new Stripe(secretKey);

  const baseOpts = {
    supabase,
    stripe,
    stripeSecretKey: secretKey,
    sendEmails,
    onWaiting: (msg: string) => console.log(`\n→ ${msg}\n`),
  };

  const result = sessionId?.startsWith("cs_")
    ? await verifyStripeStarterSession({ ...baseOpts, sessionId })
    : await runStripeStarterPurchaseTest({
        ...baseOpts,
        email,
      });

  if (
    !sessionId &&
    !result.ok &&
    result.checkoutUrl &&
    !result.steps.some((s) => s.name === "stripe payment completed" && s.ok)
  ) {
    console.log("\n--- Instructions ---");
    console.log(`1. Ouvre : ${result.checkoutUrl}`);
    console.log(`2. Carte : ${STRIPE_TEST_CARD} · 12/34 · CVC 123`);
    console.log("3. Après paiement, vérifie avec :");
    console.log(`   npm run test:stripe-purchase -- --session ${result.sessionId}`);
  }

  const text = formatStripePurchaseReport(result);
  console.log("\n" + text);
  writeFileSync(REPORT, text + "\n", "utf8");
  console.log(`\nRapport: ${REPORT}`);

  if (!result.ok) process.exitCode = 1;
}

main();
