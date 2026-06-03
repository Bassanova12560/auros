import type { Metadata } from "next";
import { Suspense } from "react";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_REGISTRY_ROUTE } from "@/lib/green";

import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";

import { GreenRegistryView } from "../_components/GreenRegistryView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Registre AUROS Green",
  description:
    "Registre public des projets et experts labellisés AUROS Green — cas pilotes RTMS et candidatures ouvertes.",
  alternates: { canonical: GREEN_REGISTRY_ROUTE },
  openGraph: {
    title: "AUROS Green registry",
    url: absoluteUrl(GREEN_REGISTRY_ROUTE),
    type: "website",
  },
};

export default async function GreenRegistryPage() {
  const snapshot = await getGreenRegistrySnapshot();
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_REGISTRY_ROUTE} />
      <Suspense
        fallback={
          <div className="page-inner page-inner--3xl mx-auto px-4 py-24 text-sm text-neutral-500">
            …
          </div>
        }
      >
        <GreenRegistryView snapshot={snapshot} />
      </Suspense>
    </>
  );
}
