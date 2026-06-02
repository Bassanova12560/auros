/**
 * Client-side dossier share tokens (localStorage registry).
 * Recipients open /dossier?token=… to view a snapshot of the shared report.
 */

const AUROS_DOSSIER_SHARES_KEY = "auros_dossier_shares";

export type SharedDossierPayload = Record<string, unknown>;

async function digestPayload(payload: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(payload)
    );
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 24);
  }
  let h = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export async function registerDossierShare(
  dossier: SharedDossierPayload
): Promise<string> {
  const payload = JSON.stringify(dossier);
  const token = await digestPayload(payload);

  try {
    const raw = localStorage.getItem(AUROS_DOSSIER_SHARES_KEY);
    const map = raw
      ? (JSON.parse(raw) as Record<string, SharedDossierPayload>)
      : {};
    map[token] = dossier;
    localStorage.setItem(AUROS_DOSSIER_SHARES_KEY, JSON.stringify(map));
  } catch {
    // storage full
  }

  return token;
}

export function loadSharedDossier(
  token: string
): SharedDossierPayload | null {
  try {
    const raw = localStorage.getItem(AUROS_DOSSIER_SHARES_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, SharedDossierPayload>;
    return map[token] ?? null;
  } catch {
    return null;
  }
}

/** @deprecated Legacy localStorage links — prefer `buildSharedDossierUrl`. */
export function buildDossierShareUrl(token: string): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "https://auros-delta.vercel.app";
  const url = new URL("/dossier", origin);
  url.searchParams.set("token", token);
  return url.toString();
}

/** Public share link backed by Supabase `dossier_shares`. */
export function buildSharedDossierUrl(token: string): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "https://auros-delta.vercel.app";
  return `${origin.replace(/\/$/, "")}/dossier/shared/${encodeURIComponent(token)}`;
}
