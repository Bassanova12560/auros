import type { Metadata } from "next";

import { CompareHubContent } from "@/app/comparators/_components/CompareHubContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import { COMPARATOR_ROUTES } from "@/lib/comparators";
import { getCompareHubPayload } from "@/lib/comparators/compare-hub";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = metadataFromPath(COMPARATOR_ROUTES.compare);

export const revalidate = 3600;

export default async function CompareHubPage() {
  const payload = await getCompareHubPayload();

  return (
    <>
      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <CompareHubContent payload={payload} />
        </div>
      </main>
      <DossierCtaStrip />
    </>
  );
}
