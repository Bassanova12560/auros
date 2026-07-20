/**
 * Dead-simple integration helpers — RWA-as-norm world:
 * wrap any fetch / handler without rewriting business logic.
 */

export type EasyTapConfig = {
  /** Protocol API key (Bearer). */
  apiKey: string;
  /** Default https://getauros.com */
  baseUrl?: string;
  /** Optional label forwarded to Shield. */
  label?: string;
  /** Fire-and-forget: never block the original request on tap failure. */
  softFail?: boolean;
};

/**
 * One-liner: wrap global fetch so every JSON POST/PUT body is also proof-tapped.
 * Non-invasive — original response unchanged; receipt in X-AUROS-Shield-Receipt header when possible.
 */
export function instrumentFetch(
  config: EasyTapConfig,
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
      if (config.softFail !== false) {
        void tapPromise.catch(() => undefined);
      } else {
        await tapPromise;
      }
    }
    return res;
  };
}

/** Curl-level mental model for ops teams (no SDK). */
export const EASY_INGEST_CURL = `curl -X POST https://getauros.com/api/v1/shield/ingest \\
  -H "Authorization: Bearer auros_pk_live_…" \\
  -H "Content-Type: text/plain" \\
  --data-binary @./export.json`;
