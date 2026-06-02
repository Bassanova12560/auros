import type { Metadata } from "next";
import { Suspense } from "react";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_MARKET_ROUTE } from "@/lib/green";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";

import { GreenMarketView } from "../_components/market/GreenMarketView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Place de marché | AUROS Green",
  description:
    "Carte interactive et annonces énergie locale — producteurs, stockeurs, rechargeurs, consommateurs. MVP AUROS Green.",
  alternates: { canonical: GREEN_MARKET_ROUTE },
  openGraph: {
    title: "AUROS Green marketplace",
    url: absoluteUrl(GREEN_MARKET_ROUTE),
    type: "website",
  },
};

export default async function GreenMarketPage() {
  const snapshot = await getGreenMarketSnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_MARKET_ROUTE} />
      <Suspense
        fallback={
          <div className="page-inner page-inner--6xl mx-auto px-4 py-24 text-sm text-white/50">
            …
          </div>
        }
      >
        <GreenMarketView snapshot={snapshot} />
      </Suspense>
    </>
  );
}
