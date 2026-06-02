import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_CONSUMERS_ROUTE } from "@/lib/green";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";

import { GreenActorListView } from "../_components/market/GreenActorListView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Consommateurs | AUROS Green",
  description: "Consommateurs et acheteurs d'énergie locale — AUROS Green.",
  alternates: { canonical: GREEN_CONSUMERS_ROUTE },
  openGraph: { title: "Green consumers", url: absoluteUrl(GREEN_CONSUMERS_ROUTE), type: "website" },
};

export default async function GreenConsumersPage() {
  const snapshot = await getGreenMarketSnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_CONSUMERS_ROUTE} />
      <GreenActorListView
        type="consumer"
        actors={snapshot.actors.filter((a) => a.type === "consumer")}
      />
    </>
  );
}
