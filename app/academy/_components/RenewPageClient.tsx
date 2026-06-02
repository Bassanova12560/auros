"use client";

import { Suspense } from "react";

import { RenewalCertView } from "../_components/RenewalCertView";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getAcademyMessages } from "@/lib/academy/i18n";

function RenewInvalidLink() {
  const { locale } = useLocale();
  return (
    <p className="text-sm text-white/55">
      {getAcademyMessages(locale).renewal.invalidLink}
    </p>
  );
}

export function RenewPageClient({ token }: { token: string }) {
  if (!token) {
    return <RenewInvalidLink />;
  }
  return <RenewalCertView certToken={decodeURIComponent(token)} />;
}

export function RenewPageShell({ token }: { token: string }) {
  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <Suspense fallback={null}>
        <RenewPageClient token={token} />
      </Suspense>
    </div>
  );
}
