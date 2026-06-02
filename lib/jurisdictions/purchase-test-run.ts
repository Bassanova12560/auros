import { nanoid } from "nanoid";
import type { SupabaseClient } from "@supabase/supabase-js";

import { insertJurisdictionLead } from "@/lib/jurisdictions/lead-persistence";
import { generateStarterKit } from "@/lib/jurisdictions/starter-kit-generate";
import {
  formatPurchaseReport,
  step,
  summarizePurchaseSteps,
  type PurchaseTestReport,
  type PurchaseTestStep,
  validateCheckoutMetadata,
  validateDeliverableToken,
  validateOverviewPdf,
  validatePortalRender,
  validateStarterKitPdf,
  validateStarterProduct,
  validateWizardBridge,
} from "@/lib/jurisdictions/purchase-test";
import { siteOrigin } from "@/lib/emails/constants";

export type RunPurchaseTestOptions = {
  baseUrl?: string;
  withDb?: boolean;
  withHttp?: boolean;
  cleanup?: boolean;
  supabase?: SupabaseClient;
};

const TEST_LEAD = {
  kind: "quote" as const,
  first_name: "SimAchat",
  project_type: "real_estate",
  project_value: "1to5m",
  jurisdictions: ["dubai-difc", "luxembourg"],
  locale: "fr",
};

export async function runStarterKitPurchaseTest(
  options: RunPurchaseTestOptions = {}
): Promise<PurchaseTestReport> {
  const steps: PurchaseTestStep[] = [];
  const baseUrl = options.baseUrl?.replace(/\/$/, "") ?? siteOrigin();

  steps.push(validateStarterProduct());
  steps.push(...validateCheckoutMetadata());

  process.env.AUROS_SIMULATION = "true";

  const ctx = {
    leadId: "purchase-test-local",
    firstName: TEST_LEAD.first_name,
    email: `sim-purchase-${Date.now()}@test.auros`,
    projectType: TEST_LEAD.project_type,
    projectValue: TEST_LEAD.project_value,
    jurisdictions: TEST_LEAD.jurisdictions,
    locale: TEST_LEAD.locale,
    paidTier: "starter",
  };

  const kit = await generateStarterKit(ctx);
  steps.push(
    step(
      "starter kit generation (post-payment)",
      kit.content.regulatoryChecklist.length >= 6,
      `provider=${kit.provider} · checklist=${kit.content.regulatoryChecklist.length}`
    )
  );

  steps.push(...validatePortalRender(kit.content));
  steps.push(
    ...validateWizardBridge({
      projectType: TEST_LEAD.project_type,
      projectValue: TEST_LEAD.project_value,
      jurisdictions: TEST_LEAD.jurisdictions,
      firstName: TEST_LEAD.first_name,
      email: ctx.email,
      locale: "fr",
    })
  );
  steps.push(await validateStarterKitPdf(TEST_LEAD.first_name, kit.content));
  steps.push(await validateOverviewPdf());

  let token: string | undefined;
  let sessionId: string | undefined;
  let leadId: string | undefined;
  let portalUrl: string | undefined;

  if (options.withDb && options.supabase) {
    const dbSteps = await runDbPurchaseSimulation(options.supabase, kit.content, kit.plain, kit.provider);
    steps.push(...dbSteps.steps);
    token = dbSteps.token;
    sessionId = dbSteps.sessionId;
    leadId = dbSteps.leadId;
    portalUrl = `${baseUrl}/starter/${token}`;

    if (options.withHttp && token) {
      steps.push(...(await runHttpPortalChecks(baseUrl, token, sessionId)));
    }

    if (options.cleanup && leadId) {
      const { error } = await options.supabase
        .from("jurisdiction_leads")
        .delete()
        .eq("id", leadId);
      steps.push(
        step("cleanup test lead", !error, error?.message ?? `deleted ${leadId}`)
      );
    }
  }

  const report = summarizePurchaseSteps(steps);
  return {
    ...report,
    token,
    portalUrl,
    sessionId,
    leadId,
  };
}

