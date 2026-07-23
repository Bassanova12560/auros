import type { Metadata } from "next";
import {
  DM_Sans,
  JetBrains_Mono,
  Noto_Sans_Arabic,
  Noto_Sans_SC,
  Syne,
} from "next/font/google";
import { cookies } from "next/headers";

import { AiFirstDiscoveryHead } from "./_components/ai-first/AiFirstDiscoveryHead";
import { ConditionalAnalytics } from "./_components/ConditionalAnalytics";
import { Providers } from "./_components/Providers";
import { SITE_URL } from "@/lib/comparators/site";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isRtlLocale,
  localeFromCookieValue,
} from "@/lib/i18n";
import "./globals.css";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AUROS",
  url: SITE_URL,
  description:
    "Plateforme B2B de tokenisation d'actifs réels — score d'admission, data room, studio réglementaire.",
  sameAs: [] as string[],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const notoSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-cjk",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const locale =
    localeFromCookieValue(jar.get(LOCALE_STORAGE_KEY)?.value) ?? DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      dir={isRtlLocale(locale) ? "rtl" : "ltr"}
      className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} ${notoArabic.variable} ${notoSc.variable}`}
    >
      <head>
        <AiFirstDiscoveryHead />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-void font-sans text-white">
        <Providers initialLocale={locale}>{children}</Providers>
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
