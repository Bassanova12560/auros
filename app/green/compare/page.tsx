import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_COMPARE_ROUTE } from "@/lib/green";
import {
  parseCompareCountriesParam,
  parseCompareOfferIdsParam,
} from "@/lib/green/market/compare-selection";
import { getGreenMarketOfferById } from "@/lib/green/market/green-market-db";

import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";

import { GreenCompareView } from "../_components/GreenCompareView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comparateur projets verts tokenisés (RWA) | AUROS Green",
  description:
    "Comparez projets verts tokenisés sourcés : solaire, REC, carbone, PPA. Statuts label honnêtes, liens primaires, rendements indicatifs — éducation, pas conseil en investissement.",
  keywords: [
    "comparateur RWA vert",
    "projets tokenisés énergie renouvelable",
    "REC tokenization compare",
    "crédits carbone on-chain",
    "green RWA comparator",
    "AUROS Green",
  ],
  alternates: { canonical: GREEN_COMPARE_ROUTE },
  openGraph: {
    title: "Green tokenized projects comparator | AUROS Green",
    description:
      "Sourced green RWA market references — honest label statuses, primary sources.",
    url: absoluteUrl(GREEN_COMPARE_ROUTE),
    type: "website",
  },
};

type PageProps = {
  searchParams: Promise<{ offers?: string; countries?: string }>;
};

export default async function GreenComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialOfferIds = parseCompareOfferIdsParam(params.offers);
  void parseCompareCountriesParam(params.countries);
  const resolvedOffers = (
    await Promise.all(initialOfferIds.map((id) => getGreenMarketOfferById(id)))
  ).filter((offer) => offer != null);

  const snapshot = await getGreenRegistrySnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_COMPARE_ROUTE} />
      <GreenCompareView
        registryProjects={snapshot.projects}
        initialOfferIds={initialOfferIds}
        resolvedOffers={resolvedOffers}
      />
    </>
  );
}
