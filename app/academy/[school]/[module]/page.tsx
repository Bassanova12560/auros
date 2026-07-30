import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import {
  ACADEMY_SCHOOL_IDS,
  getCurriculumModule,
  getCurriculumSchool,
  modulePath,
  resolveSchool,
} from "@/lib/academy/curriculum/load";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  localeFromCookieValue,
} from "@/lib/i18n";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { ModuleLearnerView } from "../../_components/ModuleLearnerView";

type PageProps = {
  params: Promise<{ school: string; module: string }>;
};

export function generateStaticParams() {
  const params: { school: string; module: string }[] = [];
  for (const schoolId of ACADEMY_SCHOOL_IDS) {
    const school = getCurriculumSchool(schoolId);
    if (!school) continue;
    for (const mod of school.modules) {
      params.push({ school: schoolId, module: mod.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { school: schoolId, module: moduleSlug } = await params;
  const found = getCurriculumModule(schoolId, moduleSlug);
  if (!found) return {};
  const path = modulePath(found.school.id, found.module.slug);
  return withOgImage(
    {
      title: `${found.module.title.en} | AUROS Academy`,
      description: found.module.summary.en,
      ...metadataFromPath(path),
    },
    path,
    found.module.title.en
  );
}

export default async function AcademyModulePage({ params }: PageProps) {
  const { school: schoolId, module: moduleSlug } = await params;
  const found = getCurriculumModule(schoolId, moduleSlug);
  if (!found) notFound();

  const jar = await cookies();
  const locale =
    localeFromCookieValue(jar.get(LOCALE_STORAGE_KEY)?.value) ?? DEFAULT_LOCALE;
  const school = resolveSchool(found.school, locale);
  const module = school.modules.find((m) => m.id === found.module.id);
  if (!module) notFound();

  return (
    <>
      <AiFirstPageJsonLd path={modulePath(found.school.id, found.module.slug)} />
      <ModuleLearnerView school={school} module={module} />
    </>
  );
}
