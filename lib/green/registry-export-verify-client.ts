export type RegistryExportVerifyResult =
  | { status: "valid" }
  | { status: "invalid" }
  | { status: "no_signing_key" }
  | { status: "error"; reason: "invalid_hash" | "missing_sig" | "network" };

/** Client-side verify of registry PDF footer hash + HMAC sig. */
export async function verifyRegistryExportClient(
  hash: string,
  sig: string
): Promise<RegistryExportVerifyResult> {
  const trimmedHash = hash.trim();
  const trimmedSig = sig.trim();
  if (!trimmedHash || !trimmedSig) {
    return { status: "error", reason: "missing_sig" };
  }

  try {
    const params = new URLSearchParams({ hash: trimmedHash, sig: trimmedSig });
    const res = await fetch(`/api/green/verify-registry-export?${params.toString()}`);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (data?.error === "invalid_hash") {
        return { status: "error", reason: "invalid_hash" };
      }
      return { status: "error", reason: "network" };
    }
    const data = (await res.json()) as {
      ok?: boolean;
      valid?: boolean;
      reason?: string;
    };
    if (data.reason === "no_signing_key") return { status: "no_signing_key" };
    if (data.valid) return { status: "valid" };
    return { status: "invalid" };
  } catch {
    return { status: "error", reason: "network" };
  }
}

/** Parse `sig=` from PDF integrity footer line. */
export function parseRegistryPdfSignature(integrityLine: string): string | null {
  const match = integrityLine.match(/sig=([a-f0-9]{64})/i);
  return match?.[1]?.toLowerCase() ?? null;
}

/** Parse SHA256 hex from PDF integrity footer line. */
export function parseRegistryPdfContentHash(integrityLine: string): string | null {
  const match = integrityLine.match(/SHA256\s*:\s*([a-f0-9]{64})/i);
  return match?.[1]?.toLowerCase() ?? null;
}
