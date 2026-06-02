import type { Metadata } from "next";

import { StablecoinsPageContent } from "@/app/comparators/_components/StablecoinsPageContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import { COMPARATOR_ROUTES } from "@/lib/comparators";
import { getStablecoinRows } from "@/lib/comparators";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "RWA Stablecoins Comparator | AUROS",
  description:
    "Compare RWA-backed stablecoins — live APY and TVL via DeFiLlama. Updated hourly.",
  alternates: {
    canonical: COMPARATOR_ROUTES.stablecoins,
  },
  openGraph: {
    title: "RWA Stablecoins Comparator | AUROS",
    description:
      "Compare RWA-backed stablecoins — live APY and TVL via DeFiLlama.",
    url: absoluteUrl(COMPARATOR_ROUTES.stablecoins),
    siteName: "AUROS",
    type: "website",
  },
};

export const revalidate = 3600;

function buildJsonLd(rows: Awaited<ReturnType<typeof getStablecoinRows>>["rows"]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RWA Stablecoins Comparator",
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

export default async function StablecoinsComparatorPage() {
  const { rows, fetchedAt, source } = await getStablecoinRows();
  const jsonLd = buildJsonLd(rows);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <StablecoinsPageContent
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
