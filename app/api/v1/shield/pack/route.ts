import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  findKeyRecord,
  logProtocolUsage,
  premiumPricingMeta,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { appendShieldAudit } from "@/lib/shield";
import { buildEvidencePack } from "@/lib/shield/evidence-pack";
import { SHIELD_SLA } from "@/lib/shield/audit";

export const runtime = "nodejs";

/**
 * Premium Evidence Pack — JSON by default; ?format=html for printable annex.
 */
export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) {
    return protocolJson(
      {
        error: {
          code: "premium_required",
          message:
            "Evidence Pack is Premium — continuous RWA proof for credit/ESG/auditors. Upgrade Monitor.",
        },
        ...premiumPricingMeta(),
      },
      { status: 403 }
    );
  }

  let body: { label?: string; cfu_limit?: number; tap_limit?: number } = {};
  try {
    if (req.headers.get("content-type")?.includes("json")) {
      body = (await req.json()) as typeof body;
    }
  } catch {
    body = {};
  }

  const url = new URL(req.url);
  const format = (url.searchParams.get("format") ?? "json").toLowerCase();

  const result = await buildEvidencePack({
    keyHash: auth.ctx.keyHash,
    label: body.label,
    cfu_limit: body.cfu_limit,
    tap_limit: body.tap_limit,
  });

  if (!result.ok) {
    return protocolError(
      result.status === 503 ? "service_unavailable" : "validation_error",
      result.error,
      result.status
    );
  }

  appendShieldAudit({
    key_hash: auth.ctx.keyHash,
    action: "pack",
    pack_id: result.pack.pack_id,
    content_hash: result.pack.pack_hash,
    meta: {
      generation_sources: result.pack.summary.generation_sources,
      cfu_total: result.pack.summary.cfu_total,
      format,
    },
  });

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/pack", "POST", 200);

  if (format === "html") {
    const p = result.pack;
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${p.pack_id}</title>
<style>body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;color:#111;line-height:1.45}h1{font-size:1.4rem}code,pre{font-family:ui-monospace,monospace;font-size:12px} .muted{color:#666;font-size:12px}</style></head><body>
<h1>AUROS Shield — Evidence Pack</h1>
<p class="muted">${p.pack_id} · ${p.generated_at} · payload_retained: false</p>
<p>${p.purpose}</p>
<h2>Summary</h2>
<ul>
<li>CFU: ${p.summary.cfu_total} (active ${p.summary.cfu_active} / retired ${p.summary.cfu_retired})</li>
<li>Taps: ${p.summary.tap_receipts_included}</li>
<li>generation_sources: ${(p.summary.generation_sources || []).join(", ") || "—"}</li>
<li>pack_hash: <code>${p.pack_hash}</code></li>
</ul>
<h2>Bank actions</h2>
<ol>${p.bank_actions.map((a) => `<li>${a}</li>`).join("")}</ol>
<h2>SLA (indicative)</h2>
<p class="muted">${SHIELD_SLA.verify_availability_target} · p99 ${SHIELD_SLA.verify_latency_p99_ms_target} ms · ${SHIELD_SLA.note}</p>
<p class="muted">${p.disclaimer}</p>
<p class="muted">Print → PDF (Ctrl/Cmd+P)</p>
</body></html>`;
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${p.pack_id}.html"`,
      },
    });
  }

  return protocolJson({
    ...result.pack,
    print_hint: "POST /api/v1/shield/pack?format=html — then Ctrl/Cmd+P → PDF",
    ...premiumPricingMeta(),
  });
});
