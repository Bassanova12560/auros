import { NextResponse } from "next/server";
import { z } from "zod";

import { createMonitorCheckoutSession } from "@/lib/stripe/monitor-checkout";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  plan: z.enum(["starter", "pro"]),
  locale: z.enum(["fr", "en", "es"]).default("fr"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", message: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const session = await createMonitorCheckoutSession(parsed.data);
  if (!session) {
    return NextResponse.json(
      {
        error: "checkout_unavailable",
        message: "Stripe non configuré — contactez contact@getauros.com",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ url: session.url, sessionId: session.sessionId });
}
