import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_STORERS_ROUTE } from "@/lib/green";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";

import { GreenActorListView } from "../_components/market/GreenActorListView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stockeurs | AUROS Green",
  description: "Batteries et stockage — place de marché AUROS Green.",
  alternates: { canonical: GREEN_STORERS_ROUTE },
  openGraph: { title: "Green storers", url: absoluteUrl(GREEN_STORERS_ROUTE), type: "website" },
};

export default async function GreenStorersPage() {
  const snapshot = await getGreenMarketSnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_STORERS_ROUTE} />
      <GreenActorListView
        type="storer"
        actors={snapshot.actors.filter((a) => a.type === "storer")}
      />
    </>
  );
}
