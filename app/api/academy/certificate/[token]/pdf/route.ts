import { parseCertificateToken } from "@/lib/academy/cert-token";
import { hasIndividualDiplomaPurchase } from "@/lib/academy/diploma-purchase";
import {
  generateIndividualDiplomaPdf,
  diplomaFilename,
} from "@/lib/academy/diploma-pdf";
import { verifyUrl } from "@/lib/academy/issue-certificate";

type Props = { params: Promise<{ token: string }> };

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: Props) {
  const { token: raw } = await params;
  const token = decodeURIComponent(raw);
  const cert = parseCertificateToken(token);
  if (!cert) {
    return Response.json({ error: "invalid_cert" }, { status: 404 });
  }

  const purchased = await hasIndividualDiplomaPurchase(cert.id);
  if (!purchased) {
    return Response.json({ error: "not_purchased" }, { status: 403 });
  }

  try {
    const blob = await generateIndividualDiplomaPdf({
      certificate: cert,
      verifyUrl: verifyUrl(token),
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const filename = diplomaFilename(cert.fullName, cert.id);

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[academy/certificate/pdf]", err);
    return Response.json({ error: "pdf_failed" }, { status: 500 });
  }
}
