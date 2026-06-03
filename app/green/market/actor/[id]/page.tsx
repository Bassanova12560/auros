import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { getGreenMarketActorById } from "@/lib/green/market/green-market-db";
import { formatGreenMarketActorTitle } from "@/lib/green/market/actor-detail";
import { greenMarketActorPath } from "@/lib/green/market/actor-routes";
import { buildGreenMarketActorJsonLd } from "@/lib/green/market/json-ld";

import { GreenActorDetailView } from "@/app/green/_components/market/GreenActorDetailView";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const actor = await getGreenMarketActorById(id);

  if (!actor) {
    return {
      title: "Acteur introuvable | AUROS Green",
      robots: { index: false, follow: false },
    };
  }

  const title = formatGreenMarketActorTitle(actor, "fr");
  const path = greenMarketActorPath(actor.id);

  return {
    title: `${title} | AUROS Green`,
    description: actor.description.slice(0, 160),
    alternates: { canonical: path },
    openGraph: {
      title,
      description: actor.description.slice(0, 200),
      url: absoluteUrl(path),
      type: "profile",
    },
  };
}

export default async function GreenMarketActorPage({ params }: PageProps) {
  const { id } = await params;
  const actor = await getGreenMarketActorById(id);

  if (!actor) notFound();

  const path = greenMarketActorPath(actor.id);
  const entityJsonLd = buildGreenMarketActorJsonLd(actor, "fr");

  return (
    <>
      <AiFirstPageJsonLd path={path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entityJsonLd) }}
      />
      <GreenActorDetailView actor={actor} />
    </>
  );
}
