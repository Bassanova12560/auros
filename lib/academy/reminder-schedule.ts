const MS_DAY = 86_400_000;

export type ReminderKind = "j14" | "j3";

/** Which optional reminder is due today (cron runs daily). */
export function dueReminderKind(
  expiresAtIso: string,
  nowMs: number,
  sent: { j14: boolean; j3: boolean }
): ReminderKind | null {
  const expires = new Date(expiresAtIso).getTime();
  if (Number.isNaN(expires) || expires <= nowMs) return null;

  const daysLeft = (expires - nowMs) / MS_DAY;

  if (daysLeft <= 3 && daysLeft > 0 && !sent.j3) return "j3";
  if (daysLeft <= 14 && daysLeft > 3 && !sent.j14) return "j14";

  return null;
}
