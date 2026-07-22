import { randomBytes } from "node:crypto";
import {
  Contract,
  JsonRpcProvider,
  Wallet,
  getAddress,
  id,
  keccak256,
  parseUnits,
  verifyMessage,
} from "ethers";

const ORACLE_ABI = ["function reportMint(address user, uint256 amount) returns (bytes32)"];
const REGISTRY_ABI = ["function isDeviceRegistered(bytes32 deviceId, address signer) view returns (bool)"];

export interface ProductionMessage {
  deviceId: string;
  amountWh: number;
  timestamp: string;
  signature: string;
}

export function productionSigningMessage(message: Omit<ProductionMessage, "signature">): string {
  return `auros:iot:${message.deviceId}:${message.amountWh}:${message.timestamp}`;
}

export function recoverProductionSigner(message: ProductionMessage): string {
  return getAddress(
    verifyMessage(
      productionSigningMessage({
        deviceId: message.deviceId,
        amountWh: message.amountWh,
        timestamp: message.timestamp,
      }),
      message.signature,
    ),
  );
}

function allowlist(): Record<string, string> {
  try {
    return JSON.parse(process.env.DEVICE_ALLOWLIST_JSON ?? "{}") as Record<string, string>;
  } catch {
    throw new Error("DEVICE_ALLOWLIST_JSON must be a JSON object");
  }
}

export class DeviceVerifier {
  private readonly provider = process.env.RPC_URL
    ? new JsonRpcProvider(process.env.RPC_URL)
    : undefined;

  async isAuthorized(deviceId: string, signer: string): Promise<boolean> {
    const configuredSigner = allowlist()[deviceId];
    if (configuredSigner) return getAddress(configuredSigner) === getAddress(signer);
    if (process.env.MOCK_MODE !== "false") return false;
    if (!this.provider || !process.env.DEVICE_REGISTRY_ADDRESS) return false;
    const registry = new Contract(process.env.DEVICE_REGISTRY_ADDRESS, REGISTRY_ABI, this.provider);
    return Boolean(await registry.isDeviceRegistered(id(deviceId), signer));
  }
}

export class OracleClient {
  readonly mockMode =
    process.env.MOCK_MODE !== "false" ||
    !process.env.RPC_URL ||
    !process.env.ORACLE_PRIVATE_KEY ||
    !process.env.RESOURCE_ORACLE_ADDRESS;

  async reportMint(user: string, amountWh: number): Promise<{ txHash: string; mode: "mock" | "chain" }> {
    if (this.mockMode) return { txHash: keccak256(randomBytes(32)), mode: "mock" };
    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const wallet = new Wallet(process.env.ORACLE_PRIVATE_KEY!, provider);
    const oracle = new Contract(process.env.RESOURCE_ORACLE_ADDRESS!, ORACLE_ABI, wallet);
    const tx = await oracle.reportMint(
      getAddress(user),
      parseUnits(String(amountWh), Number(process.env.TOKEN_DECIMALS ?? 0)),
    );
    await tx.wait();
    return { txHash: tx.hash as string, mode: "chain" };
  }
}
