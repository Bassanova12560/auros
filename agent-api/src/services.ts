import { randomBytes } from "node:crypto";
import cron, { type ScheduledTask } from "node-cron";
import {
  Contract,
  JsonRpcProvider,
  Wallet,
  getAddress,
  keccak256,
  parseUnits,
  verifyMessage,
} from "ethers";
import type {
  ForwardOrder,
  HedgerConsumer,
  Market,
  Order,
  ResourceToken,
  ResourceType,
} from "./types.js";

const ORACLE_ABI = ["function reportMint(address user, uint256 amount) returns (bytes32)"];
const ERC20_ABI = ["function approve(address spender, uint256 amount) returns (bool)"];
const SWAP_ROUTER_ABI = [
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)) payable returns (uint256 amountOut)",
];

export function mintSigningMessage(user: string, amount: string): string {
  return `auros:mint:${getAddress(user)}:${amount}`;
}

export function verifyMintSignature(user: string, amount: string, signature: string): boolean {
  try {
    return getAddress(verifyMessage(mintSigningMessage(user, amount), signature)) === getAddress(user);
  } catch {
    return false;
  }
}

export class OracleClient {
  readonly mockMode: boolean;

  constructor(
    private readonly rpcUrl = process.env.RPC_URL,
    private readonly privateKey = process.env.ORACLE_PRIVATE_KEY,
    private readonly oracleAddress = process.env.RESOURCE_ORACLE_ADDRESS,
  ) {
    this.mockMode =
      process.env.MOCK_MODE !== "false" ||
      !this.rpcUrl ||
      !this.privateKey ||
      !this.oracleAddress;
  }

  async reportMint(user: string, amount: string): Promise<{ txHash: string; mode: "mock" | "chain" }> {
    if (this.mockMode) {
      return { txHash: keccak256(randomBytes(32)), mode: "mock" };
    }

    const provider = new JsonRpcProvider(this.rpcUrl);
    const signer = new Wallet(this.privateKey!, provider);
    const oracle = new Contract(this.oracleAddress!, ORACLE_ABI, signer);
    const tx = await oracle.reportMint(
      getAddress(user),
      parseUnits(amount, Number(process.env.TOKEN_DECIMALS ?? 18)),
    );
    await tx.wait();
    return { txHash: tx.hash as string, mode: "chain" };
  }
}

const DEFAULT_TOKENS: ResourceToken[] = [
  { symbol: "AKWH", resourceType: "kwh", address: "mock:kwh" },
  { symbol: "AH2O", resourceType: "water", address: "mock:water" },
];

export function configuredTokens(): ResourceToken[] {
  try {
    return JSON.parse(process.env.RESOURCE_TOKENS_JSON ?? "") as ResourceToken[];
  } catch {
    return DEFAULT_TOKENS;
  }
}

