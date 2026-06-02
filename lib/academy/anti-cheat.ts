import type { QuestionTimings } from "./types";
import {
  MIN_QUESTION_MS,
  MIN_QUIZ_TOTAL_MS,
  MIN_CHALLENGE_MS,
  MAX_QUIZ_SESSION_MINUTES,
} from "./constants";
import { sessionExpired } from "./session-token";

export type AntiCheatResult =
  | { ok: true }
  | { ok: false; reason: string };

export function validateQuizTimings(
  questionIds: string[],
  timings: QuestionTimings | undefined,
  sessionExpiresAt: string
): AntiCheatResult {
  if (sessionExpired(sessionExpiresAt)) {
    return { ok: false, reason: "session_expired" };
  }

  if (!timings || typeof timings !== "object") {
    return { ok: false, reason: "missing_timings" };
  }

  let total = 0;
  for (const id of questionIds) {
    const ms = timings[id];
    if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) {
      return { ok: false, reason: "invalid_timing" };
    }
    total += ms;
  }

  if (Object.keys(timings).length !== questionIds.length) {
    return { ok: false, reason: "timing_count_mismatch" };
  }

  // Total duration is the main signal; per-question floor only catches instant bot clicks.
  if (total < MIN_QUIZ_TOTAL_MS) {
    return { ok: false, reason: "quiz_completed_too_fast" };
  }

  const instantClicks = questionIds.filter((id) => timings[id]! < MIN_QUESTION_MS);
  if (instantClicks.length >= 3) {
    return { ok: false, reason: "answer_too_fast" };
  }

  const maxMs = MAX_QUIZ_SESSION_MINUTES * 60_000;
  if (total > maxMs) {
    return { ok: false, reason: "session_timeout" };
  }

  return { ok: true };
}

export function validateChallengeTiming(
  elapsedMs: number | undefined,
  sessionExpiresAt: string
): AntiCheatResult {
  if (sessionExpired(sessionExpiresAt)) {
    return { ok: false, reason: "session_expired" };
  }
  if (typeof elapsedMs !== "number" || elapsedMs < MIN_CHALLENGE_MS) {
    return { ok: false, reason: "challenge_too_fast" };
  }
  return { ok: true };
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export function detectPasteBomb(text: string): boolean {
  const words = countWords(text);
  if (words > 600) return true;
  const repeated = /(.{40,})\1{2,}/.test(text);
  return repeated;
}
