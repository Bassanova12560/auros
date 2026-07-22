import "dotenv/config";
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { z } from "zod";
import {
  AutoHedger,
  ForwardOrderQueue,
  MintMonitor,
  OracleClient,
  executeOrder,
  listMarkets,
  predictPrice,
  verifyMintSignature,
} from "./services.js";
import type { HedgerConsumer } from "./types.js";
import {
  addLiquidity as addPerpLiquidity,
  closePerp,
  getPerpMarket,
  getPerpPosition,
  openPerp,
  setMarkPrice,
  settleFunding as settlePerpFunding,
} from "./perps.js";
import {
  buyInsurance,
  buyOption,
  computeStats,
  flopBalance,
  insuranceStatus,
  lendBorrowQuote,
  lendDeposit,
  lendRepayQuote,
  lendingStatus,
  listOptions,
  mintFlop,
  reportInsuranceProduction,
  settleInsurance,
  writeOption,
} from "./phase3.js";
import {
  agentIdSchema,
  corsAllowlist,
  ethAddress,
  indexIdSchema,
  parseAgentId,
  rateLimitMiddleware,
  requireOperatorKey,
  requireValidAgentId,
  safeEqualString,
  securityHeaders,
} from "./security.js";

const app = express();
const oracle = new OracleClient();
const queue = new ForwardOrderQueue();
const monitor = new MintMonitor();
const resourceType = z.enum(["kwh", "water", "compute", "carbon"]);

const positiveAmount = z.number().positive().max(1e12);
const boundedString = z.string().min(1).max(128);

app.disable("x-powered-by");
app.use(securityHeaders);
app.use(corsAllowlist);
app.use(express.json({ limit: "32kb" }));
app.use(
  rateLimitMiddleware({
    limit: Number(process.env.RATE_LIMIT_PER_MIN ?? 120),
    windowMs: 60_000,
  }),
);
app.use((request, response, next) => {
  const startedAt = Date.now();
  response.on("finish", () =>
    console.info("[request]", {
      method: request.method,
      path: request.path,
      status: response.statusCode,
      durationMs: Date.now() - startedAt,
      agentId: parseAgentId(request),
    }),
  );
  next();
});
app.use(requireValidAgentId);

const mutateLimit: RequestHandler = rateLimitMiddleware({
  limit: Number(process.env.RATE_LIMIT_MUTATE_PER_MIN ?? 30),
  windowMs: 60_000,
  key: (req) => ["mutate", parseAgentId(req) ?? "anon", req.path],
});

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    chainMode: oracle.mockMode ? "mock" : "chain",
    security: {
      agentIdRequired: process.env.AGENT_ID_REQUIRED !== "false",
      rateLimit: true,
    },
  });
});

app.post("/mint-request", mutateLimit, async (request, response) => {
  const input = z
    .object({
      user: ethAddress,
      amount: z.string().regex(/^\d+(\.\d+)?$/).max(78),
      signature: z.string().regex(/^0x[a-fA-F0-9]+$/).max(200),
    })
    .parse(request.body);
  if (!verifyMintSignature(input.user, input.amount, input.signature)) {
    response.status(401).json({ error: "Invalid mint signature" });
    return;
  }
  const result = await oracle.reportMint(input.user, input.amount);
  monitor.recordMint();
  response.status(202).json(result);
});

app.get("/markets", (_request, response) => response.json({ markets: listMarkets() }));

const orderSchema = z.object({
  resourceType,
  side: z.enum(["buy", "sell"]),
  amount: positiveAmount,
  maxSlippageBps: z.number().int().min(0).max(2_000).optional(),
  consumerId: agentIdSchema.optional(),
});

app.post("/order", mutateLimit, async (request, response) => {
  response.status(202).json(await executeOrder(orderSchema.parse(request.body)));
});

