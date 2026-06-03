import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { GREEN_COMPARE_ROUTE } from "@/lib/green";
import { lookupGreenCompareSnapshot } from "@/lib/green/compare-snapshot";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import { getGreenMarketOfferById } from "@/lib/green/market/green-market-db";

import { GreenCompareView } from "../../../_components/GreenCompareView";
import { GreenCompareSnapshotExpiredView } from "../../../_components/GreenCompareSnapshotExpiredView";

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
  const lookup = await lookupGreenCompareSnapshot(id);

  if (lookup.status === "expired") {
    return <GreenCompareSnapshotExpiredView reason="expired" />;
  }

  if (lookup.status === "not_found") {
    return <GreenCompareSnapshotExpiredView reason="not_found" />;
  }

  const { snapshot } = lookup;
  const { countries, offerIds, rwaRowIds } = snapshot.payload;
  const resolvedOffers = (
    await Promise.all(offerIds.map((offerId) => getGreenMarketOfferById(offerId)))
  ).filter((offer) => offer != null);

  const registrySnapshot = await getGreenRegistrySnapshot();

  return (
    <>
      <AiFirstPageJsonLd path={`${GREEN_COMPARE_ROUTE}/s/${snapshot.id}`} />
      <GreenCompareView
        registryProjects={registrySnapshot.projects}
        initialOfferIds={offerIds}
        initialCountries={countries}
        initialRwaRowIds={rwaRowIds}
        resolvedOffers={resolvedOffers}
        snapshotId={snapshot.id}
      />
    </>
  );
}
