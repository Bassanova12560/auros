import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";

import { siteOrigin } from "@/lib/emails/constants";
import { parseCheckoutMetadata } from "@/lib/jurisdictions/checkout-metadata";
import { fulfillJurisdictionPaymentForLead } from "@/lib/jurisdictions/fulfill-payment-core";
import { insertJurisdictionLead } from "@/lib/jurisdictions/lead-persistence";
import {
  STARTER_KIT_AMOUNT_CENTS,
  step,
  type PurchaseTestStep,
} from "@/lib/jurisdictions/purchase-test";
import { createJurisdictionCheckoutSession } from "@/lib/stripe/jurisdiction-checkout";

export const STRIPE_TEST_CARD = "4242 4242 4242 4242";

export type StripePurchaseTestOptions = {
  supabase: SupabaseClient;
  stripe: Stripe;
  stripeSecretKey: string;
  email?: string;
  firstName?: string;
  locale?: "fr" | "en" | "es";
  sendEmails?: boolean;
  pollTimeoutMs?: number;
  onWaiting?: (message: string) => void;
};

export type StripePurchaseTestResult = {
  ok: boolean;
  steps: PurchaseTestStep[];
  checkoutUrl: string;
  sessionId: string;
  leadId: string;
  portalUrl?: string;
  readyUrl?: string;
};

