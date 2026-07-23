import type { Metadata } from "next";

import { BondsPageContent } from "@/app/comparators/_components/BondsPageContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import { COMPARATOR_ROUTES, getBondRows } from "@/lib/comparators";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Tokenized Bonds & T-Bill Comparator | AUROS",
  description:
    "Compare tokenized bonds, T-Bills and treasury funds — OUSG, BUIDL, carbon-linked Green rows. Live DeFiLlama APY; manual sources labeled. Educational only.",
  alternates: {
    canonical: COMPARATOR_ROUTES.bonds,
  },
  openGraph: {
    title: "Tokenized Bonds & T-Bill Comparator | AUROS",
    description:
      "Side-by-side tokenized bonds and treasuries — APY, TVL, chain, source freshness.",
    url: absoluteUrl(COMPARATOR_ROUTES.bonds),
    siteName: "AUROS",
    type: "website",
  },
};

export const revalidate = 3600;

function buildJsonLd(rows: Awaited<ReturnType<typeof getBondRows>>["rows"]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tokenized Bonds Comparator",
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 20).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FinancialProduct",
        name: `${r.platform} — ${r.product}`,
        url: r.link,
      },
    })),
  };
}

export default async function BondsComparatorPage() {
  const { rows, fetchedAt, source } = await getBondRows();
  const jsonLd = buildJsonLd(rows);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <BondsPageContent rows={rows} fetchedAt={fetchedAt} source={source} />
        </div>
      </main>

      <DossierCtaStrip />
    </>
  );
}
