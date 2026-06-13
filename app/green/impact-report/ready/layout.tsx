import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Report | AUROS Green",
  robots: { index: false, follow: false },
};

export default function GreenImpactReportReadyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
