import { NextRequest, NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { activatePartner } from "@/lib/partners/registry";

export const runtime = "nodejs";

/**
 * POST — activate a partner (ops).
 * Authorization: Bearer CRON_SECRET
 * Body: { id? | email?, code, clerk_user_id? }
 */
export async function POST(req: NextRequest) {
  if (!isCronAuthorized(req, { allowDevWithoutSecret: false })) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const id = typeof raw.id === "string" ? raw.id : undefined;
  const email = typeof raw.email === "string" ? raw.email : undefined;
  const code = typeof raw.code === "string" ? raw.code : "";
  const clerkUserId =
    typeof raw.clerk_user_id === "string"
      ? raw.clerk_user_id
      : raw.clerk_user_id === null
        ? null
        : undefined;

  if (!id && !email) {
    return NextResponse.json(
      { ok: false, error: "id_or_email_required" },
      { status: 400 }
    );
  }

  const result = await activatePartner({ id, email, code, clerkUserId });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, partner: result.partner });
}
