import { NextResponse } from "next/server";
import Stripe from "stripe";

import { insertJurisdictionLead } from "@/lib/jurisdictions/lead-persistence";
import { createJurisdictionCheckoutSession } from "@/lib/stripe/jurisdiction-checkout";
import { isSimulationMode } from "@/lib/simulation/mode";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function getStripeTest(): Stripe | null {
  const key =
    process.env.STRIPE_TEST_SECRET_KEY?.trim() ??
    (process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")
      ? process.env.STRIPE_SECRET_KEY.trim()
      : undefined);
  if (!key?.startsWith("sk_test_")) return null;
  return new Stripe(key);
}

export async function GET() {
  if (process.env.NODE_ENV === "production" && !isSimulationMode()) {
    return NextResponse.json(
      {
        error: "forbidden",
        hint: "Set AUROS_SIMULATION=true on Vercel, or use npm run dev locally.",
      },
      { status: 403 }
    );
  }

  const stripe = getStripeTest();
  if (!stripe) {
    return NextResponse.json(
      {
        error: "stripe_test_unconfigured",
        hint: "Add STRIPE_TEST_SECRET_KEY=sk_test_... to .env.local",
      },
      { status: 503 }
    );
  }

  const supabase = getSupabaseServerClient();
  const email = `achat-test+${Date.now()}@test.auros`;

  const inserted = await insertJurisdictionLead(supabase, {
    kind: "quote",
    first_name: "TestAchat",
    email,
    project_type: "real_estate",
    project_value: "1to5m",
    jurisdictions: ["luxembourg", "dubai-difc"],
    locale: "fr",
    lead_score: 80,
    lead_tier: "hot",
  });

  if ("error" in inserted) {
    return NextResponse.json({ error: inserted.error.message }, { status: 500 });
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
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }

  await supabase
    .from("jurisdiction_leads")
    .update({ stripe_session_id: session.sessionId })
    .eq("id", inserted.id);

  return NextResponse.redirect(session.url, 303);
}
