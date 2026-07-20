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

export type EasyTapConfig = {
  apiKey: string;
  baseUrl?: string;
  label?: string;
  softFail?: boolean;
};

export type ShieldMiddlewareConfig = EasyTapConfig & {
  ignorePaths?: string[];
  tapRequest?: boolean;
  tapResponse?: boolean;
};

async function fireIngest(
  config: EasyTapConfig,
  body: string,
  fetchImpl: typeof fetch = fetch
): Promise<void> {
  if (!body) return;
  const base = (config.baseUrl ?? "https://getauros.com").replace(/\/$/, "");
  await fetchImpl(`${base}/api/v1/shield/ingest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "text/plain; charset=utf-8",
      ...(config.label ? { "X-AUROS-Shield-Label": config.label } : {}),
    },
    body,
  });
}

/** Next.js App Router — wrap a route handler. */
export function withShieldTap(
  config: ShieldMiddlewareConfig,
  handler: (req: Request) => Promise<Response> | Response
): (req: Request) => Promise<Response> {
  const ignore = config.ignorePaths ?? ["/api/health", "/_next", "/favicon"];
  const tapRequest = config.tapRequest !== false;

  return async (req: Request) => {
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
          if (config.softFail !== false) void p.catch(() => undefined);
          else await p;
        } catch {
          // soft
        }
      }
    }
    return handler(req);
  };
}

/** Express middleware — after body-parser. */
export function expressShieldTap(config: ShieldMiddlewareConfig) {
  const ignore = config.ignorePaths ?? ["/health", "/favicon.ico"];
  const tapRequest = config.tapRequest !== false;

  return (
    req: {
      method?: string;
      path?: string;
      url?: string;
      body?: unknown;
      rawBody?: string | Buffer;
    },
    _res: unknown,
    next: (err?: unknown) => void
  ) => {
    try {
      const path = req.path ?? req.url ?? "/";
      if (
        ignore.some((p) => path === p || path.startsWith(p)) ||
        !tapRequest
      ) {
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
        if (config.softFail !== false) void p.catch(() => undefined);
      }
    } catch {
      // never block
    }
    next();
  };
}

export const MIDDLEWARE_SNIPPETS = {
  next: `export const POST = withShieldTap({ apiKey: process.env.AUROS_API_KEY! }, handler);`,
  express: `app.use(expressShieldTap({ apiKey: process.env.AUROS_API_KEY! }));`,
} as const;

export type { CryptoProfile, ShieldSealKind, ShieldSeal } from "./core";
