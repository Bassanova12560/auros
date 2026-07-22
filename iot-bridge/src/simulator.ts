import "dotenv/config";
import mqtt from "mqtt";
import { Wallet } from "ethers";
import { productionSigningMessage, type ProductionMessage } from "./services.js";

if (!process.env.SIMULATOR_PRIVATE_KEY) {
  const wallet = Wallet.createRandom();
  console.error("[simulator] SIMULATOR_PRIVATE_KEY is required.");
  console.error("[simulator] For local use, set it to:", wallet.privateKey);
  console.error("[simulator] Add this signer to DEVICE_ALLOWLIST_JSON:",
    JSON.stringify({ [process.env.SIMULATOR_DEVICE_ID ?? "demo-meter-001"]: wallet.address }));
  process.exit(1);
}

const wallet = new Wallet(process.env.SIMULATOR_PRIVATE_KEY);
const deviceId = process.env.SIMULATOR_DEVICE_ID ?? "demo-meter-001";
const intervalMs = Number(process.env.SIMULATOR_INTERVAL_MS ?? 60_000);
const client = mqtt.connect(process.env.MQTT_URL ?? "mqtt://localhost:1883", {
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
});

async function publish(): Promise<void> {
  const unsigned = {
    deviceId,
    amountWh: Number(process.env.SIMULATOR_AMOUNT_WH ?? 250),
    timestamp: new Date().toISOString(),
  };
  const message: ProductionMessage = {
    ...unsigned,
    signature: await wallet.signMessage(productionSigningMessage(unsigned)),
  };
  client.publish(`energy/${deviceId}/production`, JSON.stringify(message), { qos: 1 }, (error) => {
    if (error) console.error("[simulator] publish failed", error);
    else console.info("[simulator] published", unsigned);
  });
}

client.on("connect", () => {
  console.info("[simulator] connected", { deviceId, signer: wallet.address });
  void publish();
  setInterval(() => void publish(), intervalMs);
});
client.on("error", (error) => console.error("[simulator] MQTT error", error.message));
