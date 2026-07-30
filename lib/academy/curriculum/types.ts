import type { Locale } from "@/lib/i18n";

/** Localized copy — FR/EN required; ES/AR/ZH fall back to EN then FR. */
export type L10n = {
  fr: string;
  en: string;
  es?: string;
  ar?: string;
  zh?: string;
};

export type L10nList = {
  fr: readonly string[];
  en: readonly string[];
  es?: readonly string[];
  ar?: readonly string[];
  zh?: readonly string[];
};

export type AcademySchoolId =
  | "tokenized-resources"
  | "resource-trading"
  | "machine-economy";

export type AcademyModuleLevel = 101 | 201 | 301;

export type AcademyTrackId =
  | "energy-producer"
  | "water-utility"
  | "bank-risk"
  | "counsel-issuer"
  | "platform-builder"
  | "agent-engineer";

export type CurriculumQuizOption = {
  id: string;
  label: L10n;
};

export type CurriculumQuizQuestion = {
  id: string;
  prompt: L10n;
  options: CurriculumQuizOption[];
  correctOptionId: string;
};

export type CurriculumLesson = {
  id: string;
  title: L10n;
  body: L10n;
  keyTakeaways: L10nList;
  /** Soft product demos — labeled, not fake partners */
  labLinks?: { href: string; label: L10n }[];
};

export type CurriculumModule = {
  id: string;
  level: AcademyModuleLevel;
  slug: string;
  title: L10n;
  summary: L10n;
  estimatedMinutes: number;
  /** Métier tracks that should prioritize this module */
  tracks: AcademyTrackId[];
  lessons: CurriculumLesson[];
  quiz: {
    passScore: number;
    questions: CurriculumQuizQuestion[];
  };
};

export type CurriculumSchool = {
  id: AcademySchoolId;
  slug: AcademySchoolId;
  order: number;
  name: L10n;
  shortName: L10n;
  tagline: L10n;
  description: L10n;
  /** Path toward Fellow (project) — honesty: later */
  fellowNote: L10n;
  modules: CurriculumModule[];
};

export type CurriculumTrack = {
  id: AcademyTrackId;
  name: L10n;
  blurb: L10n;
  /** Recommended module keys `schoolId:moduleSlug` in priority order */
  recommended: string[];
};

export type ModuleProgress = {
  schoolId: AcademySchoolId;
  moduleId: string;
  lessonsCompleted: string[];
  quizPassed: boolean;
  quizScore?: number;
  updatedAt: string;
};

export type LearnerProgress = {
  userId: string;
  modules: ModuleProgress[];
  updatedAt: string;
};

export type ResolvedLesson = {
  id: string;
  title: string;
  body: string;
  keyTakeaways: string[];
  labLinks: { href: string; label: string }[];
};

export type ResolvedModule = {
  id: string;
  level: AcademyModuleLevel;
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  tracks: AcademyTrackId[];
  lessons: ResolvedLesson[];
  quiz: {
    passScore: number;
    questions: {
      id: string;
      prompt: string;
      options: { id: string; label: string }[];
      correctOptionId: string;
    }[];
  };
};

export type ResolvedSchool = {
  id: AcademySchoolId;
  slug: AcademySchoolId;
  order: number;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  fellowNote: string;
  modules: ResolvedModule[];
};

export type CurriculumLocale = Locale;
