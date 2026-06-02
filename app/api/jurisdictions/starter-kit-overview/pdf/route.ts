import { NextResponse } from "next/server";

import { isLocale } from "@/lib/i18n";
import { generateStarterKitOverviewPdf } from "@/lib/jurisdictions/starter-kit-overview-pdf";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeRaw = searchParams.get("locale") ?? "fr";
  const locale = isLocale(localeRaw) ? localeRaw : "fr";

  try {
    const blob = await generateStarterKitOverviewPdf(locale);
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="auros-starter-kit-value.pdf"',
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("[starter-kit-overview-pdf]", err);
    return NextResponse.json({ error: "pdf_failed" }, { status: 500 });
  }
}
