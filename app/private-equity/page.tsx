import type { Metadata } from "next";

import { PrivateEquityPageContent } from "@/app/comparators/_components/PrivateEquityPageContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import {
  COMPARATOR_ROUTES,
  buildComparatorFaqJsonLd,
  buildComparatorItemListJsonLd,
  getPrivateEquityRows,
} from "@/lib/comparators";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Tokenized Private Equity & Stocks Comparator | AUROS",
  description:
    "Compare tokenized private equity funds and public equity RWAs — Securitize funds, Ondo stocks, Backed ETFs. Manual vs live sources labeled. Educational only.",
  alternates: { canonical: COMPARATOR_ROUTES.privateEquity },
  openGraph: {
    title: "Tokenized Private Equity & Stocks | AUROS Compare",
    description:
      "Side-by-side RWA equity and PE fund comparison — risk, TVL, chain, source freshness.",
    url: absoluteUrl(COMPARATOR_ROUTES.privateEquity),
    siteName: "AUROS",
    type: "website",
  },
};

export const revalidate = 3600;

const FAQS = [
  {
    question: "What tokenized equity products does AUROS compare?",
    answer:
      "Curated private equity / alt funds (e.g. Securitize issuances) and public equity wrappers (Ondo Global Markets, Backed, Swarm, Dinari). Many rows are manual with APY 0 when no honest public coupon exists.",
  },
  {
    question: "Is private equity the same as private credit?",
    answer:
      "No. Private credit pools (Maple, Centrifuge lending) live under /private-credit. This page focuses on equity exposure and PE-style fund tokens.",
  },
];

export default async function PrivateEquityComparatorPage() {
  const { rows, fetchedAt, source } = await getPrivateEquityRows();
  const itemList = buildComparatorItemListJsonLd({
    name: "Tokenized Private Equity & Stocks Comparator",
    description: metadata.description as string,
    url: COMPARATOR_ROUTES.privateEquity,
    items: rows.map((r) => ({
      name: `${r.platform} — ${r.product}`,
      url: r.link,
    })),
  });
  const faq = buildComparatorFaqJsonLd(FAQS, COMPARATOR_ROUTES.privateEquity);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <PrivateEquityPageContent
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
