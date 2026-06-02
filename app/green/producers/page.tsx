import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_PRODUCERS_ROUTE } from "@/lib/green";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";

import { GreenActorListView } from "../_components/market/GreenActorListView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Producteurs | AUROS Green",
  description: "Producteurs solaire, éolien, hydro — place de marché AUROS Green.",
  alternates: { canonical: GREEN_PRODUCERS_ROUTE },
  openGraph: { title: "Green producers", url: absoluteUrl(GREEN_PRODUCERS_ROUTE), type: "website" },
};

export default async function GreenProducersPage() {
  const snapshot = await getGreenMarketSnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_PRODUCERS_ROUTE} />
      <GreenActorListView
        type="producer"
        actors={snapshot.actors.filter((a) => a.type === "producer")}
      />
    </>
  );
}
