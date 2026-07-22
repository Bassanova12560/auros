import {
  CRYPTO_PROFILES,
  PORTFOLIO_AIRGAP_VERSION,
  SHIELD_DISCLAIMER,
  SHIELD_VERSION,
  buildCbom,
  importPortfolioAirgapPack,
  isContentHash,
  resolveShieldSigningKey,
  sealLocal,
  sha256Hex,
  tapLocal,
  verifyLocal
} from "./chunk-5FUSY5DM.js";

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
async function fireIngest(config, body, fetchImpl = fetch) {
  if (!body) return;
  const base = (config.baseUrl ?? "https://getauros.com").replace(/\/$/, "");
  await fetchImpl(`${base}/api/v1/shield/ingest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "text/plain; charset=utf-8",
      ...config.label ? { "X-AUROS-Shield-Label": config.label } : {}
    },
    body
  });
}
function withShieldTap(config, handler) {
  const ignore = config.ignorePaths ?? ["/api/health", "/_next", "/favicon"];
  const tapRequest = config.tapRequest !== false;
  return async (req) => {
    const url = new URL(req.url);
    const skip = ignore.some(
      (p) => url.pathname === p || url.pathname.startsWith(p)
    );
    if (!skip && tapRequest) {
      const method = req.method.toUpperCase();
      if (method === "POST" || method === "PUT" || method === "PATCH") {
        try {
          const raw = await req.clone().text();
          const p = fireIngest(config, raw);
          if (config.softFail !== false) void p.catch(() => void 0);
          else await p;
        } catch {
        }
      }
    }
    return handler(req);
  };
}
function expressShieldTap(config) {
  const ignore = config.ignorePaths ?? ["/health", "/favicon.ico"];
  const tapRequest = config.tapRequest !== false;
  return (req, _res, next) => {
    try {
      const path = req.path ?? req.url ?? "/";
      if (ignore.some((p) => path === p || path.startsWith(p)) || !tapRequest) {
        next();
        return;
      }
      const method = (req.method ?? "GET").toUpperCase();
      if (method !== "POST" && method !== "PUT" && method !== "PATCH") {
        next();
        return;
      }
      let body = "";
      if (typeof req.rawBody === "string") body = req.rawBody;
      else if (Buffer.isBuffer(req.rawBody)) body = req.rawBody.toString("utf8");
      else if (typeof req.body === "string") body = req.body;
      else if (req.body != null) body = JSON.stringify(req.body);
      if (body) {
        const p = fireIngest(config, body);
        if (config.softFail !== false) void p.catch(() => void 0);
      }
    } catch {
    }
    next();
  };
}
var MIDDLEWARE_SNIPPETS = {
  next: `export const POST = withShieldTap({ apiKey: process.env.AUROS_API_KEY! }, handler);`,
  express: `app.use(expressShieldTap({ apiKey: process.env.AUROS_API_KEY! }));`
};
export {
  CRYPTO_PROFILES,
  MIDDLEWARE_SNIPPETS,
  PORTFOLIO_AIRGAP_VERSION,
  SHIELD_DISCLAIMER,
  SHIELD_VERSION,
  buildCbom,
  expressShieldTap,
  importPortfolioAirgapPack,
  instrumentFetch,
  isContentHash,
  resolveShieldSigningKey,
  sealLocal,
  sha256Hex,
  tapLocal,
  verifyLocal,
  withShieldTap
};
