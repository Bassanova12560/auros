import type { Metadata } from "next";

import { PrivateCreditPageContent } from "@/app/comparators/_components/PrivateCreditPageContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import { COMPARATOR_ROUTES, getPrivateCreditRows } from "@/lib/comparators";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Tokenized Private Credit Comparator | AUROS",
  description:
    "Compare on-chain private credit — Maple, Centrifuge, Clearpool, Apollo ACRED, Hamilton Lane HLSCOPE. Live DeFiLlama APY. Educational only.",
  alternates: { canonical: COMPARATOR_ROUTES.privateCredit },
  openGraph: {
    title: "Tokenized Private Credit Comparator | AUROS",
    description:
      "Side-by-side private credit RWA yields — risk, TVL, chain, live vs manual.",
    url: absoluteUrl(COMPARATOR_ROUTES.privateCredit),
    siteName: "AUROS",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function PrivateCreditComparatorPage() {
  const { rows, fetchedAt, source } = await getPrivateCreditRows();

  return (
    <>
      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <PrivateCreditPageContent
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
