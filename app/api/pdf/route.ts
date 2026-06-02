import { NextResponse } from "next/server";

import { isLocale } from "@/lib/i18n";
import { generateDossierPDF, suggestedFilename } from "@/lib/pdf";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "dossier payload required" }, { status: 400 });
    }

    const rawLocale = body.locale;
    const locale =
      typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "fr";
    const dossier = { ...body, locale };
    const blob = await generateDossierPDF(dossier);
    const arrayBuffer = await blob.arrayBuffer();
    const filename = suggestedFilename(dossier);

    return new NextResponse(new Uint8Array(arrayBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[api/pdf]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PDF failed" },
      { status: 500 }
    );
  }
}
