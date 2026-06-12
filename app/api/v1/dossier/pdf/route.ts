import { NextResponse } from "next/server";

import {
  verifyDossierDownloadToken,
  suggestedDossierFilename,
} from "@/lib/protocol/dossier/download-token";
import { getDossierPayload } from "@/lib/protocol/dossier/generate";
import { generateProtocolDossierPdf } from "@/lib/protocol/dossier/report-pdf";
import { getProtocolResponseHeaders } from "@/lib/protocol/response";
import { protocolRoute } from "@/lib/protocol/timing";

export const GET = protocolRoute(async (req: Request) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token")?.trim();
  const headers = getProtocolResponseHeaders();

  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400, headers });
  }

  const verified = verifyDossierDownloadToken(token);
  if (!verified) {
    return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 403, headers });
  }

  const payload = await getDossierPayload(verified.dossierId, verified.keyHash);
  if (!payload) {
    return NextResponse.json({ error: "dossier_not_found" }, { status: 404, headers });
  }

  if (verified.format === "json") {
    return NextResponse.json(payload.score, { headers });
  }

  const blob = await generateProtocolDossierPdf(payload);
  const buffer = Buffer.from(await blob.arrayBuffer());

  return new NextResponse(buffer, {
    status: 200,
    headers: getProtocolResponseHeaders({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${suggestedDossierFilename(payload.id)}"`,
      "Cache-Control": "private, no-store",
    }),
  });
});
