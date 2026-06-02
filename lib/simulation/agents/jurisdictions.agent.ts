import { getAssetUseCases } from "@/lib/jurisdictions/asset-use-cases";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";
import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import { parseCheckoutMetadata } from "@/lib/jurisdictions/checkout-metadata";
import { filterJurisdictions } from "@/lib/jurisdictions/filters";
import {
  getJurisdictionMessages,
  jurisdictionLabel,
} from "@/lib/jurisdictions/i18n";
import { jurisdictionProduct } from "@/lib/jurisdictions/pricing";
import {
  getAllSeoLandings,
  parseSeoLandingSlug,
} from "@/lib/jurisdictions/seo-landings";
import { estimateSetupBudget } from "@/lib/jurisdictions/setup-calculator";
import {
  starterKitMarketTotal,
  STARTER_KIT_PRICE_EUR,
} from "@/lib/jurisdictions/starter-kit-value";
import { computeStarterReadiness } from "@/lib/jurisdictions/starter-readiness";
import { scoreQuoteLead } from "@/lib/jurisdictions/lead-score";
import { jurisdictionsUrlFromWizardCountry } from "@/lib/jurisdictions/wizard-bridge";
import {
  starterKitDeliveryEmail,
  starterKitTechIntroEmail,
} from "@/lib/emails/templates";
import { check, type SimCheck } from "@/lib/simulation/types";

const AGENT = "jurisdictions";

export function runJurisdictionsAgent(): SimCheck[] {
  const checks: SimCheck[] = [];

  checks.push(
    check(AGENT, "eight jurisdictions", JURISDICTIONS.length === 8, String(JURISDICTIONS.length))
  );

  const filtered = filterJurisdictions(JURISDICTIONS, "real_estate", "all", "all");
  checks.push(
    check(AGENT, "real estate filter", filtered.length >= 3, `${filtered.length} rows`)
  );

  const landings = getAllSeoLandings();
  const slugOk = landings.every((l) => parseSeoLandingSlug(l.slug)?.slug === l.slug);
  checks.push(
    check(AGENT, "seo landing slugs", slugOk && landings.length > 20, `${landings.length} pages`)
  );

  const budget = estimateSetupBudget("dubai-difc", "1to5m");
  checks.push(
    check(
      AGENT,
      "setup calculator",
      Boolean(budget && budget.totalMinEur > STARTER_KIT_PRICE_EUR),
      budget ? `${budget.totalMinEur}€ min` : "null"
    )
  );

  checks.push(
    check(
      AGENT,
      "value stack total",
      starterKitMarketTotal() > STARTER_KIT_PRICE_EUR,
      `${starterKitMarketTotal()}€ market`
    )
  );

  const meta = parseCheckoutMetadata({
    leadId: "550e8400-e29b-41d4-a716-446655440000",
    tier: "starter",
    locale: "fr",
  });
  checks.push(
    check(AGENT, "stripe metadata parse", meta?.tier === "starter", meta?.tier ?? "null")
  );
  checks.push(
    check(
      AGENT,
      "stripe metadata reject",
      parseCheckoutMetadata({ tier: "invalid" }) === null,
      "invalid tier rejected"
    )
  );

  const starter = jurisdictionProduct("starter");
  checks.push(
    check(AGENT, "starter price", starter.amountCents === 500_000, "5000€")
  );

  const hot = scoreQuoteLead({ projectValue: "over20m", projectType: "real_estate" });
  checks.push(check(AGENT, "lead scoring hot", hot.tier === "hot", hot.tier));

  const messages = getJurisdictionMessages("fr");
  checks.push(
    check(
      AGENT,
      "i18n labels",
      Boolean(messages.names.luxembourg && messages.pricing.tiers.length === 3),
      "fr catalog"
    )
  );

  checks.push(
    check(
      AGENT,
      "enterprise copy",
      getEnterpriseMessages("en").valueStack.items.regulatoryNote.length > 10,
      "en value stack"
    )
  );

  checks.push(
    check(AGENT, "asset use cases", getAssetUseCases("fr").length === 4, "4 assets")
  );

  const url = jurisdictionsUrlFromWizardCountry("Luxembourg");
  checks.push(
    check(AGENT, "wizard bridge url", url.includes("compareA=luxembourg"), url)
  );

  const delivery = starterKitDeliveryEmail({
    firstName: "Test",
    locale: "fr",
    portalUrl: "https://example.com/starter/x",
    paidTier: "starter",
  });
  checks.push(
    check(
      AGENT,
      "delivery email template",
      delivery.subject.includes("Starter Kit") && delivery.html.includes("Test"),
      delivery.subject
    )
  );

  const techIntro = starterKitTechIntroEmail({
    firstName: "Test",
    locale: "fr",
    portalUrl: "https://example.com/starter/x",
    providers: [{ name: "Tokeny", fit: "MiCA ready" }],
  });
  checks.push(
    check(
      AGENT,
      "tech intro email template",
      techIntro.html.includes("Tokeny"),
      techIntro.subject
    )
  );

  return checks;
}

export async function runJurisdictionsAsyncAgent(): Promise<SimCheck[]> {
  const checks: SimCheck[] = [];
  const ctx = {
    leadId: "sim-lead",
    firstName: "Sim",
    email: "sim@test.auros",
    projectType: "real_estate",
    projectValue: "1to5m",
    jurisdictions: ["dubai-difc", "luxembourg"],
    locale: "fr",
    paidTier: "starter",
  };

  try {
    const { generateStarterKit } = await import("@/lib/jurisdictions/starter-kit-generate");
    const kit = await generateStarterKit(ctx);
    checks.push(
      check(
        AGENT,
        "starter kit generation",
        kit.content.regulatoryChecklist.length >= 6,
        `provider=${kit.provider}, checklist=${kit.content.regulatoryChecklist.length}`
      )
    );

    const readiness = computeStarterReadiness(kit.content);
    checks.push(
      check(
        AGENT,
        "starter readiness",
        readiness.priorities.length <= 3,
        `score=${readiness.score}`
      )
    );
  } catch (e) {
    checks.push(
      check(
        AGENT,
        "starter kit generation",
        false,
        e instanceof Error ? e.message : String(e)
      )
    );
  }

  try {
    const { generateStarterKitOverviewPdf } = await import(
      "@/lib/jurisdictions/starter-kit-overview-pdf"
    );
    const blob = await generateStarterKitOverviewPdf("fr");
    checks.push(
      check(
        AGENT,
        "overview pdf",
        blob.size > 1000,
        `${blob.size} bytes`
      )
    );
  } catch (e) {
    checks.push(
      check(AGENT, "overview pdf", false, e instanceof Error ? e.message : String(e))
    );
  }

  return checks;
}
