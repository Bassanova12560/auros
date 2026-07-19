import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runGreenHealthChecks } from "@/lib/green/green-health";
import { internalNotifyEmail, resendFrom } from "@/lib/emails/constants";

export const runtime = "nodejs";

async function alertOpsUnhealthy(
  base: string,
  failed: { path: string; status: number; error?: string }[]
): Promise<void> {
  const to = internalNotifyEmail();
  const key = process.env.RESEND_API_KEY?.trim();
  if (!to || !key) {
    console.warn("[green-health] OPS email or RESEND_API_KEY missing — skip alert");
    return;
  }

  const lines = failed
    .map((c) => `• ${c.path} → ${c.status}${c.error ? ` (${c.error})` : ""}`)
    .join("\n");

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    await resend.emails.send({
      from: resendFrom(),
      to,
      subject: `[AUROS] Green health FAIL — ${failed.length} route(s) on ${base}`,
      html: `<pre style="font-family:monospace;font-size:13px">${lines.replace(/</g, "&lt;")}\n\nChecked: ${new Date().toISOString()}</pre>`,
    });
  } catch (err) {
    console.error("[green-health] alert email failed:", err);
  }
}

/** GET — smoke public Green routes (Vercel cron monitoring). */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runGreenHealthChecks();
  const failed = result.checks.filter((c) => !c.ok);

  for (const c of result.checks) {
    const tag = c.ok ? "ok" : "fail";
    console.log(
      `[green-health] ${tag} ${c.path} → ${c.status}${c.error ? ` (${c.error})` : ""}`
    );
  }

  if (!result.ok) {
    console.warn(
      `[green-health] ${failed.length} route(s) unhealthy on ${result.base}`
    );
    await alertOpsUnhealthy(result.base, failed);
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
