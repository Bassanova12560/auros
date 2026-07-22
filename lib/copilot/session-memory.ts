import {
  COPILOT_GREEN_BRIEF_STORAGE_KEY,
  type CopilotChatMessage,
} from "@/lib/copilot/types";

/** Device session memory consent (not marketing). */
export const COPILOT_MEMORY_CONSENT_KEY = "auros_copilot_memory_consent";
/** Optional chat turns for this browser session. */
export const COPILOT_TURNS_STORAGE_KEY = "auros_copilot_session_turns";

export const COPILOT_MAX_SESSION_TURNS = 12;

export type CopilotSessionTurn = CopilotChatMessage;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

/** Pure: clamp + serialize turns for sessionStorage. */
export function serializeCopilotTurns(turns: CopilotSessionTurn[]): string {
  const clipped = turns
    .filter(
      (t) =>
        t &&
        (t.role === "user" || t.role === "assistant") &&
        typeof t.content === "string"
    )
    .slice(-COPILOT_MAX_SESSION_TURNS)
    .map((t) => ({ role: t.role, content: t.content }));
  return JSON.stringify(clipped);
}

/** Pure: parse stored turns; invalid / empty → []. */
export function parseCopilotTurns(
  raw: string | null | undefined
): CopilotSessionTurn[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const turns: CopilotSessionTurn[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const role = (item as { role?: unknown }).role;
      const content = (item as { content?: unknown }).content;
      if (
        (role === "user" || role === "assistant") &&
        typeof content === "string"
      ) {
        turns.push({ role, content });
      }
    }
    return turns.slice(-COPILOT_MAX_SESSION_TURNS);
  } catch {
    return [];
  }
}

export function hasCopilotMemoryConsent(): boolean {
  if (!canUseSessionStorage()) return false;
  try {
    return sessionStorage.getItem(COPILOT_MEMORY_CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

export function setCopilotMemoryConsent(value: boolean): void {
  if (!canUseSessionStorage()) return;
  try {
    if (value) {
      sessionStorage.setItem(COPILOT_MEMORY_CONSENT_KEY, "1");
    } else {
      sessionStorage.removeItem(COPILOT_MEMORY_CONSENT_KEY);
      clearCopilotSessionMemory();
    }
  } catch {
    // ignore
  }
}

/** Clears turns + green brief; leaves consent flag untouched. */
export function clearCopilotSessionMemory(): void {
  if (!canUseSessionStorage()) return;
  try {
    sessionStorage.removeItem(COPILOT_TURNS_STORAGE_KEY);
    sessionStorage.removeItem(COPILOT_GREEN_BRIEF_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function saveCopilotTurns(turns: CopilotSessionTurn[]): void {
  if (!canUseSessionStorage() || !hasCopilotMemoryConsent()) return;
  try {
    sessionStorage.setItem(
      COPILOT_TURNS_STORAGE_KEY,
      serializeCopilotTurns(turns)
    );
  } catch {
    // ignore
  }
}

export function loadCopilotTurns(): CopilotSessionTurn[] {
  if (!canUseSessionStorage() || !hasCopilotMemoryConsent()) return [];
  try {
    return parseCopilotTurns(sessionStorage.getItem(COPILOT_TURNS_STORAGE_KEY));
  } catch {
    return [];
  }
}
