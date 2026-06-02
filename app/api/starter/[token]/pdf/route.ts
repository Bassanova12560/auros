import { NextResponse } from "next/server";

import { getStarterKitPdfPayloadAction } from "@/lib/actions/jurisdiction-starter";
import { generateStarterKitPdf } from "@/lib/jurisdictions/starter-kit-pdf";
import { isShareToken } from "@/lib/validation";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ token: string }>;
};

export async function GET(_req: Request, { params }: Props) {
  const { token } = await params;
  if (!token || !isShareToken(token)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const payload = await getStarterKitPdfPayloadAction(token);
  if (!payload.ok) {
    return NextResponse.json({ error: payload.error }, { status: 404 });
  }

  try {
    const blob = await generateStarterKitPdf({
      firstName: payload.firstName,
      content: payload.content,
      generatedAt: payload.deliveredAt,
    });
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="auros-starter-kit.pdf"`,
      },
    });
  } catch (err) {
    console.error("[starter/pdf]", err);
    return NextResponse.json({ error: "pdf_failed" }, { status: 500 });
  }
}
