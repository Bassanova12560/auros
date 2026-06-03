import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { GREEN_COMPARE_ROUTE } from "@/lib/green";
import {
  filterCompareRowsBySnapshot,
  getGreenCompareSnapshot,
} from "@/lib/green/compare-snapshot";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import { getGreenMarketOfferById } from "@/lib/green/market/green-market-db";

import { GreenCompareView } from "../../../_components/GreenCompareView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comparaison partagée | AUROS Green",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function GreenCompareSnapshotPage({ params }: PageProps) {
  const { id } = await params;
  const snapshot = await getGreenCompareSnapshot(id);

  if (!snapshot) {
    const fallback = new URLSearchParams();
    redirect(`${GREEN_COMPARE_ROUTE}${fallback.toString() ? `?${fallback}` : ""}`);
  }

  const { countries, offerIds, rwaRowIds } = snapshot.payload;
  const resolvedOffers = (
    await Promise.all(offerIds.map((offerId) => getGreenMarketOfferById(offerId)))
  ).filter((offer) => offer != null);

  const registrySnapshot = await getGreenRegistrySnapshot();
  const compareRows = filterCompareRowsBySnapshot(rwaRowIds);

  return (
    <>
      <AiFirstPageJsonLd path={`${GREEN_COMPARE_ROUTE}/s/${snapshot.id}`} />
      <GreenCompareView
        registryProjects={registrySnapshot.projects}
        initialOfferIds={offerIds}
        initialCountries={countries}
        resolvedOffers={resolvedOffers}
        compareRows={compareRows}
        snapshotId={snapshot.id}
      />
    </>
  );
}
