/**
 * Génère une URL Checkout test fraîche (session.url canonique Stripe).
 * npm run stripe:test-link
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import Stripe from "stripe";

import { insertJurisdictionLead } from "../lib/jurisdictions/lead-persistence";
import { createJurisdictionCheckoutSession } from "../lib/stripe/jurisdiction-checkout";

const OUT = join(__dirname, "stripe-test-checkout.url");

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

  const key = process.env.STRIPE_TEST_SECRET_KEY?.trim();
  if (!key?.startsWith("sk_test_")) {
    console.error("STRIPE_TEST_SECRET_KEY=sk_test_... required in .env.local");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const sbKey = process.env.SUPABASE_SECRET_KEY!.trim();
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, sbKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const stripe = new Stripe(key);
  const email = `achat-test+${Date.now()}@test.auros`;

  const inserted = await insertJurisdictionLead(supabase, {
    kind: "quote",
    first_name: "TestAchat",
    email,
    project_type: "real_estate",
    project_value: "1to5m",
    jurisdictions: ["luxembourg"],
    locale: "fr",
    lead_score: 80,
    lead_tier: "hot",
  });

  if ("error" in inserted) {
    console.error(inserted.error.message);
    process.exit(1);
  }

  const session = await createJurisdictionCheckoutSession(
    {
      tier: "starter",
      locale: "fr",
      leadId: inserted.id,
      email,
      customerName: "TestAchat",
    },
    stripe
  );

  if (!session?.url) {
    console.error("No checkout URL returned");
    process.exit(1);
  }

  await supabase
    .from("jurisdiction_leads")
    .update({ stripe_session_id: session.sessionId })
    .eq("id", inserted.id);

  // URL fraîche directement depuis Stripe (avec fragment requis)
  const fresh = await stripe.checkout.sessions.retrieve(session.sessionId);
  const checkoutUrl = fresh.url ?? session.url;

  writeFileSync(OUT, checkoutUrl + "\n", "utf8");

  console.log("Session:", session.sessionId);
  console.log("Lead:", inserted.id);
  console.log("");
  console.log("Ouvre cette URL (copie-colle ENTIERE depuis le fichier si besoin):");
  console.log(checkoutUrl);
  console.log("");
  console.log("Carte test: 4242 4242 4242 4242 · 12/34 · CVC 123");
  console.log("");
  console.log("Apres paiement:");
  console.log(`npm run test:stripe-purchase -- --session ${session.sessionId}`);
  console.log("");
  console.log("Fichier:", OUT);
}

main();
