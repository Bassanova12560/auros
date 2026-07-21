import type { Metadata } from "next";
import { Suspense } from "react";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { COPILOT_ROUTE } from "@/lib/copilot/types";
import { metadataFromPath } from "@/lib/seo/metadata";

import { CopilotChatView } from "./CopilotChatView";
import { CopilotLoadingFallback } from "./CopilotLoadingFallback";

export const metadata: Metadata = {
  ...metadataFromPath(COPILOT_ROUTE),
  title: "AUROS Copilot | Assistant RWA",
  description:
    "Assistant AUROS pour le comparateur RWA, juridictions, Protocol API et ChargeFlow — réponses sourcées, indicatives.",
};

export default function CopilotPage() {
  return (
    <>
      <AiFirstPageJsonLd path={COPILOT_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <Suspense fallback={<CopilotLoadingFallback />}>
          <CopilotChatView />
        </Suspense>
      </div>
    </>
  );
}
