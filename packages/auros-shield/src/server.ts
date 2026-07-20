import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

import {
  SHIELD_DISCLAIMER,
  SHIELD_VERSION,
  buildCbom,
  sealLocal,
  verifyLocal,
  tapLocal,
  type ShieldSealKind,
} from "./core.js";

function json(
  res: import("node:http").ServerResponse,
  status: number,
  body: unknown
) {
  const raw = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "x-auros-shield-version": SHIELD_VERSION,
  });
  res.end(raw);
}

async function readJson(
  req: import("node:http").IncomingMessage
): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

/** Minimal DMZ HTTP surface — banks run this behind VPN / private network. */
export function startShieldServer(port = 8787) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(
        req.url ?? "/",
        `http://${req.headers.host ?? "localhost"}`
      );
      if (req.method === "GET" && url.pathname === "/health") {
        return json(res, 200, {
          ok: true,
          shield_version: SHIELD_VERSION,
          disclaimer: SHIELD_DISCLAIMER,
        });
      }
      if (req.method === "GET" && url.pathname === "/v1/cbom") {
        return json(res, 200, buildCbom("on_prem"));
      }
      if (req.method === "POST" && url.pathname === "/v1/tap") {
        const body = (await readJson(req)) as {
          body?: string;
          content_hash?: string;
          kind?: ShieldSealKind | "tap";
          profile?: "classical_hmac_sha256_v1" | "hybrid_pqc_ready_v1";
        };
        try {
          return json(res, 200, tapLocal(body));
        } catch (e) {
          return json(res, 400, {
            error: e instanceof Error ? e.message : "tap failed",
          });
        }
      }
      if (req.method === "POST" && url.pathname === "/v1/seal") {
        const body = (await readJson(req)) as {
          kind?: ShieldSealKind;
          payload?: string;
          content_hash?: string;
          profile?: "classical_hmac_sha256_v1" | "hybrid_pqc_ready_v1";
          tenant_ref?: string;
        };
        if (!body.kind) return json(res, 400, { error: "kind required" });
        const seal = sealLocal({
          kind: body.kind,
          payload: body.payload,
          content_hash: body.content_hash,
          profile: body.profile,
          tenant_ref: body.tenant_ref,
        });
        return json(res, 200, seal);
      }
      if (req.method === "POST" && url.pathname === "/v1/verify") {
        const body = (await readJson(req)) as {
          kind?: ShieldSealKind;
          content_hash?: string;
          signature?: string;
          profile?: "classical_hmac_sha256_v1" | "hybrid_pqc_ready_v1";
        };
        if (!body.kind || !body.content_hash || !body.signature) {
          return json(res, 400, {
            error: "kind, content_hash, signature required",
          });
        }
        return json(
          res,
          200,
          verifyLocal({
            kind: body.kind,
            content_hash: body.content_hash,
            signature: body.signature,
            profile: body.profile,
          })
        );
      }
      return json(res, 404, {
        error: "not found",
        paths: ["/health", "/v1/cbom", "/v1/tap", "/v1/seal", "/v1/verify"],
      });
    } catch (e) {
      return json(res, 500, {
        error: e instanceof Error ? e.message : "server error",
        disclaimer: SHIELD_DISCLAIMER,
      });
    }
  });

  server.listen(port, () => {
    console.error(
      `AUROS Shield ${SHIELD_VERSION} listening on :${port} (on-prem — keep AUROS_SHIELD_SIGNING_KEY local)`
    );
  });
  return server;
}

const entry = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (entry && import.meta.url === entry) {
  startShieldServer(Number(process.env.PORT ?? 8787));
}
