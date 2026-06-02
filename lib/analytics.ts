import { track as vercelTrack } from "@vercel/analytics";

/** Safe wrapper — no-ops when Analytics is unavailable (e.g. local dev). */
export function track(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>
): void {
  try {
    const cleaned = properties
      ? Object.fromEntries(
          Object.entries(properties).filter(
            ([, v]) => v !== undefined && v !== null
          )
        )
      : undefined;
    vercelTrack(event, cleaned);
  } catch {
    // ignore
  }
}
