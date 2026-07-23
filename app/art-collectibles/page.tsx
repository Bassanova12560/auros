import type { Metadata } from "next";

import { ArtPageContent } from "@/app/comparators/_components/ArtPageContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import {
  COMPARATOR_ROUTES,
  buildComparatorFaqJsonLd,
  buildComparatorItemListJsonLd,
  getArtRows,
} from "@/lib/comparators";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Tokenized Art & Collectibles Comparator | AUROS",
  description:
    "Compare tokenized art and collectibles platforms — Masterworks, Particle, Artory and more. No invented yields; educational RWA comparison.",
  alternates: { canonical: COMPARATOR_ROUTES.art },
  openGraph: {
    title: "Tokenized Art & Collectibles | AUROS Compare",
    description:
      "Side-by-side art RWA comparison — platforms, chains, liquidity proxies. Indicative only.",
    url: absoluteUrl(COMPARATOR_ROUTES.art),
    siteName: "AUROS",
    type: "website",
  },
};

export const revalidate = 3600;

const FAQS = [
  {
    question: "Do art RWAs have APY?",
    answer:
      "Usually not as a coupon. AUROS lists art and collectibles with APY 0 unless a public yield is clearly documented. Compare platforms on access, custody, and liquidity instead.",
  },
  {
    question: "Is this investment advice?",
    answer:
      "No. Listings are educational references to help structure a dossier. Verify each platform’s terms and local regulation.",
  },
];

export default async function ArtCollectiblesComparatorPage() {
  const { rows, fetchedAt, source } = await getArtRows();
  const itemList = buildComparatorItemListJsonLd({
    name: "Tokenized Art & Collectibles Comparator",
    description: metadata.description as string,
    url: COMPARATOR_ROUTES.art,
    items: rows.map((r) => ({
      name: `${r.platform} — ${r.product}`,
      url: r.link,
    })),
  });
  const faq = buildComparatorFaqJsonLd(FAQS, COMPARATOR_ROUTES.art);

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
          <ArtPageContent rows={rows} fetchedAt={fetchedAt} source={source} />
        </div>
      </main>

      <DossierCtaStrip />
    </>
  );
}
