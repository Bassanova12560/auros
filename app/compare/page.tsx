import type { Metadata } from "next";
import { Suspense } from "react";

import { CompareHubContent } from "@/app/comparators/_components/CompareHubContent";
import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";
import {
  COMPARATOR_ROUTES,
  COMPARE_HUB_FAQS,
  buildComparatorFaqJsonLd,
  getCompareHubPayload,
} from "@/lib/comparators";
import { auditOgImage, mergeAuditOg } from "@/lib/seo/audit-og";
import { metadataFromPath } from "@/lib/seo/metadata";

const compareOg = auditOgImage(
  "/compare",
  "RWA+comparator+live+vs+manual",
  "AUROS RWA Comparator"
);

export const metadata: Metadata = mergeAuditOg(
  {
    ...metadataFromPath(COMPARATOR_ROUTES.compare),
    title: "RWA Comparator — Yields by Risk, Class & Source | AUROS",
    description:
      "Compare 100+ tokenized RWA products: treasuries, real estate, private credit, equity, commodities and art. Live DeFiLlama vs curated manual rows — educational only.",
  },
  compareOg
);

export const revalidate = 3600;

export default async function CompareHubPage() {
  const payload = await getCompareHubPayload();
  const faq = buildComparatorFaqJsonLd(COMPARE_HUB_FAQS, COMPARATOR_ROUTES.compare);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
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
