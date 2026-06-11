import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ACADEMY_ROUTE } from "@/lib/academy";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { AcademyHomeView } from "./_components/AcademyHomeView";

function academyTallyUrl(): string | null {
  return process.env.TALLY_URL?.trim() || null;
}

export const metadata: Metadata = withOgImage(
  metadataFromPath(ACADEMY_ROUTE),
  ACADEMY_ROUTE,
  "AUROS Academy"
);

export default function AcademyPage() {
  return (
    <>
      <AiFirstPageJsonLd path={ACADEMY_ROUTE} />
      <AcademyHomeView tallyUrl={academyTallyUrl()} />
    </>
  );
}