async function runDbPurchaseSimulation(
  supabase: SupabaseClient,
  content: Awaited<ReturnType<typeof generateStarterKit>>["content"],
  plain: string,
  provider: string
): Promise<{
  steps: PurchaseTestStep[];
  token: string;
  sessionId: string;
  leadId: string;
}> {
  const steps: PurchaseTestStep[] = [];
  const email = `sim-purchase-${Date.now()}@test.auros`;

  const inserted = await insertJurisdictionLead(supabase, {
    ...TEST_LEAD,
    email,
    lead_score: 75,
    lead_tier: "hot",
  });

  if ("error" in inserted) {
    steps.push(step("insert test lead", false, inserted.error.message));
    return {
      steps,
      token: "",
      sessionId: "",
      leadId: "",
    };
  }

  const leadId = inserted.id;
  steps.push(step("insert test lead", true, leadId));

  const token = nanoid(16);
  const sessionId = `cs_test_sim_${Date.now()}`;
  const now = new Date().toISOString();

  const { error: payErr } = await supabase
    .from("jurisdiction_leads")
    .update({
      status: "paid",
      paid_at: now,
      paid_tier: "starter",
      stripe_session_id: sessionId,
      stripe_payment_intent: `pi_test_sim_${Date.now()}`,
      deliverable_token: token,
      starter_kit: content,
      starter_kit_plain: plain,
      starter_kit_provider: provider,
      delivered_at: now,
      delivery_status: "ready",
    })
    .eq("id", leadId);

  steps.push(
    step(
      "simulate 5000€ payment + delivery",
      !payErr,
      payErr?.message ?? `paid_tier=starter · ${now}`
    )
  );

  steps.push(validateDeliverableToken(token));

  const { data: row, error: fetchErr } = await supabase
    .from("jurisdiction_leads")
    .select("paid_tier, delivery_status, starter_kit, deliverable_token")
    .eq("id", leadId)
    .maybeSingle();

  steps.push(
    step(
      "DB portal payload ready",
      !fetchErr &&
        row?.paid_tier === "starter" &&
        row?.delivery_status === "ready" &&
        Boolean(row?.starter_kit),
      fetchErr?.message ?? `tier=${row?.paid_tier} · status=${row?.delivery_status}`
    )
  );

  const { data: bySession } = await supabase
    .from("jurisdiction_leads")
    .select("deliverable_token, delivery_status")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  steps.push(
    step(
      "ready page session lookup",
      bySession?.delivery_status === "ready" && bySession?.deliverable_token === token,
      bySession?.deliverable_token ?? "not found"
    )
  );

  return { steps, token, sessionId, leadId };
}

async function runHttpPortalChecks(
  baseUrl: string,
  token: string,
  sessionId?: string
): Promise<PurchaseTestStep[]> {
  const steps: PurchaseTestStep[] = [];

  try {
    const portalRes = await fetch(`${baseUrl}/starter/${token}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const html = await portalRes.text();
    steps.push(
      step(
        "HTTP portal page",
        portalRes.ok && html.includes("Starter Kit"),
        `HTTP ${portalRes.status}`
      )
    );
    steps.push(
      step(
        "HTTP portal readiness block",
        html.includes("readiness") || html.includes("priorit") || html.includes("Préparation"),
        "readiness UI present"
      )
    );
    steps.push(
      step(
        "HTTP portal PDF link",
        html.includes(`/api/starter/${token}/pdf`),
        "download link"
      )
    );

    const pdfRes = await fetch(`${baseUrl}/api/starter/${token}/pdf`, {
      signal: AbortSignal.timeout(20_000),
    });
    const ct = pdfRes.headers.get("content-type") ?? "";
    steps.push(
      step(
        "HTTP portal PDF download",
        pdfRes.ok && ct.includes("application/pdf"),
        `HTTP ${pdfRes.status} · ${ct.split(";")[0]}`
      )
    );
  } catch (e) {
    steps.push(
      step(
        "HTTP portal page",
        false,
        e instanceof Error ? e.message : String(e)
      )
    );
  }

  if (sessionId) {
    try {
      const readyRes = await fetch(
        `${baseUrl}/starter/ready?session_id=${encodeURIComponent(sessionId)}`,
        { signal: AbortSignal.timeout(15_000) }
      );
      steps.push(
        step(
          "HTTP starter/ready page",
          readyRes.ok,
          `HTTP ${readyRes.status}`
        )
      );
    } catch (e) {
      steps.push(
        step(
          "HTTP starter/ready page",
          false,
          e instanceof Error ? e.message : String(e)
        )
      );
    }
  }

  return steps;
}

export { formatPurchaseReport };
