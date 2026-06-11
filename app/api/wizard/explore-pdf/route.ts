import { NextResponse } from "next/server";

import { generateDossierPDF, suggestedFilename } from "@/lib/pdf";
import type { StoredDossier } from "@/lib/pdf";
import { normalizeWizardData } from "@/lib/wizard-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    data?: Record<string, unknown>;
    score?: number;
    tierLabel?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const data = normalizeWizardData(body.data ?? {});
  const dossier: StoredDossier = {
    generatedAt: new Date().toISOString(),
    score: typeof body.score === "number" ? body.score : undefined,
    tierLabel: typeof body.tierLabel === "string" ? body.tierLabel : undefined,
    data,
    watermark: "EXPLORE — AUROS",
    locale: "fr",
  };

  const blob = await generateDossierPDF(dossier);
  const buffer = Buffer.from(await blob.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${suggestedFilename(dossier)}"`,
    },
  });
}
