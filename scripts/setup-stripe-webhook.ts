import { readFileSync } from "node:fs";

import Stripe from "stripe";

function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const key = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = v;
    }
  } catch {
    console.error("Missing .env.local");
    process.exit(1);
  }
}

async function main() {
  loadEnvLocal();
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    console.error("STRIPE_SECRET_KEY missing");
    process.exit(1);
  }

  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") +
    "/api/webhooks/stripe";

  const stripe = new Stripe(key);
  const list = await stripe.webhookEndpoints.list({ limit: 100 });

  for (const ep of list.data) {
    if (ep.url === url) {
      await stripe.webhookEndpoints.del(ep.id);
      console.log("Removed old webhook", ep.id);
    }
  }

  const ep = await stripe.webhookEndpoints.create({
    url,
    enabled_events: [
      "checkout.session.completed",
      "customer.subscription.deleted",
      "invoice.payment_failed",
    ],
    description: "AUROS checkout + Green API Premium lifecycle",
  });

  console.log("WEBHOOK_ID=" + ep.id);
  console.log("WEBHOOK_SECRET=" + ep.secret);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
