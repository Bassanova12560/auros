import type { Metadata } from "next";
import { Suspense } from "react";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_MARKET_ROUTE } from "@/lib/green";
import { auditOgImage, mergeAuditOg } from "@/lib/seo/audit-og";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";

import { GreenMarketSkeleton } from "../_components/market/GreenMarketSkeleton";
import { GreenMarketView } from "../_components/market/GreenMarketView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = mergeAuditOg(
  {
    title: "Place de marché | AUROS Green",
    description:
      "Carte interactive et annonces énergie locale — producteurs, stockeurs, rechargeurs, consommateurs. Données indicatives AUROS Green.",
    alternates: { canonical: GREEN_MARKET_ROUTE },
    openGraph: {
      title: "AUROS Green marketplace",
      url: absoluteUrl(GREEN_MARKET_ROUTE),
      type: "website",
    },
  },
  auditOgImage("/green/market", "Place+de+march%C3%A9+%C3%A9nergie+verte")
);

export default async function GreenMarketPage() {
  const snapshot = await getGreenMarketSnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_MARKET_ROUTE} />
      <Suspense fallback={<GreenMarketSkeleton />}>
        <GreenMarketView snapshot={snapshot} />
      </Suspense>
    </>
  );
}
