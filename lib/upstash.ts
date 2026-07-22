/**
 * Shared Upstash Redis REST helper — durable limits / metering on Vercel.
 */

export type UpstashStatus = {
  configured: boolean;
  reachable: boolean | null;
  message: string;
};

type UpstashResponse = { result?: number | string | null };

export function isUpstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

export async function upstashCommand(
  command: (string | number)[]
): Promise<UpstashResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    return (await res.json()) as UpstashResponse;
  } catch {
    return null;
  }
}

/** Ops probe — PING when configured. */
export async function probeUpstashStatus(): Promise<UpstashStatus> {
  if (!isUpstashConfigured()) {
    return {
      configured: false,
      reachable: null,
      message:
        "Upstash unset — in-memory rate limits only (weak on multi-instance Vercel). See docs/UPSTASH-SETUP.md",
    };
  }
  const ping = await upstashCommand(["PING"]);
  const ok =
    ping?.result === "PONG" ||
    ping?.result === "pong" ||
    String(ping?.result ?? "").toUpperCase() === "PONG";
  return {
    configured: true,
    reachable: ok,
    message: ok
      ? "Upstash Redis reachable — durable limits/metering active"
      : "Upstash env set but PING failed — check REST URL/token",
  };
}
