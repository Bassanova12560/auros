const MS_DAY = 86_400_000;

export type LeadNurtureStep = 1 | 2;

/** Returns the nurture email step due now, or null if none. */
export function dueLeadNurtureStep(
  createdAtMs: number,
  nurtureStep: number,
  nowMs: number
): LeadNurtureStep | null {
  const ageMs = nowMs - createdAtMs;
  if (nurtureStep === 0 && ageMs >= MS_DAY) return 1;
  if (nurtureStep === 1 && ageMs >= MS_DAY * 3) return 2;
  return null;
}

export { MS_DAY as LEAD_NURTURE_MS_DAY };
