import type { Metadata } from "next";
import { Suspense } from "react";

import { CompareHubContent } from "@/app/comparators/_components/CompareHubContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import { COMPARATOR_ROUTES } from "@/lib/comparators";
import { getCompareHubPayload } from "@/lib/comparators/compare-hub";
import { auditOgImage, mergeAuditOg } from "@/lib/seo/audit-og";
import { metadataFromPath } from "@/lib/seo/metadata";

const compareOg = auditOgImage(
  "/compare",
  "Rendements+RWA+par+profil+de+risque",
  "Rendements RWA — AUROS Compare"
);

export const metadata: Metadata = mergeAuditOg(
  metadataFromPath(COMPARATOR_ROUTES.compare),
  compareOg
);

export const revalidate = 3600;

export default async function CompareHubPage() {
  const payload = await getCompareHubPayload();

  return (
    <>
      <main className="page-main page-main--sticky">
        <div className="page-inner page-inner--5xl mx-auto">
          <Suspense fallback={null}>
            <CompareHubContent payload={payload} />
          </Suspense>
        </div>
      </main>
      <DossierCtaStrip />
    </>
  );
}
