import type { Metadata } from "next";

import { CommoditiesPageContent } from "@/app/comparators/_components/CommoditiesPageContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import { COMPARATOR_ROUTES, getCommodityRows } from "@/lib/comparators";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Tokenized Commodities Comparator | AUROS",
  description:
    "Compare tokenized commodities — LandX agricultural yields and precious metals RWA. Updated hourly.",
  alternates: { canonical: COMPARATOR_ROUTES.commodities },
  openGraph: {
    title: "Tokenized Commodities Comparator | AUROS",
    description: "Compare RWA commodities — agricultural yields and tokenized gold.",
    url: absoluteUrl(COMPARATOR_ROUTES.commodities),
    siteName: "AUROS",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function CommoditiesComparatorPage() {
  const { rows, fetchedAt, source } = await getCommodityRows();

  return (
    <>
      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <CommoditiesPageContent
            rows={rows}
            fetchedAt={fetchedAt}
            source={source}
          />
        </div>
      </main>
      <DossierCtaStrip />
    </>
  );
}