app.post("/forward-order", mutateLimit, (request, response) => {
  const order = orderSchema.extend({ executeAt: z.string().datetime() }).parse(request.body);
  const executeAtMs = Date.parse(order.executeAt);
  if (executeAtMs < Date.now() || executeAtMs > Date.now() + 30 * 24 * 3600_000) {
    response.status(400).json({ error: "executeAt out of allowed window (0..30d)" });
    return;
  }
  response.status(202).json({ queueId: queue.enqueue(order), status: "queued" });
});

app.get("/predict/price", (request, response) => {
  const query = z
    .object({
      resourceType,
      horizonHours: z.coerce.number().int().min(1).max(168).default(24),
    })
    .parse(request.query);
  response.json({ ...query, ...predictPrice(query.resourceType, query.horizonHours) });
});

app.get("/spreads", (_request, response) => {
  response.json({
    spreads: listMarkets().map((market) => {
      const spreadBps = Math.max(8, Math.round(80_000_000 / market.liquidityUsd));
      const halfSpread = spreadBps / 20_000;
      return {
        resourceType: market.resourceType,
        bid: Number((market.priceUsd * (1 - halfSpread)).toFixed(5)),
        ask: Number((market.priceUsd * (1 + halfSpread)).toFixed(5)),
        spreadBps,
        liquidityUsd: market.liquidityUsd,
      };
    }),
  });
});

app.get("/perps/:indexId", (request, response) => {
  const indexId = indexIdSchema.parse(request.params.indexId);
  response.json(getPerpMarket(indexId));
});

app.get("/perps/:indexId/position", (request, response) => {
  const agentId = parseAgentId(request);
  if (!agentId) {
    response.status(400).json({ error: "X-Agent-ID required" });
    return;
  }
  const indexId = indexIdSchema.parse(request.params.indexId);
  response.json({ position: getPerpPosition(indexId, agentId) });
});

app.post("/perps/:indexId/open", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "anonymous";
  const indexId = indexIdSchema.parse(request.params.indexId);
  const body = z
    .object({
      side: z.enum(["long", "short"]),
      margin: positiveAmount,
      leverage: z.number().int().min(1).max(10),
    })
    .parse(request.body);
  response.status(202).json(openPerp({ indexId, agentId, ...body }));
});

app.post("/perps/:indexId/close", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request);
  if (!agentId) {
    response.status(400).json({ error: "X-Agent-ID required" });
    return;
  }
  const indexId = indexIdSchema.parse(request.params.indexId);
  response.status(202).json(closePerp(indexId, agentId));
});

app.post("/perps/:indexId/liquidity", mutateLimit, (request, response) => {
  const indexId = indexIdSchema.parse(request.params.indexId);
  const body = z.object({ amount: positiveAmount }).parse(request.body);
  response.status(202).json(addPerpLiquidity(indexId, body.amount));
});

app.post("/perps/:indexId/funding", mutateLimit, (request, response) => {
  const indexId = indexIdSchema.parse(request.params.indexId);
  response.json(settlePerpFunding(indexId));
});

app.post("/perps/:indexId/mark-price", requireOperatorKey, mutateLimit, (request, response) => {
  const indexId = indexIdSchema.parse(request.params.indexId);
  const body = z.object({ price: z.number().positive().max(1e9) }).parse(request.body);
  response.json(setMarkPrice(indexId, body.price));
});

app.get("/options", (_request, response) => {
  response.json({ options: listOptions() });
});

app.post("/options/write", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "anonymous";
  const body = z
    .object({
      side: z.enum(["call", "put"]),
      strike: positiveAmount,
      expiry: z.number().int().positive(),
      premium: positiveAmount,
      margin: positiveAmount,
      size: positiveAmount,
    })
    .parse(request.body);
  const now = Math.floor(Date.now() / 1000);
  if (body.expiry <= now || body.expiry > now + 365 * 24 * 3600) {
    response.status(400).json({ error: "expiry out of range" });
    return;
  }
  response.status(202).json(writeOption({ ...body, seller: agentId }));
});

