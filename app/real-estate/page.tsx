import type { Metadata } from "next";

import { ImmobilierPageContent } from "@/app/comparators/_components/ImmobilierPageContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import { COMPARATOR_ROUTES } from "@/lib/comparators";
import { getImmobilierRows } from "@/lib/comparators";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Tokenized Real Estate Comparator | AUROS",
  description:
    "Compare tokenized real estate platforms — indicative rental yields and assets under management.",
  alternates: {
    canonical: COMPARATOR_ROUTES.realEstate,
  },
  openGraph: {
    title: "Tokenized Real Estate Comparator | AUROS",
    description:
      "Compare tokenized real estate platforms — rental yields and AUM.",
    url: absoluteUrl(COMPARATOR_ROUTES.realEstate),
    siteName: "AUROS",
    type: "website",
  },
};

export const revalidate = 3600;

function buildJsonLd(rows: Awaited<ReturnType<typeof getImmobilierRows>>["rows"]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tokenized Real Estate Comparator",
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

export default async function RealEstateComparatorPage() {
  const { rows, fetchedAt, source } = await getImmobilierRows();
  const jsonLd = buildJsonLd(rows);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <ImmobilierPageContent
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
