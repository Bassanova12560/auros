import { AI_CONFIG } from "@/lib/ai-config";

let dayKey = "";
let count = 0;

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Global daily cap across all users (serverless: per instance, still limits burst). */
export function checkAiDailyBudget(): { allowed: boolean; remaining: number } {
  const cap = AI_CONFIG.dailyGenerationCap;
  if (cap <= 0) return { allowed: true, remaining: 999_999 };

  const today = utcDay();
  if (dayKey !== today) {
    dayKey = today;
    count = 0;
  }

  if (count >= cap) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: cap - count };
}

/** Call once per real AI generation (not cache hits). */
export function consumeAiDailyBudget(): void {
  const cap = AI_CONFIG.dailyGenerationCap;
  if (cap <= 0) return;

  const today = utcDay();
  if (dayKey !== today) {
    dayKey = today;
    count = 0;
  }
  count++;
}
