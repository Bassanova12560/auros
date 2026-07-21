import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_TRUST_ROUTE } from "@/lib/green";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";
import { computeGreenProofMetrics } from "@/lib/green/proof-metrics";
import { auditOgImage, mergeAuditOg } from "@/lib/seo/audit-og";

import { GreenTrustView } from "../_components/GreenTrustView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = mergeAuditOg(
  {
    title: "Confiance | AUROS Green",
    description:
      "Méthode RTMS, tiers de preuve, registre, marché et limites assumées — sans M€ inventés.",
    alternates: { canonical: GREEN_TRUST_ROUTE },
    openGraph: {
      title: "Trust | AUROS Green",
      url: absoluteUrl(GREEN_TRUST_ROUTE),
      type: "website",
    },
  },
  auditOgImage("/green/trust", "Confiance+%7C+AUROS+Green")
);

export default async function GreenTrustPage() {
  const [registry, market] = await Promise.all([
    getGreenRegistrySnapshot(),
    getGreenMarketSnapshot(),
  ]);
  const metrics = computeGreenProofMetrics({ registry, market });

  return (
    <>
      <AiFirstPageJsonLd path={GREEN_TRUST_ROUTE} />
      <GreenTrustView metrics={metrics} />
    </>
  );
}
