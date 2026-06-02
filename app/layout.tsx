import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";

import { AiFirstDiscoveryHead } from "./_components/ai-first/AiFirstDiscoveryHead";
import { ConditionalAnalytics } from "./_components/ConditionalAnalytics";
import { Providers } from "./_components/Providers";
import { SITE_URL } from "@/lib/comparators/site";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AUROS | RWA tokenization readiness",
  description:
    "Admission score, 15-document data room, and regulatory studio for real-world asset tokenization dossiers.",
  alternates: {
    types: {
      "application/json": "/ai-first/index.json",
      "text/plain": "/llms.txt",
    },
  },
  other: {
    "ai-first-catalog": "/ai-first/index.json",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <head>
        <AiFirstDiscoveryHead />
      </head>
      <body className="min-h-dvh bg-void font-sans text-white">
        <Providers>{children}</Providers>
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
