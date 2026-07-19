import type Stripe from "stripe";

import { parseMonitorCheckoutMetadata } from "@/lib/stripe/monitor-checkout";
import {
  createApiKey,
  findKeyByEmail,
  upgradeApiKeyTierByEmail,
} from "@/lib/protocol/auth/keys";

export async function fulfillMonitorSubscription(
  session: Stripe.Checkout.Session
): Promise<boolean> {
  const meta = parseMonitorCheckoutMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return false;

  const email =
    meta.email || session.customer_details?.email?.trim().toLowerCase() || "";
  if (!email) return false;

  const existing = await findKeyByEmail(email);
  if (existing?.tier === "monitor" && existing.monitor_plan === meta.plan) {
    return true;
  }
  if (existing?.tier === "enterprise") {
    return true;
  }

  if (!existing) {
    await createApiKey(email);
  }

  const upgraded = await upgradeApiKeyTierByEmail(email, "monitor", {
    monitor_plan: meta.plan,
  });
  if (!upgraded) {
    console.warn("[fulfillMonitor] tier upgrade failed for", email);
    return false;
  }

  console.info(
    `[fulfillMonitor] activated ${meta.plan} for ${email} (session ${session.id})`
  );
  return true;
}

export async function downgradeMonitorByEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return false;
  return upgradeApiKeyTierByEmail(normalized, "free", { monitor_plan: null });
}
