import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { GREEN_HUB_ROUTE } from "@/lib/green";
import { computeGreenHubImpact } from "@/lib/green/hub-impact";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";
import { auditOgImage, mergeAuditOg } from "@/lib/seo/audit-og";
import { metadataFromPath } from "@/lib/seo/metadata";

import { GreenHubView } from "../_components/GreenHubView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = mergeAuditOg(
  metadataFromPath(GREEN_HUB_ROUTE),
  auditOgImage(
    "/green/hub",
    "AUROS+Green+%E2%80%94+%C3%89nergie+locale",
    "AUROS Green"
  ),
  { siteName: "AUROS" }
);

export default async function GreenHubPage() {
  const [marketSnapshot, registrySnapshot] = await Promise.all([
    getGreenMarketSnapshot(),
    getGreenRegistrySnapshot(),
  ]);

  const impact = computeGreenHubImpact(registrySnapshot);

  return (
    <>
      <AiFirstPageJsonLd path={GREEN_HUB_ROUTE} />
      <GreenHubView
        marketSnapshot={marketSnapshot}
        impact={impact}
        registrySnapshot={registrySnapshot}
      />
    </>
  );
}
