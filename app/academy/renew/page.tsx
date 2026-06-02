import type { Metadata } from "next";

import { RenewPageShell } from "../_components/RenewPageClient";

export const metadata: Metadata = {
  title: "Certificate renewal | AUROS Academy",
  description: "Micro-renewal track — maintain Fundamentals RWA certificate (90 days).",
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: Promise<{ cert?: string }> };

export default async function AcademyRenewPage({ searchParams }: PageProps) {
  const { cert } = await searchParams;
  return <RenewPageShell token={cert?.trim() ?? ""} />;
}
