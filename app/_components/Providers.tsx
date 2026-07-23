"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { enUS, esES, frFR } from "@clerk/localizations";
import { useMemo, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n";
import { CookieBanner } from "./CookieBanner";
import { LocaleProvider, useLocale } from "./i18n/LocaleProvider";

const clerkAppearance = {
  variables: {
    colorPrimary: "#f5f5f7",
    colorBackground: "#030303",
    colorInputBackground: "rgba(255,255,255,0.04)",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#7a7a82",
    borderRadius: "12px",
    fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
  },
};

function ClerkWithLocale({ children }: { children: ReactNode }) {
  const { locale } = useLocale();

  const localization = useMemo(
    () => (locale === "es" ? esES : locale === "en" ? enUS : frFR),
    [locale]
  );

  const appearance = useMemo(
    () => ({
      ...clerkAppearance,
      layout: { applicationName: "AUROS" },
    }),
    []
  );

  return (
    <ClerkProvider
      localization={localization}
      appearance={appearance}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <ClerkWithLocale>
        {children}
        <CookieBanner />
      </ClerkWithLocale>
    </LocaleProvider>
  );
}
