import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { getGreenMarketOfferById } from "@/lib/green/market/green-market-db";
import { formatGreenMarketOfferTitle } from "@/lib/green/market/offer-detail";
import { buildGreenMarketOfferJsonLd } from "@/lib/green/market/json-ld";
import { greenMarketOfferPath } from "@/lib/green/market/offer-routes";

import { GreenOfferDetailView } from "@/app/green/_components/market/GreenOfferDetailView";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const offer = await getGreenMarketOfferById(id);

  if (!offer) {
    return {
      title: "Annonce introuvable | AUROS Green",
      robots: { index: false, follow: false },
    };
  }

  const title = formatGreenMarketOfferTitle(offer, "fr");
  const path = greenMarketOfferPath(offer.id);

  return {
    title: `${title} | AUROS Green`,
    description: offer.description.slice(0, 160),
    alternates: { canonical: path },
    openGraph: {
      title,
      description: offer.description.slice(0, 200),
      url: absoluteUrl(path),
      type: "article",
    },
  };
}

export default async function GreenMarketOfferPage({ params }: PageProps) {
  const { id } = await params;
  const offer = await getGreenMarketOfferById(id);

  if (!offer) notFound();

  const path = greenMarketOfferPath(offer.id);
  const entityJsonLd = buildGreenMarketOfferJsonLd(offer, "fr");

  return (
    <>
      <AiFirstPageJsonLd path={path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entityJsonLd) }}
      />
      <GreenOfferDetailView offer={offer} />
    </>
  );
}
