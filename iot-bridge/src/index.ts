import { createHash } from "node:crypto";
import "dotenv/config";
import mqtt from "mqtt";
import { z } from "zod";
import { DeviceVerifier, OracleClient, recoverProductionSigner } from "./services.js";

const MAX_PAYLOAD_BYTES = Number(process.env.IOT_MAX_PAYLOAD_BYTES ?? 4_096);
const MAX_SKEW_MS = Number(process.env.IOT_MAX_SKEW_MS ?? 5 * 60_000);
const DEVICE_RATE_PER_MIN = Number(process.env.IOT_DEVICE_RATE_PER_MIN ?? 60);

const productionSchema = z.object({
  deviceId: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[a-zA-Z0-9:_@.\-]+$/, "invalid device id"),
  amountWh: z.number().positive().max(1_000_000_000),
  timestamp: z.string().datetime(),
  signature: z.string().regex(/^0x[a-fA-F0-9]{128,200}$/),
});

const verifier = new DeviceVerifier();
const oracle = new OracleClient();

/** Replay cache: message digest -> expiry ms */
const seenProofs = new Map<string, number>();
/** deviceId -> { count, resetAt } */
const deviceBuckets = new Map<string, { count: number; resetAt: number }>();

function messageDigest(message: {
  deviceId: string;
  amountWh: number;
  timestamp: string;
  signature: string;
}): string {
  return createHash("sha256")
    .update(`${message.deviceId}|${message.amountWh}|${message.timestamp}|${message.signature}`)
    .digest("hex");
}

function consumeDeviceRate(deviceId: string): boolean {
  const now = Date.now();
  let b = deviceBuckets.get(deviceId);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + 60_000 };
    deviceBuckets.set(deviceId, b);
  }
  if (b.count >= DEVICE_RATE_PER_MIN) return false;
  b.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, exp] of seenProofs) {
    if (now >= exp) seenProofs.delete(k);
  }
  for (const [k, b] of deviceBuckets) {
    if (now >= b.resetAt) deviceBuckets.delete(k);
  }
}, 60_000).unref?.();

const client = mqtt.connect(process.env.MQTT_URL ?? "mqtt://localhost:1883", {
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
  reconnectPeriod: 2_000,
  rejectUnauthorized: process.env.MQTT_TLS_INSECURE !== "true",
});

client.on("connect", () => {
  const topic = process.env.MQTT_TOPIC ?? "energy/+/production";
  client.subscribe(topic, { qos: 1 }, (error) => {
    if (error) console.error("[iot-bridge] subscription failed", error);
    else console.info(`[iot-bridge] subscribed to ${topic} (${oracle.mockMode ? "mock" : "chain"})`);
  });
});
client.on("message", (topic, payload) => void handleMessage(topic, payload));
client.on("error", (error) => console.error("[iot-bridge] MQTT error", error.message));

async function handleMessage(topic: string, payload: Buffer): Promise<void> {
  try {
    if (payload.length > MAX_PAYLOAD_BYTES) {
      throw new Error(`Payload exceeds ${MAX_PAYLOAD_BYTES} bytes`);
    }
    const message = productionSchema.parse(JSON.parse(payload.toString("utf8")));
    if (topic.split("/")[1] !== message.deviceId) {
      throw new Error("Topic and payload device IDs differ");
    }
    const ts = new Date(message.timestamp).getTime();
    if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > MAX_SKEW_MS) {
      throw new Error("Production message timestamp is outside the allowed window");
    }
    const digest = messageDigest(message);
    if (seenProofs.has(digest)) {
      throw new Error("Replay rejected: message already processed");
    }
    if (!consumeDeviceRate(message.deviceId)) {
      throw new Error("Device rate limit exceeded");
    }
    const signer = recoverProductionSigner(message);
    if (!(await verifier.isAuthorized(message.deviceId, signer))) {
      throw new Error("Device signer is not authorized");
    }
    seenProofs.set(digest, Date.now() + MAX_SKEW_MS * 2);
    const result = await oracle.reportMint(signer, message.amountWh);
    console.info("[iot-bridge] mint reported", {
      deviceId: message.deviceId,
      amountWh: message.amountWh,
      ...result,
    });
  } catch (error) {
    console.warn("[iot-bridge] rejected production message", {
      topic,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function shutdown(): void {
  client.end(false, {}, () => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { handleMessage, messageDigest };
