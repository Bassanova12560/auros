import type { Metadata } from "next";



import { CompareHubContent } from "@/app/comparators/_components/CompareHubContent";

import { DossierCtaStrip } from "@/app/comparators/_components/DossierCtaStrip";

import { COMPARATOR_ROUTES } from "@/lib/comparators";

import { getCompareHubPayload } from "@/lib/comparators/compare-hub";

import { absoluteUrl } from "@/lib/comparators/site";



export const metadata: Metadata = {

  title: "RWA Yields by Risk Profile | AUROS Compare",

  description:

    "Compare tokenized RWA yields across stablecoins, real estate, bonds, commodities and private credit — grouped by risk tier.",

  alternates: {

    canonical: COMPARATOR_ROUTES.compare,

  },

  openGraph: {

    title: "RWA Yields by Risk Profile | AUROS Compare",

    description:

      "Aggregated RWA yield comparison across all AUROS comparators, grouped by risk profile.",

    url: absoluteUrl(COMPARATOR_ROUTES.compare),

    siteName: "AUROS",

    type: "website",

  },

};



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

