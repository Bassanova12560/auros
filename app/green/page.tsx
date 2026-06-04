import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { GREEN_ROUTE } from "@/lib/green";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { computeGreenHubImpact } from "@/lib/green/hub-impact";

import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";

import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";



import { GreenHubView } from "./_components/GreenHubView";



export const dynamic = "force-dynamic";

export const metadata: Metadata = withOgImage(
  metadataFromPath(GREEN_ROUTE),
  GREEN_ROUTE,
  "AUROS Green — Énergie locale"
);



export default async function GreenPage() {

  const [marketSnapshot, registrySnapshot] = await Promise.all([

    getGreenMarketSnapshot(),

    getGreenRegistrySnapshot(),

  ]);

  const impact = computeGreenHubImpact(registrySnapshot);



  return (
    <>
      <AiFirstPageJsonLd path={GREEN_ROUTE} />
      <GreenHubView
        marketSnapshot={marketSnapshot}
        impact={impact}
        registrySnapshot={registrySnapshot}
      />
    </>
  );

}

