import type { Metadata } from "next";

import { notFound } from "next/navigation";

import {
  enrichCertificateView,
  getCertificateStatus,
  parseCertificateToken,
} from "@/lib/academy";
import { hasIndividualDiplomaPurchase } from "@/lib/academy/diploma-purchase";

import { VerifyCertificateView } from "@/app/academy/_components/VerifyCertificateView";

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const cert = parseCertificateToken(token);

  if (!cert) {
    return { title: "Certificate not found | AUROS Academy" };
  }

  return {
    title: `${cert.fullName} — ${cert.tierLabel} | AUROS Academy`,
    description: `Verifiable AUROS Academy certificate — ${cert.tierLabel}, ID ${cert.id}.`,
    robots: { index: false, follow: false },
  };
}

export default async function AcademyVerifyPage({ params }: PageProps) {
  const { token } = await params;
  const certToken = decodeURIComponent(token);
  const cert = parseCertificateToken(certToken);

  if (!cert) notFound();

  const view = enrichCertificateView(cert);
  const hasDiploma =
    cert.tier === "fundamentals" ? await hasIndividualDiplomaPurchase(cert.id) : false;

  return (
    <VerifyCertificateView
      cert={cert}
      status={getCertificateStatus(cert)}
      legacy={view.legacy}
      hasDiploma={hasDiploma}
      certToken={certToken}
    />
  );
}

export function generateStaticParams() {
  return [];
}
