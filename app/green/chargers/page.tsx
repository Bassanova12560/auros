import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_CHARGERS_ROUTE } from "@/lib/green";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";

import { GreenActorListView } from "../_components/market/GreenActorListView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rechargeurs | AUROS Green",
  description: "Bornes VE et recharge — place de marché AUROS Green.",
  alternates: { canonical: GREEN_CHARGERS_ROUTE },
  openGraph: { title: "Green chargers", url: absoluteUrl(GREEN_CHARGERS_ROUTE), type: "website" },
};

export default async function GreenChargersPage() {
  const snapshot = await getGreenMarketSnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_CHARGERS_ROUTE} />
      <GreenActorListView
        type="charger"
        actors={snapshot.actors.filter((a) => a.type === "charger")}
      />
    </>
  );
}
