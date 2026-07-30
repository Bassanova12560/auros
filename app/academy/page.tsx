import type { Metadata } from "next";
import { cookies } from "next/headers";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ACADEMY_ROUTE } from "@/lib/academy";
import { resolveAllSchools } from "@/lib/academy/curriculum/load";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  localeFromCookieValue,
} from "@/lib/i18n";
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

export default async function AcademyPage() {
  const jar = await cookies();
  const locale =
    localeFromCookieValue(jar.get(LOCALE_STORAGE_KEY)?.value) ?? DEFAULT_LOCALE;
  const schools = resolveAllSchools(locale);

  return (
    <>
      <AiFirstPageJsonLd path={ACADEMY_ROUTE} />
      <AcademyHomeView tallyUrl={academyTallyUrl()} schools={schools} />
    </>
  );
}
