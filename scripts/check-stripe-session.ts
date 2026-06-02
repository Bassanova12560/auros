import { readFileSync } from "node:fs";
import Stripe from "stripe";

function loadEnvLocal() {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim();
  }
}

async function main() {
  loadEnvLocal();
  const id = process.argv[2];
  if (!id?.startsWith("cs_")) {
    console.error("Usage: npx tsx scripts/check-stripe-session.ts cs_test_...");
    process.exit(1);
  }
  const key =
    process.env.STRIPE_TEST_SECRET_KEY?.trim() ??
    process.env.STRIPE_SECRET_KEY!.trim();
  const stripe = new Stripe(key);
  const s = await stripe.checkout.sessions.retrieve(id);
  console.log(JSON.stringify({
    id: s.id,
    status: s.status,
    payment_status: s.payment_status,
    amount_total: s.amount_total,
    url: s.url,
  }, null, 2));
}

main();
