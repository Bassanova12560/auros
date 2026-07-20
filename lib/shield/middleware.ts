/**
 * Drop-in middleware — Next.js route handlers & Express.
 * Taps request/response bodies without rewriting business logic.
 */

import type { EasyTapConfig } from "./easy";

export type ShieldMiddlewareConfig = EasyTapConfig & {
  /** Paths to skip (prefix match). Default: health, static. */
  ignorePaths?: string[];
  /** Tap request body (default true for POST/PUT/PATCH). */
  tapRequest?: boolean;
  /** Tap JSON response body when Content-Type is json (default false). */
  tapResponse?: boolean;
};

function shouldIgnore(pathname: string, ignore: string[]): boolean {
  return ignore.some((p) => pathname === p || pathname.startsWith(p));
}

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

/**
 * Wrap a Next.js App Router route handler — tap the incoming body, then run handler.
 *
 * @example
 * export const POST = withShieldTap(
 *   { apiKey: process.env.AUROS_API_KEY! },
 *   async (req) => Response.json({ ok: true })
 * );
 */
export function withShieldTap(
  config: ShieldMiddlewareConfig,
  handler: (req: Request) => Promise<Response> | Response
): (req: Request) => Promise<Response> {
  const ignore = config.ignorePaths ?? ["/api/health", "/_next", "/favicon"];
  const tapRequest = config.tapRequest !== false;

  return async (req: Request) => {
    const url = new URL(req.url);
    if (!shouldIgnore(url.pathname, ignore) && tapRequest) {
      const method = req.method.toUpperCase();
      if (method === "POST" || method === "PUT" || method === "PATCH") {
        try {
          const raw = await req.clone().text();
          const p = fireIngest(config, raw);
          if (config.softFail !== false) void p.catch(() => undefined);
          else await p;
        } catch {
          // soft: never block
        }
      }
    }

    const res = await handler(req);

    if (config.tapResponse && res.ok) {
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("application/json") || ct.includes("text/")) {
        try {
          const text = await res.clone().text();
          const p = fireIngest(config, text);
          if (config.softFail !== false) void p.catch(() => undefined);
          else await p;
        } catch {
          // ignore
        }
      }
    }

    return res;
  };
}

type ExpressLikeReq = {
  method?: string;
  path?: string;
  url?: string;
  body?: unknown;
  rawBody?: string | Buffer;
};

type ExpressLikeRes = {
  statusCode?: number;
  on?: (event: string, cb: () => void) => void;
};

type ExpressNext = (err?: unknown) => void;

/**
 * Express middleware — taps JSON/string body after body-parser.
 *
 * @example
 * app.use(expressShieldTap({ apiKey: process.env.AUROS_API_KEY! }));
 */
export function expressShieldTap(config: ShieldMiddlewareConfig) {
  const ignore = config.ignorePaths ?? ["/health", "/favicon.ico"];
  const tapRequest = config.tapRequest !== false;

  return (req: ExpressLikeReq, _res: ExpressLikeRes, next: ExpressNext) => {
    try {
      const path = req.path ?? req.url ?? "/";
      if (shouldIgnore(path, ignore) || !tapRequest) {
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
      // never block the request
    }
    next();
  };
}

export const MIDDLEWARE_SNIPPETS = {
  next: `import { withShieldTap } from "@adrien1212balitrand/auros-shield";

export const POST = withShieldTap(
  { apiKey: process.env.AUROS_API_KEY!, label: "my-api" },
  async (req) => {
    // your handler — body already proof-tapped
    return Response.json({ ok: true });
  }
);`,
  express: `import { expressShieldTap } from "@adrien1212balitrand/auros-shield";

app.use(express.json());
app.use(expressShieldTap({ apiKey: process.env.AUROS_API_KEY! }));`,
} as const;
