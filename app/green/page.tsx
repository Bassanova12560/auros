import type { Metadata } from "next";



import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { absoluteUrl } from "@/lib/comparators/site";

import { GREEN_ROUTE } from "@/lib/green";

import { computeGreenHubImpact } from "@/lib/green/hub-impact";

import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";

import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";



import { GreenHubView } from "./_components/GreenHubView";



export const dynamic = "force-dynamic";



export const metadata: Metadata = {
  title: "Écosystème énergie verte | AUROS Green",
  description:
    "Place de marché mondiale, standard RTMS, registre public et label Verified. Producteurs, stockeurs, rechargeurs — écosystème autonome, statuts honnêtes.",
  alternates: { canonical: GREEN_ROUTE },
  openGraph: {
    title: "Green energy ecosystem | AUROS Green",
    description:
      "Worldwide marketplace, RTMS standard, public registry and Verified label. Producers, storers, chargers — standalone ecosystem, honest statuses.",
    url: absoluteUrl(GREEN_ROUTE),
    siteName: "AUROS Green",
    type: "website",
  },
};



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

