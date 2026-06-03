import type { Locale } from "@/lib/i18n";

/** Canonical payload for registry PDF integrity — sorted project + expert row ids. */
export function registryPdfRowIdsPayload(
  projectIds: string[],
  expertIds: string[]
): string {
  return [...projectIds.slice().sort(), ...expertIds.slice().sort()].join("|");
}

export async function registryPdfContentSha256(
  projectIds: string[],
  expertIds: string[]
): Promise<string> {
  const payload = registryPdfRowIdsPayload(projectIds, expertIds);
  const data = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function registryPdfCertifiedLabel(isoUtc: string, locale: Locale = "fr"): string {
  if (locale === "en") return `AUROS certified export — ${isoUtc}`;
  if (locale === "es") return `Exportación certificada AUROS — ${isoUtc}`;
  return `Export certifié AUROS — ${isoUtc}`;
}

export function registryPdfIntegrityLine(hash: string, locale: Locale = "fr"): string {
  if (locale === "en") return `Integrity SHA256: ${hash}`;
  if (locale === "es") return `Integridad SHA256: ${hash}`;
  return `Intégrité SHA256 : ${hash}`;
}

export function registryPdfSignedIntegrityLine(
  hash: string,
  sig: string,
  locale: Locale = "fr"
): string {
  const base = registryPdfIntegrityLine(hash, locale);
  return `${base} · sig=${sig}`;
}

/** Client-side fetch of server HMAC for registry PDF footer; null if unavailable. */
export async function fetchRegistryExportSignature(
  contentHash: string
): Promise<string | null> {
  if (typeof fetch === "undefined") return null;
  try {
    const res = await fetch(
      `/api/green/sign-registry-export?hash=${encodeURIComponent(contentHash)}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; sig?: string };
    return data.ok && data.sig ? data.sig : null;
  } catch {
    return null;
  }
}

export async function resolveRegistryPdfIntegrityLine(
  projectIds: string[],
  expertIds: string[],
  locale: Locale = "fr"
): Promise<string> {
  const contentHash = await registryPdfContentSha256(projectIds, expertIds);
  const sig = await fetchRegistryExportSignature(contentHash);
  if (sig) return registryPdfSignedIntegrityLine(contentHash, sig, locale);
  return registryPdfIntegrityLine(contentHash, locale);
}
