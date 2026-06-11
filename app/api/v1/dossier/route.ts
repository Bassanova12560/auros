import { SITE_URL } from "@/lib/comparators/site";
import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  dossierRequestSchema,
  protocolError,
  protocolJson,
  premiumPricingMeta,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import {
  createDossierDownloadToken,
  suggestedDossierFilename,
} from "@/lib/protocol/dossier/download-token";
import {
  dossierJsonExport,
  generateDossierPayload,
} from "@/lib/protocol/dossier/generate";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

export async function POST(req: Request) {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = dossierRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const payload = await generateDossierPayload(auth.ctx.keyHash, parsed.data);
  const format = parsed.data.format;

  if (format === "json") {
    await logProtocolUsage(auth.ctx.keyHash, "/api/v1/dossier", "POST", 200);
    return protocolJson({
      dossier_id: payload.id,
      format: "json",
      data: dossierJsonExport(payload),
      full_report_url: payload.full_report_url,
      ...premiumPricingMeta(),
    });
  }

  const token = createDossierDownloadToken({
    dossierId: payload.id,
    keyHash: auth.ctx.keyHash,
    format,
  });

  const base = SITE_URL.replace(/\/$/, "");
  const downloadUrl = `${base}/api/v1/dossier/pdf?token=${encodeURIComponent(token)}`;

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/dossier", "POST", 200);

  return protocolJson({
    dossier_id: payload.id,
    format,
    download_url: downloadUrl,
    expires_in_hours: 24,
    filename: suggestedDossierFilename(payload.id),
    full_report_url: payload.full_report_url,
    sections: payload.sections,
    ...premiumPricingMeta(),
  });
}
