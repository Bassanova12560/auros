import { parseCheckoutMetadata } from "@/lib/jurisdictions/checkout-metadata";
import { jurisdictionProduct } from "@/lib/jurisdictions/pricing";
import { computeStarterReadiness } from "@/lib/jurisdictions/starter-readiness";
import type { StarterKitContent } from "@/lib/jurisdictions/starter-kit-types";
import { wizardPrefillFromLead, wizardSeedFromLead } from "@/lib/jurisdictions/wizard-from-lead";
import { isShareToken } from "@/lib/validation";

export const STARTER_KIT_PRICE_EUR = 5_000;
export const STARTER_KIT_AMOUNT_CENTS = 500_000;

export type PurchaseTestStep = {
  name: string;
  ok: boolean;
  detail: string;
};

export type PurchaseTestReport = {
  ok: boolean;
  passed: number;
  total: number;
  steps: PurchaseTestStep[];
  token?: string;
  portalUrl?: string;
  sessionId?: string;
  leadId?: string;
};

export function step(name: string, ok: boolean, detail: string): PurchaseTestStep {
  return { name, ok, detail };
}

export function summarizePurchaseSteps(steps: PurchaseTestStep[]): PurchaseTestReport {
  const failed = steps.filter((s) => !s.ok).length;
  return {
    ok: failed === 0,
    passed: steps.length - failed,
    total: steps.length,
    steps,
  };
}

export function validateStarterProduct(): PurchaseTestStep {
  const product = jurisdictionProduct("starter");
  const ok =
    product.amountCents === STARTER_KIT_AMOUNT_CENTS &&
    product.currency === "eur" &&
    product.name.fr.includes("Starter Kit");
  return step(
    "starter product 5000€",
    ok,
    ok ? `${product.amountCents / 100}€ · ${product.currency}` : "price mismatch"
  );
}

export function validateCheckoutMetadata(): PurchaseTestStep[] {
  const valid = parseCheckoutMetadata({
    leadId: "550e8400-e29b-41d4-a716-446655440000",
    tier: "starter",
    locale: "fr",
  });
  const invalid = parseCheckoutMetadata({ tier: "invalid" });

  return [
    step("checkout metadata parse", valid?.tier === "starter", valid?.tier ?? "null"),
    step("checkout metadata reject", invalid === null, "invalid tier rejected"),
  ];
}

export function validatePortalRender(content: StarterKitContent): PurchaseTestStep[] {
  const checks: PurchaseTestStep[] = [];

  checks.push(
    step(
      "portal executive summary",
      content.executiveSummary.length > 40,
      `${content.executiveSummary.length} chars`
    )
  );
  checks.push(
    step(
      "portal structure block",
      content.recommendedStructure.length > 20,
      "recommendedStructure"
    )
  );
  checks.push(
    step(
      "portal jurisdiction rationale",
      content.jurisdictionRationale.length > 20,
      "jurisdictionRationale"
    )
  );
  checks.push(
    step(
      "portal regulatory checklist",
      content.regulatoryChecklist.length >= 6,
      `${content.regulatoryChecklist.length} items`
    )
  );
  checks.push(
    step(
      "portal timeline",
      content.timeline.length >= 3,
      `${content.timeline.length} phases`
    )
  );
  checks.push(
    step(
      "portal tech providers",
      content.techProviders.length >= 1,
      `${content.techProviders.length} providers`
    )
  );
  checks.push(
    step(
      "portal next steps",
      content.nextSteps.length >= 3,
      `${content.nextSteps.length} steps`
    )
  );
  checks.push(
    step("portal disclaimer", content.disclaimer.length > 20, "disclaimer present")
  );

  const readiness = computeStarterReadiness(content);
  checks.push(
    step(
      "readiness card (max 3 priorities)",
      readiness.priorities.length <= 3 && readiness.score > 0,
      `score=${readiness.score} · ${readiness.priorities.length} priorities`
    )
  );

  return checks;
}

export function validateWizardBridge(input: {
  projectType: string;
  projectValue: string | null;
  jurisdictions: string[];
  firstName: string;
  email: string;
  locale: "fr" | "en" | "es";
}): PurchaseTestStep[] {
  const prefill = wizardPrefillFromLead(input);
  const seed = wizardSeedFromLead(input);

  return [
    step(
      "wizard prefill from purchase",
      Boolean(prefill.assetType && prefill.country && prefill.estimatedValue > 0),
      `${prefill.assetType} · ${prefill.country} · ${prefill.estimatedValue}€`
    ),
    step(
      "wizard seed from purchase",
      Boolean(seed.firstName && seed.email),
      seed.firstName ?? "missing"
    ),
  ];
}

export function validateDeliverableToken(token: string): PurchaseTestStep {
  return step("deliverable token format", isShareToken(token), token);
}

export async function validateStarterKitPdf(
  firstName: string,
  content: StarterKitContent
): Promise<PurchaseTestStep> {
  const { generateStarterKitPdf } = await import("@/lib/jurisdictions/starter-kit-pdf");
  try {
    const blob = await generateStarterKitPdf({
      firstName,
      content,
      generatedAt: new Date().toISOString(),
    });
    return step("starter kit PDF render", blob.size > 800, `${blob.size} bytes`);
  } catch (e) {
    return step(
      "starter kit PDF render",
      false,
      e instanceof Error ? e.message : String(e)
    );
  }
}

export async function validateOverviewPdf(): Promise<PurchaseTestStep> {
  const { generateStarterKitOverviewPdf } = await import(
    "@/lib/jurisdictions/starter-kit-overview-pdf"
  );
  try {
    const blob = await generateStarterKitOverviewPdf("fr");
    return step("value overview PDF render", blob.size > 800, `${blob.size} bytes`);
  } catch (e) {
    return step(
      "value overview PDF render",
      false,
      e instanceof Error ? e.message : String(e)
    );
  }
}

export function formatPurchaseReport(
  report: PurchaseTestReport,
  baseUrl?: string
): string {
  const lines: string[] = [
    `AUROS Starter Kit purchase test — ${new Date().toISOString()}`,
    baseUrl ? `base=${baseUrl}` : "",
    "",
  ];

  for (const s of report.steps) {
    lines.push(`  [${s.ok ? "OK" : "FAIL"}] ${s.name} — ${s.detail}`);
  }

  lines.push("");
  lines.push(`=== Résumé ${report.passed}/${report.total} ===`);

  if (report.portalUrl) {
    lines.push(`Portail: ${report.portalUrl}`);
  }
  if (report.sessionId && baseUrl) {
    lines.push(`Ready page: ${baseUrl}/starter/ready?session_id=${report.sessionId}`);
  }
  if (report.leadId) {
    lines.push(`Lead ID: ${report.leadId} (sim — safe to delete)`);
  }

  lines.push(report.ok ? "→ Purchase pipeline OK" : "→ Fix FAIL items");
  return lines.filter(Boolean).join("\n");
}
