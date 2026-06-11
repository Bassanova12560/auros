import { NextResponse } from "next/server";

import {
  verifyDossierDownloadToken,
  suggestedDossierFilename,
} from "@/lib/protocol/dossier/download-token";
import { getDossierPayload } from "@/lib/protocol/dossier/generate";
import { generateProtocolDossierPdf } from "@/lib/protocol/dossier/report-pdf";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  const verified = verifyDossierDownloadToken(token);
  if (!verified) {
    return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 403 });
  }

  const payload = await getDossierPayload(verified.dossierId, verified.keyHash);
  if (!payload) {
    return NextResponse.json({ error: "dossier_not_found" }, { status: 404 });
  }

  if (verified.format === "json") {
    return NextResponse.json(payload.score);
  }

  const blob = await generateProtocolDossierPdf(payload);
  const buffer = Buffer.from(await blob.arrayBuffer());

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${suggestedDossierFilename(payload.id)}"`,
      "Cache-Control": "private, no-store",
      "X-AUROS-Protocol-Version": "1.0",
    },
  });
}
