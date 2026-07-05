/**
 * Finalise un achat test Checkout sans UI (API Stripe test + fulfillment AUROS).
 * npm run stripe:complete-test -- cs_test_xxx
 * npm run stripe:complete-test  (dernière session du link script)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import Stripe from "stripe";

import { parseCheckoutMetadata } from "../lib/jurisdictions/checkout-metadata";
import { fulfillJurisdictionPaymentForLead } from "../lib/jurisdictions/fulfill-payment-core";

const URL_FILE = join(__dirname, "stripe-test-checkout.url");

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

function sessionIdFromArgs(): string | undefined {
  const arg = process.argv[2];
  if (arg?.startsWith("cs_")) return arg;
  return undefined;
}

async function main() {
  loadEnvLocal();
  process.env.AUROS_SIMULATION = "true";

  const key = process.env.STRIPE_TEST_SECRET_KEY?.trim();
  if (!key?.startsWith("sk_test_")) {
    console.error("STRIPE_TEST_SECRET_KEY required");
    process.exit(1);
  }

  const sessionId = sessionIdFromArgs();
  if (!sessionId) {
    console.error("Usage: npm run stripe:complete-test -- cs_test_...");
    process.exit(1);
  }

  const stripe = new Stripe(key);
  let session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  console.log("Session:", session.id);
  console.log("Status:", session.status, "· payment:", session.payment_status);

  if (session.payment_status !== "paid") {
    let paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntentId) {
      // Force PI creation by listing - sometimes PI is lazy
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent"],
      });
      paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
    }

    if (!paymentIntentId) {
      // Create and attach PI for test completion
      const pi = await stripe.paymentIntents.create({
        amount: session.amount_total ?? 500_000,
        currency: session.currency ?? "eur",
        payment_method: "pm_card_visa",
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: "never" },
        metadata: (session.metadata ?? {}) as Record<string, string>,
      });
      paymentIntentId = pi.id;
      console.log("Created test PI:", paymentIntentId, pi.status);
    } else {
      const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: "pm_card_visa",
        return_url: "https://auros-delta.vercel.app/starter/ready",
      });
      console.log("Confirmed PI:", confirmed.id, confirmed.status);
    }

    session = await stripe.checkout.sessions.retrieve(sessionId);
  }

  if (session.payment_status !== "paid") {
    console.log("Checkout still unpaid — fulfillment manuelle AUROS…");
  }

  const meta = parseCheckoutMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta?.leadId) {
    console.error("No leadId in session metadata");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const ok = await fulfillJurisdictionPaymentForLead(
    supabase,
    {
      leadId: meta.leadId,
      tier: meta.tier,
      locale: meta.locale,
      sessionId: session.id,
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
      amountCents: session.amount_total ?? undefined,
    },
    { sendEmails: false }
  );

  const { data: lead } = await supabase
    .from("jurisdiction_leads")
    .select("deliverable_token, delivery_status, paid_tier")
    .eq("id", meta.leadId)
    .maybeSingle();

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://auros-delta.vercel.app";

  console.log("");
  console.log("Fulfillment:", ok ? "OK" : "FAIL");
  console.log("Lead:", meta.leadId);
  console.log("Paid tier:", lead?.paid_tier);
  console.log("Delivery:", lead?.delivery_status);
  if (lead?.deliverable_token) {
    console.log("Portail:", `${base}/starter/${lead.deliverable_token}`);
    console.log("PDF:", `${base}/api/starter/${lead.deliverable_token}/pdf`);
  }

  if (!ok || lead?.delivery_status !== "ready") process.exitCode = 1;
}

main();