function resourceSeed(resourceType: ResourceType): number {
  return [...resourceType].reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function listMarkets(): Market[] {
  const minute = Math.floor(Date.now() / 60_000);
  return configuredTokens().map((token) => {
    const seed = resourceSeed(token.resourceType);
    return {
      ...token,
      priceUsd: Number((0.06 + (seed % 30) / 1_000 + Math.sin(minute + seed) / 1_000).toFixed(4)),
      liquidityUsd: 100_000 + (seed % 80) * 2_500,
      source: "simulated",
    };
  });
}

export async function executeOrder(order: Order): Promise<{
  orderId: string;
  status: "simulated" | "confirmed";
  executionPrice: number;
  txHash?: string;
}> {
  const market = listMarkets().find((item) => item.resourceType === order.resourceType);
  if (!market) throw new Error(`No market for ${order.resourceType}`);
  const realConfigured = Boolean(
    process.env.MOCK_MODE === "false" &&
    process.env.RPC_URL &&
    process.env.ORACLE_PRIVATE_KEY &&
    process.env.UNISWAP_ROUTER_ADDRESS &&
    process.env.SETTLEMENT_TOKEN_ADDRESS &&
    !market.address.startsWith("mock:"),
  );
  const orderId = keccak256(randomBytes(32));
  if (!realConfigured) return { orderId, status: "simulated", executionPrice: market.priceUsd };

  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const signer = new Wallet(process.env.ORACLE_PRIVATE_KEY!, provider);
  const routerAddress = getAddress(process.env.UNISWAP_ROUTER_ADDRESS!);
  const resourceDecimals = Number(process.env.TOKEN_DECIMALS ?? 18);
  const settlementDecimals = Number(process.env.SETTLEMENT_TOKEN_DECIMALS ?? 6);
  const resourceAmount = parseUnits(order.amount.toFixed(resourceDecimals), resourceDecimals);
  const settlementAmount = parseUnits(
    (order.amount * market.priceUsd).toFixed(settlementDecimals),
    settlementDecimals,
  );
  const tokenIn = getAddress(
    order.side === "buy" ? process.env.SETTLEMENT_TOKEN_ADDRESS! : market.address,
  );
  const tokenOut = getAddress(
    order.side === "buy" ? market.address : process.env.SETTLEMENT_TOKEN_ADDRESS!,
  );
  const amountIn = order.side === "buy" ? settlementAmount : resourceAmount;
  const expectedOut = order.side === "buy" ? resourceAmount : settlementAmount;
  const amountOutMinimum =
    expectedOut * BigInt(10_000 - (order.maxSlippageBps ?? 100)) / 10_000n;

  const inputToken = new Contract(tokenIn, ERC20_ABI, signer);
  const approval = await inputToken.approve(routerAddress, amountIn);
  await approval.wait();
  const router = new Contract(routerAddress, SWAP_ROUTER_ABI, signer);
  const tx = await router.exactInputSingle({
    tokenIn,
    tokenOut,
    fee: Number(process.env.UNISWAP_POOL_FEE ?? 3_000),
    recipient: signer.address,
    amountIn,
    amountOutMinimum,
    sqrtPriceLimitX96: 0,
  });
  await tx.wait();
  return { orderId, status: "confirmed", executionPrice: market.priceUsd, txHash: tx.hash as string };
}

export function predictPrice(
  resourceType: ResourceType,
  horizonHours: number,
  history?: number[],
): { predictedPriceUsd: number; slopePerHour: number; source: string } {
  const market = listMarkets().find((item) => item.resourceType === resourceType);
  if (!market) throw new Error(`No market for ${resourceType}`);
  const values =
    history ??
    Array.from({ length: 24 }, (_, index) =>
      market.priceUsd * (0.96 + index * 0.002 + Math.sin(index / 3) * 0.01),
    );
  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / n;
  const numerator = values.reduce((sum, value, index) => sum + (index - meanX) * (value - meanY), 0);
  const denominator = values.reduce((sum, _value, index) => sum + (index - meanX) ** 2, 0);
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;
  return {
    predictedPriceUsd: Number((intercept + slope * (n - 1 + horizonHours)).toFixed(5)),
    slopePerHour: Number(slope.toFixed(7)),
    source: "mock-entso-e-linear-regression",
  };
}

export class ForwardOrderQueue {
  private readonly timers = new Map<string, NodeJS.Timeout>();

  enqueue(order: ForwardOrder): string {
    const id = keccak256(randomBytes(32));
    const delay = Math.max(0, new Date(order.executeAt).getTime() - Date.now());
    const timer = setTimeout(() => {
      void executeOrder(order)
        .then((result) => console.info("[forward-order] executed", { id, result }))
        .catch((error) => console.error("[forward-order] failed", { id, error }))
        .finally(() => this.timers.delete(id));
    }, Math.min(delay, 2_147_483_647));
    this.timers.set(id, timer);
    return id;
  }
}

export class AutoHedger {
  private task?: ScheduledTask;

  constructor(
    private readonly consumers: HedgerConsumer[],
    private readonly queue: ForwardOrderQueue,
  ) {}

  start(schedule = process.env.HEDGER_CRON ?? "*/5 * * * *"): void {
    this.task = cron.schedule(schedule, () => {
      for (const consumer of this.consumers) {
        this.queue.enqueue({
          resourceType: consumer.resourceType,
          side: "buy",
          amount: consumer.forecastAmount * consumer.hedgeRatio,
          consumerId: consumer.id,
          executeAt: new Date(Date.now() + 60_000).toISOString(),
        });
      }
    });
  }

  stop(): void {
    this.task?.stop();
  }
}

export class MintMonitor {
  private lastMintAt = Date.now();
  private timer?: NodeJS.Timeout;

  recordMint(): void {
    this.lastMintAt = Date.now();
  }

  start(maxIdleMinutes = Number(process.env.MINT_ALERT_MINUTES ?? 15)): void {
    this.timer = setInterval(() => {
      const idleMinutes = (Date.now() - this.lastMintAt) / 60_000;
      if (idleMinutes >= maxIdleMinutes) {
        console.warn("[monitor] no mint activity", { idleMinutes: Math.floor(idleMinutes) });
      }
    }, 60_000);
    this.timer.unref();
  }
}