export function assertStripeTestKey(secretKey: string): PurchaseTestStep | null {
  if (secretKey.startsWith("sk_test_")) return null;
  if (secretKey.startsWith("sk_live_")) {
    return step(
      "stripe test mode",
      false,
      "STRIPE_SECRET_KEY est en live — utilise sk_test_ pour un achat test sans débit réel"
    );
  }
  return step("stripe test mode", false, "STRIPE_SECRET_KEY invalide ou manquante");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function verifyStripeStarterSession(
  options: Omit<StripePurchaseTestOptions, "email" | "firstName"> & {
    sessionId: string;
    leadId?: string;
  }
): Promise<StripePurchaseTestResult> {
  const steps: PurchaseTestStep[] = [];
  const baseUrl = siteOrigin();

  const keyCheck = assertStripeTestKey(options.stripeSecretKey);
  if (keyCheck) {
    steps.push(keyCheck);
    return {
      ok: false,
      steps,
      checkoutUrl: "",
      sessionId: options.sessionId,
      leadId: options.leadId ?? "",
    };
  }

  const stripeSession = await options.stripe.checkout.sessions.retrieve(
    options.sessionId
  );

  steps.push(
    step(
      "stripe session retrieve",
      true,
      `${stripeSession.payment_status} · ${stripeSession.amount_total ?? "?"} centimes`
    )
  );

  if (stripeSession.payment_status !== "paid") {
    steps.push(step("stripe payment completed", false, stripeSession.payment_status));
    return {
      ok: false,
      steps,
      checkoutUrl: stripeSession.url ?? "",
      sessionId: options.sessionId,
      leadId: options.leadId ?? "",
    };
  }

  const meta = parseCheckoutMetadata(
    (stripeSession.metadata ?? {}) as Record<string, string>
  );
  const leadId = options.leadId ?? meta?.leadId ?? "";

  if (!leadId) {
    steps.push(step("lead id from metadata", false, "missing leadId"));
    return { ok: false, steps, checkoutUrl: "", sessionId: options.sessionId, leadId: "" };
  }

  const { data: leadRow } = await options.supabase
    .from("jurisdiction_leads")
    .select("delivery_status, deliverable_token, paid_at")
    .eq("id", leadId)
    .maybeSingle();

  if (!leadRow?.paid_at || leadRow.delivery_status !== "ready") {
    await fulfillJurisdictionPaymentForLead(
      options.supabase,
      {
        leadId,
        tier: meta?.tier ?? "starter",
        locale: meta?.locale ?? "fr",
        sessionId: stripeSession.id,
        paymentIntentId:
          typeof stripeSession.payment_intent === "string"
            ? stripeSession.payment_intent
            : stripeSession.payment_intent?.id,
        amountCents: stripeSession.amount_total ?? undefined,
      },
      { sendEmails: options.sendEmails !== false }
    );
  }

  const { data: finalLead } = await options.supabase
    .from("jurisdiction_leads")
    .select("paid_at, paid_tier, delivery_status, deliverable_token, starter_kit")
    .eq("id", leadId)
    .maybeSingle();

  steps.push(
    step(
      "starter kit delivered",
      finalLead?.delivery_status === "ready" && Boolean(finalLead?.starter_kit),
      finalLead?.delivery_status ?? "missing"
    )
  );

  const token = finalLead?.deliverable_token as string | undefined;
  const portalUrl = token ? `${baseUrl}/starter/${token}` : undefined;

  if (token) {
    try {
      const res = await fetch(`${baseUrl}/starter/${token}`, {
        signal: AbortSignal.timeout(20_000),
      });
      steps.push(step("HTTP portal after payment", res.ok, `HTTP ${res.status}`));
    } catch (e) {
      steps.push(
        step(
          "HTTP portal after payment",
          false,
          e instanceof Error ? e.message : String(e)
        )
      );
    }
  }

  const ok = steps.every((s) => s.ok);
  return {
    ok,
    steps,
    checkoutUrl: stripeSession.url ?? "",
    sessionId: options.sessionId,
    leadId,
    portalUrl,
    readyUrl: `${baseUrl}/starter/ready?session_id=${options.sessionId}`,
  };
}

export async function runStripeStarterPurchaseTest(
  options: StripePurchaseTestOptions
): Promise<StripePurchaseTestResult> {
  const steps: PurchaseTestStep[] = [];
  const locale = options.locale ?? "fr";
  const email =
    options.email?.trim().toLowerCase() ??
    `achat-test+${Date.now()}@test.auros`;
  const firstName = options.firstName ?? "TestAchat";
  const pollTimeoutMs = options.pollTimeoutMs ?? 600_000;
  const baseUrl = siteOrigin();

  const keyCheck = assertStripeTestKey(options.stripeSecretKey);
  if (keyCheck) {
    steps.push(keyCheck);
    return {
      ok: false,
      steps,
      checkoutUrl: "",
      sessionId: "",
      leadId: "",
    };
  }
  steps.push(step("stripe test mode", true, "sk_test_"));

  const inserted = await insertJurisdictionLead(options.supabase, {
    kind: "quote",
    first_name: firstName,
    email,
    project_type: "real_estate",
    project_value: "1to5m",
    jurisdictions: ["dubai-difc", "luxembourg"],
    locale,
    lead_score: 80,
    lead_tier: "hot",
  });

  if ("error" in inserted) {
    steps.push(step("create test lead", false, inserted.error.message));
    return { ok: false, steps, checkoutUrl: "", sessionId: "", leadId: "" };
  }

  const leadId = inserted.id;
  steps.push(step("create test lead", true, leadId));

  const session = await createJurisdictionCheckoutSession(
    {
      tier: "starter",
      locale,
      leadId,
      email,
      customerName: firstName,
    },
    options.stripe
  );

  if (!session) {
    steps.push(step("create checkout session", false, "session null"));
    return { ok: false, steps, checkoutUrl: "", sessionId: "", leadId };
  }

  if (session.sessionId.startsWith("cs_live_") && options.stripeSecretKey.startsWith("sk_test_")) {
    steps.push(
      step(
        "checkout session mode",
        false,
        "session live créée avec clé test — vérifie STRIPE_SECRET_KEY vs STRIPE_TEST_SECRET_KEY"
      )
    );
    return { ok: false, steps, checkoutUrl: session.url, sessionId: session.sessionId, leadId };
  }

  steps.push(
    step(
      "checkout session 5000€",
      true,
      `${session.sessionId} · ${STARTER_KIT_AMOUNT_CENTS / 100}€`
    )
  );

  await options.supabase
    .from("jurisdiction_leads")
    .update({ stripe_session_id: session.sessionId })
    .eq("id", leadId);

  options.onWaiting?.(
    `Paiement en attente — ouvre :\n${session.url}\nCarte : ${STRIPE_TEST_CARD} (12/34, CVC 123)`
  );

  const started = Date.now();
  let paid = false;
  let stripeSession: Stripe.Checkout.Session | null = null;

  while (Date.now() - started < pollTimeoutMs) {
    try {
      stripeSession = await options.stripe.checkout.sessions.retrieve(session.sessionId);
      if (stripeSession.payment_status === "paid") {
        paid = true;
        break;
      }
    } catch (e) {
      steps.push(
        step(
          "stripe session poll",
          false,
          e instanceof Error ? e.message : String(e)
        )
      );
      return {
        ok: false,
        steps,
        checkoutUrl: session.url,
        sessionId: session.sessionId,
        leadId,
        readyUrl: `${baseUrl}/starter/ready?session_id=${session.sessionId}`,
      };
    }
    await sleep(3000);
  }

  if (!paid || !stripeSession) {
    steps.push(
      step(
        "stripe payment completed",
        false,
        `timeout ${pollTimeoutMs / 1000}s — session ${session.sessionId}`
      )
    );
    return {
      ok: false,
      steps,
      checkoutUrl: session.url,
      sessionId: session.sessionId,
      leadId,
      readyUrl: `${baseUrl}/starter/ready?session_id=${session.sessionId}`,
    };
  }

  steps.push(
    step(
      "stripe payment completed",
      true,
      `${stripeSession.amount_total ?? "?"} centimes · ${stripeSession.payment_status}`
    )
  );

  if (stripeSession.amount_total !== STARTER_KIT_AMOUNT_CENTS) {
    steps.push(
      step(
        "amount matches starter tier",
        false,
        `expected ${STARTER_KIT_AMOUNT_CENTS}, got ${stripeSession.amount_total}`
      )
    );
  } else {
    steps.push(step("amount matches starter tier", true, "5000€"));
  }

  await sleep(5000);

  const { data: leadAfterWebhook } = await options.supabase
    .from("jurisdiction_leads")
    .select("paid_at, delivery_status, deliverable_token")
    .eq("id", leadId)
    .maybeSingle();

  const delivered =
    leadAfterWebhook?.delivery_status === "ready" &&
    Boolean(leadAfterWebhook?.deliverable_token);

  if (!delivered) {
    options.onWaiting?.("Webhook lent ou absent — fulfillment manuel…");
    const meta = parseCheckoutMetadata(
      (stripeSession.metadata ?? {}) as Record<string, string>
    );
    if (meta?.leadId) {
      await fulfillJurisdictionPaymentForLead(
        options.supabase,
        {
          leadId: meta.leadId,
          tier: meta.tier,
          locale: meta.locale,
          sessionId: stripeSession.id,
          paymentIntentId:
            typeof stripeSession.payment_intent === "string"
              ? stripeSession.payment_intent
              : stripeSession.payment_intent?.id,
          amountCents: stripeSession.amount_total ?? undefined,
        },
        { sendEmails: options.sendEmails !== false }
      );
    }
  }

  const { data: finalLead } = await options.supabase
    .from("jurisdiction_leads")
    .select("paid_at, paid_tier, delivery_status, deliverable_token, starter_kit")
    .eq("id", leadId)
    .maybeSingle();

  steps.push(
    step(
      "lead marked paid",
      Boolean(finalLead?.paid_at && finalLead?.paid_tier === "starter"),
      finalLead?.paid_tier ?? "missing"
    )
  );
  steps.push(
    step(
      "starter kit delivered",
      finalLead?.delivery_status === "ready" && Boolean(finalLead?.starter_kit),
      finalLead?.delivery_status ?? "missing"
    )
  );

  const token = finalLead?.deliverable_token as string | undefined;
  const portalUrl = token ? `${baseUrl}/starter/${token}` : undefined;
  const readyUrl = `${baseUrl}/starter/ready?session_id=${session.sessionId}`;

  if (token) {
    steps.push(step("portal token", true, token));
    try {
      const res = await fetch(`${baseUrl}/starter/${token}`, {
        signal: AbortSignal.timeout(20_000),
      });
      steps.push(
        step("HTTP portal after payment", res.ok, `HTTP ${res.status}`)
      );
      const pdfRes = await fetch(`${baseUrl}/api/starter/${token}/pdf`, {
        signal: AbortSignal.timeout(20_000),
      });
      steps.push(
        step(
          "HTTP PDF after payment",
          pdfRes.ok && (pdfRes.headers.get("content-type") ?? "").includes("pdf"),
          `HTTP ${pdfRes.status}`
        )
      );
    } catch (e) {
      steps.push(
        step(
          "HTTP portal after payment",
          false,
          e instanceof Error ? e.message : String(e)
        )
      );
    }
  }

  const ok = steps.every((s) => s.ok);
  return {
    ok,
    steps,
    checkoutUrl: session.url,
    sessionId: session.sessionId,
    leadId,
    portalUrl,
    readyUrl,
  };
}

export function formatStripePurchaseReport(
  result: StripePurchaseTestResult
): string {
  const lines = [
    `AUROS — achat test Stripe Starter Kit 5 000 €`,
    "",
    ...result.steps.map(
      (s) => `  [${s.ok ? "OK" : "FAIL"}] ${s.name} — ${s.detail}`
    ),
    "",
    result.checkoutUrl ? `Checkout: ${result.checkoutUrl}` : "",
    result.readyUrl ? `Ready: ${result.readyUrl}` : "",
    result.portalUrl ? `Portail: ${result.portalUrl}` : "",
    result.leadId ? `Lead: ${result.leadId}` : "",
    "",
    result.ok ? "→ Achat test réussi" : "→ Achat test incomplet",
  ];
  return lines.filter(Boolean).join("\n");
}
