import {
  CRYPTO_PROFILES,
  SHIELD_DISCLAIMER,
  SHIELD_VERSION,
  buildCbom,
  isContentHash,
  resolveShieldSigningKey,
  sealLocal,
  sha256Hex,
  tapLocal,
  verifyLocal
} from "./chunk-N2VJYS7S.js";

// src/index.ts
function instrumentFetch(config, fetchImpl = fetch) {
  const base = (config.baseUrl ?? "https://getauros.com").replace(/\/$/, "");
  return async (input, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    const body = init?.body;
    let tapPromise = null;
    if (body && typeof body === "string" && (method === "POST" || method === "PUT" || method === "PATCH")) {
      tapPromise = fetchImpl(`${base}/api/v1/shield/ingest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "text/plain; charset=utf-8",
          ...config.label ? { "X-AUROS-Shield-Label": config.label } : {}
        },
        body
      }).then(() => void 0);
    }
    const res = await fetchImpl(input, init);
    if (tapPromise) {
      if (config.softFail !== false) void tapPromise.catch(() => void 0);
      else await tapPromise;
    }
    return res;
  };
}
export {
  CRYPTO_PROFILES,
  SHIELD_DISCLAIMER,
  SHIELD_VERSION,
  buildCbom,
  instrumentFetch,
  isContentHash,
  resolveShieldSigningKey,
  sealLocal,
  sha256Hex,
  tapLocal,
  verifyLocal
};
