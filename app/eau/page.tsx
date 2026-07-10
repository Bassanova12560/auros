import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { EAU_ROUTE } from "@/lib/eau/constants";
import { getEauHubCopy } from "@/lib/eau/i18n";
import { metadataFromPath } from "@/lib/seo/metadata";

import { EauHubView } from "./_components/EauHubView";

export const metadata: Metadata = metadataFromPath(EAU_ROUTE);

export default function EauHubPage() {
  const copy = getEauHubCopy("fr");

  return (
    <>
      <AiFirstPageJsonLd
        path={EAU_ROUTE}
        title={copy.title}
        description={copy.description}
      />
      <EauHubView />
    </>
  );
}
