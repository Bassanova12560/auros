import { getPurchaseById } from "@/lib/academy/diploma-purchase";
import {
  generateIndividualDiplomaPdf,
  generateInstitutionDiplomaPdf,
  diplomaFilename,
} from "@/lib/academy/diploma-pdf";
import { verifyUrl } from "@/lib/academy/issue-certificate";
import { absoluteUrl } from "@/lib/comparators/site";
import { createCertificateToken } from "@/lib/academy/cert-token";

type Props = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  const purchase = await getPurchaseById(id);
  if (!purchase) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  try {
    if (purchase.productType === "individual") {
      const cert = purchase.certSnapshot;
      if (!cert) {
        return Response.json({ error: "missing_cert_snapshot" }, { status: 422 });
      }
      const token = createCertificateToken({
        id: cert.id,
        fullName: cert.fullName,
        tier: cert.tier,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        curriculumVersion: cert.curriculumVersion,
        renewalGeneration: cert.renewalGeneration,
        integrityLevel: cert.integrityLevel,
      });
      const blob = await generateIndividualDiplomaPdf({
        certificate: cert,
        verifyUrl: verifyUrl(token),
      });
      const buffer = Buffer.from(await blob.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${diplomaFilename(cert.fullName, cert.id)}"`,
        },
      });
    }

    if (!purchase.organizationName) {
      return Response.json({ error: "invalid_purchase" }, { status: 422 });
    }

    const blob = await generateInstitutionDiplomaPdf({
      organizationName: purchase.organizationName,
      purchaseId: purchase.id,
      issuedAt: purchase.purchasedAt,
      verifyUrl: absoluteUrl(`/academy/entreprise?cert=${purchase.id}`),
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${diplomaFilename(purchase.organizationName, purchase.id)}"`,
      },
    });
  } catch (err) {
    console.error("[academy/diploma/pdf]", err);
    return Response.json({ error: "pdf_failed" }, { status: 500 });
  }
}
