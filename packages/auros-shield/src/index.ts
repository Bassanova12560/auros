export {
  SHIELD_VERSION,
  SHIELD_DISCLAIMER,
  CRYPTO_PROFILES,
  resolveShieldSigningKey,
  sha256Hex,
  isContentHash,
  sealLocal,
  verifyLocal,
  buildCbom,
  tapLocal,
} from "./core";

/** One-liner fetch wrapper — non-invasive cloud tap. */
export function instrumentFetch(
  config: {
    apiKey: string;
    baseUrl?: string;
    label?: string;
    softFail?: boolean;
  },
  fetchImpl: typeof fetch = fetch
): typeof fetch {
  const base = (config.baseUrl ?? "https://getauros.com").replace(/\/$/, "");
  return async (input, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    const body = init?.body;
    let tapPromise: Promise<void> | null = null;
    if (
      body &&
      typeof body === "string" &&
      (method === "POST" || method === "PUT" || method === "PATCH")
    ) {
      tapPromise = fetchImpl(`${base}/api/v1/shield/ingest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "text/plain; charset=utf-8",
          ...(config.label ? { "X-AUROS-Shield-Label": config.label } : {}),
        },
        body,
      }).then(() => undefined);
    }
    const res = await fetchImpl(input, init);
    if (tapPromise) {
      if (config.softFail !== false) void tapPromise.catch(() => undefined);
      else await tapPromise;
    }
    return res;
  };
}

export type { CryptoProfile, ShieldSealKind, ShieldSeal } from "./core";