app.post("/options/:id/buy", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "anonymous";
  const id = boundedString.parse(request.params.id);
  response.status(202).json(buyOption(id, agentId));
});

app.get("/lending", (_request, response) => {
  response.json(lendingStatus());
});

app.post("/lending/deposit", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "anonymous";
  const body = z
    .object({ side: z.enum(["resource", "quote"]), amount: positiveAmount })
    .parse(request.body);
  response.status(202).json(lendDeposit(agentId, body.side, body.amount));
});

app.post("/lending/borrow-quote", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "anonymous";
  const body = z.object({ amount: positiveAmount }).parse(request.body);
  response.status(202).json(lendBorrowQuote(agentId, body.amount));
});

app.post("/lending/repay-quote", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "anonymous";
  const body = z.object({ principal: positiveAmount }).parse(request.body);
  response.status(202).json(lendRepayQuote(agentId, body.principal));
});

app.get("/insurance", (_request, response) => {
  response.json(insuranceStatus());
});

app.post("/insurance/buy", mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "anonymous";
  const body = z
    .object({
      threshold: z.number().nonnegative().max(1e15),
      coverage: positiveAmount,
      premium: positiveAmount,
      durationSec: z.number().int().positive().max(366 * 24 * 3600),
    })
    .parse(request.body);
  response.status(202).json(buyInsurance({ insured: agentId, ...body }));
});

app.post("/insurance/:id/report", requireOperatorKey, mutateLimit, (request, response) => {
  const id = boundedString.parse(request.params.id);
  const body = z.object({ production: z.number().nonnegative().max(1e15) }).parse(request.body);
  response.json(reportInsuranceProduction(id, body.production));
});

app.post("/insurance/:id/settle", mutateLimit, (request, response) => {
  const id = boundedString.parse(request.params.id);
  response.status(202).json(settleInsurance(id));
});

app.get("/compute/stats", (_request, response) => {
  response.json(computeStats());
});

app.get("/compute/balance", (request, response) => {
  const agentId = parseAgentId(request);
  if (!agentId) {
    response.status(400).json({ error: "X-Agent-ID required" });
    return;
  }
  response.json({ agentId, balance: flopBalance(agentId) });
});

app.post("/compute/mint", requireOperatorKey, mutateLimit, (request, response) => {
  const agentId = parseAgentId(request) ?? "compute-oracle";
  const body = z
    .object({
      amount: positiveAmount,
      jobId: boundedString,
      toAgentId: agentIdSchema.optional(),
    })
    .parse(request.body);
  response.status(202).json(mintFlop(body.toAgentId ?? agentId, body.amount, body.jobId));
});

app.post("/provide-liquidity", requireOperatorKey, mutateLimit, (request, response) => {
  const input = z
    .object({
      resourceType,
      amount: positiveAmount,
      priceUsd: z.number().positive().max(1e9),
    })
    .parse(request.body);
  response.status(202).json({
    provisionId: `liq_${Date.now().toString(36)}`,
    status: "simulated",
    ...input,
  });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof z.ZodError) {
    response.status(400).json({ error: "Invalid request", issues: error.issues });
    return;
  }
  console.error("[error]", error instanceof Error ? error.message : "unknown");
  response.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);

function parseConsumers(): HedgerConsumer[] {
  try {
    return JSON.parse(process.env.HEDGER_CONSUMERS_JSON ?? "[]") as HedgerConsumer[];
  } catch {
    console.warn("[hedger] invalid HEDGER_CONSUMERS_JSON; no consumers registered");
    return [];
  }
}

const port = Number(process.env.PORT ?? 4100);
const server = app.listen(port, () => {
  monitor.start();
  new AutoHedger(parseConsumers(), queue).start();
  console.info(
    `[agent-api] listening on http://localhost:${port} (${oracle.mockMode ? "mock" : "chain"})`,
  );
});

export { app, server, safeEqualString };
