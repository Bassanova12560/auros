import {
  KEY_PREFIX_LIVE,
  KEY_PREFIX_TEST,
} from "@/lib/protocol/constants";
import { hashKey, isValidKeyFormat } from "@/lib/protocol/auth/keys";

/** Normalize checkout credit subject — never store raw API keys. */
export function resolveTollCreditSubject(input: {
  email: string;
  apiKey?: string | null;
  creditSubject?: string | null;
}): { ok: true; subject: string } | { ok: false; error: string } {
  const explicit = input.creditSubject?.trim();
  if (explicit?.startsWith("key:") && explicit.length > 8) {
    return { ok: true, subject: explicit.slice(0, 120) };
  }
  if (explicit?.startsWith("email:") && explicit.includes("@")) {
    return { ok: true, subject: explicit.toLowerCase().slice(0, 120) };
  }

  const raw = input.apiKey?.trim() ?? "";
  if (raw) {
    if (!isValidKeyFormat(raw)) {
      return { ok: false, error: "invalid_api_key" };
    }
    if (!raw.startsWith(KEY_PREFIX_LIVE) && !raw.startsWith(KEY_PREFIX_TEST)) {
      return { ok: false, error: "invalid_api_key" };
    }
    return { ok: true, subject: `key:${hashKey(raw)}` };
  }

  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, error: "invalid_email" };
  return { ok: true, subject: `email:${email}` };
}

/** Stable subject id helper for tests / docs. */
export function emailCreditSubject(email: string): string {
  return `email:${email.trim().toLowerCase()}`;
}

export function keyCreditSubjectFromHash(keyHash: string): string {
  return `key:${keyHash.trim().toLowerCase()}`;
}

/** Hash arbitrary string the same way as API keys (exposed for docs). */
export function sha256Hex(raw: string): string {
  return hashKey(raw);
}
