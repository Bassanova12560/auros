import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { EAU_ROUTE } from "@/lib/eau/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

import { EauHubView } from "./_components/EauHubView";

export const metadata: Metadata = metadataFromPath(EAU_ROUTE);

export default function EauHubPage() {
  return (
    <>
      <AiFirstPageJsonLd path={EAU_ROUTE} />
      <EauHubView />
    </>
  );
}
