import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import {
  ACADEMY_SCHOOL_IDS,
  getCurriculumSchool,
  resolveSchool,
  schoolPath,
} from "@/lib/academy/curriculum/load";
import { getLearnerProgress } from "@/lib/academy/curriculum/progress";
import { getTracks } from "@/lib/academy/curriculum/tracks";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  localeFromCookieValue,
} from "@/lib/i18n";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { SchoolHubView } from "../_components/SchoolHubView";

type PageProps = {
  params: Promise<{ school: string }>;
};

export function generateStaticParams() {
  return ACADEMY_SCHOOL_IDS.map((school) => ({ school }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { school: schoolId } = await params;
  const school = getCurriculumSchool(schoolId);
  if (!school) return {};
  const path = schoolPath(school.id);
  return withOgImage(
    {
      title: `AUROS Academy — ${school.name.en}`,
      description: school.tagline.en,
      ...metadataFromPath(path),
    },
    path,
    school.name.en
  );
}

export default async function AcademySchoolPage({ params }: PageProps) {
  const { school: schoolId } = await params;
  const raw = getCurriculumSchool(schoolId);
  if (!raw) notFound();

  const jar = await cookies();
  const locale =
    localeFromCookieValue(jar.get(LOCALE_STORAGE_KEY)?.value) ?? DEFAULT_LOCALE;
  const school = resolveSchool(raw, locale);
  const tracks = getTracks(locale);

  const { userId } = await auth();
  const progress = userId ? await getLearnerProgress(userId) : null;

  return (
    <>
      <AiFirstPageJsonLd path={schoolPath(raw.id)} />
      <SchoolHubView
        school={school}
        tracks={tracks}
        initialProgress={progress?.modules ?? []}
      />
    </>
  );
}
