import type { Locale } from "@/lib/i18n";

import machineEconomy from "@/data/academy/content/machine-economy.json";
import resourceTrading from "@/data/academy/content/resource-trading.json";
import tokenizedResources from "@/data/academy/content/tokenized-resources.json";
import tracksJson from "@/data/academy/tracks.json";

import { tL10n, tL10nList } from "./l10n";
import type {
  AcademySchoolId,
  CurriculumSchool,
  CurriculumTrack,
  ResolvedModule,
  ResolvedSchool,
} from "./types";

export const ACADEMY_SCHOOL_IDS: AcademySchoolId[] = [
  "tokenized-resources",
  "resource-trading",
  "machine-economy",
];

const SCHOOLS: CurriculumSchool[] = [
  tokenizedResources as CurriculumSchool,
  resourceTrading as CurriculumSchool,
  machineEconomy as CurriculumSchool,
].sort((a, b) => a.order - b.order);

const TRACKS = tracksJson as CurriculumTrack[];

export function loadCurriculumSchools(): CurriculumSchool[] {
  return SCHOOLS;
}

export function loadCurriculumTracks(): CurriculumTrack[] {
  return TRACKS;
}

export function getCurriculumSchool(id: string): CurriculumSchool | null {
  if (!ACADEMY_SCHOOL_IDS.includes(id as AcademySchoolId)) return null;
  return SCHOOLS.find((s) => s.id === id) ?? null;
}

export function getCurriculumModule(
  schoolId: string,
  moduleSlug: string
): { school: CurriculumSchool; module: CurriculumSchool["modules"][number] } | null {
  const school = getCurriculumSchool(schoolId);
  if (!school) return null;
  const mod = school.modules.find((m) => m.slug === moduleSlug || m.id === moduleSlug);
  if (!mod) return null;
  return { school, module: mod };
}

function resolveModule(
  mod: CurriculumSchool["modules"][number],
  locale: Locale
): ResolvedModule {
  return {
    id: mod.id,
    level: mod.level,
    slug: mod.slug,
    title: tL10n(mod.title, locale),
    summary: tL10n(mod.summary, locale),
    estimatedMinutes: mod.estimatedMinutes,
    tracks: mod.tracks,
    lessons: mod.lessons.map((lesson) => ({
      id: lesson.id,
      title: tL10n(lesson.title, locale),
      body: tL10n(lesson.body, locale),
      keyTakeaways: tL10nList(lesson.keyTakeaways, locale),
      labLinks: (lesson.labLinks ?? []).map((link) => ({
        href: link.href,
        label: tL10n(link.label, locale),
      })),
    })),
    quiz: {
      passScore: mod.quiz.passScore,
      questions: mod.quiz.questions.map((q) => ({
        id: q.id,
        prompt: tL10n(q.prompt, locale),
        options: q.options.map((o) => ({
          id: o.id,
          label: tL10n(o.label, locale),
        })),
        correctOptionId: q.correctOptionId,
      })),
    },
  };
}

export function resolveSchool(
  school: CurriculumSchool,
  locale: Locale
): ResolvedSchool {
  return {
    id: school.id,
    slug: school.slug,
    order: school.order,
    name: tL10n(school.name, locale),
    shortName: tL10n(school.shortName, locale),
    tagline: tL10n(school.tagline, locale),
    description: tL10n(school.description, locale),
    fellowNote: tL10n(school.fellowNote, locale),
    modules: school.modules.map((m) => resolveModule(m, locale)),
  };
}

export function resolveAllSchools(locale: Locale): ResolvedSchool[] {
  return loadCurriculumSchools().map((s) => resolveSchool(s, locale));
}

export function moduleProgressKey(schoolId: string, moduleId: string): string {
  return `${schoolId}:${moduleId}`;
}

export function scoreCurriculumQuiz(
  questions: { id: string; correctOptionId: string }[],
  answers: Record<string, string>
): number {
  let score = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctOptionId) score += 1;
  }
  return score;
}

export function schoolPath(schoolId: AcademySchoolId | string): string {
  return `/academy/${schoolId}`;
}

export function modulePath(
  schoolId: AcademySchoolId | string,
  moduleSlug: string
): string {
  return `/academy/${schoolId}/${moduleSlug}`;
}
