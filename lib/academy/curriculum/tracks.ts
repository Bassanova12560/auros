import type { Locale } from "@/lib/i18n";

import { tL10n } from "./l10n";
import { loadCurriculumTracks } from "./load";
import type { AcademyTrackId, CurriculumTrack } from "./types";

export function getTracks(locale: Locale): {
  id: AcademyTrackId;
  name: string;
  blurb: string;
  recommended: string[];
}[] {
  return loadCurriculumTracks().map((track) => ({
    id: track.id,
    name: tL10n(track.name, locale),
    blurb: tL10n(track.blurb, locale),
    recommended: [...track.recommended],
  }));
}

export function getTrackById(id: AcademyTrackId): CurriculumTrack | null {
  return loadCurriculumTracks().find((t) => t.id === id) ?? null;
}

export function isModuleRecommendedForTrack(
  schoolId: string,
  moduleSlug: string,
  trackId: AcademyTrackId | null
): boolean {
  if (!trackId) return true;
  const track = getTrackById(trackId);
  if (!track) return true;
  const key = `${schoolId}:${moduleSlug}`;
  return track.recommended.includes(key);
}
