/** Client-safe curriculum surface — no fs / Supabase. */
export type {
  AcademySchoolId,
  AcademyModuleLevel,
  AcademyTrackId,
  CurriculumSchool,
  CurriculumModule,
  CurriculumTrack,
  LearnerProgress,
  ModuleProgress,
  ResolvedSchool,
  ResolvedModule,
} from "./types";

export { getAcademyHubMessages } from "./hub-i18n";
export type { AcademyHubMessages } from "./hub-i18n";
export { tL10n, tL10nList } from "./l10n";
